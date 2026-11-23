// Server-only content access. The live file is written by the Notion fetch
// step; the committed snapshot is the fallback when Notion is unavailable.
// Keeping the fallback file-based means a Notion outage cannot fail a build.
import { existsSync, readFileSync } from "node:fs";
import type { Guide } from "./content.ts";
import {
  documentsToBriefNote,
  documentsToFaqItems,
  documentsToGuides,
  documentsToHomeFaqs,
  documentsToMethodology,
  type BriefNote,
  type HomeFaq,
} from "./content-map.ts";
import {
  isContentSnapshot,
  validateContentSnapshot,
  type ContentDocument,
  type ContentSnapshot,
} from "./content-model.ts";
import type { FaqItem } from "./faq-content.ts";
import { methodologyContent, type MethodologyDoc } from "./methodology-content.ts";

const LIVE_FILE = process.env.NOTION_CONTENT_FILE ?? ".data/notion-content.json";
const SNAPSHOT_FILE = process.env.NOTION_CONTENT_SNAPSHOT ?? "data/content-snapshot.json";

type ContentState = {
  active: ContentSnapshot | null;
  fallback: ContentSnapshot | null;
};

let cached: ContentState | null = null;

function readSnapshot(file: string): ContentSnapshot | null {
  if (!existsSync(file)) return null;
  try {
    const value: unknown = JSON.parse(readFileSync(file, "utf8"));
    if (!isContentSnapshot(value)) {
      const errors = validateContentSnapshot(value);
      console.warn(`Content snapshot ${file} is invalid: ${errors.slice(0, 3).join("; ")}`);
      return null;
    }
    return value;
  } catch (error) {
    console.warn(`Could not read content snapshot ${file}: ${error instanceof Error ? error.message : String(error)}`);
    return null;
  }
}

export function readContentState(liveFile = LIVE_FILE, snapshotFile = SNAPSHOT_FILE): ContentState {
  const fallback = readSnapshot(snapshotFile);
  const live = readSnapshot(liveFile);
  return {
    // A successful Notion fetch with at least one published page is
    // authoritative. An empty file means the fetch did not produce usable
    // content, so the committed snapshot stays in place.
    active: live && live.documents.length > 0 ? live : fallback,
    fallback,
  };
}

function state(): ContentState {
  if (cached) return cached;
  cached = readContentState();
  return cached;
}

export function resetContentCache() {
  cached = null;
}

export function contentDocuments(): ContentDocument[] {
  return state().active?.documents ?? [];
}

export function getGuides(): Guide[] {
  return documentsToGuides(contentDocuments());
}

export function getHomeFaqs(): HomeFaq[] {
  return documentsToHomeFaqs(contentDocuments());
}

export function getFaqPageItems(lang: "en" | "zh"): FaqItem[] {
  return documentsToFaqItems(contentDocuments(), lang);
}

export function getMethodology(): MethodologyDoc {
  const current = documentsToMethodology(contentDocuments());
  if (current) return current;
  const fallback = documentsToMethodology(state().fallback?.documents ?? []);
  return fallback ?? methodologyContent;
}

export function getBriefNote(date: string): BriefNote {
  const current = documentsToBriefNote(contentDocuments(), date);
  if (current.en || current.zh) return current;
  return documentsToBriefNote(state().fallback?.documents ?? [], date);
}

export function contentSource(): { source: ContentSnapshot["source"] | "seed"; generatedAt: string | null } {
  const active = state().active;
  return {
    source: active?.source ?? "seed",
    generatedAt: active?.generatedAt ?? null,
  };
}
