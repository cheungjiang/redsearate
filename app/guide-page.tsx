import { ArrowRight } from "lucide-react";
import { guides, type Guide, type GuideBlock } from "../lib/content";
import { GUIDES_UPDATED, guideJsonLd } from "../lib/seo";
import { JsonLd } from "./json-ld";
import SubpageShell from "./subpage-shell";

function Blocks({ lang, blocks }: { lang: "en" | "zh"; blocks: GuideBlock[] }) {
  const pick = (text: { en: string; zh: string }) => (lang === "zh" ? text.zh : text.en);
  const href = (path: string) => `${lang === "zh" ? "/zh" : ""}${path}`;
  return blocks.map((block, index) => {
    if (block.kind === "p") return <p key={index}>{pick(block.text)}</p>;
    if (block.kind === "ul") {
      return (
        <ul key={index}>
          {block.items.map((item) => <li key={item.en}>{pick(item)}</li>)}
        </ul>
      );
    }
    return (
      <ul className="guide-links" key={index}>
        {block.items.map((item) => (
          <li key={item.href}><a href={href(item.href)}>{pick(item.text)}</a></li>
        ))}
      </ul>
    );
  });
}

export default function GuidePage({ lang, guide }: { lang: "en" | "zh"; guide: Guide }) {
  const zh = lang === "zh";
  const t = (en: string, cn: string) => zh ? cn : en;
  const home = zh ? "/zh/" : "/";
  const href = (slug: string, inZh = zh) => `${inZh ? "/zh" : ""}/guides/${slug}/`;
  const pick = (text: { en: string; zh: string }) => zh ? text.zh : text.en;
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
          RedSeaRate · {t("Updated", "更新于")} <time dateTime={GUIDES_UPDATED}>{GUIDES_UPDATED}</time>
        </p>
        <p className="guide-lead">{pick(guide.lead)}</p>
        {guide.sections.map((section) => (
          <section className="guide-section" key={section.heading.en}>
            <h2>{pick(section.heading)}</h2>
            <Blocks lang={lang} blocks={section.blocks} />
          </section>
        ))}
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
