import { ArrowRight } from "lucide-react";
import { countries } from "../lib/countries";
import { guides } from "../lib/content";
import type { FaqItem, FaqRow } from "../lib/faq";
import { destinations } from "../lib/rates";
import { faqPageJsonLd } from "../lib/seo";
import { JsonLd } from "./json-ld";
import SubpageShell from "./subpage-shell";

const money = (n: number) => `US$${n.toLocaleString("en-US")}`;

export default function FaqPage({
  lang, rows, items,
}: {
  lang: "en" | "zh";
  rows: FaqRow[];
  items: FaqItem[];
}) {
  const zh = lang === "zh";
  const t = (en: string, cn: string) => (zh ? cn : en);
  const home = zh ? "/zh/" : "/";
  const path = zh ? "/zh/faq/" : "/faq/";
  const ratesHref = zh ? "/zh/rates/" : "/rates/";
  const briefHref = zh ? "/zh/market-brief/" : "/market-brief/";
  const portName = (id: string) => {
    const port = destinations.find((item) => item.id === id);
    return zh ? port?.zh ?? id : id;
  };
  const statCell = (stat: { median: number; count: number } | undefined) =>
    stat ? `${money(stat.median)} (${stat.count})` : "—";
  const transit = (row: FaqRow) =>
    row.country.transit
      ? zh ? row.country.transit.range.zh : row.country.transit.range.en
      : t("Confirm with quote", "以询价为准");
  const relatedSlugs = [
    "cape-of-good-hope-vs-suez-red-sea-freight",
    "fcl-vs-lcl-red-sea",
    "20gp-40gp-40hq-container-choice",
    "ddp-dap-red-sea-door-cost",
    "dangerous-goods-battery-red-sea",
    "port-sudan-clearance-transit-local-charges",
    "djibouti-clearance-transit-local-charges",
    "red-sea-vs-jebel-ali",
    "direct-vs-transhipment-red-sea",
  ];
  const related = guides.filter((guide) => relatedSlugs.includes(guide.slug));
  return (
    <SubpageShell lang={lang} className="guide-page country-page" languageHref={zh ? "/faq/" : "/zh/faq/"}>
      <JsonLd data={faqPageJsonLd(items, lang, path)} />
      <article className="guide-article country-article wrap">
        <nav className="breadcrumbs" aria-label={t("Breadcrumb", "面包屑导航")}>
          <a href={home}>{t("Home", "首页")}</a>
          {" / "}
          <span>{t("FAQ", "常见问题")}</span>
        </nav>
        <span className="article-tag">{t("SHIPPING FAQ", "海运常见问题")}</span>
        <h1>{t("China to Red Sea shipping FAQ", "中国到红海海运常见问题")}</h1>
        <p className="guide-lead">
          {t(
            "Short answers to the questions that come before a booking: how long each port takes, what a 20GP, 40GP or 40HQ costs, what the rate includes, and how to reserve space.",
            "订舱前最常问的几件事：各目的港要多久、20GP / 40GP / 40HQ 各多少钱、报价包含什么、舱位怎么订。先把这些对齐，再谈具体船期。",
          )}
        </p>

        <h2>{t("Container rates by port", "各目的港柜型运价")}</h2>
        <div className="rates-scroll" tabIndex={0} role="region" aria-label={t("Container rates by port", "各目的港柜型运价")}>
          <table className="country-table">
            <thead>
              <tr>
                <th scope="col">{t("Destination", "目的港")}</th>
                <th scope="col">20GP</th>
                <th scope="col">40GP</th>
                <th scope="col">40HQ</th>
                <th scope="col">{t("Transit", "航程")}</th>
                <th scope="col">{t("Rates", "运价")}</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.country.slug}>
                  <th scope="row">{portName(row.country.destination)}</th>
                  <td>{statCell(row.stats.containers["20GP"])}</td>
                  <td>{statCell(row.stats.containers["40GP"])}</td>
                  <td>{statCell(row.stats.containers["40HC"])}</td>
                  <td>{transit(row)}</td>
                  <td><a href={`${zh ? "/zh" : ""}/${row.country.slug}/`}>{t("See rates", "查看运价")}</a></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="platform-note">
          {t(
            "Medians of market quotes collected in the last 28 days, with outliers removed; the number in brackets is the sample size. A dash means there were no recent quotes for that container at that port. Port-to-port ocean freight only, not a bookable offer. Origin charges, destination charges, duty, VAT, insurance and inland transport are excluded.",
            "近 28 天收集的市场报价中位数，已剔除离群值；括号内为样本量。“—”表示该港口近期没有该柜型报价，请直接询价。仅港到港海运费，不是可订舱报价。不含起运港费用、目的港费用、关税、增值税、保险和内陆运输。",
          )}
        </p>

        <h2>{t("Frequently asked questions", "常见问题")}</h2>
        <div className="faq-list">
          {items.map((item) => (
            <details key={item.q}>
              <summary>{item.q}</summary>
              <p>{item.a}</p>
            </details>
          ))}
        </div>

        <h2>{t("Related guides and pages", "相关指南与页面")}</h2>
        <ul className="guide-links">
          {related.map((guide) => (
            <li key={guide.slug}>
              <a href={`${zh ? "/zh" : ""}/guides/${guide.slug}/`}>{zh ? guide.title.zh : guide.title.en}</a>
            </li>
          ))}
          <li><a href={briefHref}>{t("This week's market brief", "本周市场简报")}</a></li>
          <li><a href={ratesHref}>{t("Current Red Sea rates", "查看当前红海运价")}</a></li>
          {countries.map((country) => (
            <li key={country.slug}>
              <a href={`${zh ? "/zh" : ""}/${country.slug}/`}>{portName(country.destination)}</a>
            </li>
          ))}
        </ul>

        <div className="guide-cta">
          <a className="button coral" href={`${home}#estimate`}>
            {t("Get a quote", "获取报价")}
            <ArrowRight size={16} />
          </a>
          <a className="text-button" href={ratesHref}>{t("See current rates", "查看当前运价")}</a>
        </div>
      </article>
    </SubpageShell>
  );
}
