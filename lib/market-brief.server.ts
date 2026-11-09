import { existsSync, readdirSync, readFileSync } from "node:fs";
import { MARKET_BRIEF_DIR, type MarketBrief } from "./market-brief.ts";
import { destinations } from "./rates.ts";

function parseBrief(value: unknown, file: string): MarketBrief {
  if (!value || typeof value !== "object") throw new Error(`Market brief ${file} is not an object.`);
  const brief = value as MarketBrief;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(brief.date)) throw new Error(`Market brief ${file} has no issue date.`);
  if (!Array.isArray(brief.ports) || brief.ports.length !== destinations.length) {
    throw new Error(`Market brief ${file} does not list the five ports.`);
  }
  return brief;
}

export function readMarketBriefs(dir = MARKET_BRIEF_DIR): MarketBrief[] {
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter((name) => name.endsWith(".json"))
    .map((name) => parseBrief(JSON.parse(readFileSync(`${dir}/${name}`, "utf8")), name))
    .sort((a, b) => b.date.localeCompare(a.date));
}

export function marketBriefSitemap() {
  const briefs = readMarketBriefs();
  const latest = briefs[0]?.date ?? briefs.at(-1)?.date;
  return [
    { en: "/market-brief/", zh: "/zh/market-brief/", modified: latest ?? "2026-11-09" },
    ...[...briefs].sort((a, b) => a.date.localeCompare(b.date)).map((brief) => ({
      en: `/market-brief/${brief.date}/`,
      zh: `/zh/market-brief/${brief.date}/`,
      modified: brief.date,
    })),
  ];
}
