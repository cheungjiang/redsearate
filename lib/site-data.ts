import { connection } from "next/server";
import { listEntries } from "./db";
import { shanghaiDate, summarize } from "./rates";

export const contact = {
  operator: process.env.SITE_OPERATOR ?? "chinairantrucks",
  wechat: process.env.SITE_WECHAT ?? "uarmside",
  // Comma-separated; each visitor is assigned one number at random.
  whatsapp: (
    process.env.SITE_WHATSAPP ??
    "+86 132 3740 1856,+86 158 1879 6370,+86 158 7620 7182"
  )
    .split(",")
    .map((n) => n.trim())
    .filter(Boolean),
};

// Reads the price pool per request so team submissions and expiry dates show
// up immediately without a rebuild.
export async function homeData() {
  await connection();
  return { snapshot: summarize(listEntries(), shanghaiDate()), contact };
}
