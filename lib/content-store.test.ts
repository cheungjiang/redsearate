import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { seedContentDocuments } from "./content-seed.ts";
import { CONTENT_SNAPSHOT_VERSION, type ContentSnapshot } from "./content-model.ts";
import { readContentState } from "./content-store.ts";

const document = seedContentDocuments()[0];

function snapshot(source: "seed" | "notion", documents = [document]): ContentSnapshot {
  return {
    version: CONTENT_SNAPSHOT_VERSION,
    generatedAt: "2026-11-23T00:00:00.000Z",
    source,
    documents,
  };
}

test("a valid live snapshot wins over the committed snapshot", () => {
  const dir = mkdtempSync(join(tmpdir(), "content-store-"));
  const live = join(dir, "live.json");
  const fallback = join(dir, "fallback.json");
  writeFileSync(live, JSON.stringify(snapshot("notion", [{ ...document, title: "Live title" }])));
  writeFileSync(fallback, JSON.stringify(snapshot("seed")));
  const state = readContentState(live, fallback);
  assert.equal(state.active?.source, "notion");
  assert.equal(state.active?.documents[0].title, "Live title");
});

test("an invalid live file falls back to the committed snapshot", () => {
  const dir = mkdtempSync(join(tmpdir(), "content-store-"));
  const live = join(dir, "live.json");
  const fallback = join(dir, "fallback.json");
  writeFileSync(live, "{not json");
  writeFileSync(fallback, JSON.stringify(snapshot("seed")));
  const state = readContentState(live, fallback);
  assert.equal(state.active?.source, "seed");
  assert.equal(state.active?.documents.length, 1);
});

test("an empty live snapshot does not blank the site", () => {
  const dir = mkdtempSync(join(tmpdir(), "content-store-"));
  const live = join(dir, "live.json");
  const fallback = join(dir, "fallback.json");
  writeFileSync(live, JSON.stringify(snapshot("notion", [])));
  writeFileSync(fallback, JSON.stringify(snapshot("seed")));
  const state = readContentState(live, fallback);
  assert.equal(state.active?.source, "seed");
});
