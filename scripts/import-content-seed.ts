// Imports data/notion-content-seed.json into an existing Notion Content data
// source. Existing documents with the same Kind + Slug + Language are skipped.
// Run once on an empty database, then let Muse write drafts in Notion.
//
// Usage:
//   NOTION_TOKEN=... NOTION_CONTENT_DATA_SOURCE_ID=... npm run import-content-seed
//   DRY_RUN=1 npm run import-content-seed
import { readFileSync } from "node:fs";
import { contentBacklogToNotionPage, contentDocumentToNotionPage } from "../lib/notion-content-write.ts";
import type { ContentBacklogItem, ContentDocument } from "../lib/content-model.ts";

type Seed = {
  documents: ContentDocument[];
  backlog?: ContentBacklogItem[];
};

type NotionPage = {
  properties: Record<string, {
    title?: { plain_text?: string }[];
    rich_text?: { plain_text?: string }[];
    select?: { name?: string } | null;
  }>;
};

const NOTION_VERSION = "2025-09-03";
const seed = JSON.parse(readFileSync("data/notion-content-seed.json", "utf8")) as Seed;
const dryRun = process.env.DRY_RUN === "1";

function text(property: NotionPage["properties"][string] | undefined) {
  return (property?.title ?? property?.rich_text ?? []).map((item) => item.plain_text ?? "").join("").trim();
}

function key(document: Pick<ContentDocument, "kind" | "slug" | "language">) {
  return `${document.kind}:${document.slug}:${document.language}`;
}

async function notionRequest(path: string, token: string, init: RequestInit) {
  const response = await fetch(`https://api.notion.com/v1${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      "Notion-Version": NOTION_VERSION,
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) throw new Error(`Notion ${response.status}: ${await response.text()}`);
  return response.json() as Promise<unknown>;
}

async function queryAll(sourceId: string, token: string): Promise<NotionPage[]> {
  const pages: NotionPage[] = [];
  let cursor: string | undefined;
  do {
    const body = (await notionRequest(`/data_sources/${sourceId}/query`, token, {
      method: "POST",
      body: JSON.stringify({ page_size: 100, ...(cursor ? { start_cursor: cursor } : {}) }),
    })) as { results: NotionPage[]; has_more: boolean; next_cursor: string | null };
    pages.push(...body.results);
    cursor = body.has_more ? (body.next_cursor ?? undefined) : undefined;
  } while (cursor);
  return pages;
}

function existingKeys(pages: NotionPage[]) {
  return new Set(pages.map((page) => {
    const properties = page.properties;
    const slug = text(properties.Slug);
    const language = properties.Language?.select?.name ?? "";
    const kind = properties.Kind?.select?.name ?? "";
    return `${kind}:${slug}:${language}`;
  }));
}

async function createPage(payload: unknown, token: string) {
  await notionRequest("/pages", token, { method: "POST", body: JSON.stringify(payload) });
}

if (dryRun) {
  console.log(`Dry run: ${seed.documents.length} content pages and ${seed.backlog?.length ?? 0} backlog rows.`);
  console.log("First page:", JSON.stringify(contentDocumentToNotionPage(seed.documents[0], "data-source-id"), null, 2).slice(0, 1200));
  process.exit(0);
}

const token = process.env.NOTION_TOKEN;
const contentSource = process.env.NOTION_CONTENT_DATA_SOURCE_ID;
if (!token || !contentSource) {
  console.error("NOTION_TOKEN and NOTION_CONTENT_DATA_SOURCE_ID are required.");
  process.exit(1);
}

const contentPages = await queryAll(contentSource, token);
const existing = existingKeys(contentPages);
let created = 0;
let skipped = 0;
for (const document of seed.documents) {
  if (existing.has(key(document))) {
    skipped += 1;
    continue;
  }
  await createPage(contentDocumentToNotionPage(document, contentSource), token);
  created += 1;
  console.log(`Created ${key(document)}`);
  await new Promise((resolve) => setTimeout(resolve, 350));
}

const backlogSource = process.env.NOTION_BACKLOG_DATA_SOURCE_ID;
let backlogCreated = 0;
if (backlogSource && seed.backlog?.length) {
  const backlogPages = await queryAll(backlogSource, token);
  const existingBacklog = new Set(backlogPages.map((page) => {
    const properties = page.properties;
    return `${text(properties.Topic)}:${properties.Language?.select?.name ?? ""}`;
  }));
  for (const item of seed.backlog) {
    if (existingBacklog.has(`${item.topic}:${item.language}`)) continue;
    await createPage(contentBacklogToNotionPage(item, backlogSource), token);
    backlogCreated += 1;
    await new Promise((resolve) => setTimeout(resolve, 350));
  }
}

console.log(`Content: ${created} created, ${skipped} skipped. Backlog: ${backlogCreated} created.`);
