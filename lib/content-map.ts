import type { Guide, GuideBlock, GuideFaq, GuideSection, Localized } from "./content.ts";
import {
  contentBodyText,
  contentText,
  type ContentBlock,
  type ContentDocument,
  type ContentLanguage,
} from "./content-model.ts";
import type { FaqItem } from "./faq-content.ts";
import type { MethodologyDoc } from "./methodology-content.ts";

export type HomeFaq = { q: Localized; a: Localized };
export type BriefNote = Partial<Record<ContentLanguage, string>>;

const L = (en: string, zh: string): Localized => ({ en, zh });
const FAQ_HEADING = /^(faq|frequently asked questions|常见问题)$/i;
const QUESTION_PREFIX = /^(?:Q|问)\s*[:：]\s*/i;
const ANSWER_PREFIX = /^(?:A|答)\s*[:：]\s*/i;

type DocumentSection = { heading: string; blocks: ContentBlock[] };

function sectionsOf(document: ContentDocument): DocumentSection[] {
  const sections: DocumentSection[] = [];
  let current: DocumentSection | null = null;
  for (const block of document.body) {
    if (block.type === "heading2") {
      current = { heading: block.text.trim(), blocks: [] };
      sections.push(current);
    } else {
      if (!current) {
        current = { heading: "", blocks: [] };
        sections.push(current);
      }
      current.blocks.push(block);
    }
  }
  return sections;
}

function blockText(block: ContentBlock) {
  if (block.type === "heading2") return block.text;
  if (block.type === "links") return block.items.map((item) => item.text).join(" ");
  return contentText(block.richText);
}

function linkItems(block: ContentBlock) {
  if (block.type !== "bulleted_list_item") return null;
  if (block.richText.length !== 1 || !block.richText[0].href) return null;
  return { text: block.richText[0].text, href: block.richText[0].href };
}

function pairBlocks(en: ContentBlock[], zh: ContentBlock[]): GuideBlock[] | null {
  if (en.length !== zh.length) return null;
  const blocks: GuideBlock[] = [];
  for (let index = 0; index < en.length; index++) {
    const a = en[index];
    const b = zh[index];
    if (a.type !== b.type) return null;
    if (a.type === "paragraph" && b.type === "paragraph") {
      blocks.push({ kind: "p", text: L(contentText(a.richText), contentText(b.richText)) });
      continue;
    }
    if (a.type === "quote" && b.type === "quote") {
      blocks.push({ kind: "p", text: L(contentText(a.richText), contentText(b.richText)) });
      continue;
    }
    if (a.type === "links" && b.type === "links") {
      if (a.items.length !== b.items.length) return null;
      blocks.push({
        kind: "links",
        items: a.items.map((item, itemIndex) => ({
          href: item.href,
          text: L(item.text, b.items[itemIndex].text),
        })),
      });
      continue;
    }
    if (a.type === "bulleted_list_item" && b.type === "bulleted_list_item") {
      const groupEn: ContentBlock[] = [a];
      const groupZh: ContentBlock[] = [b];
      while (
        index + 1 < en.length &&
        en[index + 1].type === "bulleted_list_item" &&
        zh[index + 1].type === "bulleted_list_item"
      ) {
        index++;
        groupEn.push(en[index]);
        groupZh.push(zh[index]);
      }
      const linksEn = groupEn.map(linkItems);
      const linksZh = groupZh.map(linkItems);
      if (linksEn.every(Boolean) && linksZh.every(Boolean)) {
        blocks.push({
          kind: "links",
          items: linksEn.map((item, itemIndex) => ({
            href: item!.href,
            text: L(item!.text, linksZh[itemIndex]!.text),
          })),
        });
      } else {
        blocks.push({
          kind: "ul",
          items: groupEn.map((item, itemIndex) => L(blockText(item), blockText(groupZh[itemIndex]))),
        });
      }
      continue;
    }
    if (a.type === "numbered_list_item" && b.type === "numbered_list_item") {
      const groupEn: ContentBlock[] = [a];
      const groupZh: ContentBlock[] = [b];
      while (
        index + 1 < en.length &&
        en[index + 1].type === "numbered_list_item" &&
        zh[index + 1].type === "numbered_list_item"
      ) {
        index++;
        groupEn.push(en[index]);
        groupZh.push(zh[index]);
      }
      blocks.push({
        kind: "ol",
        items: groupEn.map((item, itemIndex) => L(blockText(item), blockText(groupZh[itemIndex]))),
      });
      continue;
    }
    return null;
  }
  return blocks;
}

function pairSections(en: ContentDocument, zh: ContentDocument): GuideSection[] | null {
  const enSections = sectionsOf(en);
  const zhSections = sectionsOf(zh);
  if (enSections.length !== zhSections.length) return null;
  const sections: GuideSection[] = [];
  for (let index = 0; index < enSections.length; index++) {
    const a = enSections[index];
    const b = zhSections[index];
    const blocks = pairBlocks(a.blocks, b.blocks);
    if (!blocks) return null;
    sections.push({ heading: L(a.heading, b.heading), blocks });
  }
  return sections;
}

