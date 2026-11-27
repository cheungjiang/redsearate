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
  median: number | null;
  low: number | null;
  high: number | null;
  twenty: LaneQuoteStat | null;
  carriers: string[];
  freeDays: [number, number] | null;
  direct: number;
  transhipped: number;
  transit: { min: number; max: number } | null;
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

const laneDocumentGuides: Record<string, string> = {
  Jeddah: "shipping-to-jeddah-saber",
  Sokhna: "shipping-to-sokhna-acid",
  Aqaba: "jordan-import-clearance-aqaba",
  Djibouti: "djibouti-import-clearance-ethiopia-transit",
  "Port Sudan": "sudan-import-clearance-port-sudan",
};

export function laneDocumentGuidePath(destination: string, lang: "en" | "zh") {
  const slug = laneDocumentGuides[destination];
  return slug ? `${lang === "zh" ? "/zh" : ""}/guides/${slug}/` : null;
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
        direct: row.direct,
        transhipped: row.transhipped,
        transit: row.transit,
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

// Four origins × five destinations stay online as route landing pages even
// when the quote window is empty. A route with quotes reuses the measured
// lane; a route without quotes still answers transit, routing and documents.
export const ROUTE_ORIGINS = ["Shanghai", "Ningbo", "Shenzhen", "Qingdao"] as const;
export const ROUTE_DESTINATIONS = ["Jeddah", "Sokhna", "Aqaba", "Djibouti", "Port Sudan"] as const;

export function curatedLanes(active: LanePageData[], measured: LanePageData[] = []): LanePageData[] {
  const bySlug = new Map(active.map((lane) => [lane.slug, lane]));
  const measuredBySlug = new Map(measured.map((lane) => [lane.slug, lane]));
  const lanes: LanePageData[] = [];
  for (const origin of ROUTE_ORIGINS) {
    const name = originName(origin);
    if (!name) throw new Error(`No lane slug for curated origin ${origin}.`);
    for (const destination of ROUTE_DESTINATIONS) {
      const slug = laneSlug(name.slug, destination);
      const published = bySlug.get(slug);
      if (published) {
        lanes.push(published);
        continue;
      }
      const thin = measuredBySlug.get(slug);
      if (thin) {
        // 1–4 quotes are too few for a median, but the sample still belongs
        // on the route page as a count, not as a price.
        lanes.push({ ...thin, median: null });
        continue;
      }
      const country = countryFor(destination);
      const port = destinations.find((item) => item.id === destination)!;
      lanes.push({
        slug,
        origin,
        destination,
        count: 0,
        median: null,
        low: null,
        high: null,
        twenty: null,
        carriers: [],
        freeDays: null,
        direct: 0,
        transhipped: 0,
        transit: null,
        originEn: name.en,
        originZh: name.zh,
        destEn: port.id,
        destZh: port.zh,
        countrySlug: country.slug,
      });
    }
  }
  return lanes;
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
  return { active, retired, measured: [...measured.values()] };
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
    ? `${lane.originZh}到${lane.destZh}海运费 | RedSeaRate`
    : `${lane.originEn} to ${lane.destEn} Shipping Rates | RedSeaRate`;
}

export function laneHeading(lane: LanePageData, lang: "en" | "zh") {
  return lang === "zh"
    ? `${lane.originZh}到${lane.destZh}海运费`
    : `${lane.originEn} to ${lane.destEn} Shipping Rates`;
}

export function laneDescription(lane: LanePageData, lang: "en" | "zh") {
  const zh = lang === "zh";
  if (lane.median === null) {
    const sample = lane.count > 0
      ? zh ? `近 28 天 ${lane.count} 条 40HQ 报价，` : `${lane.count} recent 40HQ quotes, `
      : "";
    return zh
      ? `${lane.originZh}到${lane.destZh}海运费与航线指南：${sample}航程、直航或中转说明，直接获取港到港报价。`
      : `${lane.originEn} to ${lane.destEn} shipping rates and route guide: ${sample}transit time, direct or transhipment routing and a port-to-port quote.`;
  }
  const price = money(lane.median);
  return zh
    ? `${lane.originZh}到${lane.destZh} 40HQ 海运中位数 ${price}（${lane.count} 条报价），港到港海运费、航程与订舱询价。`
    : `${lane.originEn} to ${lane.destEn} 40HQ median ${price} from ${lane.count} quotes. Port-to-port ocean freight, transit and booking inquiries.`;
}

export function laneTransit(lane: LanePageData, lang: "en" | "zh") {
  const zh = lang === "zh";
  if (lane.transit) {
    return zh
      ? `这些报价的航程为 ${lane.transit.min}–${lane.transit.max} 天。`
      : `The quotes on this route list ${lane.transit.min}–${lane.transit.max} days transit.`;
  }
  const country = countryFor(lane.destination);
  if (country.transit) {
    return zh
      ? `大致航程 ${country.transit.range.zh}。`
      : `Typical transit is ${country.transit.range.en}.`;
  }
  return zh ? "航程以询价确认为准。" : "Confirm the transit time with your quote.";
}

export function laneRouting(lane: LanePageData, lang: "en" | "zh") {
  const zh = lang === "zh";
  if (lane.direct > 0 && lane.transhipped === 0) {
    return zh ? "这条航线有直航船期，具体以询价确认为准。" : "Direct sailings appear on this route; confirm the routing with your quote.";
  }
  if (lane.direct === 0 && lane.transhipped > 0) {
    return zh ? "这条航线有中转船期，订舱时请确认中转港。" : "Some quotes on this route tranship; confirm the connection port when you book.";
  }
  if (lane.direct > 0 && lane.transhipped > 0) {
    return zh ? "这些报价中既有直航，也有中转。" : "The quotes include both direct and transhipment sailings.";
  }
  return zh ? "直航或中转以具体船期为准，询价时请确认。" : "Direct or transhipment depends on the sailing; confirm it with your quote.";
}

export function laneFaqs(lane: LanePageData, today: string, lang: "en" | "zh") {
  const country = countryFor(lane.destination);
  const zh = lang === "zh";
  const quotes = zh ? `${lane.count} 条报价` : `${lane.count} ${lane.count === 1 ? "quote" : "quotes"}`;
  const range = lane.low != null && lane.high != null ? `${money(lane.low)}–${money(lane.high)}` : "—";
  const transit = `${laneTransit(lane, lang)}${zh ? "" : " "}${laneRouting(lane, lang)}`;
  const documents = country.documents.slice(0, 2).map((item) => (zh ? item.zh : item.en)).join(zh ? "" : " ");
  return [
    {
      q: zh
        ? `${lane.originZh}到${lane.destZh}一个 40HQ 海运费多少钱？`
        : `How much is 40HQ ocean freight from ${lane.originEn} to ${lane.destEn}?`,
      a: lane.median === null
        ? lane.count > 0
          ? zh
            ? `近 ${INDEX_WINDOW_DAYS} 天只收集到${lane.originZh}到${lane.destZh}的 ${quotes}，样本不足，暂不给出中位数，请直接询价。`
            : `We collected only ${quotes} for ${lane.originEn} to ${lane.destEn} in the last ${INDEX_WINDOW_DAYS} days, too few for a median. Ask us for a quote.`
          : zh
            ? `近 ${INDEX_WINDOW_DAYS} 天暂未收集到${lane.originZh}到${lane.destZh}的 40HQ 市场报价，请直接询价。`
            : `We have no 40HQ market quotes from ${lane.originEn} to ${lane.destEn} in the last ${INDEX_WINDOW_DAYS} days. Ask us for a quote.`
        : zh
          ? `截至 ${today}，${lane.originZh}到${lane.destZh}的 40HQ 中位数为每柜 ${money(lane.median)}，基于近 ${INDEX_WINDOW_DAYS} 天的 ${quotes}（区间 ${range}）。以上为港到港海运费，不含港杂、关税和内陆运输。`
          : `As of ${today}, the 40HQ median from ${lane.originEn} to ${lane.destEn} is ${money(lane.median)} per container, based on ${quotes} in the last ${INDEX_WINDOW_DAYS} days (range ${range}). These are port-to-port ocean freight figures, excluding local charges, duty and inland transport.`,
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
        "@type": "Service",
        "@id": `${SITE}${path}#service`,
        name: laneHeading(lane, lang),
        serviceType: zh ? "海运整箱（FCL）" : "Ocean freight (FCL)",
        description: laneDescription(lane, lang),
        url: `${SITE}${path}`,
        provider: { "@type": "Organization", name: "RedSeaRate", url: `${SITE}/` },
        areaServed: zh ? country.name.zh : country.name.en,
      },
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
