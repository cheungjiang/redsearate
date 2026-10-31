import { test } from "node:test";
import assert from "node:assert/strict";
import * as platform from "./platform.ts";
import { defaultShipment, laneKey } from "./rates.ts";
import type { Snapshot } from "./rates.ts";

test("platform navigation has the six requested destinations in order", () => {
  assert.ok(Array.isArray(platform.platformNavigation));
  assert.deepEqual(platform.platformNavigation.map((item) => item.en), [
    "Rates", "Space Board", "Loads", "Agents", "Brief", "Guides",
  ]);
  assert.equal(new Set(platform.platformNavigation.map((item) => item.id)).size, 6);
});

test("index has the approved five ports without borrowing real 40HC medians", () => {
  assert.ok(Array.isArray(platform.indexCandidates));
  assert.equal(platform.indexCandidates.length, 5);
  assert.deepEqual(platform.indexCandidates.map((row) => row.port?.id), [
    "Jeddah", "Sokhna", "Aqaba", "Djibouti", "Port Sudan",
  ]);
  assert.equal(platform.indexCandidates[3].port?.code, "DJJIB");
  for (const item of platform.indexCandidates) {
    assert.equal(item.median, null);
    assert.equal(item.weekChange, null);
    assert.equal(item.sampleSize, null);
  }
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
