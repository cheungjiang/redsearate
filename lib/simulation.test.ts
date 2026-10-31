import { test } from "node:test";
import assert from "node:assert/strict";
import * as policy from "./simulation.ts";
import * as fixtures from "./rate-demo.ts";

test("simulation defaults on for development and off for a production runtime", () => {
  assert.equal(typeof policy.showSimulatedData, "function");
  assert.equal(policy.showSimulatedData(undefined, "development"), true);
  assert.equal(policy.showSimulatedData(undefined, "production"), false);
  assert.equal(policy.showSimulatedData("true", "production"), true);
  assert.equal(policy.showSimulatedData("false", "development"), false);
  assert.equal(policy.showSimulatedData("false", "production"), false);
  for (const value of ["", "1", "TRUE", "yes", " true ", "unexpected"]) {
    assert.equal(policy.showSimulatedData(value, "production"), false);
  }
  for (const value of ["1", "TRUE", "yes", "false", "unexpected"]) {
    assert.equal(policy.showSimulatedData(value, "development"), false);
  }
});

test("test rates have all required fields, fixed timestamps and A/B/C badge examples", () => {
  assert.ok(Array.isArray(fixtures.sampleRates));
  const rows = fixtures.sampleRates;
  assert.ok(rows.length >= 3 && rows.length <= 4);
  assert.deepEqual([...new Set(rows.map((row) => row.grade))].sort(), ["A", "B", "C"]);
  assert.equal(new Set(rows.map((row) => row.id)).size, rows.length);
  for (const row of rows) {
    assert.equal(row.kind, "test");
    assert.ok(row.origin && row.destination && row.container);
    assert.equal(row.currency, "USD");
    assert.ok(Number.isFinite(row.price) && row.price > 0);
    assert.match(row.carrier, /^TEST Carrier \d{2}$/);
    assert.match(row.validFrom, /^\d{4}-\d{2}-\d{2}$/);
    assert.ok(row.validUntil >= row.validFrom);
    assert.ok(Number.isFinite(Date.parse(row.updatedAt)));
  }
  assert.equal(rows[0].updatedAt, "2026-10-30T08:30:00Z");
});
