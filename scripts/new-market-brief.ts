// Writes one frozen market brief from the quote file produced by
// `npm run fetch-prices`. It does not deploy. For a manual run, check the file
// before committing; the weekly workflow uses --skip-existing and commits only
// a newly created issue.
// Usage: npm run fetch-prices && npm run market-brief
//        npm run market-brief -- 2026-11-09
//        npm run market-brief -- --skip-existing
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";
import {
  briefMonday,
  buildMarketBrief,
  MARKET_BRIEF_DIR,
  type MarketBrief,
} from "../lib/market-brief.ts";
import { readMarketBriefs } from "../lib/market-brief.server.ts";
import { shanghaiDate, type PriceEntry } from "../lib/rates.ts";

const args = process.argv.slice(2);
const skipExisting = args.includes("--skip-existing");
const requested = args.find((arg) => !arg.startsWith("--")) ?? shanghaiDate();
if (!/^\d{4}-\d{2}-\d{2}$/.test(requested)) {
  console.error(`Expected a date, received ${requested}.`);
  process.exit(1);
}
const date = briefMonday(requested);
const file = `${MARKET_BRIEF_DIR}/${date}.json`;
if (existsSync(file)) {
  if (skipExisting) {
    console.log(`Already published ${file}; nothing to do.`);
    process.exit(0);
  }
  console.error(`Refusing to overwrite ${file}. A published brief stays frozen.`);
  process.exit(1);
}

const pricesFile = process.env.PUBLIC_PRICES ?? ".data/public-prices.json";
if (!existsSync(pricesFile)) {
  console.error(`No quote file at ${pricesFile}. Run npm run fetch-prices first.`);
  process.exit(1);
}
const entries = JSON.parse(readFileSync(pricesFile, "utf8")) as PriceEntry[];
const previous = readMarketBriefs().find((brief) => brief.date < date) ?? null;
const brief = buildMarketBrief(entries, date, previous);
if (brief.ports.every((port) => port.median == null)) {
  console.error(`No 40HQ market quotes for the 28 days ending ${date}. Not writing a brief.`);
  process.exit(1);
}
mkdirSync(dirname(file), { recursive: true });
writeFileSync(file, renderBrief(brief));
console.log(`Wrote ${file}${previous ? ` (week on week versus ${previous.date})` : " (no previous brief)"}.`);
for (const port of brief.ports) {
  const change = port.weekChange == null ? "no prior brief" : `${port.weekChange}%`;
  console.log(`  ${port.destination}: ${port.median ?? "—"} (n=${port.count ?? 0}) ${change}`);
}

function renderBrief(brief: MarketBrief) {
  return JSON.stringify(brief, null, 2) + "\n";
}
