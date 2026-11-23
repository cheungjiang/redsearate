// Exports every human-written page currently in lib/*.ts into:
//   data/content-snapshot.json  - committed fallback used by the build
//   data/notion-content-seed.json - importable seed for the Notion Content DB
//
// Run this for the initial migration or when deliberately regenerating the
// seed from code. After Notion is the source of truth, this would overwrite
// the fallback snapshot with the old code seed.
//
// Usage: npm run export-content-seed
import { mkdirSync, writeFileSync } from "node:fs";
import { seedContentBacklog, seedContentDocuments } from "../lib/content-seed.ts";
import {
  CONTENT_KINDS,
  CONTENT_LANGUAGES,
  CONTENT_PLACEMENTS,
  CONTENT_SNAPSHOT_VERSION,
  type ContentSnapshot,
} from "../lib/content-model.ts";

const generatedAt = process.env.CONTENT_SEED_GENERATED_AT ?? new Date().toISOString();
const documents = seedContentDocuments();
const snapshot: ContentSnapshot = {
  version: CONTENT_SNAPSHOT_VERSION,
  generatedAt,
  source: "seed",
  documents,
};

const seed = {
  version: CONTENT_SNAPSHOT_VERSION,
  generatedAt,
  database: {
    title: "RedSeaRate Content",
    properties: {
      Title: { type: "title" },
      Slug: { type: "rich_text" },
      Language: { type: "select", options: CONTENT_LANGUAGES },
      Kind: { type: "select", options: CONTENT_KINDS },
      Placement: { type: "select", options: CONTENT_PLACEMENTS },
      Description: { type: "rich_text" },
      Lead: { type: "rich_text", optional: true },
      Tags: { type: "multi_select" },
      Status: { type: "select", options: ["draft", "publish"] },
      Published: { type: "date", optional: true },
      Updated: { type: "date", optional: true },
      Order: { type: "number", optional: true },
    },
    body: "Notion page body: heading_2, paragraph, bulleted_list_item, numbered_list_item. Put guide FAQs under a final heading 'FAQ' or '常见问题' using Q:/A: or 问：/答： paragraphs.",
  },
  backlogDatabase: {
    title: "RedSeaRate Content Backlog",
    properties: {
      Topic: { type: "title" },
      "Target Keyword": { type: "rich_text" },
      Language: { type: "select", options: CONTENT_LANGUAGES },
      Status: { type: "select", options: ["idea", "drafting", "review", "published"] },
      Notes: { type: "rich_text", optional: true },
      Priority: { type: "select", options: ["P0", "P1", "P2"], optional: true },
    },
  },
  documents,
  backlog: seedContentBacklog,
};

mkdirSync("data", { recursive: true });
writeFileSync("data/content-snapshot.json", `${JSON.stringify(snapshot, null, 2)}\n`);
writeFileSync("data/notion-content-seed.json", `${JSON.stringify(seed, null, 2)}\n`);

const counts = documents.reduce<Record<string, number>>((all, document) => {
  const key = `${document.kind}/${document.language}`;
  all[key] = (all[key] ?? 0) + 1;
  return all;
}, {});
console.log(`Wrote data/content-snapshot.json with ${documents.length} documents.`);
console.log(`Wrote data/notion-content-seed.json with ${documents.length} pages and ${seedContentBacklog.length} backlog rows.`);
for (const [key, count] of Object.entries(counts).sort()) console.log(`  ${key}: ${count}`);
