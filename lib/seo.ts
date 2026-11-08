import type { Metadata } from "next";
import { faqs, type Guide } from "./content.ts";
import { addDays, destinations, extraOriginNames, origins } from "./rates.ts";
import type { Country, CountryStats } from "./countries.ts";
import { INDEX_WINDOW_DAYS, type IndexEntry } from "./platform.ts";

export const SITE = "https://redsearate.com";
export const GUIDES_PUBLISHED = "2026-10-24";
type Lang = "en" | "zh";
const home = (lang: Lang) => (lang === "zh" ? "/zh/" : "/");

export function pageMetadata({
  lang,
  path,
  alternates,
  title,
  description,
  type = "website",
}: {
  lang: Lang;
  path: string;
  alternates: { en: string; zh: string };
  title: string;
  description: string;
  type?: "website" | "article";
}): Metadata {
  const image = {
    url: "/og.jpg",
    width: 1200,
    height: 630,
    alt: lang === "zh" ? "中国至红海海运集装箱船" : "Container ship sailing from China to the Red Sea",
  };
  return {
    title: { absolute: title },
    description,
    alternates: {
      canonical: path,
      languages: { en: alternates.en, "zh-CN": alternates.zh, "x-default": alternates.en },
    },
    openGraph: {
      title,
      description,
      url: path,
      siteName: "RedSeaRate",
      locale: lang === "zh" ? "zh_CN" : "en_US",
      alternateLocale: lang === "zh" ? "en_US" : "zh_CN",
      type,
      images: [image],
    },
    twitter: { card: "summary_large_image", title, description, images: [image.url] },
  };
}

const organization = {
  "@type": "Organization",
  "@id": `${SITE}/#organization`,
  name: "RedSeaRate",
  url: `${SITE}/`,
  logo: `${SITE}/icon-512.png`,
  description: "Ocean freight rates, estimates and booking inquiries from China to Red Sea ports.",
  areaServed: ["Saudi Arabia", "Egypt", "Jordan", "Djibouti", "Sudan"],
};

export function homeJsonLd(lang: Lang) {
  const zh = lang === "zh";
  return {
    "@context": "https://schema.org",
    "@graph": [
      organization,
      {
        "@type": "WebSite",
        "@id": `${SITE}/#website`,
        url: `${SITE}/`,
        name: "RedSeaRate",
        alternateName: "红海运价",
        inLanguage: ["en", "zh-CN"],
        publisher: { "@id": organization["@id"] },
      },
      {
        "@type": "FAQPage",
        url: `${SITE}${home(lang)}`,
        inLanguage: zh ? "zh-CN" : "en",
        mainEntity: faqs.map((f) => ({
          "@type": "Question",
          name: zh ? f.q.zh : f.q.en,
          acceptedAnswer: { "@type": "Answer", text: zh ? f.a.zh : f.a.en },
        })),
      },
    ],
  };
}

const breadcrumbs = (items: { name: string; path: string }[]) => ({
  "@type": "BreadcrumbList",
  itemListElement: items.map((item, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: item.name,
    item: `${SITE}${item.path}`,
  })),
});

export function guideJsonLd(guide: Guide, lang: Lang) {
  const zh = lang === "zh";
  const path = `${zh ? "/zh" : ""}/guides/${guide.slug}/`;
  const title = zh ? guide.title.zh : guide.title.en;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: title,
        description: guideDescription(guide, lang),
        inLanguage: zh ? "zh-CN" : "en",
        datePublished: GUIDES_PUBLISHED,
        dateModified: GUIDES_PUBLISHED,
        image: `${SITE}/og.jpg`,
        mainEntityOfPage: `${SITE}${path}`,
        author: { "@id": organization["@id"] },
        publisher: organization,
      },
      breadcrumbs([
        { name: "RedSeaRate", path: home(lang) },
        { name: zh ? "指南" : "Guides", path: `${home(lang)}#guides` },
        { name: title, path },
      ]),
    ],
  };
}

export function guideDescription(guide: Guide, lang: Lang) {
  const first = (lang === "zh" ? guide.body.zh : guide.body.en).split("\n\n")[0];
  const limit = lang === "zh" ? 80 : 155;
  return first.length > limit ? `${first.slice(0, limit - 1).trimEnd()}…` : first;
}

const portName = (entry: IndexEntry, lang: Lang) => (lang === "zh" ? entry.port.zh : entry.port.id);

