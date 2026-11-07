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

test("index pools 40HQ market quotes from all origins over the last 7 days", () => {
  const origins = ["Shanghai", "Ningbo", "Shenzhen", "Qingdao", "Shanghai"];
  const entries = [
    ...[3000, 3100, 3200, 3300, 3400].map((price, i) =>
      quote({ price, origin: origins[i], createdAt: on("2026-11-01") })),
    quote({ price: 3500, createdAt: on("2026-10-31") }),
    quote({ price: 9000, tier: "offer", createdAt: on("2026-11-05") }),
    quote({ price: 9000, container: "20GP", createdAt: on("2026-11-05") }),
    ...[2900, 2900, 3000, 3000, 3000].map((price) =>
      quote({ price, createdAt: on("2026-10-28") })),
  ];
  const jeddah = platform.liveIndex(entries, "2026-11-07")[0];
  assert.equal(jeddah.median, 3200);
  assert.equal(jeddah.sampleSize, 5);
  assert.equal(jeddah.weekChange, 6.7);
});

test("index needs 5 quotes after outliers and leaves week on week blank without a prior week", () => {
  const four = [3000, 3100, 3200, 3300].map((price) => quote({ price }));
  assert.equal(platform.liveIndex(four, "2026-11-07")[0].median, null);
  const withOutlier = [...four, quote({ price: 9000 })];
  assert.equal(platform.liveIndex(withOutlier, "2026-11-07")[0].median, null);
  const five = [...four, quote({ price: 3400 })];
  const jeddah = platform.liveIndex(five, "2026-11-07")[0];
  assert.equal(jeddah.median, 3200);
  assert.equal(jeddah.weekChange, null);
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
    market: { median: 2300, count: 5 }, grade: null, updatedAt: null,
  });
  assert.equal(rows[1].offer, null);
  assert.equal(rows[1].market, null);
  assert.equal(platform.publicRateRows(snapshot, { ...selected, mode: "LCL" })[0].offer, null);
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
