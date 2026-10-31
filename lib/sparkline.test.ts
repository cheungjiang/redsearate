import { test } from "node:test";
import assert from "node:assert/strict";
import * as chart from "./sparkline.ts";

test("sparkline places chronological values inside a 120 by 40 viewBox", () => {
  assert.equal(typeof chart.sparklinePoints, "function");
  assert.equal(chart.sparklinePoints([100, 200, 150]), "4,36 60,4 116,20");
  assert.equal(chart.sparklinePoints([200, 100]), "4,4 116,36");
});

test("flat sparklines stay centered and missing or nonfinite values do not draw", () => {
  assert.equal(typeof chart.sparklinePoints, "function");
  assert.equal(chart.sparklinePoints([150, 150, 150]), "4,20 60,20 116,20");
  for (const series of [[], [100], [100, NaN], [Infinity, 100]]) {
    assert.equal(chart.sparklinePoints(series), "");
  }
});
