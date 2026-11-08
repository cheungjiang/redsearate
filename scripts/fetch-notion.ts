// Pulls RedSeaRate 报价库 into .data. Rows for Jebel Ali stay in their own
// file and never enter the Red Sea index. The scheduled deploy runs this every
// 10 minutes.
// Usage: NOTION_TOKEN=... npm run fetch-prices
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";
import {
  fromJebelAliPage,
  isJebelAliPage,
  type JebelAliMarketQuote,
} from "../lib/jebel-ali-prices.ts";
import {
  fromNotionPage,
  REJECTED,
  toPublicEntry,
  type NotionPage,
} from "../lib/notion-prices.ts";
import type { PriceEntry } from "../lib/rates.ts";

const out = process.env.PUBLIC_PRICES ?? ".data/public-prices.json";
const jebelOut = process.env.JEBEL_ALI_PRICES ?? ".data/jebel-ali-prices.json";
const token = process.env.NOTION_TOKEN;
const dataSource =
  process.env.NOTION_DATA_SOURCE_ID ?? "aff94f68-8c06-483d-a5ee-313ba888c19e";

function save(file: string, entries: unknown[]) {
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, JSON.stringify(entries, null, 2) + "\n");
}

async function queryAll(source: string, filter: unknown) {
  const pages: NotionPage[] = [];
  let cursor: string | undefined;
  do {
    const response = await fetch(
      `https://api.notion.com/v1/data_sources/${source}/query`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Notion-Version": "2025-09-03",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ filter, page_size: 100, start_cursor: cursor }),
      },
    );
    if (!response.ok) {
      console.error(`Notion query failed: ${response.status} ${await response.text()}`);
      process.exit(1);
    }
    const body = (await response.json()) as {
      results: NotionPage[];
      has_more: boolean;
      next_cursor: string | null;
    };
    pages.push(...body.results);
    cursor = body.has_more ? (body.next_cursor ?? undefined) : undefined;
  } while (cursor);
  return pages;
}

if (!token) {
  if (process.env.CI) {
    console.error("NOTION_TOKEN is not set; refusing to publish without prices.");
    process.exit(1);
  }
  console.warn("NOTION_TOKEN is not set; leaving the existing price files in place.");
  process.exit(0);
}

const pages = await queryAll(dataSource, {
  property: "审核状态",
  select: { does_not_equal: REJECTED },
});

const entries: PriceEntry[] = [];
const jebelQuotes: JebelAliMarketQuote[] = [];
const skipped = new Map<string, number>();
const jebelSkipped = new Map<string, number>();
let jebelRows = 0;
pages.forEach((page, index) => {
  if (isJebelAliPage(page)) {
    jebelRows += 1;
    const result = fromJebelAliPage(page);
    if ("quote" in result) jebelQuotes.push(result.quote);
    else jebelSkipped.set(result.skip, (jebelSkipped.get(result.skip) ?? 0) + 1);
    return;
  }
  const result = toPublicEntry(fromNotionPage(page), index + 1);
  if ("entry" in result) entries.push(result.entry);
  else skipped.set(result.skip, (skipped.get(result.skip) ?? 0) + 1);
});
save(out, entries);
save(jebelOut, jebelQuotes);
console.log(`Notion: ${pages.length - jebelRows} Red Sea rows, ${entries.length} published.`);
for (const [reason, count] of skipped) console.log(`  skipped ${count}: ${reason}`);
console.log(`Jebel Ali: ${jebelRows} rows, ${jebelQuotes.length} market quotes.`);
for (const [reason, count] of jebelSkipped) console.log(`  skipped ${count}: ${reason}`);
