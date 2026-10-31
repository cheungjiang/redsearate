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

// These are candidate slots, not a published five-port index. In particular,
// 40HC market references must not be silently relabeled as 40HQ index values.
export const indexCandidates = [...destinations, null].map((port) => ({
  port,
  median: null,
  weekChange: null,
  sampleSize: null,
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
      // A/B/C and update-time semantics are not defined by the draft PRD.
      grade: null,
      updatedAt: null,
    };
  });
}
