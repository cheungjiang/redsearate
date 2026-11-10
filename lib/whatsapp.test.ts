import assert from "node:assert/strict";
import test from "node:test";
import { pickWhatsapp, whatsappUrl } from "./whatsapp.ts";

const numbers = [
  "+86 132 3740 1856",
  "+86 158 1879 6370",
  "+86 158 7620 7182",
  "+86 134 5470 1600",
];

test("each draw is one of the four numbers and does not stick to the first result", () => {
  const seen = new Set<string>();
  for (let i = 0; i < 80; i++) seen.add(pickWhatsapp(numbers));
  assert.deepEqual([...seen].sort(), [...numbers].sort());
});

test("an empty list draws nothing", () => {
  assert.equal(pickWhatsapp([]), "");
});

test("whatsapp links use the drawn number and the inquiry text", () => {
  const url = new URL(whatsappUrl("+86 158 1879 6370", "40HQ to Jeddah"));
  assert.equal(url.origin + url.pathname, "https://wa.me/8615818796370");
  assert.equal(url.searchParams.get("text"), "40HQ to Jeddah");
  assert.equal(whatsappUrl("", "hello"), "");
});
