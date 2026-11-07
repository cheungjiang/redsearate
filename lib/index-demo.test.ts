import { test } from "node:test";
import assert from "node:assert/strict";
import * as demo from "./index-demo.ts";
import { liveIndex, publicRateRows } from "./platform.ts";
import { defaultShipment, estimate } from "./rates.ts";
import type { Snapshot } from "./rates.ts";

test("demo index explicitly identifies its simulated scope and covers rising, falling and flat states", () => {
  assert.ok(demo.demoIndex);
  assert.equal(demo.demoIndex.kind, "demo");
  assert.equal(demo.demoIndex.origin, "Shanghai");
  assert.equal(demo.demoIndex.currency, "USD");
  assert.equal(demo.demoIndex.equipment, "40HQ");
  const rows = demo.demoIndex.entries;
  assert.equal(rows.length, 5);
  assert.ok(rows.some((row) => row.weekChange !== null && row.weekChange > 0));
  assert.ok(rows.some((row) => row.weekChange !== null && row.weekChange < 0));
  assert.ok(rows.some((row) => row.weekChange === 0));
  for (const row of rows) {
    assert.ok(row.port);
    assert.ok(Number.isFinite(row.median) && row.median! > 0);
    assert.ok(Number.isInteger(row.sampleSize) && row.sampleSize! > 0);
  }
  assert.deepEqual(rows.map((row) => row.port?.id), ["Jeddah", "Sokhna", "Aqaba", "Djibouti", "Port Sudan"]);
  assert.equal(rows[3].port?.code, "DJJIB");
});

test("simulated sparklines end at the displayed median and match the displayed weekly change", () => {
  for (const row of demo.demoIndex.entries) {
    assert.ok(Array.isArray(row.weeklyMedians));
    assert.equal(row.weeklyMedians.length, 8);
    assert.ok(row.weeklyMedians.every((price) => Number.isFinite(price) && price > 0));
    assert.equal(row.weeklyMedians.at(-1), row.median);
    const last = row.weeklyMedians.at(-1)!;
    const previous = row.weeklyMedians.at(-2)!;
    assert.equal(Number(((last / previous - 1) * 100).toFixed(1)), row.weekChange);
  }
});

test("demo fixtures do not fill the unpublished real index, rate table or estimator", () => {
  assert.ok(demo.demoIndex);
  for (const row of liveIndex([], "2026-10-31")) {
    assert.equal(row.median, null);
    assert.equal(row.weekChange, null);
    assert.equal(row.sampleSize, null);
  }
  const snapshot: Snapshot = { today: "2026-10-31", lanes: {}, trends: {} };
  const before = JSON.stringify(snapshot);
  for (const row of publicRateRows(snapshot, defaultShipment)) {
    assert.equal(row.offer, null);
    assert.equal(row.market, null);
  }
  const result = estimate(undefined, defaultShipment);
  assert.equal(result.offer, undefined);
  assert.equal(result.market, undefined);
  assert.equal(JSON.stringify(snapshot), before);
});
