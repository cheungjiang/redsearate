import type { Metadata } from "next";
import { faqs, type Guide } from "./content.ts";
import { destinations, extraOriginNames, origins } from "./rates.ts";
import type { Country, CountryStats } from "./countries.ts";
import { JEBEL_ALI_SLUG, JEBEL_ALI_TITLE, jebelAliDescription, jebelAliFaqs } from "./jebel-ali.ts";
import { briefDescription, briefHeading, briefIndexDescription, briefIndexTitle, briefPath, type MarketBrief } from "./market-brief.ts";
import { INDEX_WINDOW_DAYS, type IndexEntry } from "./platform.ts";

export const SITE = "https://redsearate.com";
export const GUIDES_PUBLISHED = "2026-10-24";
export const GUIDES_UPDATED = "2026-11-08";
// First publication of the country and Jebel Ali landing pages (git history).
export const PAGES_PUBLISHED = "2026-11-08";
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

const RED_SEA_AREA = ["Saudi Arabia", "Egypt", "Jordan", "Djibouti", "Sudan"];

// A square mark Google can crop cleanly. The wide lockup is for the page
// header and footer, not for structured data.
const organizationLogo = {
  "@type": "ImageObject",
  url: `${SITE}/apple-touch-icon.png`,
  width: 498,
  height: 498,
};

const organization = {
  "@type": "Organization",
  "@id": `${SITE}/#organization`,
  name: "RedSeaRate",
  url: `${SITE}/`,
  logo: organizationLogo,
  description: "Ocean freight rates, estimates and booking inquiries from China to Red Sea ports and Jebel Ali.",
  areaServed: [...RED_SEA_AREA, "United Arab Emirates"],
};

