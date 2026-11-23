// Pulls publish-only human-written content from Notion into .data.
// A failure is intentionally non-fatal: the build falls back to
// data/content-snapshot.json.
// Usage: NOTION_TOKEN=... NOTION_CONTENT_DATA_SOURCE_ID=... npm run fetch-content
import { fetchNotionContent } from "../lib/notion-content.ts";

await fetchNotionContent();
