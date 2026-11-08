import { test } from "node:test";
import assert from "node:assert/strict";
import { jebelAliInquiryText } from "./inquiry.ts";
import {
  JEBEL_ALI_CARRIER,
  JEBEL_ALI_DIRECT,
  JEBEL_ALI_PRICE,
  JEBEL_ALI_SLUG,
  JEBEL_ALI_TRANSIT_DAYS,
  jebelAliDescription,
  jebelAliEarliestEtd,
  jebelAliFaqs,
  jebelAliMoney,
  jebelAliQuote,
  jebelAliSailings,
} from "./jebel-ali.ts";

const facts = { transitDays: JEBEL_ALI_TRANSIT_DAYS, direct: JEBEL_ALI_DIRECT, carrier: JEBEL_ALI_CARRIER };

test("Jebel Ali keeps five sailings and a 40HQ price until the data file changes", () => {
  assert.equal(jebelAliSailings.length, 5);
  assert.deepEqual(jebelAliSailings.map((sailing) => sailing.origin), [
    "Qingdao", "Shanghai", "Ningbo", "Shenzhen", "Guangzhou (Nansha)",
  ]);
  assert.equal(JEBEL_ALI_PRICE, 7800);
  assert.equal(JEBEL_ALI_TRANSIT_DAYS, 26);
  assert.equal(JEBEL_ALI_DIRECT, true);
  assert.equal(JEBEL_ALI_CARRIER, "HPL");
  assert.equal(jebelAliEarliestEtd(), "2026-11-15");
  assert.equal(jebelAliQuote("Shanghai", "40HQ")?.price, 7800);
  assert.equal(jebelAliQuote("Shenzhen", "40HQ")?.etd, "2026-11-18");
  assert.equal(jebelAliQuote("Ningbo", "20GP")?.price, null);
  assert.equal(jebelAliQuote("Ningbo", "40GP")?.price, null);
  assert.equal(jebelAliQuote("Jeddah", "40HQ"), null);
  assert.equal(JEBEL_ALI_SLUG, "jebel-ali");
});

test("Jebel Ali descriptions stay within the snippet limits and name no invented rate", () => {
  assert.ok(jebelAliDescription("2026-11-08", "en").length <= 155);
  assert.ok(jebelAliDescription("2026-11-08", "zh").length <= 80);
  assert.match(jebelAliDescription("2026-11-08", "zh"), /参考价/);
  assert.match(jebelAliDescription("2026-11-08", "zh"), /不属于红海指数/);
  assert.doesNotMatch(jebelAliDescription("2026-11-08", "zh"), /7,800|US\$|实时|3,250/);
  assert.doesNotMatch(jebelAliDescription("2026-11-08", "en"), /7,800|US\$|live rate|3,250/);
});

test("Jebel Ali answers eight questions from the supplied facts", () => {
  const faqs = jebelAliFaqs("2026-11-20", "zh");
  const transit = faqs.find((faq) => faq.q.includes("航程"));
  const joined = faqs.map((faq) => faq.a).join("\n");
  assert.equal(faqs.length, 8);
  assert.match(joined, /2026-11-18/);
  assert.match(transit?.a ?? "", /26 天/);
  assert.match(transit?.a ?? "", /不中转/);
  assert.match(transit?.a ?? "", /HPL/);
  assert.match(joined, new RegExp(jebelAliMoney(JEBEL_ALI_PRICE).replace("$", "\\$")));
  assert.doesNotMatch(joined, /3,250|18–23|18-23|实时|保证舱位/);
  assert.match(jebelAliInquiryText("zh", "", facts), /请询价/);
  assert.doesNotMatch(jebelAliInquiryText("zh", "", facts), /7,800/);
  const quoted = jebelAliInquiryText("zh", "瓷砖", facts, {
    origin: "上海", container: "40HQ", quantity: 2, etd: "2026-11-15", price: JEBEL_ALI_PRICE,
  });
  assert.match(quoted, /US\$7,800/);
  assert.match(quoted, /2 × 40HQ/);
  assert.match(quoted, /HPL/);
  assert.doesNotMatch(quoted, /请询价|3,250/);
});
