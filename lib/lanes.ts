import { countries, countryStats, type Country } from "./countries.ts";
import { INDEX_WINDOW_DAYS } from "./platform.ts";
import { destinations, type PriceEntry } from "./rates.ts";
import { SITE } from "./seo.ts";

// A lane page exists only when this origin → destination has enough 40HQ quotes.
// 5 or more publishes a page. 3 or 4 keeps a page that is already up, and does
// not start a new one. Fewer than 3 takes a published page down.
export const LANE_PUBLISH_MIN = 5;
export const LANE_KEEP_MIN = 3;

export type LaneKey = { slug: string; origin: string; destination: string };
export type LaneRegistry = { active: LaneKey[]; retired: LaneKey[] };

export type LaneQuoteStat = { median: number; count: number; low: number; high: number };

export type LanePageData = LaneKey & {
  count: number;
  median: number;
  low: number;
  high: number;
  twenty: LaneQuoteStat | null;
  carriers: string[];
  freeDays: [number, number] | null;
  originEn: string;
  originZh: string;
  destEn: string;
  destZh: string;
  countrySlug: string;
};

type OriginName = { id: string; slug: string; en: string; zh: string };

// Short names used in the lane URL and the H1. The id matches the quote origin.
const laneOrigins: OriginName[] = [
  { id: "Shanghai", slug: "shanghai", en: "Shanghai", zh: "上海" },
  { id: "Ningbo", slug: "ningbo", en: "Ningbo", zh: "宁波" },
  { id: "Shenzhen", slug: "shenzhen", en: "Shenzhen", zh: "深圳" },
  { id: "Qingdao", slug: "qingdao", en: "Qingdao", zh: "青岛" },
  { id: "Guangzhou (Nansha)", slug: "nansha", en: "Nansha", zh: "广州南沙" },
  { id: "Guangzhou (Huangpu)", slug: "huangpu", en: "Huangpu", zh: "广州黄埔" },
  { id: "Dalian", slug: "dalian", en: "Dalian", zh: "大连" },
  { id: "Lianyungang", slug: "lianyungang", en: "Lianyungang", zh: "连云港" },
  { id: "Tianjin", slug: "tianjin", en: "Tianjin", zh: "天津" },
  { id: "Xiamen", slug: "xiamen", en: "Xiamen", zh: "厦门" },
  { id: "Foshan", slug: "foshan", en: "Foshan", zh: "佛山" },
];

const countrySlugs = new Set(countries.map((country) => country.slug));

export const emptyLaneRegistry = (): LaneRegistry => ({ active: [], retired: [] });

export function laneSlug(originSlug: string, destinationId: string) {
  return `shipping-from-${originSlug}-to-${destinationId.toLowerCase().replace(/ /g, "-")}`;
}

export function lanePath(slug: string, lang: "en" | "zh") {
  return `${lang === "zh" ? "/zh" : ""}/${slug}/`;
}

function originName(id: string) {
  return laneOrigins.find((origin) => origin.id === id);
}

function countryFor(destination: string): Country {
  const country = countries.find((item) => item.destination === destination);
  if (!country) throw new Error(`No country page for destination ${destination}.`);
  return country;
}

function measuredLanes(entries: PriceEntry[], today: string): Map<string, LanePageData> {
  const measured = new Map<string, LanePageData>();
  for (const country of countries) {
    const stats = countryStats(entries, today, country.destination);
    const port = destinations.find((item) => item.id === country.destination)!;
    for (const row of stats.origins) {
      const hq = row.containers["40HC"];
      if (!hq) continue;
      const name = originName(row.origin);
      if (!name) {
        if (hq.count >= LANE_KEEP_MIN) {
          throw new Error(`No lane slug for origin ${row.origin} (${hq.count} quotes to ${country.destination}).`);
        }
        continue;
      }
      const slug = laneSlug(name.slug, country.destination);
      if (countrySlugs.has(slug)) throw new Error(`Lane slug collides with a country page: ${slug}.`);
      const twenty = row.containers["20GP"] ?? null;
      measured.set(slug, {
        slug,
        origin: row.origin,
        destination: country.destination,
        count: hq.count,
        median: hq.median,
        low: hq.low,
        high: hq.high,
        twenty,
        carriers: row.carriers,
        freeDays: row.freeDays,
        originEn: name.en,
        originZh: name.zh,
        destEn: port.id,
        destZh: port.zh,
        countrySlug: country.slug,
      });
    }
  }
  return measured;
}

function sameKey(list: LaneKey[], slug: string) {
  return list.some((item) => item.slug === slug);
}

// previous is the registry published by the last deploy. This build replaces
// the whole site, so a page that should stay up has to be generated again.
export function planLanes(entries: PriceEntry[], today: string, previous: LaneRegistry) {
  const measured = measuredLanes(entries, today);
  const active: LanePageData[] = [];
  const retired: LaneKey[] = [];
  const seen = new Set<string>();

  for (const lane of measured.values()) {
    seen.add(lane.slug);
    const wasActive = sameKey(previous.active, lane.slug);
    const wasRetired = sameKey(previous.retired, lane.slug);
    if (lane.count >= LANE_PUBLISH_MIN || (wasActive && lane.count >= LANE_KEEP_MIN)) {
      active.push(lane);
    } else if (wasActive || wasRetired) {
      retired.push({ slug: lane.slug, origin: lane.origin, destination: lane.destination });
    }
  }

  for (const prior of [...previous.active, ...previous.retired]) {
    if (seen.has(prior.slug)) continue;
    seen.add(prior.slug);
    countryFor(prior.destination);
    retired.push(prior);
  }

  active.sort((a, b) => a.slug.localeCompare(b.slug));
  retired.sort((a, b) => a.slug.localeCompare(b.slug));
  return { active, retired };
}

