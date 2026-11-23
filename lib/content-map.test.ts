import { test } from "node:test";
import assert from "node:assert/strict";
import { guides, faqs } from "./content.ts";
import {
  documentsToBriefNote,
  documentsToFaqItems,
  documentsToGuides,
  documentsToHomeFaqs,
  documentsToMethodology,
} from "./content-map.ts";
import { seedContentDocuments } from "./content-seed.ts";
import { validateContentSnapshot } from "./content-model.ts";
import { staticFaqItems } from "./faq-content.ts";
import { methodologyContent } from "./methodology-content.ts";

test("the seed round-trips every guide without losing bilingual copy", () => {
  const documents = seedContentDocuments();
  const mapped = documentsToGuides(documents);
  assert.equal(documents.length, 72);
  assert.equal(mapped.length, guides.length);
  for (const guide of guides) {
    assert.deepEqual(mapped.find((item) => item.slug === guide.slug), guide);
  }
});

test("the seed round-trips home FAQs, FAQ page items and methodology", () => {
  const documents = seedContentDocuments();
  assert.deepEqual(documentsToHomeFaqs(documents), faqs);
  assert.deepEqual(documentsToFaqItems(documents, "en"), staticFaqItems("en"));
  assert.deepEqual(documentsToFaqItems(documents, "zh"), staticFaqItems("zh"));
  assert.deepEqual(documentsToMethodology(documents), methodologyContent);
});

test("a draft guide is not mapped, even when its other language is published", () => {
  const documents = seedContentDocuments();
  const draftSlug = "fcl-vs-lcl-red-sea";
  const withDraft = documents.map((document) =>
    document.kind === "guide" && document.slug === draftSlug && document.language === "en"
      ? { ...document, status: "draft" as const }
      : document,
  );
  assert.equal(documentsToGuides(withDraft).some((guide) => guide.slug === draftSlug), false);
});

test("a guide with mismatched section counts is skipped instead of producing broken copy", () => {
  const documents = seedContentDocuments();
  const slug = "direct-vs-transhipment-red-sea";
  const withMissingSection = documents.map((document) =>
    document.kind === "guide" && document.slug === slug && document.language === "zh"
      ? { ...document, body: document.body.slice(0, -1) }
      : document,
  );
  assert.equal(documentsToGuides(withMissingSection).some((guide) => guide.slug === slug), false);
});

test("the weekly narrative comes from a published brief document", () => {
  const note = documentsToBriefNote(seedContentDocuments(), "2026-11-23");
  assert.match(note.en ?? "", /Sokhna was the only port to rise/);
  assert.match(note.zh ?? "", /本周只有苏赫纳上涨/);
});

test("snapshot validation rejects a document with an invalid language", () => {
  const snapshot = {
    version: 1,
    generatedAt: "2026-11-23T00:00:00.000Z",
    source: "seed",
    documents: [{
      title: "Test",
      slug: "test",
      language: "fr",
      kind: "guide",
      placement: "guide",
      description: "Test",
      tags: [],
      status: "publish",
      body: [],
    }],
  };
  assert.match(validateContentSnapshot(snapshot).join("\n"), /invalid language/);
});
