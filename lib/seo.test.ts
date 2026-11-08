import { test } from "node:test";
import assert from "node:assert/strict";
import { faqs, guides } from "./content.ts";
import { destinations } from "./rates.ts";
import { GUIDES_PUBLISHED, GUIDES_UPDATED, guideDescription, guideJsonLd, homeJsonLd, indexSentences, marketBrief } from "./seo.ts";

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

test("market brief names the lowest median and every port's quote count", () => {
  const ports = destinations.map((port, i) => ({
    port,
    median: [8500, 6800, 7300, 7900, 7960][i],
    weekChange: null,
    sampleSize: [14, 7, 27, 3, 7][i],
    weeklyMedians: [],
  }));
  assert.equal(
    marketBrief(ports, "2026-11-08", "en"),
    "As of 2026-11-08, Sokhna has the lowest 40HQ median of the 5 ports, at US$6,800 per container (7 quotes). Quote counts: Jeddah 14, Sokhna 7, Aqaba 27, Djibouti 3, Port Sudan 7.",
  );
  assert.match(marketBrief(ports, "2026-11-08", "zh"), /^截至 2026-11-08，5 个港口里 40HQ 中位数最低的是苏赫纳，每柜 US\$6,800（7 条）。各港报价数：吉达 14 条，苏赫纳 7 条，亚喀巴 27 条，吉布提 3 条，苏丹港 7 条。$/);
  const tied = ports.map((entry, i) => i < 2 ? { ...entry, median: 6800 } : entry);
  assert.match(marketBrief(tied, "2026-11-08", "en"), /Jeddah and Sokhna share the lowest 40HQ median of the 5 ports, at US\$6,800 per container\./);
  assert.match(marketBrief([ports[1]], "2026-11-08", "zh"), /只有苏赫纳有 40HQ 中位数/);
  assert.match(marketBrief(index, "2026-11-08", "en"), /Jeddah is the only one of the 2 ports with a 40HQ median, at US\$8,550 per container \(7 quotes\)\. Quote counts: Jeddah 7, Sokhna 0\./);
  const empty = index.map((entry) => ({ ...entry, median: null, sampleSize: null }));
  assert.match(marketBrief(empty, "2026-11-08", "zh"), /2 个港口近 28 天都没有 40HQ 市场报价/);
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
