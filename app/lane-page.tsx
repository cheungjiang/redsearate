import { countries, type Country } from "../lib/countries";
import { laneFaqs, laneHeading, laneJsonLd, lanePath, type LanePageData } from "../lib/lanes";
import { JsonLd } from "./json-ld";
import SubpageShell from "./subpage-shell";

const money = (n: number) => `US$${n.toLocaleString("en-US")}`;

export default function LanePage({
  lang, lane, today,
}: {
  lang: "en" | "zh";
  lane: LanePageData;
  today: string;
}) {
  const zh = lang === "zh";
  const t = (en: string, cn: string) => zh ? cn : en;
  const pick = (text: { en: string; zh: string }) => zh ? text.zh : text.en;
  const country = countries.find((item) => item.slug === lane.countrySlug) as Country;
  const faqs = laneFaqs(lane, today, lang);
  const countryHref = lanePath(lane.countrySlug, lang);
  const ratesHref = zh ? "/zh/rates/" : "/rates/";
  const quotes = (n: number) => zh ? `${n} 条报价` : `${n} ${n === 1 ? "quote" : "quotes"}`;
  return (
    <SubpageShell lang={lang} className="guide-page country-page" languageHref={lanePath(lane.slug, zh ? "en" : "zh")}>
      <JsonLd data={laneJsonLd(lane, today, lang)} />
      <article className="guide-article country-article wrap">
        <nav className="breadcrumbs" aria-label={t("Breadcrumb", "面包屑导航")}>
          <a href={zh ? "/zh/" : "/"}>RedSeaRate</a>
          {" / "}
          <a href={ratesHref}>{t("Rates", "航线运价")}</a>
          {" / "}
          <a href={countryHref}>{pick(country.name)}</a>
          {" / "}
          <span>{laneHeading(lane, lang)}</span>
        </nav>
        <h1>{laneHeading(lane, lang)}</h1>
        <p className="guide-meta">
          RedSeaRate · {t("Prices updated", "价格更新于")} <time dateTime={today}>{today}</time>
        </p>
        <div className="answer-box">
          <p>{faqs[0].a}</p>
          <p>
            {lane.twenty
              ? t(
                `The 20GP median is ${money(lane.twenty.median)} (${quotes(lane.twenty.count)}).`,
                `20GP 中位数为 ${money(lane.twenty.median)}（${quotes(lane.twenty.count)}）。`,
              )
              : t("20GP: Unavailable.", "20GP：暂无数据。")}
          </p>
        </div>
        <p>
          {lane.carriers.length
            ? t(
              `Carriers named on the quotes: ${lane.carriers.join(", ")}.`,
              `报价写明的船公司：${lane.carriers.join("、")}。`,
            )
            : t("Carriers: Unavailable.", "船公司：暂无数据。")}
        </p>
        {lane.freeDays && (
          <p>
            {t(
              `Free time on these quotes: ${lane.freeDays[0] === lane.freeDays[1] ? `${lane.freeDays[0]} days` : `${lane.freeDays[0]}–${lane.freeDays[1]} days`}.`,
              `这些报价的免柜期：${lane.freeDays[0] === lane.freeDays[1] ? `${lane.freeDays[0]} 天` : `${lane.freeDays[0]}–${lane.freeDays[1]} 天`}。`,
            )}
          </p>
        )}
        <p className="platform-note">
          {t(
            "Origin charges, destination charges, duty and inland transport are not included. A market reading, not a bookable offer.",
            "不含起运港费用、目的港费用、关税和内陆运输。这是市场读数，不是可订舱报价。",
          )}
        </p>

        <h2>{t(`How long does shipping from China to ${pick(country.name)} take?`, `中国到${pick(country.name)}海运要多久？`)}</h2>
        {country.transit ? (
          <p><strong>{pick(country.transit.range)}{t(".", "。")}</strong>{t(" ", "")}{pick(country.transit.note)}</p>
        ) : (
          <p>{faqs[1].a}</p>
        )}

        <h2>{t("Documents and customs", "单证与清关")}</h2>
        <ul>{country.documents.map((item) => <li key={item.en}>{pick(item)}</li>)}</ul>

        <h2>{t("Frequently asked questions", "常见问题")}</h2>
        <div className="faq-list">
          {faqs.map((faq) => (
            <details key={faq.q}>
              <summary>{faq.q}</summary>
              <p>{faq.a}</p>
            </details>
          ))}
        </div>

        <p>
          <a href={countryHref}>{t(`${pick(country.name)} rates by origin`, `${pick(country.name)}各起运港运价`)}</a>
          {" · "}
          <a href={ratesHref}>{t("All Red Sea rates", "全部红海运价")}</a>
        </p>
      </article>
    </SubpageShell>
  );
}
