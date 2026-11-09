import { test } from "node:test";
import assert from "node:assert/strict";
import { jebelAliInquiryText } from "./inquiry.ts";
import { jebelAliMarketStats, type JebelAliMarketQuote } from "./jebel-ali-prices.ts";
import {
  JEBEL_ALI_CARRIER,
  JEBEL_ALI_DIRECT,
  JEBEL_ALI_SLUG,
  JEBEL_ALI_TITLE,
  JEBEL_ALI_TRANSIT_DAYS,
  jebelAliCheapest,
  jebelAliDescription,
  jebelAliEarliestEtd,
  jebelAliFaqs,
  jebelAliMarketNote,
  jebelAliOverview,
  jebelAliQuote,
  jebelAliSailings,
  jebelAliTitle,
} from "./jebel-ali.ts";
import { jebelAliJsonLd } from "./seo.ts";

const facts = { transitDays: JEBEL_ALI_TRANSIT_DAYS, direct: JEBEL_ALI_DIRECT, carrier: JEBEL_ALI_CARRIER };

test("Jebel Ali keeps five sailings and a 40HQ price until the data file changes", () => {
  assert.equal(jebelAliSailings.length, 5);
  assert.deepEqual(jebelAliSailings.map((sailing) => sailing.origin), [
    "Qingdao", "Shanghai", "Ningbo", "Shenzhen", "Guangzhou (Nansha)",
  ]);
  assert.equal(JEBEL_ALI_TRANSIT_DAYS, 26);
  assert.equal(JEBEL_ALI_DIRECT, true);
  assert.equal(JEBEL_ALI_CARRIER, "HPL");
  assert.equal(jebelAliEarliestEtd(), "2026-11-15");
  assert.equal(jebelAliQuote("Shenzhen", "40HQ")?.etd, "2026-11-18");
  assert.equal(jebelAliQuote("Jeddah", "40HQ"), null);
  assert.equal(JEBEL_ALI_SLUG, "jebel-ali");
});

test("Jebel Ali descriptions stay within the snippet limits and name no invented rate", () => {
  assert.equal(jebelAliTitle("en"), `${JEBEL_ALI_TITLE.en} | RedSeaRate`);
  assert.equal(jebelAliTitle("zh"), `${JEBEL_ALI_TITLE.zh} | RedSeaRate`);
  assert.ok(jebelAliDescription("2026-11-08", "en").length <= 155);
  assert.ok(jebelAliDescription("2026-11-08", "zh").length <= 80);
  assert.match(jebelAliDescription("2026-11-08", "zh"), /不属于红海指数/);
  assert.doesNotMatch(jebelAliDescription("2026-11-08", "zh"), /7,800|US\$|实时|3,250|市场参考/);
  assert.doesNotMatch(jebelAliDescription("2026-11-08", "en"), /7,800|US\$|live rate|3,250|market reference/);
});

test("Jebel Ali answers eight questions from the supplied facts", () => {
  const faqs = jebelAliFaqs("2026-11-20", "zh", jebelAliMarketStats([], "2026-11-20"));
  const transit = faqs.find((faq) => faq.q.includes("航程"));
  const joined = faqs.map((faq) => faq.a).join("\n");
  assert.equal(faqs.length, 8);
  assert.match(joined, /2026-11-18/);
  assert.equal(joined.match(/市场参考/g)?.length, 1);
  assert.match(transit?.a ?? "", /26 天/);
  assert.match(transit?.a ?? "", /不中转/);
  assert.match(transit?.a ?? "", /HPL/);
  assert.doesNotMatch(joined, /3,250|18–23|18-23|实时|保证舱位|7,800|以我们确认的价格为准/);
  assert.match(jebelAliInquiryText("zh", "", facts), /请询价/);
  assert.match(jebelAliInquiryText("zh", "", facts), /以我们回复为准/);
  assert.doesNotMatch(jebelAliInquiryText("zh", "", facts), /7,800/);
  const quoted = jebelAliInquiryText("zh", "瓷砖", facts, {
    origin: "上海", container: "40HQ", quantity: 2, etd: "2026-11-15", price: 6850,
  });
  assert.match(quoted, /页面参考价：US\$6,850/);
  assert.match(quoted, /以我们回复为准/);
  assert.match(quoted, /2 × 40HQ/);
  assert.match(quoted, /HPL/);
  assert.doesNotMatch(quoted, /请询价|3,250/);
});

test("the market block uses the country median and will not headline a single low quote", () => {
  const quotes: JebelAliMarketQuote[] = [
    ...[7000, 7100, 6900].map((price) => ({
      origin: "Shanghai", container: "40HQ" as const, price, quoteDate: "2026-11-08", validUntil: "2026-11-30", carrier: "HPL",
    })),
    { origin: "Guangzhou (Nansha)", container: "40HQ", price: 4890, quoteDate: "2026-11-08", validUntil: null },
    { origin: "Shanghai", container: "20GP", price: 5100, quoteDate: "2026-11-08", validUntil: null },
    { origin: "Shanghai", container: "40HQ", price: 1000, quoteDate: "2026-09-01", validUntil: null },
  ];
  const stats = jebelAliMarketStats(quotes, "2026-11-09");
  assert.equal(stats.containers["40HC"]?.median, 6950);
  assert.equal(stats.containers["40HC"]?.count, 4);
  assert.equal(stats.containers["20GP"]?.median, 5100);
  assert.equal(stats.containers["20GP"]?.count, 1);
  assert.deepEqual(stats.origins.map((origin) => origin.origin), ["Guangzhou (Nansha)", "Shanghai"]);
  assert.deepEqual(stats.origins[0].carriers, []);
  assert.deepEqual(stats.origins[1].carriers, ["HPL"]);
  const overview = jebelAliOverview(stats, "2026-11-09", "en");
  assert.match(overview, /US\$6,950 per container, based on 4 quotes in the last 28 days/);
  assert.match(overview, /20GP median is US\$5,100 \(1 quote\)/);
  assert.doesNotMatch(overview, /market reference/);
  const cheapest = jebelAliCheapest(stats, "en");
  assert.match(cheapest, /Shanghai had the lowest 40HQ median to Jebel Ali, at US\$7,000 \(3 quotes\), out of 1 origin port compared, among origin ports with at least 3 quotes/);
  assert.doesNotMatch(cheapest, /4,890|Nansha/);
  assert.equal(jebelAliMarketNote(stats, "en").match(/market reference/g)?.length, 1);
  const graph = jebelAliJsonLd(stats, "2026-11-09", "en")["@graph"].map((node) => node["@type"]);
  assert.deepEqual(graph, ["Article", "FAQPage", "BreadcrumbList"]);
});
