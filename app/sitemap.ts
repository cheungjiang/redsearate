import { guides } from "../lib/content";
import { countries } from "../lib/countries";
import { JEBEL_ALI_SLUG } from "../lib/jebel-ali";
import { marketBriefSitemap } from "../lib/market-brief.server";
import { lanePath } from "../lib/lanes";
import { getLanePlan } from "../lib/lanes.server";
import { shanghaiDate } from "../lib/rates";
import { GUIDES_UPDATED, SITE } from "../lib/seo";

export const dynamic = "force-static";

export default async function sitemap() {
  const today = shanghaiDate();
  const lanes = await getLanePlan();
  const pages = [
    { en: "/", zh: "/zh/", modified: today },
    { en: "/rates/", zh: "/zh/rates/", modified: today },
    ...countries.map(({ slug }) => ({ en: `/${slug}/`, zh: `/zh/${slug}/`, modified: today })),
    ...lanes.active.map(({ slug }) => ({ en: lanePath(slug, "en"), zh: lanePath(slug, "zh"), modified: today })),
    { en: `/${JEBEL_ALI_SLUG}/`, zh: `/zh/${JEBEL_ALI_SLUG}/`, modified: today },
    ...guides.map(({ slug }) => ({ en: `/guides/${slug}/`, zh: `/zh/guides/${slug}/`, modified: GUIDES_UPDATED })),
    ...marketBriefSitemap(),
  ];
  return pages.flatMap(({ en, zh, modified }) =>
    [en, zh].map((path) => ({
      url: `${SITE}${path}`,
      lastModified: modified,
      alternates: { languages: { en: `${SITE}${en}`, "zh-CN": `${SITE}${zh}` } },
    })),
  );
}
