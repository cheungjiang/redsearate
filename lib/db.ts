import { DatabaseSync } from "node:sqlite";
import { mkdirSync } from "node:fs";
import { dirname } from "node:path";
import type { PriceEntry } from "./rates";

const path = process.env.PRICE_DB ?? ".data/prices.db";
let db: DatabaseSync | undefined;

function open() {
  if (!db) {
    mkdirSync(dirname(path), { recursive: true });
    db = new DatabaseSync(path);
    db.exec(`create table if not exists prices (
      id integer primary key,
      tier text not null,
      origin text not null,
      destination text not null,
      container text not null,
      price real not null,
      valid_until text not null,
      transit_min integer,
      transit_max integer,
      source text not null,
      note text not null,
      submitted_by text not null,
      created_at text not null
    )`);
  }
  return db;
}

export function listEntries(): PriceEntry[] {
  return open()
    .prepare(
      `select id, tier, origin, destination, container, price,
        valid_until as validUntil, transit_min as transitMin,
        transit_max as transitMax, source, note,
        submitted_by as submittedBy, created_at as createdAt
      from prices order by created_at desc, id desc`,
    )
    .all() as unknown as PriceEntry[];
}

export function addEntry(
  entry: Omit<PriceEntry, "id" | "createdAt">,
  createdAt = new Date().toISOString(),
) {
  open()
    .prepare(
      `insert into prices (tier, origin, destination, container, price,
        valid_until, transit_min, transit_max, source, note, submitted_by, created_at)
      values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    )
    .run(
      entry.tier,
      entry.origin,
      entry.destination,
      entry.container,
      entry.price,
      entry.validUntil,
      entry.transitMin,
      entry.transitMax,
      entry.source,
      entry.note,
      entry.submittedBy,
      createdAt,
    );
}

export function deleteEntry(id: number) {
  open().prepare("delete from prices where id = ?").run(id);
}
