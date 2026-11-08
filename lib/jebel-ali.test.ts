import { test } from "node:test";
import assert from "node:assert/strict";
import {
  JEBEL_ALI_PRICE,
  jebelAliDescription,
  jebelAliSailings,
  openJebelAliSailings,
} from "./jebel-ali.ts";

test("Jebel Ali sailings are five 40HQ offers at the same price, Shenzhen a later ETD", () => {
  assert.equal(jebelAliSailings.length, 5);
  assert.deepEqual(jebelAliSailings.map((sailing) => sailing.origin), [
    "Qingdao", "Shanghai", "Ningbo", "Shenzhen", "Guangzhou (Nansha)",
  ]);
  assert.equal(JEBEL_ALI_PRICE, 7800);
  assert.deepEqual(openJebelAliSailings("2026-11-15").map((sailing) => sailing.origin), [
    "Qingdao", "Shanghai", "Ningbo", "Shenzhen", "Guangzhou (Nansha)",
  ]);
  assert.deepEqual(openJebelAliSailings("2026-11-16").map((sailing) => sailing.origin), ["Shenzhen"]);
  assert.deepEqual(openJebelAliSailings("2026-11-18").map((sailing) => sailing.origin), ["Shenzhen"]);
  assert.deepEqual(openJebelAliSailings("2026-11-19"), []);
});

test("Jebel Ali descriptions stay within the snippet limits", () => {
  assert.ok(jebelAliDescription("2026-11-08", "en").length <= 155);
  assert.ok(jebelAliDescription("2026-11-08", "zh").length <= 80);
  assert.ok(jebelAliDescription("2026-11-20", "en").length <= 155);
  assert.ok(jebelAliDescription("2026-11-20", "zh").length <= 80);
  assert.match(jebelAliDescription("2026-11-08", "zh"), /US\$7,800/);
  assert.match(jebelAliDescription("2026-11-20", "en"), /have passed/);
});
