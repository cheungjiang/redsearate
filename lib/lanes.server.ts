import { existsSync, readFileSync } from "node:fs";
import { shanghaiDate, type PriceEntry } from "./rates.ts";
import {
  emptyLaneRegistry,
  parseLaneRegistry,
  planLanes,
  type LanePageData,
  type LaneKey,
  type LaneRegistry,
} from "./lanes.ts";

const pricesFile = process.env.PUBLIC_PRICES ?? ".data/public-prices.json";
const registryUrl = process.env.LANE_REGISTRY_URL ?? "https://redsearate.com/lane-registry.json";

function readEntries(): PriceEntry[] {
  return existsSync(pricesFile) ? JSON.parse(readFileSync(pricesFile, "utf8")) : [];
}

async function loadPrevious(): Promise<LaneRegistry> {
  if (process.env.LANE_REGISTRY_FILE && existsSync(process.env.LANE_REGISTRY_FILE)) {
    return parseLaneRegistry(JSON.parse(readFileSync(process.env.LANE_REGISTRY_FILE, "utf8")));
  }
  try {
    const response = await fetch(registryUrl, { signal: AbortSignal.timeout(10000) });
    if (response.status === 404) return emptyLaneRegistry();
    if (!response.ok) throw new Error(`Lane registry HTTP ${response.status}`);
    return parseLaneRegistry(await response.json());
  } catch (error) {
    if (process.env.CI) throw error;
    console.warn("Lane registry unavailable. Publishing only lanes with at least 5 quotes.");
    return emptyLaneRegistry();
  }
}

export type LanePlan = {
  today: string;
  active: LanePageData[];
  retired: LaneKey[];
  registry: LaneRegistry;
};

let pending: Promise<LanePlan> | null = null;

export function getLanePlan(): Promise<LanePlan> {
  if (!pending) {
    pending = (async () => {
      const today = shanghaiDate();
      const previous = await loadPrevious();
      const { active, retired } = planLanes(readEntries(), today, previous);
      const registry = { active, retired };
      console.log(`Lanes: ${active.length} published, ${retired.length} retired.`);
      for (const lane of active) console.log(`Lane ${lane.slug}: ${lane.count} quotes, median ${lane.median}`);
      return { today, active, retired, registry };
    })();
  }
  return pending;
}
