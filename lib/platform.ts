import { destinations, laneView, MIN_MARKET_SAMPLES } from "./rates.ts";
import type { Shipment, Snapshot } from "./rates.ts";

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

// The approved ports are known, but the live index methodology is not.
// Never relabel real 40HC market references as simulated 40HQ index values.
export const indexCandidates: IndexEntry[] = destinations.map((port) => ({
  port,
  median: null,
  weekChange: null,
  sampleSize: null,
  weeklyMedians: [],
}));

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
