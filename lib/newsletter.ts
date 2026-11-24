import signupUrls from "../data/newsletter.json" with { type: "json" };

// Public Substack signup links, never credentials. Both site languages currently
// use one English publication; an unset entry still disables that site's link.
export function newsletterUrl(
  lang: "en" | "zh",
  urls: { en: string | null; zh: string | null } = signupUrls,
): string | null {
  const value = urls[lang]?.trim();
  if (!value) return null;
  try {
    const url = new URL(value);
    if (
      url.protocol !== "https:" ||
      url.hostname !== "redsearate.substack.com" ||
      url.port || url.username || url.password ||
      url.search || url.hash ||
      !/^\/subscribe\/?$/.test(url.pathname)
    ) return null;
    return url.href;
  } catch {
    return null;
  }
}
