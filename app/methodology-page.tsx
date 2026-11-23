import { ArrowRight } from "lucide-react";
import type { GuideBlock } from "../lib/content";
import type { MethodologyDoc } from "../lib/methodology-content";
import { methodologyJsonLd } from "../lib/seo";
import { JsonLd } from "./json-ld";
import SubpageShell from "./subpage-shell";

function Blocks({ lang, blocks }: { lang: "en" | "zh"; blocks: GuideBlock[] }) {
  const pick = (text: { en: string; zh: string }) => (lang === "zh" ? text.zh : text.en);
  const href = (path: string) => /^https?:\/\//.test(path) ? path : `${lang === "zh" ? "/zh" : ""}${path}`;
  return blocks.map((block, index) => {
    if (block.kind === "p") return <p key={index}>{pick(block.text)}</p>;
    if (block.kind === "ul") {
      return (
        <ul key={index}>
          {block.items.map((item) => <li key={item.en}>{pick(item)}</li>)}
        </ul>
      );
    }
    if (block.kind === "ol") {
      return (
        <ol key={index}>
          {block.items.map((item) => <li key={item.en}>{pick(item)}</li>)}
        </ol>
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

export default function MethodologyPage({ lang, content }: { lang: "en" | "zh"; content: MethodologyDoc }) {
  const zh = lang === "zh";
  const t = (en: string, cn: string) => (zh ? cn : en);
  const pick = (text: { en: string; zh: string }) => (zh ? text.zh : text.en);
  const home = zh ? "/zh/" : "/";
  const rates = zh ? "/zh/rates/" : "/rates/";
  return (
    <SubpageShell lang={lang} className="guide-page country-page" languageHref={zh ? "/methodology/" : "/zh/methodology/"}>
      <JsonLd data={methodologyJsonLd(lang, content)} />
      <article className="guide-article country-article wrap">
        <nav className="breadcrumbs" aria-label={t("Breadcrumb", "面包屑导航")}>
          <a href={home}>{t("Home", "首页")}</a>
          {" / "}
          <span>{t("Methodology", "方法与数据")}</span>
        </nav>
        <span className="article-tag">{pick(content.tag)}</span>
        <h1>{pick(content.title)}</h1>
        <p className="guide-meta">
          RedSeaRate · {t("Updated", "更新于")} <time dateTime={content.updated}>{content.updated}</time>
        </p>
        <p className="guide-lead">{pick(content.lead)}</p>

        {content.sections.map((section) => (
          <section className="guide-section" key={section.heading.en}>
            <h2>{pick(section.heading)}</h2>
            <Blocks lang={lang} blocks={section.blocks} />
          </section>
        ))}

        <div className="guide-cta">
          <a className="button coral" href={`${home}#estimate`}>
            {t("Ask for a quote on your cargo", "按你的货询价")}
            <ArrowRight size={16} />
          </a>
          <a className="text-button" href={rates}>{t("See current rates", "查看当前运价")}</a>
        </div>
      </article>
    </SubpageShell>
  );
}
