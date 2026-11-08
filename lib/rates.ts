export const origins = [
  { id: "Shanghai", zh: "上海", code: "CNSHA" },
  { id: "Ningbo", zh: "宁波", code: "CNNGB" },
  { id: "Shenzhen", zh: "深圳", code: "CNSZX" },
  { id: "Qingdao", zh: "青岛", code: "CNTAO" },
];
// Chinese names for origins that only appear in collected quotes.
export const extraOriginNames: Record<string, string> = {
  "Guangzhou (Nansha)": "广州南沙",
  "Guangzhou (Huangpu)": "广州黄埔",
  Dalian: "大连",
  Lianyungang: "连云港",
  Tianjin: "天津",
  Xiamen: "厦门",
  Foshan: "佛山",
};
export const destinations = [
  {
    id: "Jeddah",
    zh: "吉达",
    country: "Saudi Arabia",
    countryZh: "沙特阿拉伯",
    code: "SAJED",
  },
  {
    id: "Sokhna",
    zh: "苏赫纳",
    country: "Egypt",
    countryZh: "埃及",
    code: "EGSOK",
  },
  {
    id: "Aqaba",
    zh: "亚喀巴",
    country: "Jordan",
    countryZh: "约旦",
    code: "JOAQJ",
  },
  {
    id: "Djibouti",
    zh: "吉布提",
    country: "Djibouti",
    countryZh: "吉布提",
    code: "DJJIB",
  },
  {
    id: "Port Sudan",
    zh: "苏丹港",
    country: "Sudan",
    countryZh: "苏丹",
    code: "SDPZU",
  },
];
// Prices are USD per container; LCL is USD per chargeable tonne (W/M).
export const containers = ["20GP", "40GP", "40HC", "LCL"] as const;

export const countrySlug = (destination: string) =>
  `shipping-from-china-to-${destinations.find((d) => d.id === destination)!.country.toLowerCase().replace(/ /g, "-")}`;
export type Container = (typeof containers)[number];
export const tiers = ["offer", "market", "internal"] as const;
export type Tier = (typeof tiers)[number];

export type PriceEntry = {
  id: number;
  tier: Tier;
  origin: string;
  destination: string;
  container: Container;
  price: number;
  validUntil: string;
  carrier?: string;
  freeDays?: number | null;
  routing?: string;
  addedAt?: string;
  transitMin: number | null;
  transitMax: number | null;
  source: string;
  note: string;
  submittedBy: string;
  createdAt: string;
};
export type Offer = {
  low: number;
  high: number;
  validUntil: string;
  transitMin: number | null;
  transitMax: number | null;
};
export type Market = { median: number; count: number };
// Carriers named on the quotes behind a lane's price, for the rates table.
export type LaneDetails = { carriers: string[] };
export type Lane = { offer?: Offer; market?: Market; details?: LaneDetails };
export type TrendPoint = { week: string; median: number; count: number };
export type Snapshot = {
  today: string;
  lanes: Record<string, Lane>;
  trends: Record<string, TrendPoint[]>;
};

export const MARKET_WINDOW_DAYS = 28;
// Every collected price counts; the sample size is shown next to each median.
export const MIN_MARKET_SAMPLES = 1;
const TREND_WEEKS = 12;

export const laneKey = (
  origin: string,
  destination: string,
  container: string,
) => `${origin}|${destination}|${container}`;
export const shanghaiDate = (date = new Date()) =>
  date.toLocaleDateString("en-CA", { timeZone: "Asia/Shanghai" });
export function addDays(date: string, days: number) {
  const value = new Date(date + "T00:00:00Z");
  value.setUTCDate(value.getUTCDate() + days);
  return value.toISOString().slice(0, 10);
}
const weekStart = (date: string) =>
  addDays(date, -((new Date(date + "T00:00:00Z").getUTCDay() + 6) % 7));
function median(sorted: number[]) {
  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2
    ? sorted[middle]
    : (sorted[middle - 1] + sorted[middle]) / 2;
}
// Drops entries more than 50% away from the median, such as typos or a
// different charge scope, before market prices are summarised.
function withoutOutliers(prices: number[]) {
  const sorted = [...prices].sort((a, b) => a - b);
  const middle = median(sorted);
  return sorted.filter(
    (price) => price >= middle * 0.5 && price <= middle * 1.5,
  );
}
export function marketSummary(prices: number[]): Market | undefined {
  const kept = withoutOutliers(prices);
  if (kept.length < MIN_MARKET_SAMPLES) return undefined;
  return { median: Math.round(median(kept) / 10) * 10, count: kept.length };
}

function marketUsed(entries: PriceEntry[]) {
  const kept = withoutOutliers(entries.map((e) => e.price));
  return entries.filter((e) => e.price >= kept[0] && e.price <= kept[kept.length - 1]);
}
function laneDetails(entries: PriceEntry[]): LaneDetails {
  const carriers = new Set(
    entries.flatMap((e) => (e.carrier ?? "").split(/[,，/、;；]+/).map((c) => c.trim()).filter(Boolean)),
  );
  return { carriers: [...carriers].sort() };
}

