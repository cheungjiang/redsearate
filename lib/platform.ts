import {
  addDays,
  destinations,
  laneView,
  marketSummary,
  MIN_MARKET_SAMPLES,
  shanghaiDate,
} from "./rates.ts";
import type { Lane, PriceEntry, Shipment, Snapshot } from "./rates.ts";

export const platformNavigation = [
  { id: "rates", en: "Rates", zh: "运价" },
  { id: "space-board", en: "Space Board", zh: "舱位板" },
  { id: "loads", en: "Loads", zh: "货盘" },
  { id: "agents", en: "Agents", zh: "代理" },
  { id: "brief", en: "Brief", zh: "市场简报" },
  { id: "guides", en: "Guides", zh: "指南" },
] as const;

export type IndexEntry = {
  port: (typeof destinations)[number];
  median: number | null;
  weekChange: number | null;
  sampleSize: number | null;
  weeklyMedians: number[];
};

export type Grade = "A" | "B" | "C";
export type SampleRate = {
  kind: "test";
  id: string;
  origin: string;
  destination: string;
  container: string;
  currency: "USD";
  price: number;
  carrier: string;
  grade: Grade;
  validFrom: string;
  validUntil: string;
  updatedAt: string;
};
export type SimulationPreview = { index: IndexEntry[]; rates: SampleRate[] };

export const INDEX_WINDOW_DAYS = 28;

// Per destination: market quotes for 40HQ (stored as 40HC) from every China
// origin, dated in the last 28 days, outliers dropped. Week on week compares
// with the same window ending 7 days ago.
export function liveIndex(entries: PriceEntry[], today: string): IndexEntry[] {
  const windowMedian = (destination: string, end: string) => {
    const start = addDays(end, 1 - INDEX_WINDOW_DAYS);
    return marketSummary(
      entries
        .filter((e) => {
          const date = shanghaiDate(new Date(e.createdAt));
          return e.tier === "market" && e.container === "40HC" &&
            e.destination === destination && date >= start && date <= end;
        })
        .map((e) => e.price),
    );
  };
  return destinations.map((port) => {
    const current = windowMedian(port.id, today);
    const previous = windowMedian(port.id, addDays(today, -7));
    return {
      port,
      median: current?.median ?? null,
      weekChange: current && previous
        ? Math.round(((current.median - previous.median) / previous.median) * 1000) / 10
        : null,
      sampleSize: current?.count ?? null,
      weeklyMedians: [],
    };
  });
}

export type LatestQuote = {
  id: number;
  origin: string;
  destination: string;
  container: string;
  price: number;
  carrier: string;
  date: string;
};
export const LATEST_LIMIT = 6;

// The quotes most recently added to the price table, newest first.
export function latestQuotes(entries: PriceEntry[], today: string): LatestQuote[] {
  const since = addDays(today, -INDEX_WINDOW_DAYS);
  return entries
    .filter((e) => e.tier !== "internal" && shanghaiDate(new Date(e.createdAt)) >= since)
    .sort((a, b) =>
      (b.addedAt ?? b.createdAt).localeCompare(a.addedAt ?? a.createdAt) || b.id - a.id)
    .slice(0, LATEST_LIMIT)
    .map((e) => ({
      id: e.id,
      origin: e.origin,
      destination: e.destination,
      container: e.container === "40HC" ? "40HQ" : e.container,
      price: e.price,
      carrier: e.carrier ?? "",
      date: shanghaiDate(new Date(e.createdAt)),
    }));
}

export type Rating = "excellent" | "good";
export const EXCELLENT_DISCOUNT = 0.1;

// One row per destination: the shipment's origin when it has a current price,
// otherwise the origin with a live offer or the most market samples.
// Every priced row is rated good; it is excellent when its price is at least
// 10% below the median of all origins' prices for that destination and equipment.
function rate(price: number | undefined, benchmark: number | undefined): Rating | null {
  if (price === undefined) return null;
  return benchmark !== undefined && price <= benchmark * (1 - EXCELLENT_DISCOUNT) ? "excellent" : "good";
}

export function publicRateRows(snapshot: Snapshot, shipment: Shipment) {
  const live = (lane: Lane | undefined) =>
    lane?.offer && lane.offer.validUntil >= snapshot.today ? lane.offer : undefined;
  const priced = (lane: Lane | undefined) => Boolean(live(lane) || lane?.market);
  const price = (lane: Lane | undefined) => live(lane)?.low ?? lane?.market?.median;
  const benchmark = (destination: string, equipment: string) => {
    const prices = Object.entries(snapshot.lanes)
      .filter(([key]) => key.split("|")[1] === destination && key.split("|")[2] === equipment)
      .flatMap(([, lane]) => price(lane) ?? [])
      .sort((a, b) => a - b);
    if (prices.length < 2) return undefined;
    const middle = Math.floor(prices.length / 2);
    return prices.length % 2 ? prices[middle] : (prices[middle - 1] + prices[middle]) / 2;
  };
  return destinations.map((destination) => {
    const view = laneView(snapshot, { ...shipment, destination: destination.id });
    const { equipment } = view;
    const fallback = priced(view.lane) ? undefined : Object.entries(snapshot.lanes)
      .map(([key, lane]) => ({ key: key.split("|"), lane }))
      .filter(({ key, lane }) => key[1] === destination.id && key[2] === equipment && priced(lane))
      .sort((a, b) =>
        Number(Boolean(b.lane.offer)) - Number(Boolean(a.lane.offer)) ||
        (b.lane.market?.count ?? 0) - (a.lane.market?.count ?? 0))[0];
    const lane = fallback?.lane ?? view.lane;
    const offer = lane?.offer;
    const market = lane?.market;
    return {
      origin: fallback?.key[0] ?? shipment.origin,
      destination: destination.id,
      equipment,
      offer: offer && offer.validUntil >= snapshot.today
        ? { low: offer.low, high: offer.high, validUntil: offer.validUntil }
        : null,
      market: market && market.count >= MIN_MARKET_SAMPLES
        ? { median: market.median, count: market.count }
        : null,
      carriers: lane?.details?.carriers ?? [],
      rating: rate(price(lane), benchmark(destination.id, equipment)),
    };
  });
}
