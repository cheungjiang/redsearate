// Canonical content shape shared by the Notion fetcher, the committed
// snapshot and the page renderers. Keep this file free of node:fs so it can
// also be imported by tests and by the seed exporter.

export const CONTENT_SNAPSHOT_VERSION = 1;
export const CONTENT_LANGUAGES = ["en", "zh"] as const;
export const CONTENT_KINDS = ["guide", "faq", "brief", "methodology"] as const;
export const CONTENT_PLACEMENTS = ["guide", "home", "faq", "methodology", "brief"] as const;
export const CONTENT_STATUSES = ["draft", "publish"] as const;

export type ContentLanguage = (typeof CONTENT_LANGUAGES)[number];
export type ContentKind = (typeof CONTENT_KINDS)[number];
export type ContentPlacement = (typeof CONTENT_PLACEMENTS)[number];
export type ContentStatus = (typeof CONTENT_STATUSES)[number];

export type ContentText = { text: string; href?: string };

export type ContentBlock =
  | { type: "heading2"; text: string }
  | { type: "paragraph"; richText: ContentText[] }
  | { type: "bulleted_list_item"; richText: ContentText[] }
  | { type: "numbered_list_item"; richText: ContentText[] }
  | { type: "quote"; richText: ContentText[] }
  | { type: "links"; items: { text: string; href: string }[] };

export type ContentDocument = {
  // Notion page id when the document came from the API. Seed documents leave it empty.
  id?: string;
  title: string;
  slug: string;
  language: ContentLanguage;
  kind: ContentKind;
  placement: ContentPlacement;
  description: string;
  // Optional page lead. Guides use Description as the lead; methodology keeps
  // a separate lead and meta description.
  lead?: string;
  tags: string[];
  status: ContentStatus;
  published?: string;
  updated?: string;
  order?: number;
  body: ContentBlock[];
};

export type ContentSnapshot = {
  version: typeof CONTENT_SNAPSHOT_VERSION;
  generatedAt: string;
  source: "seed" | "notion";
  documents: ContentDocument[];
};

export type ContentBacklogItem = {
  topic: string;
  targetKeyword: string;
  language: ContentLanguage;
  status: "idea" | "drafting" | "review" | "published";
  notes?: string;
  priority?: "P0" | "P1" | "P2";
};

export const isContentLanguage = (value: unknown): value is ContentLanguage =>
  typeof value === "string" && (CONTENT_LANGUAGES as readonly string[]).includes(value);

export const isContentKind = (value: unknown): value is ContentKind =>
  typeof value === "string" && (CONTENT_KINDS as readonly string[]).includes(value);

export const isContentPlacement = (value: unknown): value is ContentPlacement =>
  typeof value === "string" && (CONTENT_PLACEMENTS as readonly string[]).includes(value);

export const contentDocumentKey = (document: Pick<ContentDocument, "kind" | "slug" | "language">) =>
  `${document.kind}:${document.slug}:${document.language}`;

export function contentText(value: ContentText[] | undefined) {
  return (value ?? []).map((part) => part.text).join("");
}

export function contentBlockText(block: ContentBlock) {
  if (block.type === "heading2") return block.text;
  if (block.type === "links") return block.items.map((item) => item.text).join(" ");
  return contentText(block.richText);
}

export function contentBodyText(document: ContentDocument) {
  return document.body.map(contentBlockText).filter(Boolean).join("\n\n");
}

export function contentPlainText(document: ContentDocument) {
  return [document.title, document.lead, document.description, contentBodyText(document)]
    .filter(Boolean)
    .join("\n\n");
}

export function truncateText(value: string, limit: number) {
  const text = value.replace(/\s+/g, " ").trim();
  return text.length > limit ? `${text.slice(0, limit - 1).trimEnd()}…` : text;
}

export function validateContentDocument(value: unknown, index = 0): string[] {
  if (!value || typeof value !== "object") return [`document ${index} is not an object`];
  const document = value as Partial<ContentDocument>;
  const errors: string[] = [];
  if (!document.title?.trim()) errors.push(`document ${index} has no title`);
  if (!document.slug?.trim()) errors.push(`document ${index} has no slug`);
  if (!isContentLanguage(document.language)) errors.push(`document ${index} has an invalid language`);
  if (!isContentKind(document.kind)) errors.push(`document ${index} has an invalid kind`);
  if (!isContentPlacement(document.placement)) errors.push(`document ${index} has an invalid placement`);
  if (typeof document.description !== "string") errors.push(`document ${index} has no description`);
  if (!Array.isArray(document.tags) || document.tags.some((tag) => typeof tag !== "string")) {
    errors.push(`document ${index} has invalid tags`);
  }
  if (document.status !== "draft" && document.status !== "publish") {
    errors.push(`document ${index} has an invalid status`);
  }
  if (!Array.isArray(document.body)) errors.push(`document ${index} has no body`);
  return errors;
}

export function validateContentSnapshot(value: unknown): string[] {
  if (!value || typeof value !== "object") return ["snapshot is not an object"];
  const snapshot = value as Partial<ContentSnapshot>;
  if (snapshot.version !== CONTENT_SNAPSHOT_VERSION) return [`snapshot version is not ${CONTENT_SNAPSHOT_VERSION}`];
  if (snapshot.source !== "seed" && snapshot.source !== "notion") return ["snapshot source is invalid"];
  if (!Array.isArray(snapshot.documents)) return ["snapshot documents are not an array"];
  return snapshot.documents.flatMap((document, index) => validateContentDocument(document, index));
}

export function isContentSnapshot(value: unknown): value is ContentSnapshot {
  return validateContentSnapshot(value).length === 0;
}
