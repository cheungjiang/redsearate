"use server";

import { createHash, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { refresh } from "next/cache";
import { addEntry, deleteEntry } from "../../lib/db";
import { shanghaiDate, type Container, type Tier } from "../../lib/rates";
import { checkEntry, type NewEntry } from "../../lib/price-records";

const COOKIE = "pool_key";
const digest = (value: string) => createHash("sha256").update(value).digest();

// One shared key for the team, set as POOL_ACCESS_KEY. Without it the pool is closed.
export async function isMember() {
  const expected = process.env.POOL_ACCESS_KEY;
  const given = (await cookies()).get(COOKIE)?.value;
  return Boolean(
    expected && given && timingSafeEqual(digest(given), digest(expected)),
  );
}

export async function signIn(_: string, formData: FormData) {
  const key = String(formData.get("key") ?? "");
  const expected = process.env.POOL_ACCESS_KEY;
  if (!expected || !timingSafeEqual(digest(key), digest(expected)))
    return "访问密钥不正确";
  (await cookies()).set(COOKIE, key, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    path: "/pool",
    maxAge: 60 * 60 * 24 * 90,
  });
  refresh();
  return "";
}

export async function signOut() {
  (await cookies()).delete({ name: COOKIE, path: "/pool" });
  refresh();
}

const text = (formData: FormData, name: string, max: number) =>
  String(formData.get(name) ?? "")
    .trim()
    .slice(0, max);

export async function submitPrice(_: string, formData: FormData) {
  if (!(await isMember())) return "请先登录";
  const days = (name: string) => {
    const value = text(formData, name, 3);
    return value ? Number(value) : null;
  };
  const entry: NewEntry = {
    tier: text(formData, "tier", 10) as Tier,
    origin: text(formData, "origin", 40),
    destination: text(formData, "destination", 40),
    container: text(formData, "container", 10) as Container,
    price: Number(formData.get("price")),
    validUntil: text(formData, "validUntil", 10),
    transitMin: days("transitMin"),
    transitMax: days("transitMax"),
    source: text(formData, "source", 80),
    note: text(formData, "note", 300),
    submittedBy: text(formData, "submittedBy", 40),
  };
  if (
    !/^\d{4}-\d{2}-\d{2}$/.test(entry.validUntil) ||
    entry.validUntil < shanghaiDate()
  )
    return "有效期不能早于今天";
  const error = checkEntry(entry);
  if (error) return error;
  addEntry(entry);
  refresh();
  return "ok";
}

export async function removePrice(formData: FormData) {
  if (!(await isMember())) return;
  deleteEntry(Number(formData.get("id")));
  refresh();
}
