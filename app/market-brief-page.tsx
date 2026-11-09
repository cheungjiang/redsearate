import { countries } from "../lib/countries";
import {
  briefChangeText,
  briefDateLabel,
  briefHeading,
  briefMoney,
  briefPath,
  briefSampleNote,
  type MarketBrief,
} from "../lib/market-brief";
import { destinations } from "../lib/rates";
import { marketBriefJsonLd } from "../lib/seo";
import { JsonLd } from "./json-ld";
import SubpageShell from "./subpage-shell";

export default function MarketBriefPage({
  lang, brief, previous, next,
}: {
  lang: "en" | "zh";
  brief: MarketBrief;
  previous: string | null;
  next: string | null;
}) {
  const zh = lang === "zh";
  const t = (en: string, cn: string) => (zh ? cn : en);
  const home = zh ? "/zh/" : "/";
  const ratesHref = zh ? "/zh/rates/" : "/rates/";
  const showChange = brief.comparedWith != null;
  const portName = (id: string) => {
    const port = destinations.find((item) => item.id === id);
    return zh ? port?.zh ?? id : id;
  };
  return (
    <SubpageShell lang={lang} className="guide-page country-page" languageHref={briefPath(brief.date, zh ? "en" : "zh")}>
      <JsonLd data={marketBriefJsonLd(brief, lang)} />
      <article className="guide-article country-article wrap">
        <nav className="breadcrumbs" aria-label={t("Breadcrumb", "面包屑导航")}>
          <a href={home}>{t("Home", "首页")}</a>
          {" / "}
          <a href={briefPath(null, lang)}>{t("Market brief", "市场简报")}</a>
          {" / "}
          <span>{briefDateLabel(brief.date, lang)}</span>
        </nav>
        <h1>{briefHeading(brief.date, lang)}</h1>
        <p className="guide-meta">
          RedSeaRate · {t("Issue date", "期数日期")} <time dateTime={brief.date}>{brief.date}</time>
        </p>
        <div className="rates-scroll" tabIndex={0} role="region" aria-label={t("Five-port market brief", "五港市场简报")}>
          <table className="country-table">
            <thead>
              <tr>
                <th scope="col">{t("Destination", "目的港")}</th>
                <th scope="col">{t("40HQ median", "40HQ 中位数")}</th>
                <th scope="col">{t("Quotes", "样本数")}</th>
                {showChange && <th scope="col">{t("Week on week", "周环比")}</th>}
              </tr>
            </thead>
            <tbody>
              {brief.ports.map((port) => {
                const note = briefSampleNote(port.count, lang);
                return (
                  <tr key={port.destination}>
                    <th scope="row">{portName(port.destination)}</th>
                    <td>{port.median == null ? "—" : briefMoney(port.median)}</td>
                    <td>
                      {port.count == null ? "—" : port.count}
                      {note && <span className="platform-note"> {note}</span>}
                    </td>
                    {showChange && <td>{port.weekChange == null ? "—" : briefChangeText(port.weekChange)}</td>}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <p className="platform-note">{zh ? brief.method.zh : brief.method.en}</p>
        <p>
          <a href={ratesHref}>{t("Current rates", "查看当前运价")}</a>
        </p>
        <ul>
          {countries.map((country) => (
            <li key={country.slug}>
              <a href={`${zh ? "/zh" : ""}/${country.slug}/`}>{portName(country.destination)}</a>
            </li>
          ))}
        </ul>
        <p>
          {previous && <a href={briefPath(previous, lang)}>{t("Previous issue", "上一期")} {previous}</a>}
          {previous && next ? " · " : null}
          {next && <a href={briefPath(next, lang)}>{t("Next issue", "下一期")} {next}</a>}
        </p>
      </article>
    </SubpageShell>
  );
}
