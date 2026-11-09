import { test } from "node:test";
import assert from "node:assert/strict";
import {
  emptyLaneRegistry,
  laneDescription,
  laneFaqs,
  laneJsonLd,
  laneSlug,
  laneTitle,
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
  assert.equal(laneTitle(lane, "en"), "Nansha to Aqaba Freight Rates: 40HQ | RedSeaRate");
  assert.ok(laneDescription(lane, "en").length <= 155);
  assert.ok(laneDescription(lane, "zh").length <= 80);
  const graph = laneJsonLd(lane, "2026-11-09", "en")["@graph"] as { "@type": string }[];
  assert.deepEqual(graph.map((item) => item["@type"]), ["FAQPage", "BreadcrumbList"]);
  assert.equal(laneFaqs(lane, "2026-11-09", "en").length, 3);
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
