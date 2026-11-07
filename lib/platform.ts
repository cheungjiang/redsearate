import {
  addDays,
  destinations,
  laneView,
  marketSummary,
  MIN_MARKET_SAMPLES,
  shanghaiDate,
} from "./rates.ts";
import type { PriceEntry, Shipment, Snapshot } from "./rates.ts";

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
// origin, dated in the last 28 days. The median needs 5 quotes after outliers
// are dropped. Week on week compares with the same window ending 7 days ago.
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

export function publicRateRows(snapshot: Snapshot, shipment: Shipment) {
  return destinations.map((destination) => {
    const { lane, equipment } = laneView(snapshot, {
      ...shipment,
      destination: destination.id,
    });
    const offer = lane?.offer;
    const market = lane?.market;
    return {
      origin: shipment.origin,
      destination: destination.id,
      equipment,
      offer: offer && offer.validUntil >= snapshot.today
        ? { low: offer.low, high: offer.high, validUntil: offer.validUntil }
        : null,
      market: market && market.count >= MIN_MARKET_SAMPLES
        ? { median: market.median, count: market.count }
        : null,
      // These public summaries have no grading evidence or trusted update source.
      grade: null,
      updatedAt: null,
    };
  });
}
