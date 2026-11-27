import { test } from "node:test";
import assert from "node:assert/strict";
import {
  curatedLanes,
  emptyLaneRegistry,
  laneDescription,
  laneDocumentGuidePath,
  laneFaqs,
  laneJsonLd,
  laneRouting,
  laneSlug,
  laneTitle,
  laneTransit,
  planLanes,
  type LaneRegistry,
} from "./lanes.ts";
import type { PriceEntry } from "./rates.ts";

let nextId = 0;
const quote = (over: Partial<PriceEntry>): PriceEntry => ({
  id: ++nextId,
  tier: "market",
  origin: "Shanghai",
  destination: "Jeddah",
  container: "40HC",
  price: 8200,
  validUntil: "2026-11-30",
  transitMin: null,
  transitMax: null,
  source: "",
  note: "",
  submittedBy: "Notion",
  createdAt: "2026-11-05T04:00:00.000Z",
  ...over,
});

const times = (n: number, origin: string, destination: string, price: number, extra: Partial<PriceEntry> = {}) =>
  Array.from({ length: n }, () => quote({ origin, destination, price, ...extra }));

const slugs = (registry: { active: { slug: string }[] }) => registry.active.map((lane) => lane.slug);

test("five quotes publish a lane and one to three quotes do not", () => {
  const entries = [
    ...times(7, "Guangzhou (Nansha)", "Aqaba", 7650, { carrier: "COSCO", freeDays: 14 }),
    ...times(2, "Shanghai", "Jeddah", 8500),
    quote({ origin: "Shanghai", destination: "Jeddah", container: "20GP", price: 5700 }),
  ];
  const plan = planLanes(entries, "2026-11-09", emptyLaneRegistry());
  assert.deepEqual(slugs(plan), ["shipping-from-nansha-to-aqaba"]);
  assert.deepEqual(plan.retired, []);
  const lane = plan.active[0];
  assert.equal(lane.median, 7650);
  assert.equal(lane.count, 7);
  assert.equal(lane.twenty, null);
  assert.deepEqual(lane.carriers, ["COSCO"]);
  assert.deepEqual(lane.freeDays, [14, 14]);
  assert.equal(laneSlug("nansha", "Aqaba"), lane.slug);
  assert.equal(laneTitle(lane, "en"), "Nansha to Aqaba Shipping Rates | RedSeaRate");
  assert.ok(laneDescription(lane, "en").length <= 155);
  assert.ok(laneDescription(lane, "zh").length <= 80);
  const graph = laneJsonLd(lane, "2026-11-09", "en")["@graph"] as { "@type": string }[];
  assert.deepEqual(graph.map((item) => item["@type"]), ["Service", "FAQPage", "BreadcrumbList"]);
  assert.equal(laneFaqs(lane, "2026-11-09", "en").length, 3);
});

test("twenty curated routes stay published when the quote window is empty", () => {
  const lanes = curatedLanes([]);
  assert.equal(lanes.length, 20);
  assert.deepEqual(lanes.map((lane) => lane.slug).slice(0, 5), [
    "shipping-from-shanghai-to-jeddah",
    "shipping-from-shanghai-to-sokhna",
    "shipping-from-shanghai-to-aqaba",
    "shipping-from-shanghai-to-djibouti",
    "shipping-from-shanghai-to-port-sudan",
  ]);
  const thin = lanes.find((lane) => lane.slug === "shipping-from-shanghai-to-jeddah")!;
  assert.equal(thin.median, null);
  assert.equal(thin.count, 0);
  assert.equal(laneTitle(thin, "zh"), "上海到吉达海运费 | RedSeaRate");
  assert.match(laneDescription(thin, "zh"), /^上海到吉达海运费与航线指南：/);
  assert.match(laneFaqs(thin, "2026-11-09", "en")[0].a, /no 40HQ market quotes/);
  assert.equal(laneDocumentGuidePath("Jeddah", "en"), "/guides/shipping-to-jeddah-saber/");
  assert.equal(laneDocumentGuidePath("Jeddah", "zh"), "/zh/guides/shipping-to-jeddah-saber/");
  assert.equal(laneDocumentGuidePath("Sokhna", "en"), "/guides/shipping-to-sokhna-acid/");
  assert.equal(laneDocumentGuidePath("Sokhna", "zh"), "/zh/guides/shipping-to-sokhna-acid/");
  assert.equal(laneDocumentGuidePath("Aqaba", "en"), "/guides/jordan-import-clearance-aqaba/");
  assert.equal(laneDocumentGuidePath("Aqaba", "zh"), "/zh/guides/jordan-import-clearance-aqaba/");
  assert.equal(laneDocumentGuidePath("Djibouti", "en"), "/guides/djibouti-import-clearance-ethiopia-transit/");
  assert.equal(laneDocumentGuidePath("Djibouti", "zh"), "/zh/guides/djibouti-import-clearance-ethiopia-transit/");
  assert.equal(laneDocumentGuidePath("Port Sudan", "en"), "/guides/sudan-import-clearance-port-sudan/");
  assert.equal(laneDocumentGuidePath("Port Sudan", "zh"), "/zh/guides/sudan-import-clearance-port-sudan/");
  assert.equal(laneFaqs(thin, "2026-11-09", "en").some((faq) => faq.a.includes("/guides/")), false);
  assert.equal(laneJsonLd(thin, "2026-11-09", "en")["@graph"][0]["@type"], "Service");
});