// Builds the only price data that reaches public pages: internal entries are
// never included, and market prices appear as medians with their sample size.
export function summarize(entries: PriceEntry[], today: string): Snapshot {
  const marketSince = addDays(today, -MARKET_WINDOW_DAYS);
  const trendSince = weekStart(addDays(today, -7 * (TREND_WEEKS - 1)));
  const groups = new Map<string, PriceEntry[]>();
  for (const entry of entries) {
    if (entry.tier === "internal") continue;
    const key = laneKey(entry.origin, entry.destination, entry.container);
    groups.set(key, [...(groups.get(key) ?? []), entry]);
  }
  const snapshot: Snapshot = { today, lanes: {}, trends: {} };
  for (const [key, list] of groups) {
    const lane: Lane = {};
    const offers = list.filter(
      (e) => e.tier === "offer" && e.validUntil >= today,
    );
    if (offers.length) {
      const transitMins = offers.flatMap((e) =>
        e.transitMin ? [e.transitMin] : [],
      );
      const transitMaxes = offers.flatMap((e) =>
        e.transitMax ? [e.transitMax] : [],
      );
      lane.offer = {
        low: Math.min(...offers.map((e) => e.price)),
        high: Math.max(...offers.map((e) => e.price)),
        validUntil: offers.map((e) => e.validUntil).sort()[0],
        transitMin: transitMins.length ? Math.min(...transitMins) : null,
        transitMax: transitMaxes.length ? Math.max(...transitMaxes) : null,
      };
    }
    const market = list.filter((e) => e.tier === "market");
    const current = market.filter(
      (e) =>
        e.validUntil >= today &&
        shanghaiDate(new Date(e.createdAt)) >= marketSince,
    );
    lane.market = marketSummary(current.map((e) => e.price));
    if (lane.offer || lane.market) {
      const used = offers.length ? offers : marketUsed(current);
      lane.details = laneDetails(used);
      snapshot.lanes[key] = lane;
    }
    const weeks = new Map<string, number[]>();
    for (const entry of market) {
      const week = weekStart(shanghaiDate(new Date(entry.createdAt)));
      if (week >= trendSince)
        weeks.set(week, [...(weeks.get(week) ?? []), entry.price]);
    }
    const points = [...weeks]
      .sort(([a], [b]) => a.localeCompare(b))
      .flatMap(([week, prices]) => {
        const summary = marketSummary(prices);
        return summary
          ? [{ week, median: summary.median, count: summary.count }]
          : [];
      });
    if (points.length) snapshot.trends[key] = points;
  }
  return snapshot;
}

export type Shipment = {
  origin: string;
  destination: string;
  mode: "FCL" | "LCL";
  container: string;
  quantity: number;
  volume: number;
  weight: number;
  date: string;
};
export const defaultShipment: Shipment = {
  origin: "Shanghai",
  destination: "Jeddah",
  mode: "FCL",
  container: "40HC",
  quantity: 1,
  volume: 5,
  weight: 1000,
  date: "",
};
export const shipmentKey = (s: Shipment) =>
  laneKey(s.origin, s.destination, s.mode === "LCL" ? "LCL" : s.container);
export function laneView(snapshot: Snapshot, shipment: Shipment) {
  const key = shipmentKey(shipment);
  return {
    equipment: shipment.mode === "LCL" ? "LCL" : shipment.container,
    lane: snapshot.lanes[key],
    trend: snapshot.trends[key] ?? [],
  };
}

// Scales the per-container or per-W/M lane prices to the whole shipment.
// LCL bills the larger of cubic metres and metric tonnes, with a 1 W/M minimum.
export function estimate(lane: Lane | undefined, s: Shipment) {
  if (
    !origins.some((p) => p.id === s.origin) ||
    !destinations.some((p) => p.id === s.destination) ||
    (s.mode === "FCL" &&
      (!["20GP", "40GP", "40HC"].includes(s.container) ||
        !Number.isInteger(s.quantity) ||
        s.quantity < 1 ||
        s.quantity > 100)) ||
    (s.mode === "LCL" &&
      (!Number.isFinite(s.volume) ||
        s.volume <= 0 ||
        s.volume > 1000 ||
        !Number.isFinite(s.weight) ||
        s.weight <= 0 ||
        s.weight > 1000000)) ||
    !["FCL", "LCL"].includes(s.mode)
  )
    throw new Error("Invalid shipment");
  const units =
    s.mode === "FCL" ? s.quantity : Math.max(1, s.volume, s.weight / 1000);
  const scale = (price: number) => Math.round(price * units);
  return {
    units,
    offer: lane?.offer && {
      ...lane.offer,
      low: scale(lane.offer.low),
      high: scale(lane.offer.high),
    },
    market: lane?.market && {
      ...lane.market,
      median: scale(lane.market.median),
    },
  };
}