// One answer-first sentence per port, built only from computed index values.
export function indexSentences(index: IndexEntry[], today: string, lang: Lang) {
  return index.map((entry) => {
    const name = portName(entry, lang);
    if (entry.median === null)
      return lang === "zh"
        ? `${name}：近 ${INDEX_WINDOW_DAYS} 天暂无 40HQ 市场报价。`
        : `${name}: no 40HQ market quotes in the last ${INDEX_WINDOW_DAYS} days yet.`;
    const price = `US$${entry.median.toLocaleString("en-US")}`;
    const change = entry.weekChange === null
      ? ""
      : lang === "zh"
        ? `，周环比 ${entry.weekChange > 0 ? "+" : ""}${entry.weekChange.toFixed(1)}%`
        : `, ${entry.weekChange > 0 ? "+" : ""}${entry.weekChange.toFixed(1)}% week on week`;
    return lang === "zh"
      ? `截至 ${today}，中国至${name} 40HQ 海运市场中位数为每柜 ${price}（近 ${INDEX_WINDOW_DAYS} 天 ${entry.sampleSize} 条报价${change}）。`
      : `As of ${today}, the median 40HQ ocean freight market rate from China to ${name} is ${price} per container (${entry.sampleSize} ${entry.sampleSize === 1 ? "quote" : "quotes"} in the last ${INDEX_WINDOW_DAYS} days${change}).`;
  });
}

export function ratesJsonLd(index: IndexEntry[], today: string, lang: Lang) {
  const zh = lang === "zh";
  const path = zh ? "/zh/rates/" : "/rates/";
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Dataset",
        name: zh ? "中国至红海 40HQ 海运市场运价指数" : "China to Red Sea 40HQ ocean freight market index",
        description: zh
          ? `中国各起运港至吉达、苏赫纳、亚喀巴、吉布提和苏丹港的 40HQ 港到港海运费市场中位数，基于近 ${INDEX_WINDOW_DAYS} 天收集的报价，已剔除异常值。`
          : `Median port-to-port 40HQ ocean freight market rates from China to Jeddah, Sokhna, Aqaba, Djibouti and Port Sudan, from quotes collected in the last ${INDEX_WINDOW_DAYS} days. Outliers are dropped and each median states its sample size.`,
        url: `${SITE}${path}`,
        inLanguage: zh ? "zh-CN" : "en",
        isAccessibleForFree: true,
        dateModified: today,
        temporalCoverage: `${addDays(today, 1 - INDEX_WINDOW_DAYS)}/${today}`,
        spatialCoverage: index.map((entry) => ({ "@type": "Place", name: `${entry.port.id} (${entry.port.code})` })),
        variableMeasured: zh ? "40HQ 海运费中位数（美元/柜）" : "40HQ ocean freight median (USD per container)",
        creator: { "@id": organization["@id"] },
        publisher: organization,
      },
      breadcrumbs([
        { name: "RedSeaRate", path: home(lang) },
        { name: zh ? "航线运价" : "Rates", path },
      ]),
    ],
  };
}

const money = (n: number) => `US$${n.toLocaleString("en-US")}`;

