import { ArrowRight } from "lucide-react";
import { countries, type Country, type CountryStats } from "../lib/countries";
import { countryFaqs, countryJsonLd } from "../lib/seo";
import { destinations, extraOriginNames, origins } from "../lib/rates";
import { JsonLd } from "./json-ld";
import SubpageShell from "./subpage-shell";

export default function CountryPage({
  lang, country, stats, today, laneSlugs = {},
}: {
  lang: "en" | "zh";
  country: Country;
  stats: CountryStats;
  today: string;
  laneSlugs?: Record<string, string>;
}) {
  const zh = lang === "zh";
  const t = (en: string, cn: string) => zh ? cn : en;
  const pick = (text: { en: string; zh: string }) => zh ? text.zh : text.en;
  const home = zh ? "/zh/" : "/";
  const href = (slug: string, inZh = zh) => `${inZh ? "/zh" : ""}/${slug}/`;
  const port = destinations.find((d) => d.id === country.destination)!;
  const portName = zh ? port.zh : port.id;
  const originName = (id: string) =>
    zh ? origins.find((o) => o.id === id)?.zh ?? extraOriginNames[id] ?? id : id;
  const money = (n: number) => `US$${n.toLocaleString("en-US")}`;
  const cell = (s?: { median: number; count: number }) =>
    s ? `${money(s.median)} (${s.count})` : "—";
  const faqs = countryFaqs(country, stats, today, lang);
  const hasFreeDays = stats.origins.some((o) => o.freeDays);
  return (
    <SubpageShell lang={lang} className="guide-page country-page" languageHref={href(country.slug, !zh)}>
      <JsonLd data={countryJsonLd(country, stats, today, lang)} />
      <article className="guide-article country-article wrap">
        <nav className="breadcrumbs" aria-label={t("Breadcrumb", "面包屑导航")}>
          <a href={home}>RedSeaRate</a> / <a href={zh ? "/zh/rates/" : "/rates/"}>{t("Rates", "航线运价")}</a>
        </nav>
        <span className="article-tag">{t(`CHINA → ${port.id.toUpperCase()} · ${port.code}`, `中国 → ${port.zh} · ${port.code}`)}</span>
        <h1>{pick(country.title)}</h1>
        <p className="guide-meta">
          RedSeaRate · {t("Prices updated", "价格更新于")} <time dateTime={today}>{today}</time>
        </p>

        <div className="answer-box">
          {faqs.slice(0, 2).map((f) => <p key={f.q}>{f.a}</p>)}
        </div>

        <h2>{t(`Current ${portName} rates by China origin port`, `中国各起运港到${portName}的当前运价`)}</h2>
        {stats.origins.length ? (
          <div className="rates-scroll" tabIndex={0} role="region" aria-label={t("Rates by origin port", "各起运港运价")}>
            <table className="country-table">
              <thead>
                <tr>
                  <th scope="col">{t("Origin port", "起运港")}</th>
                  <th scope="col">{t("20GP median (quotes)", "20GP 中位数（报价数）")}</th>
                  <th scope="col">{t("40HQ median (quotes)", "40HQ 中位数（报价数）")}</th>
                  <th scope="col">{t("Carriers", "船公司")}</th>
                  {hasFreeDays && <th scope="col">{t("Free time", "免柜期")}</th>}
                </tr>
              </thead>
              <tbody>
                {stats.origins.map((o) => (
                  <tr key={o.origin}>
                    <th scope="row">{laneSlugs[o.origin] ? <a href={`${zh ? "/zh" : ""}/${laneSlugs[o.origin]}/`}>{originName(o.origin)}</a> : originName(o.origin)}</th>
                    <td>{cell(o.containers["20GP"])}</td>
                    <td>{cell(o.containers["40HC"])}</td>
                    <td>{o.carriers.join(", ") || "—"}</td>
                    {hasFreeDays && <td>{o.freeDays ? (o.freeDays[0] === o.freeDays[1] ? t(`${o.freeDays[0]} days`, `${o.freeDays[0]} 天`) : t(`${o.freeDays[0]}–${o.freeDays[1]} days`, `${o.freeDays[0]}–${o.freeDays[1]} 天`)) : "—"}</td>}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p>{t("No market quotes collected for this port in the last 28 days.", "近 28 天暂未收集到该港口的市场报价。")}</p>
        )}
        <p className="platform-note">
          {t(
            `Port-to-port ocean freight in USD per container, median of market quotes collected in the last 28 days (${stats.quotes} quotes in total). Origin charges, destination charges, duty and inland transport are not included. A market reading, not a bookable offer.`,
            `港到港海运费，美元/柜，近 28 天收集的市场报价中位数（共 ${stats.quotes} 条）。不含起运港费用、目的港费用、关税和内陆运输。这是市场读数，不是可订舱报价。`,
          )}
        </p>

        <h2>{t(`How long does shipping from China to ${pick(country.name)} take?`, `中国到${pick(country.name)}海运要多久？`)}</h2>
        {country.transit ? (
          <p><strong>{pick(country.transit.range)}{t(".", "。")}</strong>{t(" ", "")}{pick(country.transit.note)}</p>
        ) : (
          <p>{t(
            "Direct sailings are limited and many services tranship, so transit depends on the connection. Ask for the routing and connection port with every quote.",
            "直航有限，很多航线需要中转，时效取决于衔接情况。每次询价请确认航线和中转港。",
          )}</p>
        )}

        <h2>{t("Documents and customs", "单证与清关")}</h2>
        <ul>{country.documents.map((d) => <li key={d.en}>{pick(d)}</li>)}</ul>
        {country.taxes && <p>{pick(country.taxes)}</p>}

        <h2>{t("Current situation", "当前航线状况")}</h2>
        <p>{pick(country.situation)}</p>

        <h2>{t("What a port-to-port rate leaves out", "港到港运价不包含什么")}</h2>
        <p>{t(
          "Quotes on this page cover ocean freight only. Budget separately for origin charges in China (terminal handling, document and seal fees), destination port charges, any drop-off or war-risk surcharge the carrier bills at destination, customs duty and taxes, and delivery from the port.",
          "本页报价只含海运费。请另行预算中国起运港费用（码头操作费、单证费、封条费）、目的港港杂、船公司在目的港收取的还箱费或战争风险附加费、关税和税费，以及从港口到仓库的派送。",
        )}</p>

        <h2>{t("Frequently asked questions", "常见问题")}</h2>
        <div className="faq-list">
          {faqs.map((f) => (
            <details key={f.q}>
              <summary>{f.q}</summary>
              <p>{f.a}</p>
            </details>
          ))}
        </div>

        <div className="guide-cta">
          <a className="button coral" href={`${home}#estimate`}>
            {t("Get a quote for your shipment", "获取我的出运报价")}<ArrowRight size={16} />
          </a>
          <a className="text-button" href={zh ? "/zh/rates/" : "/rates/"}>
            {t("All Red Sea rates", "全部红海运价")}<ArrowRight size={15} />
          </a>
        </div>

        <aside className="related-guides" aria-labelledby="countries-title">
          <h2 id="countries-title">{t("Other Red Sea destinations", "其他红海目的地")}</h2>
          <ul>
            {countries.filter((c) => c.slug !== country.slug).map((c) => (
              <li key={c.slug}><a href={href(c.slug)}>{pick(c.title)}</a></li>
            ))}
          </ul>
          <h2>{t("Sources", "资料来源")}</h2>
          <ul className="sources">
            {country.sources.map((s) => (
              <li key={s.url}><a href={s.url} rel="noopener noreferrer" target="_blank">{s.title}</a></li>
            ))}
          </ul>
        </aside>
      </article>
    </SubpageShell>
  );
}
