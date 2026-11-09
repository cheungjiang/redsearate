import { ArrowRight, ClipboardList, MapPin, Package, Ship } from "lucide-react";
import { guides } from "../lib/content";
import {
  JEBEL_ALI_CARRIER,
  JEBEL_ALI_CODE,
  JEBEL_ALI_DIRECT,
  JEBEL_ALI_SLUG,
  JEBEL_ALI_TRANSIT_DAYS,
  jebelAliCheapest,
  jebelAliEarliestEtd,
  jebelAliFaqs,
  jebelAliMarketNote,
  jebelAliMoney,
  jebelAliOriginName,
  jebelAliOverview,
  jebelAliSailings,
  type JebelAliContainer,
} from "../lib/jebel-ali";
import { jebelAliGoodPrice, jebelAliMarketStats, readJebelAliQuotes } from "../lib/jebel-ali-prices";
import { jebelAliJsonLd } from "../lib/seo";
import { contact } from "../lib/site-data";
import { JebelAliCta } from "./jebel-ali-cta";
import { JebelAliMap } from "./jebel-ali-map";
import { JebelAliPlanner } from "./jebel-ali-planner";
import { JsonLd } from "./json-ld";
import SubpageShell from "./subpage-shell";

export default function JebelAliPage({ lang, today }: { lang: "en" | "zh"; today: string }) {
  const zh = lang === "zh";
  const t = (en: string, cn: string) => (zh ? cn : en);
  const pick = (text: { en: string; zh: string }) => (zh ? text.zh : text.en);
  const href = (inZh = zh) => `${inZh ? "/zh" : ""}/${JEBEL_ALI_SLUG}/`;
  const quotes = readJebelAliQuotes();
  const market = jebelAliMarketStats(quotes, today);
  const faqs = jebelAliFaqs(today, lang, market);
  const containers: JebelAliContainer[] = ["20GP", "40GP", "40HQ"];
  const origins = jebelAliSailings.map((sailing) => ({
    id: sailing.origin,
    name: jebelAliOriginName(sailing.origin, lang),
    etd: sailing.etd,
  }));
  const names = origins.map((row) => row.name).join(zh ? "、" : ", ");
  const lanes = origins.flatMap((row) =>
    containers.map((container) => ({
      origin: row.id,
      container,
      price: jebelAliGoodPrice(quotes, row.id, container, today),
    })),
  );
  const headline = lanes
    .filter((lane) => lane.container === "40HQ" && lane.price != null)
    .sort((a, b) => a.price! - b.price!)[0];
  const headlineName = headline ? jebelAliOriginName(headline.origin, lang) : "";
  const steps = [
    {
      icon: ClipboardList,
      title: t("Book", "订舱"),
      body: t("Send the origin port, the container and the ETD for us to confirm.", "把起运港、柜型和这一水 ETD 发来确认。"),
    },
    {
      icon: Package,
      title: t("Prepare the cargo", "备货 / 报关"),
      body: t("The cargo is ready at the origin port, and export clearance is filed.", "货物在起运港备好，并办理出口报关。"),
    },
    {
      icon: Ship,
      title: t("Load", "装船"),
      body: t("Load on the sailing that was confirmed.", "按确认的那一水装船。"),
    },
    {
      icon: MapPin,
      title: t("Pick up", "到港提货"),
      body: t("After arrival at Jebel Ali, the cargo is picked up at the port.", "货到杰贝阿里后在港提取。"),
    },
  ];
  const cell = (sample?: { median: number; count: number }) =>
    sample ? `${jebelAliMoney(sample.median)} (${sample.count})` : "—";
  return (
    <SubpageShell lang={lang} className="guide-page country-page jebel-ali-page" languageHref={href(!zh)}>
      <JsonLd data={jebelAliJsonLd(market, today, lang)} />
      <p className="jebel-crumb wrap">
        <a href={zh ? "/zh/rates/" : "/rates/"}>{t("Rates", "航线运价")}</a>
        {" / "}
        <span aria-current="page">{t(`China → Jebel Ali · ${JEBEL_ALI_CODE}`, `中国 → 杰贝阿里 · ${JEBEL_ALI_CODE}`)}</span>
        <span className="jebel-checked">{t("Sailing date checked", "船期核对于")} <time dateTime={today}>{today}</time></span>
      </p>
      <div className="jebel-frame wrap">
      <section className="jebel-planner">
        <div className="jebel-navy">
          <div className="jebel-title">
            <p className="jebel-kicker">{t(`China → Jebel Ali · ${JEBEL_ALI_CODE}`, `中国 → 杰贝阿里 · ${JEBEL_ALI_CODE}`)}</p>
            <h1>{t("Shipping from China to Jebel Ali", "中国到杰贝阿里海运")}</h1>
            <p>
              {t(
                "Qingdao, Shanghai, Ningbo, Shenzhen and Nansha can load on this sailing.",
                "青岛、上海、宁波、深圳、广州南沙都可以出运这一班。",
              )}
            </p>
            <p>
              {t(
                `Transit ${JEBEL_ALI_TRANSIT_DAYS} days, no transshipment, carrier ${JEBEL_ALI_CARRIER}. Jebel Ali is in Dubai.`,
                `航程 ${JEBEL_ALI_TRANSIT_DAYS} 天，不中转，船公司 ${JEBEL_ALI_CARRIER}。杰贝阿里在迪拜。`,
              )}
            </p>
          </div>
          <JebelAliMap lang={lang} />
          <dl className="jebel-stats">
            <div>
              <dt>{t("Origin ports", "起运港")}</dt>
              <dd>{origins.length}</dd>
              <span>{names}</span>
            </div>
            <div>
              <dt>{t("Next ETD", "最近 ETD")}</dt>
              <dd><time dateTime={jebelAliEarliestEtd()}>{jebelAliEarliestEtd()}</time></dd>
            </div>
            <div>
              <dt>{t("40HQ on this sailing", "这一班 40HQ")}</dt>
              <dd className="jebel-money">{headline ? jebelAliMoney(headline.price!) : t("On request", "请询价")}</dd>
              {headline && <span>{t(`Lower price, ${headlineName}`, `较低一条，${headlineName}`)}</span>}
            </div>
          </dl>
        </div>
        <JebelAliPlanner
          lang={lang}
          origins={origins}
          lanes={lanes}
          transitDays={JEBEL_ALI_TRANSIT_DAYS}
          direct={JEBEL_ALI_DIRECT}
          carrier={JEBEL_ALI_CARRIER}
          wechat={contact.wechat}
          whatsapp={contact.whatsapp}
          ratesHref={zh ? "/zh/rates/" : "/rates/"}
        />
      </section>

      <section className="jebel-band" aria-labelledby="jebel-gateway">
        <img
          src="/images/jebel-ali/terminal-night.webp"
          width={1920}
          height={1272}
          alt={t("Container terminal at night, cranes lit above the water", "夜间集装箱码头，岸桥灯火映在水面")}
          loading="lazy"
        />
        <div className="jebel-band-copy">
          <div>
            <h2 id="jebel-gateway">{t("A main gate to the Middle East", "通往中东的关键门户")}</h2>
            <p>{t("Jebel Ali is in Dubai. This page is separate from the Red Sea index.", "杰贝阿里在迪拜。这一页不属于红海指数。")}</p>
          </div>
        </div>
      </section>
      </div>

      <article className="guide-article country-article wrap">
        <h2>{t("Market median", "市场中位数")}</h2>
        <p>
          {t(
            "This section is the market median of published quotes. The ETD and the figure in the sailing block above belong to that sailing.",
            "这一节是已发布报价的市场中位数。上面船期里的 ETD 和价格属于那一班船。",
          )}
        </p>
        <p>{jebelAliOverview(market, today, lang)}</p>
        <p>{jebelAliCheapest(market, lang)}</p>

        <h2>{t("Current Jebel Ali rates by China origin port", "中国各起运港到杰贝阿里的当前运价")}</h2>
        {market.origins.length ? (
          <div className="rates-scroll" tabIndex={0} role="region" aria-label={t("Rates by origin port", "各起运港运价")}>
            <table className="country-table">
              <thead>
                <tr>
                  <th scope="col">{t("Origin port", "起运港")}</th>
                  <th scope="col">{t("20GP median (quotes)", "20GP 中位数（报价数）")}</th>
                  <th scope="col">{t("40HQ median (quotes)", "40HQ 中位数（报价数）")}</th>
                  <th scope="col">{t("Carriers", "船公司")}</th>
                </tr>
              </thead>
              <tbody>
                {market.origins.map((origin) => (
                  <tr key={origin.origin}>
                    <th scope="row">{jebelAliOriginName(origin.origin, lang)}</th>
                    <td>{cell(origin.containers["20GP"])}</td>
                    <td>{cell(origin.containers["40HC"])}</td>
                    <td>{origin.carriers.join(", ") || t("Unavailable", "未注明")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p>{t("No market quotes collected for this port in the last 28 days.", "近 28 天暂未收集到该港口的市场报价。")}</p>
        )}
        <p className="platform-note">{jebelAliMarketNote(market, lang)}</p>

        <h2>{t("What a quote covers", "费用包含与不包含")}</h2>
        <div className="cost-split">
          <div>
            <h3>{t("Included", "包含")}</h3>
            <ul>
              <li>{t("Port-to-port ocean freight.", "港到港海运费。")}</li>
            </ul>
          </div>
          <div>
            <h3>{t("Not included", "不包含")}</h3>
            <ul>
              <li>{t("Local charges", "港杂")}</li>
              <li>{t("Customs clearance", "清关")}</li>
              <li>{t("Duty", "关税")}</li>
              <li>{t("Insurance", "保险")}</li>
              <li>{t("Inland transport", "内陆运输")}</li>
            </ul>
          </div>
        </div>

        <h2>{t("How a shipment moves", "出运流程")}</h2>
        <ol className="step-list">
          {steps.map((step) => (
            <li key={step.title}>
              <step.icon size={22} aria-hidden="true" />
              <h3>{step.title}</h3>
              <p>{step.body}</p>
            </li>
          ))}
        </ol>

        <h2>{t("Frequently asked questions", "常见问题")}</h2>
        <div className="faq-list">
          {faqs.map((faq) => (
            <details key={faq.q}>
              <summary>{faq.q}</summary>
              <p>{faq.a}</p>
            </details>
          ))}
        </div>
      </article>

      <section className="section wrap jebel-guides" aria-labelledby="jebel-guides-title">
        <h2 id="jebel-guides-title">{t("Related guides", "相关指南")}</h2>
        <p className="platform-note">
          {t("These three guides are about Red Sea ports.", "下面三篇是红海指南，写的是红海港口。")}
        </p>
        <div className="guide-grid">
          {guides.map((guide) => (
            <a className="guide-card" key={guide.slug} href={`${zh ? "/zh" : ""}/guides/${guide.slug}/`}>
              <span className="article-tag">
                {pick(guide.tag)} <span>{t("FULL GUIDE", "全文")}</span>
              </span>
              <h3>{pick(guide.title)}</h3>
              <span className="guide-read">
                {t("Read the guide", "阅读全文")}
                <ArrowRight size={15} />
              </span>
            </a>
          ))}
        </div>
      </section>

      <JebelAliCta
        lang={lang}
        transitDays={JEBEL_ALI_TRANSIT_DAYS}
        direct={JEBEL_ALI_DIRECT}
        carrier={JEBEL_ALI_CARRIER}
        wechat={contact.wechat}
        whatsapp={contact.whatsapp}
      />
    </SubpageShell>
  );
}
