type Lang = "en" | "zh";

const pick = (lang: Lang, en: string, zh: string) => (lang === "zh" ? zh : en);
const dollars = (n: number) => "$" + n.toLocaleString("en-US");

export function homeInquiryText(input: {
  lang: Lang;
  intent: "quote" | "booking";
  origin: string;
  destination: string;
  referenceFrom: string | null;
  mode: string;
  quantity: number;
  container: string;
  volume: number;
  weight: number;
  date: string;
  offer: { low: number; high: number; validUntil: string } | null;
  market: { median: number; count: number } | null;
  cargo: string;
}) {
  const { lang } = input;
  return [
    input.intent === "quote"
      ? pick(lang, "RedSeaRate ocean freight quote request (redsearate.com)", "RedSeaRate 海运询价（redsearate.com）")
      : pick(lang, "RedSeaRate booking request (redsearate.com)", "RedSeaRate 订舱需求（redsearate.com）"),
    `${pick(lang, "Route", "航线")}: ${input.origin} → ${input.destination}`,
    input.referenceFrom ? `${pick(lang, "Shown reference", "页面参考来自")}: ${input.referenceFrom}` : "",
    input.mode === "FCL"
      ? `${pick(lang, "Equipment", "柜型")}: ${input.quantity} × ${input.container}`
      : `${pick(lang, "LCL", "拼箱")}: ${input.volume} CBM / ${input.weight} kg`,
    `${pick(lang, "Cargo ready", "备货日期")}: ${input.date || "-"}`,
    input.offer
      ? `${pick(lang, "Page offer", "页面报价")}: ${dollars(input.offer.low)}${input.offer.high !== input.offer.low ? `–${dollars(input.offer.high)}` : ""} (${pick(lang, "valid until", "有效至")} ${input.offer.validUntil})`
      : input.market
        ? `${pick(lang, "Market reference", "市场参考价")}: ≈ ${dollars(input.market.median)} (${pick(lang, `median of ${input.market.count} prices`, `${input.market.count} 条中位数`)})`
        : `${pick(lang, "Page offer", "页面报价")}: ${pick(lang, "on request", "请询价")}`,
    `${pick(lang, "Cargo", "货物")}: ${input.cargo || "-"}`,
  ].filter(Boolean).join("\n");
}

export function jebelAliInquiryText(
  lang: Lang,
  cargo: string,
  facts: { transitDays: number; direct: boolean; carrier: string },
  selection?: { origin: string; container: string; quantity: number; etd: string; price: number | null },
) {
  const money = selection?.price == null ? "" : "US$" + selection.price.toLocaleString("en-US");
  return [
    pick(lang, "RedSeaRate ocean freight quote request (redsearate.com)", "RedSeaRate 海运询价（redsearate.com）"),
    pick(lang, "Route: China → Jebel Ali", "航线：中国 → 杰贝阿里"),
    selection ? pick(lang, `Origin: ${selection.origin}`, `起运港：${selection.origin}`) : "",
    selection
      ? pick(lang, `Equipment: ${selection.quantity} × ${selection.container}`, `柜型：${selection.quantity} × ${selection.container}`)
      : pick(lang, "Equipment: 40HQ", "柜型：40HQ"),
    selection ? `ETD: ${selection.etd}` : "",
    selection?.price == null
      ? pick(lang, "Page offer: on request", "页面报价：请询价")
      : pick(lang, `Page offer: ${money}`, `页面报价：${money}`),
    pick(lang, `Transit: ${facts.transitDays} days`, `航程：${facts.transitDays} 天`),
    pick(lang, `Transshipment: ${facts.direct ? "no" : "yes"}`, `中转：${facts.direct ? "否" : "是"}`),
    pick(lang, `Carrier: ${facts.carrier}`, `船公司：${facts.carrier}`),
    pick(lang, `Cargo: ${cargo || "-"}`, `货物：${cargo || "-"}`),
  ].filter(Boolean).join("\n");
}
