import { guides } from "../lib/content";
import { countries } from "../lib/countries";
import { shanghaiDate } from "../lib/rates";
import { GUIDES_UPDATED, SITE } from "../lib/seo";

export const dynamic = "force-static";

const pages = [
  { en: "/", zh: "/zh/", modified: shanghaiDate() },
  { en: "/rates/", zh: "/zh/rates/", modified: shanghaiDate() },
  ...countries.map(({ slug }) => ({ en: `/${slug}/`, zh: `/zh/${slug}/`, modified: shanghaiDate() })),
  ...guides.map(({ slug }) => ({ en: `/guides/${slug}/`, zh: `/zh/guides/${slug}/`, modified: GUIDES_UPDATED })),
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