test("a curated route reuses measured quotes, direct routing and transit", () => {
  const active = planLanes(
    times(7, "Shanghai", "Jeddah", 8500, { routing: "直达", transitMin: 18, transitMax: 20 }),
    "2026-11-09",
    emptyLaneRegistry(),
  ).active;
  const jeddah = curatedLanes(active).find((lane) => lane.slug === "shipping-from-shanghai-to-jeddah")!;
  assert.equal(jeddah.median, 8500);
  assert.equal(jeddah.direct, 7);
  assert.equal(jeddah.transhipped, 0);
  assert.deepEqual(jeddah.transit, { min: 18, max: 20 });
  assert.match(laneTransit(jeddah, "en"), /18–20 days/);
  assert.match(laneRouting(jeddah, "en"), /Direct sailings appear on this route/);
});

test("a thin curated route keeps the sample count without a median", () => {
  const measured = planLanes(
    times(3, "Shanghai", "Djibouti", 7200, { routing: "中转" }),
    "2026-11-09",
    emptyLaneRegistry(),
  ).measured;
  const thin = curatedLanes([], measured).find((lane) => lane.slug === "shipping-from-shanghai-to-djibouti")!;
  assert.equal(thin.median, null);
  assert.equal(thin.count, 3);
  assert.match(laneDescription(thin, "en"), /3 recent 40HQ quotes/);
  assert.match(laneFaqs(thin, "2026-11-09", "en")[0].a, /only 3 quotes .* too few for a median/);
});

test("three or four quotes keep an existing lane and do not start a new one", () => {
  const entries = [
    ...times(4, "Ningbo", "Jeddah", 8200),
    ...times(4, "Qingdao", "Aqaba", 7600),
  ];
  const previous: LaneRegistry = {
    active: [{ slug: "shipping-from-ningbo-to-jeddah", origin: "Ningbo", destination: "Jeddah" }],
    retired: [],
  };
  const plan = planLanes(entries, "2026-11-09", previous);
  assert.deepEqual(slugs(plan), ["shipping-from-ningbo-to-jeddah"]);
  assert.equal(plan.active[0].count, 4);
  assert.deepEqual(plan.retired, []);
});

test("fewer than three quotes retire a published lane and leave a new thin lane unpublished", () => {
  const entries = [
    ...times(2, "Shenzhen", "Port Sudan", 8100),
    ...times(1, "Shanghai", "Sokhna", 6500),
  ];
  const previous: LaneRegistry = {
    active: [{ slug: "shipping-from-shenzhen-to-port-sudan", origin: "Shenzhen", destination: "Port Sudan" }],
    retired: [{ slug: "shipping-from-shanghai-to-jeddah", origin: "Shanghai", destination: "Jeddah" }],
  };
  const plan = planLanes(entries, "2026-11-09", previous);
  assert.deepEqual(slugs(plan), []);
  assert.deepEqual(plan.retired.map((lane) => lane.slug), [
    "shipping-from-shanghai-to-jeddah",
    "shipping-from-shenzhen-to-port-sudan",
  ]);
});

test("a retired lane comes back only at five quotes", () => {
  const previous: LaneRegistry = {
    active: [],
    retired: [{ slug: "shipping-from-qingdao-to-jeddah", origin: "Qingdao", destination: "Jeddah" }],
  };
  const thin = planLanes(times(4, "Qingdao", "Jeddah", 8400), "2026-11-09", previous);
  assert.deepEqual(slugs(thin), []);
  assert.equal(thin.retired[0].slug, "shipping-from-qingdao-to-jeddah");
  const back = planLanes(times(5, "Qingdao", "Jeddah", 8400), "2026-11-09", previous);
  assert.deepEqual(slugs(back), ["shipping-from-qingdao-to-jeddah"]);
  assert.deepEqual(back.retired, []);
});
