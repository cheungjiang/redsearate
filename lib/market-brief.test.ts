import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { countryStats } from "./countries.ts";
import {
  BRIEF_METHOD,
  briefChangeText,
  briefDescription,
  briefMonday,
  briefSampleNote,
  briefTitle,
  buildMarketBrief,
  type MarketBrief,
} from "./market-brief.ts";
import { readMarketBriefs } from "./market-brief.server.ts";
import { liveIndex } from "./platform.ts";
import { marketBriefJsonLd } from "./seo.ts";
import type { PriceEntry } from "./rates.ts";

let nextId = 0;
const quote = (over: Partial<PriceEntry>): PriceEntry => ({
  id: ++nextId,
  tier: "market",
  origin: "Shanghai",
  destination: "Jeddah",
  container: "40HC",
  price: 8450,
  validUntil: "2026-11-30",
  transitMin: null,
  transitMax: null,
  source: "",
  note: "",
  submittedBy: "Notion",
  createdAt: "2026-11-05T04:00:00.000Z",
  ...over,
});

test("a brief uses the rates-index median and has no week-on-week without a previous issue", () => {
  const entries = [
    quote({ price: 8000 }),
    quote({ price: 8450 }),
    quote({ price: 9000 }),
    quote({ destination: "Djibouti", price: 7900 }),
    quote({ destination: "Sokhna", price: 1000, createdAt: "2026-09-01T04:00:00.000Z" }),
  ];
  const brief = buildMarketBrief(entries, "2026-11-09", null);
  const index = liveIndex(entries, "2026-11-09");
  for (const port of brief.ports) {
    const row = index.find((item) => item.port.id === port.destination);
    const stat = countryStats(entries, "2026-11-09", port.destination).containers["40HC"];
    assert.equal(port.median, row?.median ?? null);
    assert.equal(port.count, row?.sampleSize ?? null);
    assert.equal(port.low, stat?.low ?? null);
    assert.equal(port.high, stat?.high ?? null);
    assert.equal(port.weekChange, null);
  }
  assert.equal(brief.comparedWith, null);
  assert.equal(brief.ports.find((port) => port.destination === "Jeddah")?.median, 8450);
  assert.equal(brief.ports.find((port) => port.destination === "Jeddah")?.count, 3);
  assert.equal(brief.ports.find((port) => port.destination === "Djibouti")?.count, 1);
  assert.equal(briefSampleNote(1, "zh"), "样本未满 5 条");
  assert.equal(briefSampleNote(4, "en"), "Fewer than 5 quotes");
  assert.equal(briefSampleNote(5, "zh"), null);
  assert.equal(briefMonday("2026-11-09"), "2026-11-09");
  assert.equal(briefMonday("2026-11-11"), "2026-11-09");
});

test("week on week is the change from the previous frozen brief, not a new window", () => {
  const current = buildMarketBrief([
    quote({ price: 8450 }),
    quote({ destination: "Sokhna", price: 6800 }),
  ], "2026-11-16", null);
  const previous: MarketBrief = {
    ...current,
    date: "2026-11-09",
    ports: current.ports.map((port) => port.destination === "Jeddah"
      ? { ...port, median: 8000, count: 10, low: 8000, high: 8000 }
      : port),
  };
  const next = buildMarketBrief([
    quote({ price: 8450 }),
    quote({ destination: "Sokhna", price: 6800 }),
  ], "2026-11-16", previous);
  assert.equal(next.comparedWith, "2026-11-09");
  assert.equal(next.ports.find((port) => port.destination === "Jeddah")?.weekChange, 5.6);
  assert.equal(briefChangeText(5.6), "+5.6%");
  assert.equal(briefChangeText(-1.2), "-1.2%");
  assert.match(next.method.en, /not a forecast/);
  assert.match(next.method.zh, /不是涨跌预测/);
  assert.equal(next.method.en, BRIEF_METHOD.en);
});

test("brief descriptions stay inside the snippet limits and name the frozen medians", () => {
  const brief = buildMarketBrief([], "2026-11-09", null);
  brief.ports = [
    ["Jeddah", 8450, 16],
    ["Sokhna", 6800, 8],
    ["Aqaba", 7600, 35],
    ["Djibouti", 7900, 4],
    ["Port Sudan", 8020, 8],
  ].map(([destination, median, count]) => ({
    destination: String(destination),
    median: Number(median),
    count: Number(count),
    low: Number(median),
    high: Number(median),
    weekChange: null,
  }));
  const en = briefDescription(brief, "en");
  const zh = briefDescription(brief, "zh");
  assert.ok(en.length <= 155, en);
  assert.ok(zh.length <= 80, `${zh.length} ${zh}`);
  assert.match(en, /Jeddah US\$8,450 \(16\)/);
  assert.match(en, /Port Sudan US\$8,020 \(8\)/);
  assert.match(zh, /吉达 8,450（16）/);
  assert.match(zh, /苏丹港 8,020（8）/);
  assert.equal(briefTitle("2026-11-09", "en"), "Red Sea Freight Market Brief — 9 Nov 2026 | RedSeaRate");
  const graph = marketBriefJsonLd(brief, "en")["@graph"];
  assert.deepEqual(graph.map((node) => node["@type"]), ["Article", "BreadcrumbList"]);
  const article = graph.find((node) => node["@type"] === "Article");
  assert.equal(article && "datePublished" in article ? article.datePublished : null, "2026-11-09");
});

test("the published 2026-11-09 snapshot stays at the frozen readings", () => {
  const [brief] = readMarketBriefs(join(process.cwd(), "data/market-brief"));
  assert.equal(brief.date, "2026-11-09");
  assert.equal(brief.comparedWith, null);
  assert.deepEqual(
    brief.ports.map((port) => [port.destination, port.median, port.count, port.weekChange]),
    [
      ["Jeddah", 8450, 16, null],
      ["Sokhna", 6800, 8, null],
      ["Aqaba", 7600, 35, null],
      ["Djibouti", 7900, 4, null],
      ["Port Sudan", 8020, 8, null],
    ],
  );
});

test("saved briefs are read back unchanged and newest first", () => {
  const dir = mkdtempSync(join(tmpdir(), "brief-"));
  const older = buildMarketBrief([], "2026-11-02", null);
  const newer = buildMarketBrief([], "2026-11-09", older);
  writeFileSync(join(dir, "2026-11-02.json"), JSON.stringify(older));
  writeFileSync(join(dir, "2026-11-09.json"), JSON.stringify(newer));
  const briefs = readMarketBriefs(dir);
  assert.deepEqual(briefs.map((brief) => brief.date), ["2026-11-09", "2026-11-02"]);
  assert.equal(briefs[1].ports[0].median, older.ports[0].median);
});
