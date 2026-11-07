import { guides } from "../lib/content";
import { shanghaiDate } from "../lib/rates";
import { GUIDES_PUBLISHED, SITE } from "../lib/seo";

export const dynamic = "force-static";

const pages = [
  { en: "/", zh: "/zh/", modified: shanghaiDate() },
  { en: "/rates/", zh: "/zh/rates/", modified: shanghaiDate() },
  ...guides.map(({ slug }) => ({ en: `/guides/${slug}/`, zh: `/zh/guides/${slug}/`, modified: GUIDES_PUBLISHED })),
];

export default function sitemap() {
  return pages.flatMap(({ en, zh, modified }) =>
    [en, zh].map((path) => ({
      url: `${SITE}${path}`,
      lastModified: modified,
      alternates: { languages: { en: `${SITE}${en}`, "zh-CN": `${SITE}${zh}` } },
    })),
  );
}
