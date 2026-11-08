import { existsSync, readFileSync } from "node:fs";
import { addDays } from "./rates.ts";
import type { NotionPage } from "./notion-prices.ts";
import type { JebelAliContainer } from "./jebel-ali.ts";

// RedSeaRate 报价库 rows whose destination is Jebel Ali. They stay out of the Red Sea price file.
export const JEBEL_ALI_DESTINATION = "Jebel Ali";
const PUBLISHED = "允许发布";
const MARKET = "AI收集的市场价";
const VALID_DAYS = 7;

export type JebelAliMarketQuote = {
  origin: string;
  container: JebelAliContainer;
  price: number;
  quoteDate: string;
  validUntil: string | null;
};

const containers = new Set<JebelAliContainer>(["20GP", "40GP", "40HQ"]);
const day = (value?: string | null) => (value ? value.slice(0, 10) : null);

const JEBEL_DESTINATIONS = new Set(["Jebel Ali", "杰贝阿里", "AEJEA"]);

function selectName(page: NotionPage, name: string) {
  return page.properties[name]?.select?.name ?? "";
}

function recordTitle(page: NotionPage) {
  return (page.properties["记录标识"]?.title ?? []).map((part) => part.plain_text).join("");
}

// Destination Jebel Ali, or a record id that already says JEA, never joins the Red Sea index.
export function isJebelAliPage(page: NotionPage) {
  return JEBEL_DESTINATIONS.has(selectName(page, "目的港")) || /-JEA-/.test(recordTitle(page));
}

// Source links, notes and internal floors never become a public quote.
export function fromJebelAliPage(
  page: NotionPage,
): { quote: JebelAliMarketQuote } | { skip: string } {
  if (!isJebelAliPage(page)) return { skip: "目的港不是杰贝阿里" };
  if (selectName(page, "审核状态") !== PUBLISHED) return { skip: "未允许发布" };
  if (selectName(page, "报价类型") !== MARKET) return { skip: "不是市场价" };
  if (selectName(page, "币种") !== "USD") return { skip: "币种不是 USD" };
  if (selectName(page, "计费单位") !== "USD/柜") return { skip: "计费单位不是 USD/柜" };
  const container = selectName(page, "柜型");
  if (!containers.has(container as JebelAliContainer)) return { skip: `柜型不支持：${container || "空"}` };
  const rawOrigin = selectName(page, "起运港");
  const origin = rawOrigin === "Shenzhen (Shekou)" ? "Shenzhen" : rawOrigin;
  if (!origin) return { skip: "起运港为空" };
  const price = page.properties["价格"]?.number ?? NaN;
  if (!(price > 0 && price <= 50000)) return { skip: "价格需在 0–50000 美元之间" };
  const quoteDate = day(page.properties["报价日期"]?.date?.start) ?? day(page.created_time)!;
  const validUntil = day(page.properties["有效期"]?.date?.end) ?? day(page.properties["有效期"]?.date?.start);
  return {
    quote: { origin, container: container as JebelAliContainer, price, quoteDate, validUntil },
  };
}

function inForce(quote: JebelAliMarketQuote, today: string) {
  return (quote.validUntil ?? addDays(quote.quoteDate, VALID_DAYS)) >= today;
}

// The lower price still in force. A price under half of the next one is left
// out, so a stray low figure does not become the number on the page.
export function jebelAliGoodPrice(
  quotes: readonly JebelAliMarketQuote[],
  origin: string,
  container: JebelAliContainer,
  today: string,
): number | null {
  const prices = quotes
    .filter((quote) => quote.origin === origin && quote.container === container && inForce(quote, today))
    .map((quote) => quote.price)
    .sort((a, b) => a - b);
  while (prices.length > 1 && prices[0] < prices[1] * 0.5) prices.shift();
  return prices[0] ?? null;
}

const referenceOrigins = ["Shanghai", "Ningbo", "Shenzhen", "Qingdao"] as const;

export type JebelAliReference = {
  origin: (typeof referenceOrigins)[number];
  container: JebelAliContainer;
  price: number | null;
};

// One price per homepage origin and container. The rates table shows the row
// that matches the selected origin. These numbers stay out of the Red Sea index.
export function jebelAliReferences(
  quotes: readonly JebelAliMarketQuote[],
  today: string,
): JebelAliReference[] {
  const boxes: JebelAliContainer[] = ["20GP", "40GP", "40HQ"];
  return referenceOrigins.flatMap((origin) =>
    boxes.map((container) => ({
      origin,
      container,
      price: jebelAliGoodPrice(quotes, origin, container, today),
    })),
  );
}

export function readJebelAliQuotes(): JebelAliMarketQuote[] {
  const file = process.env.JEBEL_ALI_PRICES ?? ".data/jebel-ali-prices.json";
  if (!existsSync(file)) return [];
  return JSON.parse(readFileSync(file, "utf8")) as JebelAliMarketQuote[];
}