// Answer-first questions for a country page, written from the live statistics.
export function countryFaqs(country: Country, stats: CountryStats, today: string, lang: Lang) {
  const zh = lang === "zh";
  const port = destinations.find((d) => d.id === country.destination)!;
  const portName = zh ? port.zh : port.id;
  const name = zh ? country.name.zh : country.name.en;
  const originName = (id: string) =>
    zh ? origins.find((o) => o.id === id)?.zh ?? extraOriginNames[id] ?? id : id;
  const hq = stats.containers["40HC"];
  const gp = stats.containers["20GP"];
  const quotes = (n: number) => (zh ? `${n} 条报价` : `${n} ${n === 1 ? "quote" : "quotes"}`);
  const faqs: { q: string; a: string }[] = [];
  faqs.push({
    q: zh ? `中国到${name}一个集装箱海运费多少钱？` : `How much does it cost to ship a container from China to ${name}?`,
    a: hq
      ? zh
        ? `截至 ${today}，中国到${portName}的 40HQ 海运市场中位数为每柜 ${money(hq.median)}，基于近 ${INDEX_WINDOW_DAYS} 天的 ${quotes(hq.count)}（区间 ${money(hq.low)}–${money(hq.high)}）。${gp ? `20GP 中位数为 ${money(gp.median)}（${quotes(gp.count)}）。` : ""}以上为港到港海运费，不含港杂、关税和内陆运输。`
        : `As of ${today}, the median 40HQ ocean freight market rate from China to ${portName} is ${money(hq.median)} per container, based on ${quotes(hq.count)} in the last ${INDEX_WINDOW_DAYS} days (range ${money(hq.low)}–${money(hq.high)}).${gp ? ` The 20GP median is ${money(gp.median)} (${quotes(gp.count)}).` : ""} These are port-to-port ocean freight figures, excluding local charges, duty and inland transport.`
      : zh
        ? `近 ${INDEX_WINDOW_DAYS} 天暂未收集到中国到${portName}的 40HQ 市场报价，请直接询价。`
        : `We have no 40HQ market quotes from China to ${portName} in the last ${INDEX_WINDOW_DAYS} days. Ask us for a quote.`,
  });
  const priced = stats.origins.filter((o) => o.containers["40HC"]);
  if (priced.length > 1) {
    const [cheapest] = priced;
    const s = cheapest.containers["40HC"]!;
    faqs.push({
      q: zh ? `从中国哪个港口出运到${portName}最便宜？` : `Which Chinese port is cheapest for shipping to ${portName}?`,
      a: zh
        ? `近 ${INDEX_WINDOW_DAYS} 天的报价中，${originName(cheapest.origin)}出运的 40HQ 中位数最低，为 ${money(s.median)}（${quotes(s.count)}），共比较了 ${priced.length} 个起运港。离工厂最近的港口加上拖车费，往往才是总成本最低的选择。`
        : `In the last ${INDEX_WINDOW_DAYS} days, ${originName(cheapest.origin)} had the lowest 40HQ median to ${portName}, at ${money(s.median)} (${quotes(s.count)}), out of ${priced.length} origin ports compared. Add trucking from your factory: the nearest port is often the cheapest in total.`,
    });
  }
  faqs.push({
    q: zh ? `中国到${name}海运要多久？` : `How long does shipping from China to ${name} take?`,
    a: country.transit
      ? zh ? `${country.transit.range.zh}。${country.transit.note.zh}` : `${country.transit.range.en}. ${country.transit.note.en}`
      : zh
        ? `中国到${portName}直航有限，很多货物需中转，时效取决于衔接情况，请在询价时确认航线。`
        : `Direct sailings from China to ${portName} are limited and much cargo is transhipped, so transit depends on the connection. Confirm the routing when you ask for a quote.`,
  });
  faqs.push({
    q: zh ? `出运到${name}需要哪些文件？` : `What documents do I need to ship to ${name}?`,
    a: country.documents.slice(0, 2).map((d) => (zh ? d.zh : d.en)).join(zh ? "" : " "),
  });
  return faqs;
}

export function countryDescription(country: Country, stats: CountryStats, lang: Lang) {
  const zh = lang === "zh";
  const port = destinations.find((d) => d.id === country.destination)!;
  const hq = stats.containers["40HC"];
  const transit = country.transit ? (zh ? country.transit.range.zh : country.transit.range.en) : null;
  if (zh)
    return `${hq ? `中国到${port.zh} 40HQ 市场中位数 ${money(hq.median)}（${hq.count} 条报价）。` : ""}各起运港运价、船公司${transit ? `、航程 ${transit}` : ""}和清关文件。`;
  return `${hq ? `China to ${port.id} 40HQ market median: ${money(hq.median)} from ${hq.count} recent quotes. ` : ""}Rates by origin port, carriers${transit ? `, ${transit} transit` : ""} and the import documents you need.`;
}

export function countryJsonLd(country: Country, stats: CountryStats, today: string, lang: Lang) {
  const zh = lang === "zh";
  const path = `${zh ? "/zh" : ""}/${country.slug}/`;
  const title = zh ? country.title.zh : country.title.en;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: title,
        description: countryDescription(country, stats, lang),
        inLanguage: zh ? "zh-CN" : "en",
        dateModified: today,
        image: `${SITE}/og.jpg`,
        mainEntityOfPage: `${SITE}${path}`,
        author: { "@id": organization["@id"] },
        publisher: organization,
        citation: country.sources.map((s) => s.url),
      },
      {
        "@type": "FAQPage",
        url: `${SITE}${path}`,
        inLanguage: zh ? "zh-CN" : "en",
        mainEntity: countryFaqs(country, stats, today, lang).map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      },
      breadcrumbs([
        { name: "RedSeaRate", path: home(lang) },
        { name: zh ? "航线运价" : "Rates", path: zh ? "/zh/rates/" : "/rates/" },
        { name: title, path },
      ]),
    ],
  };
}
