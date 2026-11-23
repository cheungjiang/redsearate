import { test } from "node:test";
import assert from "node:assert/strict";
import { seedContentBacklog, seedContentDocuments } from "./content-seed.ts";
import { contentBacklogToNotionPage, contentDocumentToNotionPage } from "./notion-content-write.ts";

test("a content document becomes a Notion data-source page with body blocks", () => {
  const document = seedContentDocuments().find((item) => item.kind === "guide" && item.language === "en")!;
  const page = contentDocumentToNotionPage(document, "data-source-id");
  assert.deepEqual(page.parent, { data_source_id: "data-source-id" });
  assert.deepEqual((page.properties.Title as { title: { text: { content: string } }[] }).title[0].text.content, document.title);
  assert.deepEqual((page.properties.Status as { select: { name: string } }).select.name, "publish");
  assert.equal(page.children[0].type, "heading_2");
  assert.ok(page.children.some((block) => block.type === "paragraph"));
});

test("links become bulleted list items with a Notion link URL", () => {
  const document = seedContentDocuments().find((item) => item.kind === "guide" && item.language === "en")!;
  const page = contentDocumentToNotionPage(document, "data-source-id");
  const linkBlock = page.children.find((block) => {
    const payload = block.bulleted_list_item as { rich_text?: { text?: { link?: { url?: string } } }[] } | undefined;
    return payload?.rich_text?.some((item) => item.text?.link?.url);
  });
  assert.ok(linkBlock);
});

test("a backlog item becomes a Notion backlog page", () => {
  const page = contentBacklogToNotionPage(seedContentBacklog[0], "backlog-source-id");
  assert.deepEqual(page.parent, { data_source_id: "backlog-source-id" });
  assert.deepEqual((page.properties.Topic as { title: { text: { content: string } }[] }).title[0].text.content, seedContentBacklog[0].topic);
  assert.deepEqual((page.properties.Status as { select: { name: string } }).select.name, "idea");
});
