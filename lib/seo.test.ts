import { test } from "node:test";
import assert from "node:assert/strict";
import { faqs, guides } from "./content.ts";
import { destinations } from "./rates.ts";
import { guideDescription, homeJsonLd, indexSentences } from "./seo.ts";

const [jeddah, sokhna] = destinations;
const index = [
  { port: jeddah, median: 8550, weekChange: -2.5, sampleSize: 7, weeklyMedians: [] },
  { port: sokhna, median: null, weekChange: null, sampleSize: null, weeklyMedians: [] },
];

test("index sentences state the median and sample size, or say it is withheld", () => {
  assert.deepEqual(indexSentences(index, "2026-11-07", "en"), [
    "As of 2026-11-07, the median 40HQ ocean freight market rate from China to Jeddah is US$8,550 per container (7 quotes in the last 28 days, -2.5% week on week).",
    "Sokhna: fewer than 5 40HQ market quotes in the last 28 days, so no median is published yet.",
  ]);
  assert.match(indexSentences(index, "2026-11-07", "zh")[0], /截至 2026-11-07，中国至吉达 40HQ 海运市场中位数为每柜 US\$8,550/);
});

test("home JSON-LD carries every FAQ in the page language", () => {
  const faq = homeJsonLd("zh")["@graph"].find((node) => node["@type"] === "FAQPage") as { mainEntity: { name: string }[] };
  assert.deepEqual(faq.mainEntity.map((q) => q.name), faqs.map((f) => f.q.zh));
});

test("guide slugs are unique and descriptions fit search snippets", () => {
  assert.equal(new Set(guides.map((g) => g.slug)).size, guides.length);
  for (const guide of guides) {
    assert.ok(guideDescription(guide, "en").length <= 155);
    assert.ok(guideDescription(guide, "zh").length <= 80);
  }
});
