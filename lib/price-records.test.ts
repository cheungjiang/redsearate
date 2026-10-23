import { test } from "node:test";
import assert from "node:assert/strict";
import { parsePriceCsv, toPriceCsv } from "./price-records.ts";
import type { PriceEntry } from "./rates.ts";

const today = "2026-10-23";

test("import maps Chinese names, applies defaults and keeps quoted commas", () => {
  const { rows, errors } = parsePriceCsv(
    [
      "日期,类型,起运港,目的港,柜型,价格USD,有效期,航程最短,航程最长,来源,录入人,备注",
      '2026-10-20,市场价,上海,吉达,40hq,7800,2026-11-06,28,32,同行A,老笠,"含BAF, 不含THC"',
      ",,CNNGB,aqaba,20GP,5450,,,,群消息,同事B,",
    ].join("\r\n"),
    today,
  );
  assert.deepEqual(errors, []);
  assert.deepEqual(rows[0], {
    line: 2,
    date: "2026-10-20",
    entry: {
      tier: "market",
      origin: "Shanghai",
      destination: "Jeddah",
      container: "40HC",
      price: 7800,
      validUntil: "2026-11-06",
      transitMin: 28,
      transitMax: 32,
      source: "同行A",
      submittedBy: "老笠",
      note: "含BAF, 不含THC",
    },
  });
  assert.equal(rows[1].date, today);
  assert.equal(rows[1].entry.tier, "market");
  assert.equal(rows[1].entry.origin, "Ningbo");
  assert.equal(rows[1].entry.validUntil, "2026-10-30");
  assert.equal(rows[1].entry.note, "有效期未注明，默认7天");
});

test("invalid rows are reported by line and do not block valid rows", () => {
  const { rows, errors } = parsePriceCsv(
    [
      "2026-10-23,market,Xiamen,Jeddah,40HC,7800,2026-11-06,,,A,B,",
      "2026-10-24,market,Shanghai,Jeddah,40HC,7800,2026-11-06,,,A,B,",
      "2026-10-23,market,Shanghai,Jeddah,40HC,7800,2026-10-22,,,A,B,",
      "2026-10-23,market,Shanghai,Jeddah,40HC,7800,2026-11-06,30,20,A,B,",
      "2026-10-23,market,Shanghai,Jeddah,40HC,7800,2026-11-06,,,A,,",
      "2026-10-01,market,Qingdao,Jeddah,40HC,8398,2026-10-10,,,A,B,",
    ].join("\n"),
    today,
  );
  assert.deepEqual(
    errors.map((e) => e.line),
    [1, 2, 3, 4, 5],
  );
  assert.match(errors[0].error, /Xiamen/);
  // An expired price from an earlier date still imports, for history and restores.
  assert.deepEqual(
    rows.map((r) => r.line),
    [6],
  );
});

test("export re-imports to the same prices and dates", () => {
  const entries: PriceEntry[] = [
    {
      id: 2,
      tier: "internal",
      origin: "Shenzhen",
      destination: "Port Sudan",
      container: "LCL",
      price: 95,
      validUntil: "2026-11-01",
      transitMin: null,
      transitMax: null,
      source: 'Carrier "X", desk',
      note: "line one\nline two",
      submittedBy: "老笠",
      // 23:30 UTC is already the next day in Shanghai.
      createdAt: "2026-10-21T23:30:00.000Z",
    },
  ];
  const { rows, errors } = parsePriceCsv(toPriceCsv(entries), today);
  assert.deepEqual(errors, []);
  const { id, createdAt, ...entry } = entries[0];
  assert.deepEqual(rows, [{ line: 2, date: "2026-10-22", entry }]);
});
