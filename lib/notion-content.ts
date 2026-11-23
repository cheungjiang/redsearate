import { mkdirSync, renameSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";
import {
  CONTENT_KINDS,
  CONTENT_LANGUAGES,
  CONTENT_PLACEMENTS,
  CONTENT_SNAPSHOT_VERSION,
  type ContentBlock,
  type ContentDocument,
  type ContentKind,
  type ContentLanguage,
  type ContentPlacement,
  type ContentSnapshot,
  type ContentText,
} from "./content-model.ts";

const NOTION_VERSION = "2025-09-03";
const DEFAULT_LIVE_FILE = ".data/notion-content.json";

type RichTextItem = {
  plain_text?: string;
  href?: string | null;
};

type NotionProperty = {
  type?: string;
  title?: RichTextItem[];
  rich_text?: RichTextItem[];
  select?: { name?: string } | null;
  status?: { name?: string } | null;
  multi_select?: { name?: string }[];
  date?: { start?: string } | null;
  number?: number | null;
};

export type NotionContentPage = {
  id: string;
  created_time: string;
  last_edited_time: string;
  properties: Record<string, NotionProperty>;
};

export type NotionBlock = {
  id: string;
  type: string;
  has_children?: boolean;
  [key: string]: unknown;
};

function richTextItems(items: RichTextItem[] | undefined): ContentText[] {
  return (items ?? [])
    .map((item) => ({
      text: item.plain_text ?? "",
      ...(item.href ? { href: item.href } : {}),
    }))
    .filter((item) => item.text.trim().length > 0);
}

function propertyText(property: NotionProperty | undefined) {
  if (!property) return "";
  return richTextItems(property.title ?? property.rich_text).map((item) => item.text).join("").trim();
}

function propertySelect(property: NotionProperty | undefined) {
  return (property?.select?.name ?? property?.status?.name ?? "").trim();
}

function propertyDate(property: NotionProperty | undefined) {
  return property?.date?.start?.slice(0, 10) ?? "";
}

function propertyNumber(property: NotionProperty | undefined) {
  return typeof property?.number === "number" ? property.number : undefined;
}

function propertyTags(property: NotionProperty | undefined) {
  return (property?.multi_select ?? []).map((tag) => tag.name?.trim()).filter(Boolean) as string[];
}

function blockRichText(block: NotionBlock) {
  const payload = block[block.type] as { rich_text?: RichTextItem[] } | undefined;
  return richTextItems(payload?.rich_text);
}

export function notionBlocksToContent(blocks: NotionBlock[]): ContentBlock[] {
  const content: ContentBlock[] = [];
  for (const block of blocks) {
    if (block.type === "heading_2") {
      const text = blockRichText(block).map((item) => item.text).join("").trim();
      if (text) content.push({ type: "heading2", text });
      continue;
    }
    if (block.type === "paragraph") {
      const richText = blockRichText(block);
      if (richText.length) content.push({ type: "paragraph", richText });
      continue;
    }
    if (block.type === "bulleted_list_item") {
      const richText = blockRichText(block);
      if (richText.length) content.push({ type: "bulleted_list_item", richText });
      continue;
    }
    if (block.type === "numbered_list_item") {
      const richText = blockRichText(block);
      if (richText.length) content.push({ type: "numbered_list_item", richText });
      continue;
    }
    if (block.type === "quote") {
      const richText = blockRichText(block);
      if (richText.length) content.push({ type: "quote", richText });
      continue;
    }
    if (block.type === "callout") {
      const richText = blockRichText(block);
      if (richText.length) content.push({ type: "paragraph", richText });
    }
  }
  return content;
}

const defaultPlacement = (kind: ContentKind): ContentPlacement =>
  kind === "guide" ? "guide" : kind === "faq" ? "faq" : kind === "brief" ? "brief" : "methodology";

export function fromNotionContentPage(
  page: NotionContentPage,
  blocks: NotionBlock[],
): { document: ContentDocument } | { skip: string } {
  const title = propertyText(page.properties.Title);
  const slug = propertyText(page.properties.Slug);
  const language = propertySelect(page.properties.Language) as ContentLanguage;
  const kind = propertySelect(page.properties.Kind) as ContentKind;
  const status = propertySelect(page.properties.Status);
  if (status.toLowerCase() !== "publish") return { skip: "status is not publish" };
  if (!title) return { skip: "Title is empty" };
  if (!slug) return { skip: "Slug is empty" };
  if (!(CONTENT_LANGUAGES as readonly string[]).includes(language)) return { skip: `Language is invalid: ${language || "empty"}` };
  if (!(CONTENT_KINDS as readonly string[]).includes(kind)) return { skip: `Kind is invalid: ${kind || "empty"}` };
  const placementValue = propertySelect(page.properties.Placement) as ContentPlacement;
  const placement = (CONTENT_PLACEMENTS as readonly string[]).includes(placementValue)
    ? placementValue
    : defaultPlacement(kind);
  const description = propertyText(page.properties.Description);
  const lead = propertyText(page.properties.Lead);
  const body = notionBlocksToContent(blocks);
  if (!body.length && (kind === "guide" || kind === "methodology")) {
    return { skip: "body has no supported blocks" };
  }
  const fallbackBody: ContentBlock[] = description
    ? [{ type: "paragraph", richText: [{ text: description }] }]
    : [];
  return {
    document: {
      id: page.id,
      title,
      slug,
      language,
      kind,
      placement,
      description: description || lead || title,
      ...(lead ? { lead } : {}),
      tags: propertyTags(page.properties.Tags),
      status: "publish",
      published: propertyDate(page.properties.Published) || page.created_time.slice(0, 10),
      updated: propertyDate(page.properties.Updated) || page.last_edited_time.slice(0, 10),
      ...(propertyNumber(page.properties.Order) != null ? { order: propertyNumber(page.properties.Order) } : {}),
      body: body.length ? body : fallbackBody,
    },
  };
}

async function notionRequest(path: string, token: string, init: RequestInit = {}) {
  const response = await fetch(`https://api.notion.com/v1${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      "Notion-Version": NOTION_VERSION,
      "Content-Type": "application/json",
      ...(init.headers ?? {}),
    },
  });
  if (!response.ok) {
    throw new Error(`Notion ${response.status}: ${await response.text()}`);
  }
  return response.json() as Promise<unknown>;
}

async function queryContentPages(sourceId: string, token: string): Promise<NotionContentPage[]> {
  const pages: NotionContentPage[] = [];
  let cursor: string | undefined;
  do {
    const body = (await notionRequest(`/data_sources/${sourceId}/query`, token, {
      method: "POST",
      body: JSON.stringify({ page_size: 100, ...(cursor ? { start_cursor: cursor } : {}) }),
    })) as { results: NotionContentPage[]; has_more: boolean; next_cursor: string | null };
    pages.push(...body.results);
    cursor = body.has_more ? (body.next_cursor ?? undefined) : undefined;
  } while (cursor);
  return pages;
}

async function fetchBlockChildren(blockId: string, token: string): Promise<NotionBlock[]> {
  const blocks: NotionBlock[] = [];
  let cursor: string | undefined;
  do {
    const query = new URLSearchParams({ page_size: "100", ...(cursor ? { start_cursor: cursor } : {}) });
    const body = (await notionRequest(`/blocks/${blockId}/children?${query}`, token)) as {
      results: NotionBlock[];
      has_more: boolean;
      next_cursor: string | null;
    };
    for (const block of body.results) {
      blocks.push(block);
      if (block.has_children && block.type !== "child_page") {
        blocks.push(...await fetchBlockChildren(block.id, token));
      }
    }
    cursor = body.has_more ? (body.next_cursor ?? undefined) : undefined;
  } while (cursor);
  return blocks;
}

function writeSnapshot(snapshot: ContentSnapshot, file: string) {
  mkdirSync(dirname(file), { recursive: true });
  const temporary = `${file}.tmp`;
  writeFileSync(temporary, `${JSON.stringify(snapshot, null, 2)}\n`);
  renameSync(temporary, file);
}

// Fetches publish-only content. Any failure is non-fatal: the build then reads
// the committed snapshot. This is deliberate, because a Notion outage must not
// block a scheduled deploy.
export async function fetchNotionContent(): Promise<boolean> {
  const token = process.env.NOTION_TOKEN;
  const sourceId = process.env.NOTION_CONTENT_DATA_SOURCE_ID;
  const file = process.env.NOTION_CONTENT_FILE ?? DEFAULT_LIVE_FILE;
  if (!token) {
    console.warn("NOTION_TOKEN is not set; using the committed content snapshot.");
    return false;
  }
  if (!sourceId) {
    console.warn("NOTION_CONTENT_DATA_SOURCE_ID is not set; using the committed content snapshot.");
    return false;
  }
  try {
    const pages = await queryContentPages(sourceId, token);
    const documents: ContentDocument[] = [];
    let nonPublish = 0;
    for (const page of pages) {
      // Do not spend block requests on drafts.
      if (propertySelect(page.properties.Status).toLowerCase() !== "publish") {
        nonPublish += 1;
        continue;
      }
      const blocks = await fetchBlockChildren(page.id, token);
      const mapped = fromNotionContentPage(page, blocks);
      if ("document" in mapped) documents.push(mapped.document);
      else console.log(`Content skipped (${mapped.skip}): ${propertyText(page.properties.Title) || page.id}`);
    }
    if (!documents.length) {
      console.warn("Notion returned no publishable content; keeping the committed snapshot.");
      return false;
    }
    writeSnapshot({
      version: CONTENT_SNAPSHOT_VERSION,
      generatedAt: new Date().toISOString(),
      source: "notion",
      documents,
    }, file);
    console.log(`Notion content: ${documents.length} publishable documents written to ${file}; ${nonPublish} non-publish skipped.`);
    return true;
  } catch (error) {
    console.warn(`Notion content fetch failed; using the committed snapshot: ${error instanceof Error ? error.message : String(error)}`);
    return false;
  }
}