export function homeJsonLd(lang: Lang, whatsapp: string[] = []) {
  const zh = lang === "zh";
  const contactPoints = whatsapp.map((telephone) => ({
    "@type": "ContactPoint",
    contactType: "sales",
    telephone,
    url: `${SITE}${home(lang)}#estimate`,
    availableLanguage: ["English", "Chinese"],
    areaServed: organization.areaServed,
  }));
  return {
    "@context": "https://schema.org",
    "@graph": [
      contactPoints.length ? { ...organization, contactPoint: contactPoints } : organization,
      {
        "@type": "WebSite",
        "@id": `${SITE}/#website`,
        url: `${SITE}/`,
        name: "RedSeaRate",
        alternateName: "红海运价",
        description: "China to Red Sea ocean freight rates, estimates and booking inquiries.",
        inLanguage: ["en", "zh-CN"],
        publisher: { "@id": organization["@id"] },
      },
      {
        "@type": "Service",
        "@id": `${SITE}/#service`,
        name: zh ? "中国至红海海运" : "China to Red Sea ocean freight",
        serviceType: zh ? "海运整箱（FCL）与拼箱（LCL）" : "Ocean freight (FCL and LCL)",
        description: zh
          ? "从上海、宁波、深圳、青岛和南沙起运至吉达、苏赫纳、亚喀巴、吉布提和苏丹港的港到港海运，提供市场运价参考与订舱询价。"
          : "Port-to-port ocean freight from Shanghai, Ningbo, Shenzhen, Qingdao and Nansha to Jeddah, Sokhna, Aqaba, Djibouti and Port Sudan, with market rate references and booking inquiries.",
        url: `${SITE}${home(lang)}`,
        provider: { "@id": organization["@id"] },
        areaServed: RED_SEA_AREA,
        availableChannel: {
          "@type": "ServiceChannel",
          serviceUrl: `${SITE}${home(lang)}#estimate`,
        },
      },
      {
        "@type": "FAQPage",
        url: `${SITE}${home(lang)}`,
        inLanguage: zh ? "zh-CN" : "en",
        isPartOf: { "@id": `${SITE}/#website` },
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

export function faqPageJsonLd(items: { q: string; a: string }[], lang: Lang, path: string) {
  const zh = lang === "zh";
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "FAQPage",
        url: `${SITE}${path}`,
        inLanguage: zh ? "zh-CN" : "en",
        mainEntity: items.map((item) => ({
          "@type": "Question",
          name: item.q,
          acceptedAnswer: { "@type": "Answer", text: item.a },
        })),
      },
      breadcrumbs([
        { name: "RedSeaRate", path: home(lang) },
        { name: zh ? "常见问题" : "FAQ", path },
      ]),
    ],
  };
}

export function guideJsonLd(guide: Guide, lang: Lang) {
  const zh = lang === "zh";
  const path = `${zh ? "/zh" : ""}/guides/${guide.slug}/`;
  const title = zh ? guide.title.zh : guide.title.en;
  const graph: object[] = [
    {
      "@type": "Article",
      headline: title,
      description: guideDescription(guide, lang),
      inLanguage: zh ? "zh-CN" : "en",
      datePublished: guide.published ?? GUIDES_PUBLISHED,
      dateModified: guide.updated ?? GUIDES_UPDATED,
      image: `${SITE}/og.jpg`,
      mainEntityOfPage: `${SITE}${path}`,
      author: { "@id": organization["@id"] },
      publisher: organization,
    },
  ];
  if (guide.faqs?.length) {
    graph.push({
      "@type": "FAQPage",
      url: `${SITE}${path}`,
      inLanguage: zh ? "zh-CN" : "en",
      mainEntity: guide.faqs.map((faq) => ({
        "@type": "Question",
        name: zh ? faq.q.zh : faq.q.en,
        acceptedAnswer: { "@type": "Answer", text: zh ? faq.a.zh : faq.a.en },
      })),
    });
  }
  graph.push(breadcrumbs([
    { name: "RedSeaRate", path: home(lang) },
    { name: zh ? "指南" : "Guides", path: `${home(lang)}#guides` },
    { name: title, path },
  ]));
  return { "@context": "https://schema.org", "@graph": graph };
}

export function guideDescription(guide: Guide, lang: Lang) {
  const lead = lang === "zh" ? guide.lead.zh : guide.lead.en;
  const limit = lang === "zh" ? 80 : 155;
  return lead.length > limit ? `${lead.slice(0, limit - 1).trimEnd()}…` : lead;
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

const joinNames = (names: string[], lang: Lang) => {
  if (names.length <= 1) return names[0] ?? "";
  if (lang === "zh") return names.length === 2 ? `${names[0]}和${names[1]}` : `${names.slice(0, -1).join("、")}和${names.at(-1)}`;
  return names.length === 2 ? `${names[0]} and ${names[1]}` : `${names.slice(0, -1).join(", ")}, and ${names.at(-1)}`;
};

// One paragraph for the homepage index: the lowest median, then every port's quote count.
// Every figure comes from the index. Ports without a median are counted as zero quotes.
export function marketBrief(index: IndexEntry[], today: string, lang: Lang) {
  const zh = lang === "zh";
  const name = (entry: IndexEntry) => portName(entry, lang);
  const quotes = (n: number) => zh ? `${n} 条` : `${n} ${n === 1 ? "quote" : "quotes"}`;
  const counts = zh
    ? `各港报价数：${index.map((entry) => `${name(entry)} ${entry.sampleSize ?? 0} 条`).join("，")}。`
    : `Quote counts: ${index.map((entry) => `${name(entry)} ${entry.sampleSize ?? 0}`).join(", ")}.`;
  const priced = index.filter((entry) => entry.median !== null);
  if (priced.length === 0) {
    return zh
      ? `截至 ${today}，${index.length} 个港口近 ${INDEX_WINDOW_DAYS} 天都没有 40HQ 市场报价。`
      : `As of ${today}, none of the ${index.length} ports has a 40HQ market quote in the last ${INDEX_WINDOW_DAYS} days.`;
  }
  const low = Math.min(...priced.map((entry) => entry.median!));
  const cheapest = priced.filter((entry) => entry.median === low);
  const price = `US$${low.toLocaleString("en-US")}`;
  if (priced.length === 1) {
    const only = priced[0];
    const lead = zh
      ? `截至 ${today}，${index.length} 个港口里只有${name(only)}有 40HQ 中位数，为每柜 ${price}（${quotes(only.sampleSize ?? 0)}）。`
      : `As of ${today}, ${name(only)} is the only one of the ${index.length} ports with a 40HQ median, at ${price} per container (${quotes(only.sampleSize ?? 0)}).`;
    return `${lead}${zh ? "" : " "}${counts}`;
  }
  const scope = priced.length === index.length
    ? (zh ? `${index.length} 个港口里` : `of the ${index.length} ports`)
    : (zh ? "有读数的港口里" : "among the ports with a reading");
  const lead = cheapest.length === 1
    ? zh
      ? `截至 ${today}，${scope} 40HQ 中位数最低的是${name(cheapest[0])}，每柜 ${price}（${quotes(cheapest[0].sampleSize ?? 0)}）。`
      : `As of ${today}, ${name(cheapest[0])} has the lowest 40HQ median ${scope}, at ${price} per container (${quotes(cheapest[0].sampleSize ?? 0)}).`
    : zh
      ? `截至 ${today}，${scope}，${joinNames(cheapest.map(name), lang)}的 40HQ 中位数并列最低，均为每柜 ${price}。`
      : `As of ${today}, ${joinNames(cheapest.map(name), lang)} share the lowest 40HQ median ${scope}, at ${price} per container.`;
  return `${lead}${zh ? "" : " "}${counts}`;
}

export function ratesJsonLd(lang: Lang) {
  const zh = lang === "zh";
  const path = zh ? "/zh/rates/" : "/rates/";
  return {
    "@context": "https://schema.org",
    "@graph": [
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
  // Same rule for the answer box and this FAQ: only origins with at least 3
  // recent 40HQ quotes can be named. Fewer than that is not a conclusion.
  const MIN_ORIGIN_QUOTES = 3;
  const candidates = stats.origins.filter((o) => (o.containers["40HC"]?.count ?? 0) >= MIN_ORIGIN_QUOTES);
  const cheapest = candidates[0];
  const s = cheapest?.containers["40HC"];
  faqs.push({
    q: zh ? `从中国哪个港口出运到${portName}最便宜？` : `Which Chinese port is cheapest for shipping to ${portName}?`,
    a: !cheapest || !s
      ? zh
        ? "该港口按起运港拆开的样本仍然偏少，请对照下方表格和样本量一起看。"
        : "Origin-level samples are still thin for this port — compare the table below together with the sample counts."
      : zh
        ? `近 ${INDEX_WINDOW_DAYS} 天的报价中，在至少有 ${MIN_ORIGIN_QUOTES} 条报价的起运港里，${originName(cheapest.origin)}出运的 40HQ 中位数最低，为 ${money(s.median)}（${quotes(s.count)}），共比较了 ${candidates.length} 个起运港。离工厂最近的港口加上拖车费，往往才是总成本最低的选择。`
        : `In the last ${INDEX_WINDOW_DAYS} days, ${originName(cheapest.origin)} had the lowest 40HQ median to ${portName}, at ${money(s.median)} (${quotes(s.count)}), out of ${candidates.length} origin ${candidates.length === 1 ? "port" : "ports"} compared, among origin ports with at least ${MIN_ORIGIN_QUOTES} quotes. Add trucking from your factory: the nearest port is often the cheapest in total.`,
  });
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
  if (zh) {
    const price = hq ? `中国到${port.zh} 40HQ 中位数 ${money(hq.median)}（${hq.count} 条报价）。` : "";
    return `${price}对比上海、宁波、深圳、青岛、南沙到${port.zh}的 20GP/40HQ 海运费（红海航线）${transit ? `、${transit}航程` : ""}与清关文件。`;
  }
  const price = hq ? `China to ${port.id} 40HQ median ${money(hq.median)} (${hq.count} quotes). ` : "";
  return `${price}Compare 20GP and 40HQ Red Sea rates ${hq ? "by origin port" : "from Shanghai, Ningbo, Shenzhen, Qingdao and Nansha"}${transit ? `, ${transit} transit` : ""} and the import documents you need.`;
}

// A shorter title tag than the on-page H1: keeps the port keyword and the
// brand inside the roughly 60-character snippet Google shows.
export function countrySeoTitle(country: Country, lang: Lang) {
  const zh = lang === "zh";
  const port = destinations.find((d) => d.id === country.destination)!;
  if (country.slug === "shipping-from-china-to-djibouti") {
    return zh
      ? "中国到吉布提及埃塞俄比亚海运：40HQ 运价 | RedSeaRate"
      : "China to Djibouti & Ethiopia Freight Rates | RedSeaRate";
  }
  return zh
    ? `中国到${country.name.zh}海运：${port.zh} 40HQ 运价 | RedSeaRate`
    : `China to ${country.name.en}: ${port.id} Freight Rates | RedSeaRate`;
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
        datePublished: PAGES_PUBLISHED,
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

export function jebelAliJsonLd(stats: CountryStats, today: string, lang: Lang) {
  const zh = lang === "zh";
  const path = `${zh ? "/zh" : ""}/${JEBEL_ALI_SLUG}/`;
  const title = JEBEL_ALI_TITLE[lang];
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: title,
        description: jebelAliDescription(today, lang),
        inLanguage: zh ? "zh-CN" : "en",
        datePublished: PAGES_PUBLISHED,
        dateModified: today,
        image: `${SITE}/og.jpg`,
        mainEntityOfPage: `${SITE}${path}`,
        author: { "@id": organization["@id"] },
        publisher: organization,
      },
      {
        "@type": "FAQPage",
        url: `${SITE}${path}`,
        inLanguage: zh ? "zh-CN" : "en",
        mainEntity: jebelAliFaqs(today, lang, stats).map((faq) => ({
          "@type": "Question",
          name: faq.q,
          acceptedAnswer: { "@type": "Answer", text: faq.a },
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

export function marketBriefJsonLd(brief: MarketBrief, lang: Lang) {
  const zh = lang === "zh";
  const path = briefPath(brief.date, lang);
  const headline = briefHeading(brief.date, lang);
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline,
        description: briefDescription(brief, lang),
        inLanguage: zh ? "zh-CN" : "en",
        datePublished: brief.date,
        dateModified: brief.date,
        image: `${SITE}/og.jpg`,
        mainEntityOfPage: `${SITE}${path}`,
        author: { "@id": organization["@id"] },
        publisher: organization,
      },
      breadcrumbs([
        { name: zh ? "首页" : "Home", path: home(lang) },
        { name: zh ? "市场简报" : "Market brief", path: briefPath(null, lang) },
        { name: headline, path },
      ]),
    ],
  };
}

export function marketBriefIndexJsonLd(briefs: MarketBrief[], lang: Lang) {
  const zh = lang === "zh";
  const path = briefPath(null, lang);
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": `${SITE}${path}#page`,
        url: `${SITE}${path}`,
        name: briefIndexTitle(lang),
        description: briefIndexDescription(lang),
        inLanguage: zh ? "zh-CN" : "en",
        publisher: organization,
        mainEntity: {
          "@type": "ItemList",
          numberOfItems: briefs.length,
          itemListElement: briefs.map((brief, index) => ({
            "@type": "ListItem",
            position: index + 1,
            url: `${SITE}${briefPath(brief.date, lang)}`,
            name: briefHeading(brief.date, lang),
          })),
        },
      },
      breadcrumbs([
        { name: zh ? "首页" : "Home", path: home(lang) },
        { name: zh ? "市场简报" : "Market brief", path },
      ]),
    ],
  };
}
