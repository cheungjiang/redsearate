import { guides, faqs, type Guide, type GuideBlock, type GuideSection } from "./content.ts";
import {
  contentBodyText,
  truncateText,
  type ContentBacklogItem,
  type ContentBlock,
  type ContentDocument,
  type ContentLanguage,
} from "./content-model.ts";
import { staticFaqItems } from "./faq-content.ts";
import { briefTitle } from "./market-brief.ts";
import { readMarketBriefs } from "./market-brief.server.ts";
import { methodologyContent, type MethodologyDoc } from "./methodology-content.ts";

const text = (value: string) => [{ text: value }];

function sectionBlocks(block: GuideBlock, lang: ContentLanguage): ContentBlock[] {
  if (block.kind === "p") return [{ type: "paragraph", richText: text(block.text[lang]) }];
  if (block.kind === "ul") {
    return block.items.map((item) => ({ type: "bulleted_list_item", richText: text(item[lang]) }));
  }
  if (block.kind === "ol") {
    return block.items.map((item) => ({ type: "numbered_list_item", richText: text(item[lang]) }));
  }
  return [{
    type: "links",
    items: block.items.map((item) => ({ text: item.text[lang], href: item.href })),
  }];
}

function sectionsBody(sections: GuideSection[], lang: ContentLanguage): ContentBlock[] {
  return sections.flatMap((section) => [
    { type: "heading2" as const, text: section.heading[lang] },
    ...section.blocks.flatMap((block) => sectionBlocks(block, lang)),
  ]);
}

function guideFaqBody(guide: Guide, lang: ContentLanguage): ContentBlock[] {
  if (!guide.faqs?.length) return [];
  return [
    { type: "heading2", text: lang === "zh" ? "常见问题" : "FAQ" },
    ...guide.faqs.flatMap((faq) => [
      { type: "paragraph" as const, richText: text(lang === "zh" ? `问：${faq.q.zh}` : `Q: ${faq.q.en}`) },
      { type: "paragraph" as const, richText: text(lang === "zh" ? `答：${faq.a.zh}` : `A: ${faq.a.en}`) },
    ]),
  ];
}

function guideDocuments(): ContentDocument[] {
  return guides.flatMap((guide, index) =>
    (["en", "zh"] as const).map((lang) => ({
      title: guide.title[lang],
      slug: guide.slug,
      language: lang,
      kind: "guide" as const,
      placement: "guide" as const,
      description: guide.lead[lang],
      lead: guide.lead[lang],
      tags: [guide.tag[lang]],
      status: "publish" as const,
      published: guide.published,
      updated: guide.updated,
      order: index + 1,
      body: [...sectionsBody(guide.sections, lang), ...guideFaqBody(guide, lang)],
    })),
  );
}

function homeFaqDocuments(): ContentDocument[] {
  return faqs.flatMap((faq, index) =>
    (["en", "zh"] as const).map((lang) => ({
      title: faq.q[lang],
      slug: `home-faq-${index + 1}`,
      language: lang,
      kind: "faq" as const,
      placement: "home" as const,
      description: truncateText(faq.a[lang], lang === "zh" ? 80 : 155),
      tags: ["Home FAQ"],
      status: "publish" as const,
      order: index + 1,
      body: [{ type: "paragraph" as const, richText: text(faq.a[lang]) }],
    })),
  );
}

function faqPageDocuments(): ContentDocument[] {
  return (["en", "zh"] as const).flatMap((lang) =>
    staticFaqItems(lang).map((faq, index) => ({
      title: faq.q,
      slug: `faq-${index + 1}`,
      language: lang,
      kind: "faq" as const,
      placement: "faq" as const,
      description: truncateText(faq.a, lang === "zh" ? 80 : 155),
      tags: ["FAQ"],
      status: "publish" as const,
      order: index + 1,
      body: [{ type: "paragraph" as const, richText: text(faq.a) }],
    })),
  );
}

function methodologyDocuments(): ContentDocument[] {
  const content: MethodologyDoc = methodologyContent;
  return (["en", "zh"] as const).map((lang) => ({
    title: content.title[lang],
    slug: content.slug,
    language: lang,
    kind: "methodology" as const,
    placement: "methodology" as const,
    description: content.description[lang],
    lead: content.lead[lang],
    tags: [content.tag[lang]],
    status: "publish" as const,
    published: content.published,
    updated: content.updated,
    order: 1,
    body: sectionsBody(content.sections, lang),
  }));
}

function briefDocuments(): ContentDocument[] {
  return readMarketBriefs().flatMap((brief) => {
    if (!brief.note) return [];
    return (["en", "zh"] as const).map((lang) => {
      const note = brief.note![lang];
      return {
        title: briefTitle(brief.date, lang),
        slug: brief.date,
        language: lang,
        kind: "brief" as const,
        placement: "brief" as const,
        description: truncateText(note, lang === "zh" ? 80 : 155),
        tags: ["Market brief"],
        status: "publish" as const,
        published: brief.date,
        updated: brief.dataAsOf ?? brief.date,
        order: 1,
        body: note.split(/\n{2,}/).map((paragraph) => ({
          type: "paragraph" as const,
          richText: text(paragraph.trim()),
        })),
      };
    });
  });
}

export function seedContentDocuments(): ContentDocument[] {
  return [
    ...guideDocuments(),
    ...homeFaqDocuments(),
    ...faqPageDocuments(),
    ...methodologyDocuments(),
    ...briefDocuments(),
  ];
}

export const seedContentBacklog: ContentBacklogItem[] = [
  {
    topic: "China to Jeddah transit time",
    targetKeyword: "中国到吉达海运要多久",
    language: "zh",
    status: "idea",
    priority: "P0",
  },
  {
    topic: "Red Sea freight rate weekly outlook",
    targetKeyword: "红海海运费走势",
    language: "zh",
    status: "idea",
    priority: "P0",
  },
  {
    topic: "China to Sokhna ACID checklist",
    targetKeyword: "中国到埃及海运 ACID",
    language: "zh",
    status: "idea",
    priority: "P1",
  },
  {
    topic: "Port Sudan clearance and local charges",
    targetKeyword: "苏丹港清关费用",
    language: "zh",
    status: "idea",
    priority: "P1",
  },
  {
    topic: "China to Jeddah 20GP vs 40HQ",
    targetKeyword: "Jeddah 20GP 40HQ rate",
    language: "en",
    status: "idea",
    priority: "P1",
  },
  {
    topic: "Djibouti to Ethiopia transit",
    targetKeyword: "Djibouti Ethiopia transit",
    language: "en",
    status: "idea",
    priority: "P1",
  },
];

export function seedDocumentText(document: ContentDocument) {
  return contentBodyText(document);
}