export function laneRegistry(active: LanePageData[], retired: LaneKey[]): LaneRegistry {
  const id = (lane: LaneKey): LaneKey => ({ slug: lane.slug, origin: lane.origin, destination: lane.destination });
  return { active: active.map(id), retired: retired.map(id) };
}

export function parseLaneRegistry(value: unknown): LaneRegistry {
  if (!value || typeof value !== "object") throw new Error("Lane registry is not an object.");
  const record = value as { active?: unknown; retired?: unknown };
  const read = (list: unknown, label: string): LaneKey[] => {
    if (!Array.isArray(list)) throw new Error(`Lane registry ${label} is not a list.`);
    return list.map((item) => {
      const row = item as Partial<LaneKey>;
      if (!row.slug || !row.origin || !row.destination) {
        throw new Error(`Lane registry ${label} is missing slug, origin, or destination.`);
      }
      return { slug: row.slug, origin: row.origin, destination: row.destination };
    });
  };
  return { active: read(record.active, "active"), retired: read(record.retired, "retired") };
}

const money = (n: number) => `US$${n.toLocaleString("en-US")}`;

export function laneTitle(lane: LanePageData, lang: "en" | "zh") {
  return lang === "zh"
    ? `${lane.originZh}到${lane.destZh} 40HQ 运价 | RedSeaRate`
    : `${lane.originEn} to ${lane.destEn} Freight Rates: 40HQ | RedSeaRate`;
}

export function laneHeading(lane: LanePageData, lang: "en" | "zh") {
  return lang === "zh"
    ? `${lane.originZh}到${lane.destZh} 40HQ 运价`
    : `${lane.originEn} to ${lane.destEn} 40HQ Freight Rates`;
}

export function laneDescription(lane: LanePageData, lang: "en" | "zh") {
  const price = money(lane.median);
  return lang === "zh"
    ? `${lane.originZh}到${lane.destZh} 40HQ 中位数 ${price}（${lane.count} 条）。港到港海运费。`
    : `${lane.originEn} to ${lane.destEn} 40HQ median ${price} from ${lane.count} quotes. Port-to-port ocean freight.`;
}

export function laneFaqs(lane: LanePageData, today: string, lang: "en" | "zh") {
  const country = countryFor(lane.destination);
  const zh = lang === "zh";
  const price = money(lane.median);
  const quotes = zh ? `${lane.count} 条报价` : `${lane.count} ${lane.count === 1 ? "quote" : "quotes"}`;
  const transit = country.transit
    ? zh
      ? `${country.transit.range.zh}。${country.transit.note.zh}`
      : `${country.transit.range.en}. ${country.transit.note.en}`
    : zh
      ? `中国到${lane.destZh}直航有限，很多货物需中转，时效取决于衔接情况，请在询价时确认航线。`
      : `Direct sailings from China to ${lane.destEn} are limited and much cargo is transhipped, so transit depends on the connection. Confirm the routing when you ask for a quote.`;
  const documents = country.documents.slice(0, 2).map((item) => (zh ? item.zh : item.en)).join(zh ? "" : " ");
  return [
    {
      q: zh
        ? `${lane.originZh}到${lane.destZh}一个 40HQ 海运费多少钱？`
        : `How much is 40HQ ocean freight from ${lane.originEn} to ${lane.destEn}?`,
      a: zh
        ? `截至 ${today}，${lane.originZh}到${lane.destZh}的 40HQ 中位数为每柜 ${price}，基于近 ${INDEX_WINDOW_DAYS} 天的 ${quotes}（区间 ${money(lane.low)}–${money(lane.high)}）。以上为港到港海运费，不含港杂、关税和内陆运输。`
        : `As of ${today}, the 40HQ median from ${lane.originEn} to ${lane.destEn} is ${price} per container, based on ${quotes} in the last ${INDEX_WINDOW_DAYS} days (range ${money(lane.low)}–${money(lane.high)}). These are port-to-port ocean freight figures, excluding local charges, duty and inland transport.`,
    },
    {
      q: zh
        ? `${lane.originZh}到${lane.destZh}海运要多久？`
        : `How long does shipping from ${lane.originEn} to ${lane.destEn} take?`,
      a: transit,
    },
    {
      q: zh
        ? `出运到${lane.destZh}需要哪些文件？`
        : `What documents do I need to ship to ${lane.destEn}?`,
      a: documents,
    },
  ];
}

export function laneJsonLd(lane: LanePageData, today: string, lang: "en" | "zh") {
  const zh = lang === "zh";
  const path = lanePath(lane.slug, lang);
  const country = countryFor(lane.destination);
  const countryPath = lanePath(lane.countrySlug, lang);
  const ratesPath = zh ? "/zh/rates/" : "/rates/";
  const homePath = zh ? "/zh/" : "/";
  const crumbs = [
    { name: "RedSeaRate", path: homePath },
    { name: zh ? "航线运价" : "Rates", path: ratesPath },
    { name: zh ? country.name.zh : country.name.en, path: countryPath },
    { name: laneHeading(lane, lang), path },
  ];
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "FAQPage",
        url: `${SITE}${path}`,
        inLanguage: zh ? "zh-CN" : "en",
        dateModified: today,
        mainEntity: laneFaqs(lane, today, lang).map((faq) => ({
          "@type": "Question",
          name: faq.q,
          acceptedAnswer: { "@type": "Answer", text: faq.a },
        })),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: crumbs.map((item, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: item.name,
          item: `${SITE}${item.path}`,
        })),
      },
    ],
  };
}
