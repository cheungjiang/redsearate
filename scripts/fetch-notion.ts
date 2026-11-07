// Pulls every quote not marked 拒绝 from the Notion price database into
// .data/public-prices.json, which the build reads. Usage:
//   NOTION_TOKEN=... npm run fetch-prices
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";
import {
  fromNotionPage,
  REJECTED,
  toPublicEntry,
  type NotionPage,
} from "../lib/notion-prices.ts";
import type { PriceEntry } from "../lib/rates.ts";

const out = process.env.PUBLIC_PRICES ?? ".data/public-prices.json";
const token = process.env.NOTION_TOKEN;
const dataSource =
  process.env.NOTION_DATA_SOURCE_ID ?? "aff94f68-8c06-483d-a5ee-313ba888c19e";

function save(entries: PriceEntry[]) {
  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, JSON.stringify(entries, null, 2) + "\n");
}

if (!token) {
  if (process.env.CI) {
    console.error("NOTION_TOKEN is not set; refusing to publish without prices.");
    process.exit(1);
  }
  console.warn("NOTION_TOKEN is not set; writing an empty price list.");
  save([]);
  process.exit(0);
}

const pages: NotionPage[] = [];
let cursor: string | undefined;
do {
  const response = await fetch(
    `https://api.notion.com/v1/data_sources/${dataSource}/query`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Notion-Version": "2025-09-03",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        filter: { property: "审核状态", select: { does_not_equal: REJECTED } },
        page_size: 100,
        start_cursor: cursor,
      }),
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

const entries: PriceEntry[] = [];
const skipped = new Map<string, number>();
pages.forEach((page, index) => {
  const result = toPublicEntry(fromNotionPage(page), index + 1);
  if ("entry" in result) entries.push(result.entry);
  else skipped.set(result.skip, (skipped.get(result.skip) ?? 0) + 1);
});
save(entries);
console.log(`Notion: ${pages.length} not rejected, ${entries.length} published.`);
for (const [reason, count] of skipped) console.log(`  skipped ${count}: ${reason}`);
