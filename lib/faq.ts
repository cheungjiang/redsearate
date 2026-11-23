import { countries, type CountryStats } from "./countries.ts";
import type { FaqItem } from "./faq-content.ts";
import { readMarketBriefs } from "./market-brief.server.ts";
import { destinations } from "./rates.ts";
import { countryData } from "./site-data.ts";

export type { FaqItem } from "./faq-content.ts";
export type FaqRow = ReturnType<typeof countryData>;
type ContainerKey = "20GP" | "40GP" | "40HC";

const money = (n: number) => `US$${n.toLocaleString("en-US")}`;
const containerLabel = (key: ContainerKey) => key === "40HC" ? "40HQ" : key;

const statText = (stat: CountryStats["containers"][ContainerKey], lang: "en" | "zh") => {
  if (!stat) return lang === "zh" ? "暂无" : "n/a";
  return lang === "zh"
    ? `${money(stat.median)}（${stat.count} 条报价）`
    : `${money(stat.median)} (${stat.count} quotes)`;
};

const portOf = (row: FaqRow) => destinations.find((item) => item.id === row.country.destination)!;

const portName = (row: FaqRow, lang: "en" | "zh") => {
  const port = portOf(row);
  return lang === "zh" ? port.zh : port.id;
};

const transitText = (row: FaqRow, lang: "en" | "zh") => {
  if (row.country.transit) return lang === "zh" ? row.country.transit.range.zh : row.country.transit.range.en;
  return lang === "zh"
    ? "中国直航有限，很多货需经吉达、杰贝阿里或吉布提中转，具体以询价确认为准。"
    : "Direct sailings from China are limited; much cargo tranships via Jeddah, Jebel Ali or Djibouti, so confirm the routing with your quote.";
};

const containerSummary = (rows: FaqRow[], key: ContainerKey, lang: "en" | "zh") =>
  rows
    .map((row) => `${portName(row, lang)} ${statText(row.stats.containers[key], lang)}`)
    .join(lang === "zh" ? "；" : "; ");

export function faqRows(): FaqRow[] {
  // Preview builds may have no public-prices snapshot. Fall back to the latest
  // frozen 40HQ medians so the FAQ still answers the price question; live
  // country data always wins when it exists.
  const brief = readMarketBriefs()[0];
  return countries.map((country) => {
    const row = countryData(country.slug);
    if (!row.stats.containers["40HC"] && brief) {
      const port = brief.ports.find((item) => item.destination === country.destination);
      if (port?.median != null && port.count != null && port.low != null && port.high != null) {
        row.stats.containers["40HC"] = {
          median: port.median,
          count: port.count,
          low: port.low,
          high: port.high,
        };
      }
    }
    return row;
  });
}

export function faqItems(lang: "en" | "zh", rows: FaqRow[]): FaqItem[] {
  const zh = lang === "zh";
  const items: FaqItem[] = [
    {
      q: zh ? "中国到红海一个柜子多少钱？" : "How much does a container from China to the Red Sea cost?",
      a: zh
        ? `40HQ 市场中位数：${containerSummary(rows, "40HC", "zh")}。以上为近 28 天收集的港到港报价中位数，已剔除离群值；20GP 和 40GP 的读数见上方表格。具体船期和可订价格需按货量、日期和起运港询价。`
        : `40HQ market medians: ${containerSummary(rows, "40HC", "en")}. These are port-to-port medians from quotes collected in the last 28 days, with outliers removed; the table above shows 20GP and 40GP where quotes exist. A bookable price depends on your cargo, date and origin port.`,
    },
    {
      q: zh ? "20GP 一个柜多少钱？" : "How much is a 20GP container?",
      a: zh
        ? `20GP 市场中位数：${containerSummary(rows, "20GP", "zh")}。没有读数的港口，说明近 28 天没有足够的 20GP 报价，请直接询价。`
        : `20GP market medians: ${containerSummary(rows, "20GP", "en")}. A port marked n/a has no recent 20GP quotes in the 28-day window; ask for a quote.`,
    },
    {
      q: zh ? "40GP 一个柜多少钱？" : "How much is a 40GP container?",
      a: zh
        ? `40GP 市场中位数：${containerSummary(rows, "40GP", "zh")}。40GP 的箱源比 40HQ 少，报价前请确认起运港有箱。`
        : `40GP market medians: ${containerSummary(rows, "40GP", "en")}. 40GP equipment is less common than 40HQ at some origins, so confirm availability before you book.`,
    },
    {
      q: zh ? "40HQ 一个柜多少钱？" : "How much is a 40HQ container?",
      a: zh
        ? `40HQ 市场中位数：${containerSummary(rows, "40HC", "zh")}。40HQ 是本站指数使用的柜型；轻货、体积货通常比 20GP 更合适，但目的港内陆限高和拖车也要一起确认。`
        : `40HQ market medians: ${containerSummary(rows, "40HC", "en")}. 40HQ is the container behind this site's index. It usually suits light, voluminous cargo, but check inland height limits and trucking at destination too.`,
    },
  ];

  for (const row of rows) {
    const transit = transitText(row, lang);
    const hasRange = Boolean(row.country.transit);
    items.push({
      q: zh
        ? `中国到${portName(row, "zh")}海运要多久？`
        : `How long does shipping from China to ${portName(row, "en")} take?`,
      a: hasRange
        ? zh
          ? `${portName(row, "zh")}的港到港时效约为 ${transit}。这是港到港区间，不含目的港清关、拖车和内陆运输；中转船期还要看衔接。`
          : `Port-to-port transit to ${portName(row, "en")} is about ${transit}. This is a port-to-port range and excludes destination clearance, trucking and inland transport; a transhipment sailing also depends on the connection.`
        : zh
          ? `中国到${portName(row, "zh")}的港到港时效取决于航线。${transit}这是港到港区间，不含目的港清关、拖车和内陆运输；中转船期还要看衔接。`
          : `Port-to-port transit to ${portName(row, "en")} depends on the routing. ${transit} This is a port-to-port range and excludes destination clearance, trucking and inland transport; a transhipment sailing also depends on the connection.`,
    });
  }

  return items;
}
