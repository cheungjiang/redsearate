import { test } from "node:test";
import assert from "node:assert/strict";
import * as platform from "./platform.ts";
import { defaultShipment, laneKey } from "./rates.ts";
import type { PriceEntry, Snapshot } from "./rates.ts";

test("platform navigation has the six requested destinations in order", () => {
  assert.ok(Array.isArray(platform.platformNavigation));
  assert.deepEqual(platform.platformNavigation.map((item) => item.en), [
    "Rates", "Space Board", "Loads", "Agents", "Brief", "Guides",
  ]);
  assert.equal(new Set(platform.platformNavigation.map((item) => item.id)).size, 6);
});

let nextId = 0;
const quote = (over: Partial<PriceEntry>): PriceEntry => ({
  id: ++nextId,
  tier: "market",
  origin: "Shanghai",
  destination: "Jeddah",
  container: "40HC",
  price: 3000,
  validUntil: "2026-11-30",
  transitMin: null,
  transitMax: null,
  source: "",
  note: "",
  submittedBy: "Notion",
  createdAt: "2026-11-05T04:00:00.000Z",
  ...over,
});
const on = (date: string) => `${date}T04:00:00.000Z`;

test("index has the approved five ports and stays unavailable without data", () => {
  const index = platform.liveIndex([], "2026-11-07");
  assert.deepEqual(index.map((row) => row.port.id), [
    "Jeddah", "Sokhna", "Aqaba", "Djibouti", "Port Sudan",
  ]);
  assert.equal(index[3].port.code, "DJJIB");
  for (const item of index) {
    assert.equal(item.median, null);
    assert.equal(item.weekChange, null);
    assert.equal(item.sampleSize, null);
  }
});

test("index pools 40HQ market quotes from all origins over the last 28 days", () => {
  const origins = ["Shanghai", "Ningbo", "Shenzhen", "Qingdao", "Dalian"];
  const entries = [
    ...[3000, 3100, 3200, 3300, 3400].map((price, i) =>
      quote({ price, origin: origins[i], createdAt: on("2026-11-03") })),
    quote({ price: 9000, tier: "offer", createdAt: on("2026-11-05") }),
    quote({ price: 9000, container: "20GP", createdAt: on("2026-11-05") }),
    quote({ price: 2000, createdAt: on("2026-10-03") }),
    ...[2900, 2900, 2900, 3000, 3000].map((price) =>
      quote({ price, createdAt: on("2026-10-20") })),
  ];
  const jeddah = platform.liveIndex(entries, "2026-11-07")[0];
  assert.equal(jeddah.median, 3000);
  assert.equal(jeddah.sampleSize, 10);
  assert.equal(jeddah.weekChange, 3.4);
});

test("index uses every quote after outliers and leaves week on week blank without a prior week", () => {
  const single = platform.liveIndex([quote({ price: 3000 })], "2026-11-07")[0];
  assert.equal(single.median, 3000);
  assert.equal(single.sampleSize, 1);
  const four = [3000, 3100, 3200, 3300].map((price) => quote({ price }));
  const withOutlier = platform.liveIndex([...four, quote({ price: 9000 })], "2026-11-07")[0];
  assert.equal(withOutlier.median, 3150);
  assert.equal(withOutlier.sampleSize, 4);
  assert.equal(withOutlier.weekChange, null);
});

test("rate preview follows selected equipment and exposes no invented grades or update times", () => {
  assert.equal(typeof platform.publicRateRows, "function");
  const key = laneKey("Qingdao", "Jeddah", "20GP");
  const snapshot: Snapshot = {
    today: "2026-10-30",
    lanes: {
      [key]: {
        offer: { low: 2100, high: 2400, validUntil: "2026-11-05", transitMin: 20, transitMax: 25 },
        market: { median: 2300, count: 5 },
      },
    },
    trends: {},
  };
  const selected = { ...defaultShipment, origin: "Qingdao", container: "20GP", quantity: 3 };
  const rows = platform.publicRateRows(snapshot, selected);
  assert.equal(rows.length, 5);
  assert.deepEqual(rows[0], {
    origin: "Qingdao", destination: "Jeddah", equipment: "20GP",
    offer: { low: 2100, high: 2400, validUntil: "2026-11-05" },
    market: { median: 2300, count: 5 }, carriers: [], rating: "good",
  });
  assert.equal(rows[1].offer, null);
  assert.equal(rows[1].market, null);
  assert.equal(platform.publicRateRows(snapshot, { ...selected, mode: "LCL" })[0].offer, null);
});

