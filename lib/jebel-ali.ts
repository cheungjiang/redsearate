import type { CountryStats } from "./countries.ts";
import { INDEX_WINDOW_DAYS } from "./platform.ts";
import { extraOriginNames, origins } from "./rates.ts";

export const JEBEL_ALI_SLUG = "jebel-ali";
export const JEBEL_ALI_TITLE = {
  en: "Shipping from China to Jebel Ali: Freight Rates & Transit Times",
  zh: "中国到杰贝阿里海运：运价与航程",
} as const;

export function jebelAliTitle(lang: "en" | "zh") {
  return `${JEBEL_ALI_TITLE[lang]} | RedSeaRate`;
}
export const JEBEL_ALI_CODE = "AEJEA";
export const JEBEL_ALI_TRANSIT_DAYS = 26;
export const JEBEL_ALI_DIRECT = true;
export const JEBEL_ALI_CARRIER = "HPL";

// Rows stay on the page until this list is edited. Do not drop them by date.
// Unpublished, no figure supplied: throughput, terminal operator, depth, free time,
// Dubai customs documents, free-zone rules, duty rates, 20GP and 40GP prices.
export const jebelAliSailings = [
  { origin: "Qingdao", etd: "2026-11-15" },
  { origin: "Shanghai", etd: "2026-11-15" },
  { origin: "Ningbo", etd: "2026-11-15" },
  { origin: "Shenzhen", etd: "2026-11-18" },
  { origin: "Guangzhou (Nansha)", etd: "2026-11-15" },
] as const;

export type JebelAliSailing = (typeof jebelAliSailings)[number];
export type JebelAliContainer = "20GP" | "40GP" | "40HQ";

export function jebelAliOriginName(id: string, lang: "en" | "zh") {
  if (lang === "en") return id;
  return origins.find((port) => port.id === id)?.zh ?? extraOriginNames[id] ?? id;
}

export function jebelAliEarliestEtd() {
  return jebelAliSailings.map((sailing) => sailing.etd).sort()[0] ?? "";
}

export function jebelAliMoney(amount: number) {
  return "US$" + amount.toLocaleString("en-US");
}

export function jebelAliQuote(origin: string, container: JebelAliContainer) {
  const sailing = jebelAliSailings.find((row) => row.origin === origin);
  if (!sailing) return null;
  return { origin: sailing.origin, etd: sailing.etd, container };
}

function joinNames(names: string[], lang: "en" | "zh") {
  if (lang === "zh" || names.length < 2) return names.join("、");
  if (names.length === 2) return `${names[0]} and ${names[1]}`;
  return `${names.slice(0, -1).join(", ")}, and ${names.at(-1)}`;
}

const etdLines = (sailings: readonly JebelAliSailing[], lang: "en" | "zh") => {
  const groups = new Map<string, string[]>();
  for (const sailing of sailings) {
    const names = groups.get(sailing.etd) ?? [];
    names.push(jebelAliOriginName(sailing.origin, lang));
    groups.set(sailing.etd, names);
  }
  return [...groups].map(([etd, names]) =>
    lang === "zh" ? `${names.join("、")}的 ETD 是 ${etd}` : `ETD is ${etd} from ${joinNames(names, "en")}`,
  );
};

export function jebelAliDescription(_today: string, lang: "en" | "zh") {
  if (!jebelAliSailings.length) {
    return lang === "zh"
      ? "已列的中国到杰贝阿里船期已过。杰贝阿里在迪拜，不是沙特港。请重新询价。"
      : "The listed China to Jebel Ali sailings have passed. Jebel Ali is in Dubai, not Saudi Arabia. Ask for a new quote.";
  }
  return lang === "zh"
    ? "各起运港到杰贝阿里的运价，以及已列的一班船期。杰贝阿里在迪拜。此页不属于红海指数。"
    : "Rates from China origin ports to Jebel Ali, plus one listed sailing. Jebel Ali is in Dubai, separate from the Red Sea index.";
}

const quotesLabel = (n: number, lang: "en" | "zh") =>
  lang === "zh" ? `${n} 条报价` : `${n} ${n === 1 ? "quote" : "quotes"}`;

export function jebelAliOverview(stats: CountryStats, today: string, lang: "en" | "zh") {
  const zh = lang === "zh";
  const port = zh ? "杰贝阿里" : "Jebel Ali";
  const hq = stats.containers["40HC"];
  const gp = stats.containers["20GP"];
  if (!hq) {
    return zh
      ? `近 ${INDEX_WINDOW_DAYS} 天暂未收集到中国到${port}的 40HQ 市场报价。`
      : `No 40HQ market quotes from China to ${port} in the last ${INDEX_WINDOW_DAYS} days.`;
  }
  const range = `${jebelAliMoney(hq.low)}–${jebelAliMoney(hq.high)}`;
  const gpSentence = gp
    ? zh
      ? `20GP 中位数为 ${jebelAliMoney(gp.median)}（${quotesLabel(gp.count, lang)}）。`
      : ` The 20GP median is ${jebelAliMoney(gp.median)} (${quotesLabel(gp.count, lang)}).`
    : "";
  return zh
    ? `截至 ${today}，中国到${port}的 40HQ 海运市场中位数为每柜 ${jebelAliMoney(hq.median)}，基于近 ${INDEX_WINDOW_DAYS} 天的 ${quotesLabel(hq.count, lang)}（区间 ${range}）。${gpSentence}`
    : `As of ${today}, the median 40HQ ocean freight market rate from China to ${port} is ${jebelAliMoney(hq.median)} per container, based on ${quotesLabel(hq.count, lang)} in the last ${INDEX_WINDOW_DAYS} days (range ${range}).${gpSentence}`;
}

