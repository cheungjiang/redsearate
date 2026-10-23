import { createHash, timingSafeEqual } from "node:crypto";
import { addEntry, listEntries } from "../../../lib/db";
import { shanghaiDate } from "../../../lib/rates";
import {
  parsePriceCsv,
  recordKey,
  toPriceCsv,
} from "../../../lib/price-records";

// For Grokbot and backups: `Authorization: Bearer <PRICE_API_KEY>`.
// A separate key from the team's POOL_ACCESS_KEY, so either can be rotated alone.
function authorized(request: Request) {
  const expected = process.env.PRICE_API_KEY;
  const given = request.headers.get("authorization")?.replace(/^Bearer /, "");
  const digest = (v: string) => createHash("sha256").update(v).digest();
  return Boolean(
    expected && given && timingSafeEqual(digest(given), digest(expected)),
  );
}
const denied = () => Response.json({ error: "unauthorized" }, { status: 401 });

// Exports every price, including internal ones, as CSV.
export async function GET(request: Request) {
  if (!authorized(request)) return denied();
  return new Response(toPriceCsv(listEntries()), {
    headers: {
      "content-type": "text/csv; charset=utf-8",
      "cache-control": "no-store",
    },
  });
}

// Imports CSV rows. Valid rows are added, rows already in the pool are
// skipped, and invalid rows are reported by line without stopping the rest.
export async function POST(request: Request) {
  if (!authorized(request)) return denied();
  const text = await request.text();
  if (text.length > 1_000_000)
    return Response.json({ error: "too large" }, { status: 413 });
  const today = shanghaiDate();
  const { rows, errors } = parsePriceCsv(text, today);
  const existing = new Set(
    listEntries().map((e) => recordKey(shanghaiDate(new Date(e.createdAt)), e)),
  );
  let added = 0;
  let duplicates = 0;
  for (const { entry, date } of rows) {
    const key = recordKey(date, entry);
    if (existing.has(key)) {
      duplicates++;
      continue;
    }
    existing.add(key);
    // Back-dated rows are stamped at noon Shanghai time on their quote date.
    addEntry(entry, date === today ? undefined : `${date}T04:00:00.000Z`);
    added++;
  }
  return Response.json({ added, duplicates, errors });
}
