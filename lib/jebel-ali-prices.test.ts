import { test } from "node:test";
import assert from "node:assert/strict";
import { fromJebelAliPage, jebelAliGoodPrice, type JebelAliMarketQuote } from "./jebel-ali-prices.ts";
import type { NotionPage } from "./notion-prices.ts";

function page(fields: Record<string, string | number | null>, created = "2026-11-08T00:00:00.000Z"): NotionPage {
  const properties: NotionPage["properties"] = {};
  for (const [name, value] of Object.entries(fields)) {
    if (typeof value === "number") properties[name] = { type: "number", number: value };
    else if (name === "报价日期" || name === "有效期") {
      properties[name] = { type: "date", date: value ? { start: value, end: name === "有效期" ? value : null } : null };
    } else properties[name] = { type: "select", select: value ? { name: value } : null };
  }
  return { created_time: created, properties };
}

const published = {
  审核状态: "允许发布",
  报价类型: "AI收集的市场价",
  币种: "USD",
  计费单位: "USD/柜",
  目的港: "Jebel Ali",
  起运港: "Shanghai",
  柜型: "40HQ",
  价格: 6850,
  报价日期: "2026-11-08",
};

test("Jebel Ali publish keeps a market quote and drops everything else", () => {
  const quote = fromJebelAliPage(page(published));
  assert.ok("quote" in quote);
  if (!("quote" in quote)) return;
  assert.equal(quote.quote.price, 6850);
  assert.equal(quote.quote.origin, "Shanghai");
  const shekou = fromJebelAliPage(page({ ...published, 起运港: "Shenzhen (Shekou)" }));
  assert.equal("quote" in shekou && shekou.quote.origin, "Shenzhen");
  assert.ok("skip" in fromJebelAliPage(page({ ...published, 审核状态: "待审核" })));
  assert.ok("skip" in fromJebelAliPage(page({ ...published, 审核状态: "拒绝" })));
  assert.ok("skip" in fromJebelAliPage(page({ ...published, 报价类型: "内部底价" })));
  assert.ok("skip" in fromJebelAliPage(page({ ...published, 报价类型: "你们可提供的报价" })));
  assert.ok("skip" in fromJebelAliPage(page({ ...published, 币种: "CNY" })));
  assert.equal(JSON.stringify(quote).includes("来源"), false);
  const byTitle = fromJebelAliPage({
    ...page({ ...published, 目的港: "Jeddah" }),
    properties: {
      ...page({ ...published, 目的港: "Jeddah" }).properties,
      记录标识: { type: "title", title: [{ plain_text: "20261108-SHA-JEA-40HQ-206" }] },
    },
  });
  assert.ok("quote" in byTitle);
});

test("the shown Jebel Ali price is the lower quote still in force", () => {
  const quotes: JebelAliMarketQuote[] = [
    { origin: "Shanghai", container: "40HQ", price: 6850, quoteDate: "2026-11-08", validUntil: "2026-11-30" },
    { origin: "Shanghai", container: "40HQ", price: 7800, quoteDate: "2026-11-05", validUntil: null },
    { origin: "Shanghai", container: "40HQ", price: 8800, quoteDate: "2026-11-08", validUntil: "2026-11-07" },
    { origin: "Shanghai", container: "40HQ", price: 1000, quoteDate: "2026-11-08", validUntil: "2026-11-30" },
    { origin: "Ningbo", container: "20GP", price: 7100, quoteDate: "2026-11-08", validUntil: "2026-11-20" },
  ];
  assert.equal(jebelAliGoodPrice(quotes, "Shanghai", "40HQ", "2026-11-08"), 6850);
  assert.equal(jebelAliGoodPrice(quotes, "Shanghai", "20GP", "2026-11-08"), null);
  assert.equal(jebelAliGoodPrice(quotes, "Ningbo", "20GP", "2026-11-08"), 7100);
  assert.equal(jebelAliGoodPrice(quotes, "Shanghai", "40HQ", "2026-11-13"), 6850);
});
