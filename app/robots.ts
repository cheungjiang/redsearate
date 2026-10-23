export default function robots() {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/pool", "/api"] },
    sitemap: "https://redsearate.com/sitemap.xml",
  };
}
