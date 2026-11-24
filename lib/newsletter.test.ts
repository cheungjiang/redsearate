import { test } from "node:test";
import assert from "node:assert/strict";
import { newsletterUrl } from "./newsletter.ts";

const urls = {
  en: "https://redsearate.substack.com/subscribe",
  zh: "https://redsearate.substack.com/subscribe/",
};

test("newsletter signup uses the selected language without cross-language fallback", () => {
  assert.equal(newsletterUrl("en", urls), urls.en);
  assert.equal(newsletterUrl("zh", urls), urls.zh);
  assert.equal(newsletterUrl("zh", { ...urls, zh: null }), null);
  assert.equal(newsletterUrl("en", { ...urls, en: "  " }), null);
  assert.equal(newsletterUrl("zh", { en: null, zh: null }), null);
  assert.equal(newsletterUrl("zh", { ...urls, zh: ` ${urls.zh} ` }), urls.zh);
});

test("newsletter signup only links to this publication's secure signup page", () => {
  for (const en of [
    "javascript:alert(1)",
    "http://redsearate.substack.com/subscribe",
    "https://redsearate.substack.com.example.org/subscribe",
    "https://another-publication.substack.com/subscribe",
    "https://example.org/subscribe/",
    "https://user:secret@redsearate.substack.com/subscribe",
    "https://redsearate.substack.com:8443/subscribe",
    "https://redsearate.substack.com/",
    "https://redsearate.substack.com/publish",
    "https://redsearate.substack.com/subscribe?next=https://example.org",
    "https://redsearate.substack.com/subscribe#other",
    "/subscribe/",
    "not configured",
  ]) assert.equal(newsletterUrl("en", { ...urls, en }), null, en);
});
