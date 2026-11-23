import { countryStats } from "./countries.ts";
import { INDEX_WINDOW_DAYS, liveIndex } from "./platform.ts";
import { addDays, destinations, type PriceEntry } from "./rates.ts";

// Frozen Monday issues. Pages render these files and never recompute them.
export const MARKET_BRIEF_DIR = process.env.MARKET_BRIEF_DIR ?? "data/market-brief";
export const BRIEF_SAMPLE_NOTE_BELOW = 5;

export const BRIEF_METHOD = {
  en: "Each 40HQ median uses market quotes collected in the last 28 days, with outliers removed. It is a market reading, not a bookable offer. A change in the quotes that make up the sample also moves the week-on-week figure, so that figure is not a forecast.",
  zh: "每个 40HQ 中位数取近 28 天收集到的市场报价，已剔除离群值。这是市场读数，不是可订舱报价。样本构成变化也会影响周环比，所以周环比不是涨跌预测。",
} as const;

export type BriefPort = {
  destination: string;
  median: number | null;
  count: number | null;
  low: number | null;
  high: number | null;
  weekChange: number | null;
  // The live 28-day index change. `weekChange` is the change against the
  // previous frozen issue, which can be older than one week.
  indexWeekChange?: number | null;
};

export type MarketBrief = {
  date: string;
  dataAsOf?: string;
  windowDays: number;
  container: "40HQ";
  outliersDropped: true;
  comparedWith: string | null;
  source?: { en: string; zh: string };
  note?: { en: string; zh: string };
  method: { en: string; zh: string };
  ports: BriefPort[];
};

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export function briefMonday(date: string) {
  const day = new Date(date + "T00:00:00Z").getUTCDay();
  return addDays(date, -((day + 6) % 7));
}

export function briefMoney(amount: number) {
  return `US$${amount.toLocaleString("en-US")}`;
}

export function briefDateLabel(date: string, lang: "en" | "zh") {
  const [year, month, day] = date.split("-").map(Number);
  if (lang === "zh") return `${year} 年 ${month} 月 ${day} 日`;
  return `${day} ${months[month - 1]} ${year}`;
}

export function briefTitle(date: string, lang: "en" | "zh") {
  const label = briefDateLabel(date, lang);
  return lang === "zh"
    ? `红海运价市场简报 — ${label} | RedSeaRate`
    : `Red Sea Freight Market Brief — ${label} | RedSeaRate`;
}

export function briefHeading(date: string, lang: "en" | "zh") {
  const label = briefDateLabel(date, lang);
  return lang === "zh" ? `红海运价市场简报 — ${label}` : `Red Sea Freight Market Brief — ${label}`;
}

export function briefIndexTitle(lang: "en" | "zh") {
  return lang === "zh" ? "红海运价市场简报 | RedSeaRate" : "Red Sea Freight Market Brief | RedSeaRate";
}

export function briefPath(date: string | null, lang: "en" | "zh") {
  const prefix = lang === "zh" ? "/zh" : "";
  return date ? `${prefix}/market-brief/${date}/` : `${prefix}/market-brief/`;
}

export function briefSampleNote(count: number | null, lang: "en" | "zh") {
  if (count == null || count >= BRIEF_SAMPLE_NOTE_BELOW) return null;
  return lang === "zh" ? "样本未满 5 条" : "Fewer than 5 quotes";
}

export function briefChangeText(value: number) {
  return `${value > 0 ? "+" : ""}${value.toFixed(1)}%`;
}

const joinPorts = (names: string[], zh: boolean) => {
  if (names.length <= 1) return names[0] ?? "";
  if (zh) return names.join("、");
  return names.length === 2 ? `${names[0]} and ${names[1]}` : `${names.slice(0, -1).join(", ")}, and ${names.at(-1)}`;
};

