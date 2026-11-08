import { test } from "node:test";
import assert from "node:assert/strict";
import { faqs, guides } from "./content.ts";
import { destinations } from "./rates.ts";
import { GUIDES_PUBLISHED, GUIDES_UPDATED, guideDescription, guideJsonLd, homeJsonLd, indexSentences } from "./seo.ts";

const [jeddah, sokhna] = destinations;
const index = [
  { port: jeddah, median: 8550, weekChange: -2.5, sampleSize: 7, weeklyMedians: [] },
  { port: sokhna, median: null, weekChange: null, sampleSize: null, weeklyMedians: [] },
];

test("index sentences state the median and sample size, or say there are none yet", () => {
  assert.deepEqual(indexSentences(index, "2026-11-07", "en"), [
    "As of 2026-11-07, the median 40HQ ocean freight market rate from China to Jeddah is US$8,550 per container (7 quotes in the last 28 days, -2.5% week on week).",
    "Sokhna: no 40HQ market quotes in the last 28 days yet.",
  ]);
  assert.match(indexSentences(index, "2026-11-07", "zh")[0], /截至 2026-11-07，中国至吉达 40HQ 海运市场中位数为每柜 US\$8,550/);
});

test("home JSON-LD carries every FAQ in the page language", () => {
  const faq = homeJsonLd("zh")["@graph"].find((node) => node["@type"] === "FAQPage") as { mainEntity: { name: string }[] };
  assert.deepEqual(faq.mainEntity.map((q) => q.name), faqs.map((f) => f.q.zh));
});

function guidePlain(guide: (typeof guides)[number], lang: "en" | "zh") {
  const bits = [guide.lead[lang]];
  for (const section of guide.sections) {
    bits.push(section.heading[lang]);
    for (const block of section.blocks) {
      if (block.kind === "p") bits.push(block.text[lang]);
      if (block.kind === "ul") bits.push(...block.items.map((item) => item[lang]));
      if (block.kind === "links") bits.push(...block.items.map((item) => item.text[lang]));
    }
  }
  return bits.join("\n");
}

test("guide slugs are unique and descriptions fit search snippets", () => {
  assert.equal(new Set(guides.map((g) => g.slug)).size, guides.length);
  for (const guide of guides) {
    assert.ok(guideDescription(guide, "en").length <= 155, guide.slug);
    assert.ok(guideDescription(guide, "zh").length <= 80, guide.slug);
    const words = guidePlain(guide, "en").split(/\s+/).filter(Boolean).length;
    const chars = guidePlain(guide, "zh").replace(/\s/g, "").length;
    assert.ok(words >= 1000, `${guide.slug} en ${words}`);
    assert.ok(chars >= 1500, `${guide.slug} zh ${chars}`);
    const article = guideJsonLd(guide, "en")["@graph"].find((node) => node["@type"] === "Article") as { datePublished: string; dateModified: string };
    assert.equal(article.datePublished, GUIDES_PUBLISHED);
    assert.equal(article.dateModified, GUIDES_UPDATED);
  }
});
