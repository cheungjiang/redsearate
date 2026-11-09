import {
  briefDateLabel,
  briefMoney,
  briefPath,
  type MarketBrief,
} from "../lib/market-brief";
import { destinations } from "../lib/rates";
import SubpageShell from "./subpage-shell";

export default function MarketBriefIndex({ lang, briefs }: { lang: "en" | "zh"; briefs: MarketBrief[] }) {
  const zh = lang === "zh";
  const t = (en: string, cn: string) => (zh ? cn : en);
  const home = zh ? "/zh/" : "/";
  const portName = (id: string) => (zh ? destinations.find((item) => item.id === id)?.zh ?? id : id);
  return (
    <SubpageShell lang={lang} className="guide-page country-page" languageHref={briefPath(null, zh ? "en" : "zh")}>
      <article className="guide-article country-article wrap">
        <nav className="breadcrumbs" aria-label={t("Breadcrumb", "面包屑导航")}>
          <a href={home}>{t("Home", "首页")}</a>
          {" / "}
          <span>{t("Market brief", "市场简报")}</span>
        </nav>
        <h1>{t("Red Sea freight market brief", "红海运价市场简报")}</h1>
        <p>
          {t(
            "One frozen issue each Monday. The figures on an issue page stay as they were that week.",
            "每周一冻结一期。当期页上的数字保持当周的读数。",
          )}
        </p>
        <p>
          <a href={zh ? "/zh/rates/" : "/rates/"}>{t("Current rates", "查看当前运价")}</a>
        </p>
        {briefs.length ? (
          <div className="rates-scroll" tabIndex={0} role="region" aria-label={t("Market brief issues", "市场简报期数")}>
            <table className="country-table">
              <thead>
                <tr>
                  <th scope="col">{t("Issue", "期数")}</th>
                  {destinations.map((port) => <th scope="col" key={port.id}>{portName(port.id)}</th>)}
                </tr>
              </thead>
              <tbody>
                {briefs.map((brief) => (
                  <tr key={brief.date}>
                    <th scope="row"><a href={briefPath(brief.date, lang)}>{briefDateLabel(brief.date, lang)}</a></th>
                    {brief.ports.map((port) => (
                      <td key={port.destination}>{port.median == null ? "—" : briefMoney(port.median)}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p>{t("No issue has been frozen yet.", "还没有冻结的期数。")}</p>
        )}
      </article>
    </SubpageShell>
  );
}
