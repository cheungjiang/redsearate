export const dynamic = "force-static";

export default function robots() {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/lane-registry.json"] },
    sitemap: "https://redsearate.com/sitemap.xml",
  };
}
