import {
  addDays,
  containers,
  destinations,
  origins,
  shanghaiDate,
  tiers,
  type Container,
  type PriceEntry,
  type Tier,
} from "./rates.ts";

export type NewEntry = Omit<PriceEntry, "id" | "createdAt">;

// Validates CSV imports.
export function checkEntry(entry: NewEntry): string {
  if (
    !tiers.includes(entry.tier) ||
    !origins.some((p) => p.id === entry.origin) ||
    !destinations.some((p) => p.id === entry.destination) ||
    !containers.includes(entry.container)
  )
    return "请选择价格类型、航线和柜型";
  if (!Number.isFinite(entry.price) || entry.price <= 0 || entry.price > 50000)
    return "价格需在 0–50000 美元之间";
  const { transitMin: min, transitMax: max } = entry;
  if (
    [min, max].some(
      (d) => d !== null && !(Number.isInteger(d) && d > 0 && d < 120),
    ) ||
    (min && max && max < min)
  )
    return "航程天数不正确";
  if (!entry.submittedBy) return "请填写录入人";
  return "";
}

// One price per row. The header row is optional; Chinese or English headers work.
export const csvColumns = [
  "date",
  "tier",
  "origin",
  "destination",
  "container",
  "price",
  "valid_until",
  "transit_min",
  "transit_max",
  "source",
  "submitted_by",
  "note",
] as const;

const tierNames: Record<string, Tier> = {
  "": "market",
  市场: "market",
  市场价: "market",
  本站报价: "offer",
  内部: "internal",
  内部底价: "internal",
};
const portId = (
  list: { id: string; zh: string; code: string }[],
  value: string,
) =>
  list.find((p) =>
    [p.id, p.zh, p.code].some((n) => n.toLowerCase() === value.toLowerCase()),
  )?.id ?? "";
const isDate = (value: string) =>
  /^\d{4}-\d{2}-\d{2}$/.test(value) &&
  !Number.isNaN(Date.parse(value + "T00:00:00Z"));

function splitCsv(text: string) {
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = "";
  let quoted = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (quoted) {
      if (c === '"' && text[i + 1] === '"') cell += text[++i];
      else if (c === '"') quoted = false;
      else cell += c;
    } else if (c === '"') quoted = true;
    else if (c === ",") {
      row.push(cell);
      cell = "";
    } else if (c === "\n" || c === "\r") {
      if (c === "\r" && text[i + 1] === "\n") i++;
      rows.push([...row, cell]);
      row = [];
      cell = "";
    } else cell += c;
  }
  rows.push([...row, cell]);
  return rows.map((r) => r.map((v) => v.trim()));
}

export type ParsedRow = { line: number; entry: NewEntry; date: string };
export type RowError = { line: number; error: string };

// Parses rows for import. The quote date (blank: today) dates the price for
// the 28-day window and the weekly trend, so history can be re-imported. A
// blank valid_until defaults to 7 days after the quote date.
export function parsePriceCsv(text: string, today = shanghaiDate()) {
  const rows: ParsedRow[] = [];
  const errors: RowError[] = [];
  splitCsv(text.replace(/^\uFEFF/, "")).forEach((cells, index) => {
    const line = index + 1;
    if (cells.every((c) => !c) || cells[0].startsWith("#")) return;
    if (index === 0 && !isDate(cells[0]) && Number.isNaN(Number(cells[5])))
      return;
    if (cells.length > csvColumns.length)
      return errors.push({ line, error: "列数过多（备注含逗号请加引号）" });
    const [date0, tier, origin, destination, container, price, validUntil0] =
      cells;
    const [transitMin, transitMax, source = "", submittedBy = "", note = ""] =
      cells.slice(7);
    const date = date0 || today;
    if (!isDate(date) || date > today)
      return errors.push({ line, error: "日期需为 YYYY-MM-DD，且不晚于今天" });
    const validUntil = validUntil0 || addDays(date, 7);
    if (!isDate(validUntil) || validUntil < date)
      return errors.push({
        line,
        error: "有效期需为 YYYY-MM-DD，且不早于日期",
      });
    const days = (v = "") => (v ? Number(v) : null);
    const entry: NewEntry = {
      tier: (tiers as readonly string[]).includes(tier)
        ? (tier as Tier)
        : tierNames[tier],
      origin: portId(origins, origin ?? ""),
      destination: portId(destinations, destination ?? ""),
      container: (container ?? "")
        .toUpperCase()
        .replace(/^40'?HQ$/, "40HC") as Container,
      price: Number(price),
      validUntil,
      transitMin: days(transitMin),
      transitMax: days(transitMax),
      source: source.slice(0, 80),
      submittedBy: submittedBy.slice(0, 40),
      note: (validUntil0 ? note : `${note} 有效期未注明，默认7天`)
        .trim()
        .slice(0, 300),
    };
    const error =
      (!entry.origin && `起运港不支持：${origin}`) ||
      (!entry.destination && `目的港不支持：${destination}`) ||
      checkEntry(entry);
    if (error) errors.push({ line, error });
    else rows.push({ line, entry, date });
  });
  return { rows, errors };
}

const cell = (value: string | number | null) => {
  const text = String(value ?? "");
  return /[",\r\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
};

// Same columns as the import, oldest first, so the export re-imports as is
// and daily backups produce small diffs.
export function toPriceCsv(entries: PriceEntry[]) {
  const lines = [...entries]
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt) || a.id - b.id)
    .map((e) =>
      [
        shanghaiDate(new Date(e.createdAt)),
        e.tier,
        e.origin,
        e.destination,
        e.container,
        e.price,
        e.validUntil,
        e.transitMin,
        e.transitMax,
        e.source,
        e.submittedBy,
        e.note,
      ]
        .map(cell)
        .join(","),
    );
  return [csvColumns.join(","), ...lines].join("\n") + "\n";
}

// Rows already in the pool with the same date and content are skipped, so a
// retried or repeated import does not double-count prices.
export const recordKey = (date: string, e: NewEntry) =>
  [
    date,
    e.tier,
    e.origin,
    e.destination,
    e.container,
    e.price,
    e.validUntil,
    e.source,
    e.submittedBy,
  ].join("|");
