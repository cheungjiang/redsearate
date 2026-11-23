import { ArrowRight } from "lucide-react";
import { countries } from "../lib/countries";
import {
  briefChangeText,
  briefDateLabel,
  briefHeading,
  briefHighlights,
  briefMoney,
  briefPath,
  briefSampleNote,
  type BriefPort,
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
  const faqHref = zh ? "/zh/faq/" : "/faq/";
  const dataAsOf = brief.dataAsOf ?? brief.date;
  const highlights = briefHighlights(brief, lang);
  const portName = (id: string) => {
    const port = destinations.find((item) => item.id === id);
    return zh ? port?.zh ?? id : id;
  };
  const countryHref = (destination: string) => {
    const country = countries.find((item) => item.destination === destination);
    return `${zh ? "/zh" : ""}/${country?.slug ?? ""}/`;
  };
  const range = (port: BriefPort) =>
    port.low != null && port.high != null ? `${briefMoney(port.low)}–${briefMoney(port.high)}` : "—";
  const change = (port: BriefPort) => port.indexWeekChange ?? port.weekChange;
  const sinceLastIssue = brief.comparedWith
    ? brief.ports.filter((port) => port.weekChange != null)
    : [];
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
        <span className="article-tag">{t("WEEKLY MARKET REPORT", "每周市场周报")}</span>
        <h1>{briefHeading(brief.date, lang)}</h1>
        <p className="guide-meta">
          RedSeaRate · {t("Issue date", "期数日期")} <time dateTime={brief.date}>{brief.date}</time>
          {dataAsOf !== brief.date && (
            <> · {t("Data as of", "数据截至")} <time dateTime={dataAsOf}>{dataAsOf}</time></>
          )}
        </p>

        {brief.note && (zh ? brief.note.zh : brief.note.en)
          .split(/\n{2,}/)
          .map((paragraph, index) => (
            <p className={index === 0 ? "guide-lead" : undefined} key={`${index}-${paragraph.slice(0, 24)}`}>
              {paragraph}
            </p>
          ))}

        <h2>{t("This week in numbers", "本周数字")}</h2>
        <ul>
          {highlights.map((line) => <li key={line}>{line}</li>)}
        </ul>

        <h2>{t("Port by port", "分港口看")}</h2>
        <div className="rates-scroll" tabIndex={0} role="region" aria-label={t("Five-port market brief", "五港市场简报")}>
          <table className="country-table">
            <thead>
              <tr>
                <th scope="col">{t("Destination", "目的港")}</th>
                <th scope="col">{t("40HQ median", "40HQ 中位数")}</th>
                <th scope="col">{t("Week on week", "周环比")}</th>
                <th scope="col">{t("Quotes", "样本数")}</th>
                <th scope="col">{t("Range", "区间")}</th>
              </tr>
            </thead>
            <tbody>
              {brief.ports.map((port) => {
                const note = briefSampleNote(port.count, lang);
                return (
                  <tr key={port.destination}>
                    <th scope="row"><a href={countryHref(port.destination)}>{portName(port.destination)}</a></th>
                    <td>{port.median == null ? "—" : briefMoney(port.median)}</td>
                    <td>{change(port) == null ? "—" : briefChangeText(change(port)!)}</td>
                    <td>
                      {port.count == null ? "—" : port.count}
                      {note && <span className="platform-note"> {note}</span>}
                    </td>
                    <td>{range(port)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <p className="platform-note">
          {t(
            "Week on week is the live Red Sea index reading: the 28-day median compared with the same reading a week earlier. The range is the low and high of the quotes behind the median, after outliers are dropped.",
            "周环比取本站红海指数的实时读数：近 28 天中位数与一周前同口径读数比较。区间为中位数背后报价的最低值和最高值，已剔除离群值。",
          )}
        </p>
        {sinceLastIssue.length > 0 && (
          <p className="platform-note">
            {t(
              `Since the last frozen issue (${briefDateLabel(brief.comparedWith!, "en")}): `,
              `自上一期冻结读数（${briefDateLabel(brief.comparedWith!, "zh")}）以来：`,
            )}
            {sinceLastIssue.map((port) => `${portName(port.destination)} ${briefChangeText(port.weekChange!)}`).join(zh ? "，" : ", ")}.
          </p>
        )}

        <h2>{t("What to watch next week", "下周看什么")}</h2>
        <p>
          {t(
            "A weekly move is a reading, not a forecast. Check the sample count and the range before treating a move as a trend. If your cargo is ready in the next two weeks, ask for a quote on the specific sailing; the index is not a bookable offer.",
            "周环比是读数，不是预测。把样本量和区间一起看，再判断一个变动是不是趋势。货在两周内要出，请按具体船期询价；指数不是可订舱报价。",
          )}
        </p>
        <p className="platform-note">{zh ? brief.method.zh : brief.method.en}</p>
        {brief.source && <p className="platform-note">{t("Source", "来源")}: {zh ? brief.source.zh : brief.source.en}</p>}

        <h2>{t("Port pages", "目的港页面")}</h2>
        <ul>
          {countries.map((country) => (
            <li key={country.slug}>
              <a href={`${zh ? "/zh" : ""}/${country.slug}/`}>{portName(country.destination)}</a>
            </li>
          ))}
        </ul>

        <div className="guide-cta">
          <a className="button coral" href={`${home}#estimate`}>
            {t("Get a quote for this week", "按本周行情询价")}
            <ArrowRight size={16} />
          </a>
          <a className="text-button" href={ratesHref}>{t("Current rates", "查看当前运价")}</a>
          <a className="text-button" href={faqHref}>{t("Shipping FAQ", "海运常见问题")}</a>
        </div>

        <p>
          {previous && <a href={briefPath(previous, lang)}>{t("Previous issue", "上一期")} {previous}</a>}
          {previous && next ? " · " : null}
          {next && <a href={briefPath(next, lang)}>{t("Next issue", "下一期")} {next}</a>}
        </p>
      </article>
    </SubpageShell>
  );
}
