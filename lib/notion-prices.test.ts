import { test } from "node:test";
import assert from "node:assert/strict";
// @ts-ignore Node runs TypeScript directly.
import { fromNotionPage, toPublicEntry } from "./notion-prices.ts";
// @ts-ignore Node runs TypeScript directly.
import type { NotionQuote } from "./notion-prices.ts";

const quote = (over: Partial<NotionQuote> = {}): NotionQuote => ({
  status: "允许发布",
  type: "AI收集的市场价",
  origin: "Shanghai",
  destination: "Jeddah",
  container: "40HQ",
  currency: "USD",
  unit: "USD/柜",
  price: 3200,
  quoteDate: "2026-11-05",
  validFrom: "2026-11-20",
  validTo: null,
  createdTime: "2026-11-07T14:07:00.000Z",
  ...over,
});

test("approved Notion quotes become public market entries with 40HQ stored as 40HC", () => {
  const result = toPublicEntry(quote(), 1);
  assert.ok("entry" in result);
  assert.equal(result.entry.tier, "market");
  assert.equal(result.entry.container, "40HC");
  assert.equal(result.entry.validUntil, "2026-11-20");
  assert.equal(result.entry.createdAt, "2026-11-05T04:00:00.000Z");
});

test("unapproved, internal, non-USD and mismatched-unit quotes are not published", () => {
  for (const over of [
    { status: "待审核" },
    { type: "内部底价" },
    { currency: "CNY" },
    { unit: "USD/CBM" },
    { container: "LCL", unit: "USD/柜" },
    { origin: "Dalian" },
    { price: null },
  ])
    assert.ok("skip" in toPublicEntry(quote(over), 1), JSON.stringify(over));
});

test("validity falls back to the range end, then seven days after the quote date", () => {
  const ranged = toPublicEntry(quote({ validTo: "2026-11-30" }), 1);
  const missing = toPublicEntry(quote({ validFrom: null }), 1);
  const undated = toPublicEntry(quote({ validFrom: null, quoteDate: null }), 1);
  assert.ok("entry" in ranged && "entry" in missing && "entry" in undated);
  assert.equal(ranged.entry.validUntil, "2026-11-30");
  assert.equal(missing.entry.validUntil, "2026-11-12");
  assert.equal(undated.entry.validUntil, "2026-11-14");
});

test("Shekou maps to Shenzhen and private Notion fields never reach the entry", () => {
  const page = {
    created_time: "2026-11-07T14:07:00.000Z",
    properties: {
      审核状态: { type: "select", select: { name: "允许发布" } },
      报价类型: { type: "select", select: { name: "你们可提供的报价" } },
      起运港: { type: "select", select: { name: "Shenzhen (Shekou)" } },
      目的港: { type: "select", select: { name: "Djibouti" } },
      柜型: { type: "select", select: { name: "20GP" } },
      币种: { type: "select", select: { name: "USD" } },
      计费单位: { type: "select", select: { name: "USD/柜" } },
      价格: { type: "number", number: 1800 },
      报价日期: { type: "date", date: { start: "2026-11-05", end: null } },
      有效期: { type: "date", date: null },
      备注: { type: "rich_text", rich_text: [{ plain_text: "secret note" }] },
      来源链接或凭据: { type: "url", url: "https://example.com/source" },
      船公司: { type: "rich_text", rich_text: [{ plain_text: "CMA" }] },
    },
  };
  const result = toPublicEntry(fromNotionPage(page), 7);
  assert.ok("entry" in result);
  assert.equal(result.entry.tier, "offer");
  assert.equal(result.entry.origin, "Shenzhen");
  const text = JSON.stringify(result.entry);
  for (const secret of ["secret note", "example.com", "CMA"]) assert.ok(!text.includes(secret));
});