export function jebelAliCheapest(stats: CountryStats, lang: "en" | "zh") {
  const zh = lang === "zh";
  const port = zh ? "杰贝阿里" : "Jebel Ali";
  const minQuotes = 3;
  const candidates = stats.origins.filter((origin) => (origin.containers["40HC"]?.count ?? 0) >= minQuotes);
  const cheapest = candidates[0];
  const sample = cheapest?.containers["40HC"];
  if (!cheapest || !sample) {
    return zh
      ? "该港口按起运港拆开的样本仍然偏少，请对照下方表格和样本量一起看。"
      : "Origin-level samples are still thin for this port — compare the table below together with the sample counts.";
  }
  const name = jebelAliOriginName(cheapest.origin, lang);
  return zh
    ? `近 ${INDEX_WINDOW_DAYS} 天的报价中，在至少有 ${minQuotes} 条报价的起运港里，${name}出运的 40HQ 中位数最低，为 ${jebelAliMoney(sample.median)}（${quotesLabel(sample.count, lang)}），共比较了 ${candidates.length} 个起运港。离工厂最近的港口加上拖车费，往往才是总成本最低的选择。`
    : `In the last ${INDEX_WINDOW_DAYS} days, ${name} had the lowest 40HQ median to ${port}, at ${jebelAliMoney(sample.median)} (${quotesLabel(sample.count, lang)}), out of ${candidates.length} origin ${candidates.length === 1 ? "port" : "ports"} compared, among origin ports with at least ${minQuotes} quotes. Add trucking from your factory: the nearest port is often the cheapest in total.`;
}

export function jebelAliMarketNote(stats: CountryStats, lang: "en" | "zh") {
  return lang === "zh"
    ? `市场参考，不是可订舱报价。港到港海运费，美元/柜，近 ${INDEX_WINDOW_DAYS} 天收集的报价中位数（共 ${stats.quotes} 条）。不含本地费用、关税和内陆运输。`
    : `A market reference, not a bookable offer. Port-to-port ocean freight in USD per container, the median of quotes collected in the last ${INDEX_WINDOW_DAYS} days (${stats.quotes} in total). Local charges, duty and inland transport are not included.`;
}

export function jebelAliFaqs(today: string, lang: "en" | "zh", stats: CountryStats) {
  const zh = lang === "zh";
  const etd = zh
    ? `${etdLines(jebelAliSailings, lang).join("。")}。`
    : `${etdLines(jebelAliSailings, lang).join(". ")}.`;
  const reading = zh
    ? "这个中位数是市场参考，不是可订舱报价，不含本地费用。"
    : "This median is a market reference, not a bookable rate, and it excludes local charges.";
  return [
    {
      q: zh ? "中国到杰贝阿里一个集装箱海运费多少钱？" : "How much does it cost to ship a container from China to Jebel Ali?",
      a: `${jebelAliOverview(stats, today, lang)} ${reading}`,
    },
    { q: zh ? "这几条船的 ETD 是哪天？" : "What are the ETDs?", a: etd },
    {
      q: zh ? "航程几天，中转吗？" : "How long is the transit, and does it transship?",
      a: zh
        ? `航程 ${JEBEL_ALI_TRANSIT_DAYS} 天，不中转，船公司 ${JEBEL_ALI_CARRIER}。`
        : `Transit time is ${JEBEL_ALI_TRANSIT_DAYS} days, with no transshipment. The carrier is ${JEBEL_ALI_CARRIER}.`,
    },
    {
      q: zh ? "杰贝阿里是沙特的港口吗？" : "Is Jebel Ali a Saudi port?",
      a: zh ? "不是。杰贝阿里在迪拜。沙特的运价看吉达页。" : "No. Jebel Ali is in Dubai. Saudi rates on this site are for Jeddah.",
    },
    {
      q: zh ? "这个页面属于红海指数吗？" : "Is this page part of the Red Sea index?",
      a: zh
        ? "不属于。首页估价只覆盖吉达、苏赫纳、亚喀巴、吉布提和苏丹港。"
        : "No. The homepage estimator covers Jeddah, Sokhna, Aqaba, Djibouti and Port Sudan.",
    },
    {
      q: zh ? "这份服务含什么？" : "What does this service include?",
      a: zh ? "港到港海运费。" : "Port-to-port ocean freight.",
    },
    {
      q: zh ? "这份服务不含什么？" : "What does this service leave out?",
      a: zh
        ? "不含港杂、清关、关税、保险和内陆运输。"
        : "Local charges, customs clearance, duty, insurance and inland transport.",
    },
    {
      q: zh ? "怎么询这一水？" : "How do I ask about this sailing?",
      a: zh
        ? "用页面上的获取估价，或底部的微信、WhatsApp。消息发出去还不代表舱位已留。"
        : "Use Get a quote on this page, or the WeChat and WhatsApp buttons at the bottom. Sending a message does not hold space.",
    },
  ];
}
