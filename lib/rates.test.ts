import { test } from "node:test";
import assert from "node:assert/strict";
// @ts-ignore Node runs TypeScript directly.
import { estimate, summarize, laneKey, defaultShipment } from "./rates.ts";
// @ts-ignore Node runs TypeScript directly.
import type { PriceEntry } from "./rates.ts";

const today = "2026-10-23";
let id = 0;
const entry = (over: Partial<PriceEntry>): PriceEntry => ({
  id: ++id,
  tier: "market",
  origin: "Shanghai",
  destination: "Jeddah",
  container: "40HC",
  price: 2000,
  validUntil: "2026-11-05",
  transitMin: null,
  transitMax: null,
  source: "Forwarder A",
  note: "secret note",
  submittedBy: "DoKwan",
  createdAt: "2026-10-20T03:00:00Z",
  ...over,
});
const key = laneKey("Shanghai", "Jeddah", "40HC");

test("public snapshot never exposes internal prices, sources or single market quotes", () => {
  const snapshot = summarize(
    [
      entry({ tier: "internal", price: 1500 }),
      entry({ price: 2100 }),
      entry({ price: 2300 }),
      entry({ price: 2200 }),
      entry({ price: 2400 }),
    ],
    today,
  );
  assert.deepEqual(snapshot.lanes, {});
  const text = JSON.stringify(snapshot);
  for (const secret of [
    "1500",
    "2100",
    "2300",
    "Forwarder A",
    "secret note",
    "DoKwan",
  ])
    assert.ok(!text.includes(secret), secret);
});

test("market reference needs five current prices, drops outliers and expired or old prices", () => {
  const snapshot = summarize(
    [
      entry({ price: 1900 }),
      entry({ price: 2100 }),
      entry({ price: 2400 }),
      entry({ price: 2000 }),
      entry({ price: 2230 }),
      entry({ price: 9000 }), // typo or different charge scope
      entry({ price: 1000, validUntil: "2026-10-22" }), // expired
      entry({ price: 1100, createdAt: "2026-09-01T03:00:00Z" }), // older than 28 days
    ],
    today,
  );
  // Five kept prices, published as their median only (no single quote's low or high).
  assert.deepEqual(snapshot.lanes[key].market, { median: 2100, count: 5 });
});

test("offers expire at the end of their valid date and combine into one range", () => {
  const offers = [
    entry({
      tier: "offer",
      price: 2200,
      validUntil: today,
      transitMin: 22,
      transitMax: 26,
    }),
    entry({
      tier: "offer",
      price: 2050,
      validUntil: "2026-10-30",
      transitMin: 20,
      transitMax: 24,
    }),
    entry({ tier: "offer", price: 1800, validUntil: "2026-10-22" }),
  ];
  assert.deepEqual(summarize(offers, today).lanes[key].offer, {
    low: 2050,
    high: 2200,
    validUntil: today,
    transitMin: 20,
    transitMax: 26,
  });
  assert.deepEqual(summarize(offers, "2026-10-31").lanes, {});
});

test("weekly trend groups market prices by Monday-start week in Shanghai time", () => {
  const snapshot = summarize(
    [
      // Sunday 23:30 UTC is Monday 07:30 in Shanghai, so it belongs to the week of Oct 19.
      ...[1900, 1950, 2000, 2050, 2105].map((price) =>
        entry({ price, createdAt: "2026-10-18T23:30:00Z" }),
      ),
      ...[2200, 2300, 2250, 2350].map((price) =>
        entry({ price, createdAt: "2026-10-14T03:00:00Z" }),
      ),
    ],
    today,
  );
  assert.deepEqual(snapshot.trends[key], [
    { week: "2026-10-19", median: 2000, count: 5 },
  ]);
});

test("estimate scales per-container and per-W/M prices to the whole shipment", () => {
  const lane = {
    offer: {
      low: 2000,
      high: 2200,
      validUntil: today,
      transitMin: null,
      transitMax: null,
    },
  };
  assert.deepEqual(estimate(lane, { ...defaultShipment, quantity: 3 }).offer, {
    ...lane.offer,
    low: 6000,
    high: 6600,
  });
  // LCL bills the larger of CBM and metric tonnes, with a 1 W/M minimum.
  const lcl = { ...defaultShipment, mode: "LCL" as const };
  assert.equal(
    estimate(lane, { ...lcl, volume: 2, weight: 6000 }).offer?.low,
    12000,
  );
  assert.equal(
    estimate(lane, { ...lcl, volume: 0.4, weight: 200 }).offer?.low,
    2000,
  );
  assert.equal(estimate(undefined, defaultShipment).offer, undefined);
  for (const invalid of [
    { quantity: 1.5 },
    { origin: "Unknown" },
    { container: "reefer" },
  ])
    assert.throws(
      () => estimate(lane, { ...defaultShipment, ...invalid }),
      /Invalid/,
    );
});
