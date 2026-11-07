import { existsSync, readFileSync } from "node:fs";
import { shanghaiDate, summarize, type PriceEntry } from "./rates";
import { liveIndex } from "./platform";
import { simulationPreview } from "./simulation.server";

export const contact = {
  wechat: process.env.SITE_WECHAT ?? "uarmside",
  // Comma-separated; each visitor is assigned one number at random.
  whatsapp: (
    process.env.SITE_WHATSAPP ??
    "+86 132 3740 1856,+86 158 1879 6370,+86 158 7620 7182,+86 134 5470 1600"
  )
    .split(",")
    .map((n) => n.trim())
    .filter(Boolean),
};

const pricesFile = process.env.PUBLIC_PRICES ?? ".data/public-prices.json";

// Pages are prerendered, so prices and expiry reflect the last build. The
// scheduled deploy rebuilds from Notion to keep them current.
export async function homeData() {
  const entries: PriceEntry[] = existsSync(pricesFile)
    ? JSON.parse(readFileSync(pricesFile, "utf8"))
    : [];
  const today = shanghaiDate();
  return {
    snapshot: summarize(entries, today),
    index: liveIndex(entries, today),
    contact,
    simulation: simulationPreview(),
  };
}
