import type { ContentBacklogItem, ContentBlock, ContentDocument, ContentText } from "./content-model.ts";

type NotionRichText = {
  type: "text";
  text: { content: string; link?: { url: string } };
};

type NotionBlockRequest = {
  object: "block";
  type: string;
  [key: string]: unknown;
};

function richText(items: ContentText[]): NotionRichText[] {
  return items
    .filter((item) => item.text.length > 0)
    .map((item) => ({
      type: "text",
      text: {
        content: item.text,
        ...(item.href ? { link: { url: item.href } } : {}),
      },
    }));
}

function block(type: string, items: ContentText[]): NotionBlockRequest {
  return { object: "block", type, [type]: { rich_text: richText(items) } };
}

function contentBlockToNotion(blockValue: ContentBlock): NotionBlockRequest[] {
  if (blockValue.type === "heading2") {
    return [block("heading_2", [{ text: blockValue.text }])];
  }
  if (blockValue.type === "paragraph") return [block("paragraph", blockValue.richText)];
  if (blockValue.type === "bulleted_list_item") return [block("bulleted_list_item", blockValue.richText)];
  if (blockValue.type === "numbered_list_item") return [block("numbered_list_item", blockValue.richText)];
  if (blockValue.type === "quote") return [block("quote", blockValue.richText)];
  return blockValue.items.map((item) =>
    block("bulleted_list_item", [{ text: item.text, href: item.href }]),
  );
}

export function contentDocumentToNotionPage(document: ContentDocument, dataSourceId: string) {
  const properties: Record<string, unknown> = {
    Title: { title: [{ type: "text", text: { content: document.title } }] },
    Slug: { rich_text: [{ type: "text", text: { content: document.slug } }] },
    Language: { select: { name: document.language } },
    Kind: { select: { name: document.kind } },
    Placement: { select: { name: document.placement } },
    Description: { rich_text: [{ type: "text", text: { content: document.description } }] },
    Tags: { multi_select: document.tags.map((name) => ({ name })) },
    Status: { select: { name: document.status } },
  };
  if (document.lead) {
    properties.Lead = { rich_text: [{ type: "text", text: { content: document.lead } }] };
  }
  if (document.published) properties.Published = { date: { start: document.published } };
  if (document.updated) properties.Updated = { date: { start: document.updated } };
  if (document.order != null) properties.Order = { number: document.order };
  return {
    parent: { data_source_id: dataSourceId },
    properties,
    children: document.body.flatMap(contentBlockToNotion),
  };
}

export function contentBacklogToNotionPage(item: ContentBacklogItem, dataSourceId: string) {
  return {
    parent: { data_source_id: dataSourceId },
    properties: {
      Topic: { title: [{ type: "text", text: { content: item.topic } }] },
      "Target Keyword": { rich_text: [{ type: "text", text: { content: item.targetKeyword } }] },
      Language: { select: { name: item.language } },
      Status: { select: { name: item.status } },
      ...(item.notes ? { Notes: { rich_text: [{ type: "text", text: { content: item.notes } }] } } : {}),
      ...(item.priority ? { Priority: { select: { name: item.priority } } } : {}),
    },
  };
}
