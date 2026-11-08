import { JsonLd } from "./json-ld";
import SubpageShell from "./subpage-shell";
import {
  JEBEL_ALI_CODE,
  JEBEL_ALI_PRICE,
  JEBEL_ALI_SLUG,
  jebelAliFaqs,
  jebelAliOriginName,
  openJebelAliSailings,
} from "../lib/jebel-ali";
import { SITE } from "../lib/seo";

export default function JebelAliPage({ lang, today }: { lang: "en" | "zh"; today: string }) {
  const zh = lang === "zh";
  const t = (en: string, cn: string) => (zh ? cn : en);
  const home = zh ? "/zh/" : "/";
  const href = (inZh = zh) => `${inZh ? "/zh" : ""}/${JEBEL_ALI_SLUG}/`;
  const saudi = `${zh ? "/zh" : ""}/shipping-from-china-to-saudi-arabia/`;
  const sailings = openJebelAliSailings(today);
  const faqs = jebelAliFaqs(today, lang);
  const money = `US$${JEBEL_ALI_PRICE.toLocaleString("en-US")}`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "FAQPage",
        inLanguage: zh ? "zh-CN" : "en",
        url: `${SITE}${href()}`,
        mainEntity: faqs.map((faq) => ({
          "@type": "Question",
          name: faq.q,
          acceptedAnswer: { "@type": "Answer", text: faq.a },
        })),
      },
    ],
  };
  return (
    <SubpageShell lang={lang} className="guide-page country-page" languageHref={href(!zh)}>
      <JsonLd data={jsonLd} />
      <article className="guide-article country-article wrap">
        <nav className="breadcrumbs" aria-label={t("Breadcrumb", "面包屑导航")}>
          <a href={home}>RedSeaRate</a> / <a href={zh ? "/zh/rates/" : "/rates/"}>{t("Rates", "航线运价")}</a>
        </nav>
        <span className="article-tag">{t(`CHINA → JEBEL ALI · ${JEBEL_ALI_CODE}`, `中国 → 杰贝阿里 · ${JEBEL_ALI_CODE}`)}</span>
        <h1>{t("Shipping from China to Jebel Ali: 40HQ rates by ETD", "中国到杰贝阿里海运：按 ETD 列出的 40HQ 运价")}</h1>
        <p className="guide-meta">
          RedSeaRate · {t("Sailing date checked", "船期核对于")} <time dateTime={today}>{today}</time>
        </p>
        <div className="answer-box">
          {faqs.map((faq) => <p key={faq.q}>{faq.a}</p>)}
        </div>
        <h2>{t("40HQ sailings still on offer", "仍可询的 40HQ 船期")}</h2>
        {sailings.length ? (
          <div className="rates-scroll" tabIndex={0} role="region" aria-label={t("Jebel Ali sailings", "杰贝阿里船期")}>
            <table className="country-table">
              <thead>
                <tr>
                  <th scope="col">{t("Origin port", "起运港")}</th>
                  <th scope="col">40HQ</th>
                  <th scope="col">ETD</th>
                </tr>
              </thead>
              <tbody>
                {sailings.map((sailing) => (
                  <tr key={sailing.origin}>
                    <th scope="row">{jebelAliOriginName(sailing.origin, lang)}</th>
                    <td>{money}</td>
                    <td><time dateTime={sailing.etd}>{sailing.etd}</time></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p>{t("These ETDs have passed. Ask for the next sailing.", "这些 ETD 已过，请询下一水船期。")}</p>
        )}
        <p className="platform-note">
          {t(
            "Port-to-port ocean freight, USD per 40HQ, for the ETD on that row. The same figure was given for every origin. Local charges, duty and inland transport are not included. Space is confirmed on WeChat or WhatsApp.",
            "港到港海运费，美元/40HQ，对应该行的 ETD。五个起运港给的是同一个价格。不含港杂、关税和内陆运输。舱位以微信或 WhatsApp 确认为准。",
          )}
        </p>
        <h2>{t("This port is in Dubai", "这个港在迪拜")}</h2>
        <p>
          {t(
            "Jebel Ali is the container port of Dubai, United Arab Emirates. It is not a Saudi port. For Saudi Arabia, use the Jeddah page.",
            "杰贝阿里是阿拉伯联合酋长国迪拜的集装箱港，不是沙特的港口。去沙特请看吉达页。",
          )}{" "}
          <a href={saudi}>{t("Shipping from China to Jeddah", "中国到吉达海运")}</a>
        </p>
        <p className="platform-note">
          {t(
            "This page is separate from the Red Sea index. The homepage estimator covers Jeddah, Sokhna, Aqaba, Djibouti and Port Sudan.",
            "这一页不属于红海指数。首页估价只覆盖吉达、苏赫纳、亚喀巴、吉布提和苏丹港。",
          )}
        </p>
      </article>
    </SubpageShell>
  );
}
