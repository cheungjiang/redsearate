import { test } from "node:test";
import assert from "node:assert/strict";
import {
  fromNotionContentPage,
  notionBlocksToContent,
  type NotionBlock,
  type NotionContentPage,
} from "./notion-content.ts";

const property = (value: unknown) => value as NotionContentPage["properties"][string];

function page(overrides: Partial<NotionContentPage> = {}): NotionContentPage {
  return {
    id: "page-1",
    created_time: "2026-11-20T04:00:00.000Z",
    last_edited_time: "2026-11-22T04:00:00.000Z",
    properties: {
      Title: property({ type: "title", title: [{ plain_text: "China to Jeddah transit" }] }),
      Slug: property({ type: "rich_text", rich_text: [{ plain_text: "jeddah-transit" }] }),
      Language: property({ type: "select", select: { name: "en" } }),
      Kind: property({ type: "select", select: { name: "guide" } }),
      Placement: property({ type: "select", select: { name: "guide" } }),
      Description: property({ type: "rich_text", rich_text: [{ plain_text: "A short description." }] }),
      Lead: property({ type: "rich_text", rich_text: [{ plain_text: "A longer lead." }] }),
      Tags: property({ type: "multi_select", multi_select: [{ name: "Transit" }] }),
      Status: property({ type: "select", select: { name: "publish" } }),
      Published: property({ type: "date", date: { start: "2026-11-20" } }),
      Updated: property({ type: "date", date: { start: "2026-11-22" } }),
      Order: property({ type: "number", number: 3 }),
    },
    ...overrides,
  };
}

const heading = (text: string): NotionBlock => ({
  id: "heading",
  type: "heading_2",
  heading_2: { rich_text: [{ plain_text: text }] },
});

test("Notion blocks map to the canonical heading, paragraph and list blocks", () => {
  const blocks: NotionBlock[] = [
    heading("Transit time"),
    { id: "p", type: "paragraph", paragraph: { rich_text: [{ plain_text: "About 17 days." }] } },
    { id: "b", type: "bulleted_list_item", bulleted_list_item: { rich_text: [{ plain_text: "Direct sailing", href: "https://redsearate.com/rates/" }] } },
    { id: "n", type: "numbered_list_item", numbered_list_item: { rich_text: [{ plain_text: "Book the sailing." }] } },
    { id: "q", type: "quote", quote: { rich_text: [{ plain_text: "A reading, not a forecast." }] } },
    { id: "empty", type: "paragraph", paragraph: { rich_text: [] } },
  ];
  assert.deepEqual(notionBlocksToContent(blocks), [
    { type: "heading2", text: "Transit time" },
    { type: "paragraph", richText: [{ text: "About 17 days." }] },
    { type: "bulleted_list_item", richText: [{ text: "Direct sailing", href: "https://redsearate.com/rates/" }] },
    { type: "numbered_list_item", richText: [{ text: "Book the sailing." }] },
    { type: "quote", richText: [{ text: "A reading, not a forecast." }] },
  ]);
});

test("a published Notion page maps its properties and body", () => {
  const mapped = fromNotionContentPage(page(), [
    heading("Transit time"),
    { id: "p", type: "paragraph", paragraph: { rich_text: [{ plain_text: "About 17 days." }] } },
  ]);
  assert.ok("document" in mapped);
  assert.deepEqual(mapped.document, {
    id: "page-1",
    title: "China to Jeddah transit",
    slug: "jeddah-transit",
    language: "en",
    kind: "guide",
    placement: "guide",
    description: "A short description.",
    lead: "A longer lead.",
    tags: ["Transit"],
    status: "publish",
    published: "2026-11-20",
    updated: "2026-11-22",
    order: 3,
    body: [
      { type: "heading2", text: "Transit time" },
      { type: "paragraph", richText: [{ text: "About 17 days." }] },
    ],
  });
});

test("draft pages are skipped, and a FAQ can fall back to its description", () => {
  const draft = fromNotionContentPage(page({
    properties: {
      ...page().properties,
      Status: property({ type: "select", select: { name: "draft" } }),
    },
  }), []);
  assert.deepEqual(draft, { skip: "status is not publish" });

  const faq = fromNotionContentPage(page({
    properties: {
      ...page().properties,
      Kind: property({ type: "select", select: { name: "faq" } }),
      Placement: property({ type: "select", select: { name: "faq" } }),
    },
  }), []);
  assert.ok("document" in faq);
  assert.deepEqual(faq.document.body, [{ type: "paragraph", richText: [{ text: "A short description." }] }]);
});

test("missing required fields are skipped with a reason", () => {
  const noSlug = fromNotionContentPage(page({
    properties: { ...page().properties, Slug: property({ type: "rich_text", rich_text: [] }) },
  }), []);
  assert.deepEqual(noSlug, { skip: "Slug is empty" });
});
