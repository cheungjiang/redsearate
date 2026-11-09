import { test } from "node:test";
import assert from "node:assert/strict";
import { countries, countryStats } from "./countries.ts";
import { countryFaqs } from "./seo.ts";
import { countrySlug, destinations, type PriceEntry } from "./rates.ts";

let nextId = 0;
const quote = (over: Partial<PriceEntry>): PriceEntry => ({
  id: ++nextId,
  tier: "market",
  origin: "Shanghai",
  destination: "Jeddah",
  container: "40HC",
  price: 3000,
  validUntil: "2026-11-30",
  transitMin: null,
  transitMax: null,
  source: "",
  note: "",
  submittedBy: "Notion",
  createdAt: "2026-11-05T04:00:00.000Z",
  ...over,
});

test("one country page per destination, at the slug the index links to", () => {
  assert.deepEqual(countries.map((c) => c.destination), destinations.map((d) => d.id));
  for (const c of countries) assert.equal(c.slug, countrySlug(c.destination));
});

test("country stats pool recent market quotes and break them down by origin", () => {
  const entries = [
    quote({ price: 3000, carrier: "COSCO", freeDays: 14, routing: "直达" }),
    quote({ price: 3400, carrier: "MSC / CMA", freeDays: 21, routing: "中转" }),
    quote({ origin: "Shenzhen", price: 2800, carrier: "COSCO" }),
    quote({ origin: "Shenzhen", container: "20GP", price: 1800 }),
    quote({ price: 9900, tier: "internal" }),
    quote({ price: 9900, destination: "Aqaba" }),
    quote({ price: 9900, createdAt: "2026-09-01T04:00:00.000Z" }),
  ];
  const stats = countryStats(entries, "2026-11-08", "Jeddah");
  assert.equal(stats.quotes, 4);
  assert.equal(stats.latest, "2026-11-05");
  assert.equal(stats.containers["40HC"]?.median, 3000);
  assert.equal(stats.containers["40HC"]?.count, 3);
  assert.equal(stats.containers["20GP"]?.median, 1800);
  assert.deepEqual(stats.origins.map((o) => o.origin), ["Shenzhen", "Shanghai"]);
  const shanghai = stats.origins[1];
  assert.equal(shanghai.containers["40HC"]?.median, 3200);
  assert.deepEqual(shanghai.carriers, ["CMA", "COSCO", "MSC"]);
  assert.deepEqual(shanghai.freeDays, [14, 21]);
  assert.equal(shanghai.direct, 1);
  assert.equal(shanghai.transhipped, 1);
});

test("country FAQ answers lead with the live median and the cheapest origin", () => {
  const entries = [quote({ price: 3000 }), quote({ origin: "Shenzhen", price: 2800 })];
  const saudi = countries[0];
  const [cost, cheapest] = countryFaqs(saudi, countryStats(entries, "2026-11-08", "Jeddah"), "2026-11-08", "en");
  assert.match(cost.a, /^As of 2026-11-08, the median 40HQ .* Jeddah is US\$2,900 per container, based on 2 quotes/);
  assert.equal(cheapest.a, "Origin-level samples are still thin for this port — compare the table below together with the sample counts.");
  assert.doesNotMatch(cheapest.a, /Shenzhen|Shanghai|2,800/);
  const qualified = [
    ...[8200, 8200, 8100, 8300, 8200].map((price) => quote({ origin: "Ningbo", price })),
    quote({ origin: "Guangzhou (Nansha)", price: 4890 }),
    ...[7000, 7100, 6900].map((price) => quote({ origin: "Shanghai", price })),
  ];
  const named = countryFaqs(saudi, countryStats(qualified, "2026-11-08", "Jeddah"), "2026-11-08", "en")[1].a;
  assert.match(named, /Shanghai had the lowest 40HQ median to Jeddah, at US\$7,000 \(3 quotes\), out of 2 origin ports compared, among origin ports with at least 3 quotes/);
  assert.doesNotMatch(named, /4,890|Nansha|Ningbo/);
  const zh = countryFaqs(saudi, countryStats(qualified, "2026-11-08", "Jeddah"), "2026-11-08", "zh")[1].a;
  assert.match(zh, /在至少有 3 条报价的起运港里，上海出运的 40HQ 中位数最低，为 US\$7,000（3 条报价），共比较了 2 个起运港/);
  assert.doesNotMatch(zh, /4,890|南沙|宁波/);
  const empty = countryFaqs(saudi, countryStats([], "2026-11-08", "Jeddah"), "2026-11-08", "en");
  assert.match(empty[0].a, /no 40HQ market quotes/);
  assert.equal(empty[1].a, cheapest.a);
  assert.equal(empty.length, 4);
});
