import { ArrowRight } from "lucide-react";
import { guides, type Guide } from "../lib/content";
import { GUIDES_PUBLISHED, guideJsonLd } from "../lib/seo";
import { JsonLd } from "./json-ld";
import SubpageShell from "./subpage-shell";

export default function GuidePage({ lang, guide }: { lang: "en" | "zh"; guide: Guide }) {
  const zh = lang === "zh";
  const t = (en: string, cn: string) => zh ? cn : en;
  const home = zh ? "/zh/" : "/";
  const href = (slug: string, inZh = zh) => `${inZh ? "/zh" : ""}/guides/${slug}/`;
  const body = zh ? guide.body.zh : guide.body.en;
  return (
    <SubpageShell lang={lang} className="guide-page" current="guides" languageHref={href(guide.slug, !zh)}>
      <JsonLd data={guideJsonLd(guide, lang)} />
      <article className="guide-article wrap">
        <nav className="breadcrumbs" aria-label={t("Breadcrumb", "面包屑导航")}>
          <a href={home}>RedSeaRate</a> / <a href={`${home}#guides`}>{t("Guides", "指南")}</a>
        </nav>
        <span className="article-tag">{zh ? guide.tag.zh : guide.tag.en}</span>
        <h1>{zh ? guide.title.zh : guide.title.en}</h1>
        <p className="guide-meta">
          RedSeaRate · <time dateTime={GUIDES_PUBLISHED}>{GUIDES_PUBLISHED}</time>
        </p>
        {body.split("\n\n").map((paragraph, index) => <p key={index}>{paragraph}</p>)}
        <div className="guide-cta">
          <a className="button coral" href={`${home}#estimate`}>
            {t("Estimate your shipment", "估算我的运费")}<ArrowRight size={16} />
          </a>
          <a className="text-button" href={zh ? "/zh/rates/" : "/rates/"}>
            {t("See current rates", "查看当前运价")}<ArrowRight size={15} />
          </a>
        </div>
        <aside className="related-guides" aria-labelledby="related-title">
          <h2 id="related-title">{t("More guides", "更多指南")}</h2>
          <ul>
            {guides.filter((g) => g.slug !== guide.slug).map((g) => (
              <li key={g.slug}><a href={href(g.slug)}>{zh ? g.title.zh : g.title.en}</a></li>
            ))}
          </ul>
        </aside>
      </article>
    </SubpageShell>
  );
}