test("rate rows fall back to the best-covered origin when the selected one has no price", () => {
  const snapshot: Snapshot = {
    today: "2026-11-07",
    lanes: {
      [laneKey("Shenzhen", "Jeddah", "40HC")]: { market: { median: 3000, count: 1 } },
      [laneKey("Guangzhou (Nansha)", "Jeddah", "40HC")]: { market: { median: 3200, count: 2 } },
      [laneKey("Ningbo", "Sokhna", "40HC")]: { market: { median: 3600, count: 1 } },
      [laneKey("Shanghai", "Sokhna", "40HC")]: { market: { median: 3500, count: 1 } },
    },
    trends: {},
  };
  const rows = platform.publicRateRows(snapshot, defaultShipment);
  assert.equal(rows[0].origin, "Guangzhou (Nansha)");
  assert.deepEqual(rows[0].market, { median: 3200, count: 2 });
  assert.equal(rows[1].origin, "Shanghai");
  assert.equal(rows[2].origin, "Shanghai");
  assert.equal(rows[2].market, null);
});

test("rows are rated good, or excellent when at least 10% below the all-origin median", () => {
  const snapshot: Snapshot = {
    today: "2026-11-07",
    lanes: {
      [laneKey("Shanghai", "Jeddah", "40HC")]: { market: { median: 2700, count: 2 } },
      [laneKey("Ningbo", "Jeddah", "40HC")]: { market: { median: 3000, count: 1 } },
      [laneKey("Qingdao", "Jeddah", "40HC")]: { market: { median: 3100, count: 1 } },
      [laneKey("Shanghai", "Sokhna", "40HC")]: { market: { median: 2800, count: 3 } },
      [laneKey("Ningbo", "Sokhna", "40HC")]: { market: { median: 3000, count: 1 } },
      [laneKey("Shanghai", "Aqaba", "40HC")]: { market: { median: 2000, count: 1 } },
    },
    trends: {},
  };
  const rows = platform.publicRateRows(snapshot, defaultShipment);
  assert.deepEqual(rows.map((r) => r.rating), ["excellent", "good", "good", null, null]);
});

test("latest quotes are the rows most recently added to the table, without internal prices", () => {
  const entries = [
    quote({ id: 1, price: 3000, addedAt: "2026-11-07T01:00:00Z" }),
    quote({ id: 2, price: 3100, addedAt: "2026-11-07T09:00:00Z", carrier: "COSCO" }),
    quote({ id: 3, price: 1000, tier: "internal", addedAt: "2026-11-07T10:00:00Z" }),
    quote({ id: 4, price: 2900, addedAt: "2026-11-06T09:00:00Z" }),
  ];
  const latest = platform.latestQuotes(entries, "2026-11-07");
  assert.deepEqual(latest.map((q) => q.id), [2, 1, 4]);
  assert.equal(latest[0].carrier, "COSCO");
  assert.equal(latest[0].container, "40HQ");
});

test("public rate projection drops expired offers even from a stale snapshot", () => {
  assert.equal(typeof platform.publicRateRows, "function");
  const key = laneKey("Shanghai", "Jeddah", "40HC");
  const snapshot: Snapshot = {
    today: "2026-10-30",
    lanes: { [key]: { offer: { low: 1000, high: 1000, validUntil: "2026-10-29", transitMin: null, transitMax: null } } },
    trends: {},
  };
  assert.equal(platform.publicRateRows(snapshot, defaultShipment)[0].offer, null);
});
