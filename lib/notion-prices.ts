import { addDays, containers, destinations, type PriceEntry, type Tier } from "./rates.ts";

// One row of the Notion "RedSeaRate 报价库" data source, reduced to the fields
// the public site may use. Source links, notes and reviewers are never read,
// so they cannot reach the build output.
export type NotionQuote = {
  status: string;
  type: string;
  origin: string;
  destination: string;
  container: string;
  currency: string;
  unit: string;
  price: number | null;
  carrier: string;
  freeDays: number | null;
  routing: string;
  quoteDate: string | null;
  validFrom: string | null;
  validTo: string | null;
  createdTime: string;
};

// Rows publish without manual review unless marked 拒绝.
export const REJECTED = "拒绝";
const tierNames: Record<string, Tier> = {
  AI收集的市场价: "market",
  你们可提供的报价: "offer",
};
const originNames: Record<string, string> = { "Shenzhen (Shekou)": "Shenzhen" };
const unitFor = (container: string) => (container === "LCL" ? "USD/W/M" : "USD/柜");

type Property = {
  type: string;
  select?: { name: string } | null;
  number?: number | null;
  date?: { start: string; end: string | null } | null;
  title?: { plain_text: string }[];
  rich_text?: { plain_text: string }[];
};
export type NotionPage = {
  created_time: string;
  properties: Record<string, Property>;
};

const select = (p?: Property) => p?.select?.name ?? "";
const text = (p?: Property) => (p?.rich_text ?? []).map((t) => t.plain_text).join("").trim();
const day = (value?: string | null) => (value ? value.slice(0, 10) : null);

export function fromNotionPage(page: NotionPage): NotionQuote {
  const p = page.properties;
  return {
    status: select(p["审核状态"]),
    type: select(p["报价类型"]),
    origin: select(p["起运港"]),
    destination: select(p["目的港"]),
    container: select(p["柜型"]),
    currency: select(p["币种"]),
    unit: select(p["计费单位"]),
    price: p["价格"]?.number ?? null,
    carrier: text(p["船公司"]),
    freeDays: p["免用箱期天数"]?.number ?? null,
    routing: text(p["直达/中转"]),
    quoteDate: day(p["报价日期"]?.date?.start),
    validFrom: day(p["有效期"]?.date?.start),
    validTo: day(p["有效期"]?.date?.end),
    createdTime: page.created_time,
  };
}

// A quote without a validity date is valid for 7 days from its quote date,
// the same default the CSV import used.
export function toPublicEntry(
  q: NotionQuote,
  id: number,
): { entry: PriceEntry } | { skip: string } {
  if (q.status === REJECTED) return { skip: "已拒绝" };
  if (q.destination === "Jebel Ali" || q.destination === "杰贝阿里" || q.destination === "AEJEA") {
    return { skip: "杰贝阿里不进红海指数" };
  }
  const tier = tierNames[q.type];
  if (!tier) return { skip: `报价类型不公开：${q.type || "空"}` };
  // Origins outside the estimator's four still count towards the port index.
  const origin = originNames[q.origin] ?? q.origin;
  if (!origin) return { skip: "起运港为空" };
  if (!destinations.some((d) => d.id === q.destination)) return { skip: `目的港暂不支持：${q.destination || "空"}` };
  const container = q.container === "40HQ" ? "40HC" : q.container;
  if (!(containers as readonly string[]).includes(container)) return { skip: `柜型不支持：${q.container || "空"}` };
  if (q.currency !== "USD") return { skip: `币种不是 USD：${q.currency || "空"}` };
  if (q.unit !== unitFor(container)) return { skip: `计费单位与柜型不符：${q.unit || "空"}` };
  const date = q.quoteDate ?? day(q.createdTime)!;
  const entry: PriceEntry = {
    id,
    tier,
    origin,
    destination: q.destination,
    container: container as PriceEntry["container"],
    price: q.price ?? NaN,
    validUntil: q.validTo ?? q.validFrom ?? addDays(date, 7),
    carrier: q.carrier,
    freeDays: q.freeDays,
    routing: q.routing,
    addedAt: q.createdTime,
    transitMin: null,
    transitMax: null,
    source: "",
    note: "",
    submittedBy: "Notion",
    createdAt: new Date(`${date}T12:00:00+08:00`).toISOString(),
  };
  if (!(entry.price > 0 && entry.price <= 50000)) return { skip: "价格需在 0–50000 美元之间" };
  return { entry };
}
