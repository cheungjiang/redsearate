export const dynamic = "force-static";

const site = "https://redsearate.com";
const pages = [
  { en: "/", zh: "/zh/" },
  { en: "/rates/", zh: "/zh/rates/" },
];

export default function sitemap() {
  return pages.flatMap(({ en, zh }) =>
    [en, zh].map((path) => ({
      url: `${site}${path}`,
      alternates: { languages: { en: `${site}${en}`, "zh-CN": `${site}${zh}` } },
    })),
  );
}
