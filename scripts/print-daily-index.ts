// Prints the 14-day rolling 40HQ median for the five ports.
// Reads the quote file from `npm run fetch-prices`. Does not deploy.
import { readFileSync } from "node:fs";
import { dailyIndex, INDEX_WINDOW_DAYS, liveIndex } from "../lib/platform.ts";
import { addDays, shanghaiDate, type PriceEntry } from "../lib/rates.ts";

const file = process.env.PUBLIC_PRICES ?? ".data/public-prices.json";
const entries = JSON.parse(readFileSync(file, "utf8")) as PriceEntry[];
const today = process.argv[2] ?? new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Shanghai" });
const series = dailyIndex(entries, today);
const index = liveIndex(entries, today);
const ports = series.map((row) => row.port.id);
console.log(`today ${today}`);
console.log(["date", ...ports.map((port) => `${port} median/n`)].join("\t"));
for (const point of series[0].points) {
  const cells = series.map((row) => {
    const day = row.points.find((item) => item.date === point.date)!;
    return day.median == null ? "—" : `${day.median}/${day.count}`;
  });
  console.log([point.date, ...cells].join("\t"));
}
let mismatch = false;
for (const row of series) {
  const live = index.find((item) => item.port.id === row.port.id)!;
  const latest = row.points.at(-1)!;
  const same = latest.median === live.median && latest.count === live.sampleSize;
  if (!same) mismatch = true;
  console.log(`check ${row.port.id} series ${latest.median}/${latest.count} index ${live.median}/${live.sampleSize} ${same ? "match" : "MISMATCH"}`);
}
const reference: Record<string, Record<string, number>> = {
  "2026-11-10": { Jeddah: 8400, Sokhna: 6800, Aqaba: 7600, Djibouti: 7900, "Port Sudan": 8080 },
  "2026-11-09": { Jeddah: 8450, Sokhna: 6800, Aqaba: 7600, Djibouti: 7900, "Port Sudan": 8020 },
  "2026-11-08": { Jeddah: 8550, Sokhna: 6800, Aqaba: 7000, Djibouti: 8810, "Port Sudan": 7930 },
};
const referenceCounts: Record<string, number> = {
  Jeddah: 18, Sokhna: 9, Aqaba: 43, Djibouti: 5, "Port Sudan": 9,
};
for (const [date, expected] of Object.entries(reference)) {
  for (const row of series) {
    const point = row.points.find((item) => item.date === date);
    const got = point?.median ?? null;
    const delta = got == null || expected[row.port.id] == null ? null : got - expected[row.port.id];
    const countNote = date === "2026-11-10" ? ` n=${point?.count ?? "—"} expected n=${referenceCounts[row.port.id]}` : ` n=${point?.count ?? "—"}`;
    console.log(`ref ${date} ${row.port.id} got ${got ?? "—"}${countNote} delta ${delta ?? "—"}`);
    if (delta != null && Math.abs(delta) > 50) {
      const start = addDays(date, 1 - INDEX_WINDOW_DAYS);
      const quotes = entries
        .filter((entry) => {
          const quoteDate = shanghaiDate(new Date(entry.createdAt));
          return entry.tier === "market" && entry.container === "40HC" &&
            entry.destination === row.port.id && quoteDate >= start && quoteDate <= date;
        })
        .map((entry) => `${shanghaiDate(new Date(entry.createdAt))} ${entry.origin} ${entry.price}`)
        .sort();
      console.log(`  window ${start}..${date} quotes ${quotes.length}`);
      for (const line of quotes) console.log(`  ${line}`);
    }
  }
}
for (const row of series) {
  const thin = row.points.filter((point) => point.count != null && point.count < 5).map((point) => `${point.date.slice(5)}:${point.count}`);
  console.log(`thin ${row.port.id} ${thin.join(" ") || "none"}`);
}
if (mismatch) process.exit(1);