function extractFaqs(sections: GuideSection[]): { sections: GuideSection[]; faqs: GuideFaq[] } {
  const index = sections.findIndex((section) => FAQ_HEADING.test(section.heading.en) || FAQ_HEADING.test(section.heading.zh));
  if (index < 0) return { sections, faqs: [] };
  const faqSection = sections[index];
  const faqs: GuideFaq[] = [];
  let question: Localized | null = null;
  for (const block of faqSection.blocks) {
    if (block.kind !== "p") continue;
    const text = block.text;
    const enQuestion = QUESTION_PREFIX.test(text.en);
    const zhQuestion = QUESTION_PREFIX.test(text.zh);
    const enAnswer = ANSWER_PREFIX.test(text.en);
    const zhAnswer = ANSWER_PREFIX.test(text.zh);
    if (enQuestion && zhQuestion) {
      question = {
        en: text.en.replace(QUESTION_PREFIX, "").trim(),
        zh: text.zh.replace(QUESTION_PREFIX, "").trim(),
      };
      continue;
    }
    if (question && enAnswer && zhAnswer) {
      faqs.push({
        q: question,
        a: {
          en: text.en.replace(ANSWER_PREFIX, "").trim(),
          zh: text.zh.replace(ANSWER_PREFIX, "").trim(),
        },
      });
      question = null;
    }
  }
  if (!faqs.length) return { sections, faqs: [] };
  return { sections: sections.filter((_, sectionIndex) => sectionIndex !== index), faqs };
}

function guideFromPair(en: ContentDocument, zh: ContentDocument): Guide | null {
  const sections = pairSections(en, zh);
  if (!sections) return null;
  // The FAQ section is extracted from the paired sections, so the FAQ list is
  // already bilingual. Run the parser once and keep the result.
  const parsed = extractFaqs(sections);
  const published = en.published ?? zh.published;
  const updated = [en.updated, zh.updated].filter(Boolean).sort().at(-1);
  return {
    slug: en.slug,
    tag: L(en.tags[0] ?? "GUIDE", zh.tags[0] ?? en.tags[0] ?? "指南"),
    title: L(en.title, zh.title),
    lead: L(en.lead ?? en.description, zh.lead ?? zh.description),
    ...(published ? { published } : {}),
    ...(updated ? { updated } : {}),
    ...(parsed.faqs.length ? { faqs: parsed.faqs } : {}),
    sections: parsed.sections,
  };
}

function groupBySlug(documents: ContentDocument[], kind: ContentDocument["kind"]) {
  const groups = new Map<string, Partial<Record<ContentLanguage, ContentDocument>>>();
  for (const document of documents) {
    if (document.kind !== kind || document.status !== "publish") continue;
    const group = groups.get(document.slug) ?? {};
    group[document.language] = document;
    groups.set(document.slug, group);
  }
  return groups;
}

export function documentsToGuides(documents: ContentDocument[]): Guide[] {
  const groups = groupBySlug(documents, "guide");
  const guides: Guide[] = [];
  for (const group of groups.values()) {
    if (!group.en || !group.zh) continue;
    const guide = guideFromPair(group.en, group.zh);
    if (guide) guides.push(guide);
  }
  return guides.sort((a, b) => {
    const orderA = documents.find((doc) => doc.kind === "guide" && doc.slug === a.slug && doc.language === "en")?.order ?? 9999;
    const orderB = documents.find((doc) => doc.kind === "guide" && doc.slug === b.slug && doc.language === "en")?.order ?? 9999;
    return orderA - orderB || a.slug.localeCompare(b.slug);
  });
}

export function documentsToHomeFaqs(documents: ContentDocument[]): HomeFaq[] {
  const groups = groupBySlug(documents, "faq");
  const faqs: HomeFaq[] = [];
  for (const group of groups.values()) {
    if (!group.en || !group.zh) continue;
    if (group.en.placement !== "home" || group.zh.placement !== "home") continue;
    faqs.push({
      q: L(group.en.title, group.zh.title),
      a: L(contentBodyText(group.en) || group.en.description, contentBodyText(group.zh) || group.zh.description),
    });
  }
  return faqs;
}

export function documentsToFaqItems(documents: ContentDocument[], lang: ContentLanguage): FaqItem[] {
  return documents
    .filter((document) => document.kind === "faq" && document.placement === "faq" && document.language === lang && document.status === "publish")
    .sort((a, b) => (a.order ?? 9999) - (b.order ?? 9999) || a.slug.localeCompare(b.slug))
    .map((document) => ({
      q: document.title,
      a: contentBodyText(document) || document.description,
    }));
}

export function documentsToMethodology(documents: ContentDocument[]): MethodologyDoc | null {
  const en = documents.find((document) => document.kind === "methodology" && document.slug === "methodology" && document.language === "en" && document.status === "publish");
  const zh = documents.find((document) => document.kind === "methodology" && document.slug === "methodology" && document.language === "zh" && document.status === "publish");
  if (!en || !zh) return null;
  const sections = pairSections(en, zh);
  if (!sections) return null;
  return {
    slug: "methodology",
    tag: L(en.tags[0] ?? "DATA & METHOD", zh.tags[0] ?? "数据与方法"),
    title: L(en.title, zh.title),
    description: L(en.description, zh.description),
    lead: L(en.lead ?? en.description, zh.lead ?? zh.description),
    published: en.published ?? zh.published ?? "2026-11-08",
    updated: [en.updated, zh.updated].filter(Boolean).sort().at(-1) ?? "2026-11-23",
    sections,
  };
}

export function documentsToBriefNote(documents: ContentDocument[], date: string): BriefNote {
  const note: BriefNote = {};
  for (const document of documents) {
    if (document.kind !== "brief" || document.slug !== date || document.status !== "publish") continue;
    const text = contentBodyText(document) || document.description;
    if (text) note[document.language] = text;
  }
  return note;
}

// Kept for tests and seed verification: a guide is only usable when both
// languages have the same section and block structure.
export function guidePairIsComplete(en: ContentDocument, zh: ContentDocument) {
  return guideFromPair(en, zh) !== null;
}

export function contentDocumentText(document: ContentDocument) {
  return contentBodyText(document);
}