// Data-driven bullets for the weekly report template. The first issue can
// carry a hand-written `note`; these lines keep every later issue useful even
// when nobody writes new copy.
export function briefHighlights(brief: MarketBrief, lang: "en" | "zh"): string[] {
  const zh = lang === "zh";
  const name = (port: BriefPort) => {
    const destination = destinations.find((item) => item.id === port.destination);
    return zh ? destination?.zh ?? port.destination : port.destination;
  };
  const change = (port: BriefPort) => port.indexWeekChange ?? port.weekChange;
  const moved = brief.ports.filter((port) => change(port) != null && change(port) !== 0);
  const riser = moved.filter((port) => (change(port) ?? 0) > 0).sort((a, b) => (change(b) ?? 0) - (change(a) ?? 0))[0];
  const faller = moved.filter((port) => (change(port) ?? 0) < 0).sort((a, b) => (change(a) ?? 0) - (change(b) ?? 0))[0];
  const flat = brief.ports.filter((port) => change(port) === 0);
  const thin = brief.ports.filter((port) => port.count != null && port.count < BRIEF_SAMPLE_NOTE_BELOW);
  const format = (port: BriefPort) => `${name(port)} ${change(port) == null ? "—" : briefChangeText(change(port)!)}`;
  const lines: string[] = [];
  if (riser) {
    lines.push(zh
      ? `${format(riser)} 周环比涨幅最大，样本 ${riser.count ?? "—"} 条。`
      : `${format(riser)} had the largest week-on-week rise, on ${riser.count ?? "—"} quotes.`);
  }
  if (faller) {
    lines.push(zh
      ? `${format(faller)} 周环比跌幅最大，样本 ${faller.count ?? "—"} 条。`
      : `${format(faller)} had the largest week-on-week fall, on ${faller.count ?? "—"} quotes.`);
  }
  if (flat.length) {
    lines.push(zh
      ? `${joinPorts(flat.map(name), true)}持平。`
      : `${joinPorts(flat.map(name), false)} ${flat.length === 1 ? "was" : "were"} flat.`);
  }
  if (thin.length) {
    lines.push(zh
      ? `${joinPorts(thin.map(name), true)}的样本低于 ${BRIEF_SAMPLE_NOTE_BELOW} 条，应当作读数，不要当成趋势。`
      : `${joinPorts(thin.map(name), false)} ${thin.length === 1 ? "has" : "have"} fewer than ${BRIEF_SAMPLE_NOTE_BELOW} quotes; treat ${thin.length === 1 ? "it" : "them"} as a reading, not a trend.`);
  }
  if (!lines.length) {
    lines.push(zh ? "这是首期读数，暂无可比的上一期。" : "This is the first reading; there is no earlier issue to compare.");
  }
  return lines;
}

// Same 40HQ pool as the rates index: country stats for that destination,
// container 40HC, which is how 40HQ is stored. `weekChange` compares with the
// previous frozen issue; `indexWeekChange` is the live 28-day index change.
export function buildMarketBrief(entries: PriceEntry[], date: string, previous?: MarketBrief | null): MarketBrief {
  const prior = new Map((previous?.ports ?? []).map((port) => [port.destination, port]));
  const live = new Map(liveIndex(entries, date).map((entry) => [entry.port.id, entry]));
  const ports = destinations.map((destination): BriefPort => {
    const stat = countryStats(entries, date, destination.id).containers["40HC"];
    const before = prior.get(destination.id);
    return {
      destination: destination.id,
      median: stat?.median ?? null,
      count: stat?.count ?? null,
      low: stat?.low ?? null,
      high: stat?.high ?? null,
      weekChange: stat && before?.median
        ? Math.round(((stat.median - before.median) / before.median) * 1000) / 10
        : null,
      indexWeekChange: live.get(destination.id)?.weekChange ?? null,
    };
  });
  return {
    date,
    dataAsOf: date,
    windowDays: INDEX_WINDOW_DAYS,
    container: "40HQ",
    outliersDropped: true,
    comparedWith: previous?.date ?? null,
    method: { en: BRIEF_METHOD.en, zh: BRIEF_METHOD.zh },
    ports,
  };
}

export function briefDescription(brief: MarketBrief, lang: "en" | "zh") {
  const parts = brief.ports.map((port) => {
    const name = lang === "zh"
      ? destinations.find((item) => item.id === port.destination)?.zh ?? port.destination
      : port.destination;
    if (port.median == null || port.count == null) return lang === "zh" ? `${name} 暂无` : `${name} n/a`;
    const amount = lang === "zh" ? port.median.toLocaleString("en-US") : briefMoney(port.median);
    const count = lang === "zh" ? `（${port.count}）` : ` (${port.count})`;
    return `${name} ${amount}${count}`;
  });
  if (lang === "zh") {
    const [, month, day] = brief.date.split("-").map(Number);
    return `${month} 月 ${day} 日：${parts.join("，")}。`;
  }
  return `${briefDateLabel(brief.date, "en")}: ${parts.join(", ")}.`;
}

export function briefIndexDescription(lang: "en" | "zh") {
  return lang === "zh"
    ? "每周一归档的中国到红海 40HQ 市场中位数。每期数字按当周冻结。"
    : "Monday archive of China to Red Sea 40HQ market medians. Each issue keeps the figures from that week.";
}

export function briefSummary(brief: MarketBrief, lang: "en" | "zh") {
  return brief.ports.map((port) => {
    const name = lang === "zh"
      ? destinations.find((item) => item.id === port.destination)?.zh ?? port.destination
      : port.destination;
    return port.median == null ? `${name} —` : `${name} ${briefMoney(port.median)}`;
  }).join(lang === "zh" ? " · " : " · ");
}

