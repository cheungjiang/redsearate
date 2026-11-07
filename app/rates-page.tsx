"use client";

import { useState } from "react";
import { ArrowLeft, ArrowUpRight, Globe2, Menu, X } from "lucide-react";
import { platformNavigation, type SimulationPreview } from "../lib/platform";
import { defaultShipment, type Snapshot } from "../lib/rates";
import { RatesPreview } from "./platform-sections";

export default function RatesPage({
  lang, snapshot, simulation,
}: {
  lang: "en" | "zh";
  snapshot: Snapshot;
  simulation: SimulationPreview | null;
}) {
  const [menu, setMenu] = useState(false);
  const zh = lang === "zh";
  const t = (en: string, cn: string) => zh ? cn : en;
  const home = zh ? "/zh/" : "/";
  return (
    <div className="editorial-site rates-page">
      <a className="skip" href="#main">{t("Skip to content", "跳至正文")}</a>
      <header className="header wrap">
        <a href={home} className="brand" aria-label="RedSeaRate home">
          <span className="brand-symbol" aria-hidden="true">≈</span><span>RedSeaRate</span>
        </a>
        <nav id="main-navigation" className={menu ? "navigation open" : "navigation"} aria-label={t("Main navigation", "主导航")}>
          {platformNavigation.map((item) => (
            <a key={item.id} aria-current={item.id === "rates" ? "page" : undefined}
              href={item.id === "rates" ? (zh ? "/zh/rates/" : "/rates/") : `${home}#${item.id}`}
              onClick={() => setMenu(false)}>{t(item.en, item.zh)}</a>
          ))}
          <div className="mobile-menu-actions">
            <a className="button small join-button" href={`${home}#join`}>{t("Join", "加入")}</a>
            <a className="button small coral" href={`${home}#estimate`}>{t("Get a quote", "获取报价")}</a>
          </div>
        </nav>
        <div className="header-actions">
          <a className="language" href={zh ? "/rates/" : "/zh/rates/"} lang={zh ? "en" : "zh-CN"}><Globe2 size={16} />{zh ? "EN" : "中文"}</a>
          <a className="button small join-button header-join" href={`${home}#join`}>{t("Join", "加入")}</a>
          <a className="button small coral header-quote" href={`${home}#estimate`}>{t("Get a quote", "获取报价")}<ArrowUpRight size={15} /></a>
          <button className="menu-toggle" aria-controls="main-navigation" aria-expanded={menu}
            aria-label={t("Toggle navigation", "展开导航")} onClick={() => setMenu(!menu)}>{menu ? <X /> : <Menu />}</button>
        </div>
      </header>
      <main id="main">
        <div className="rates-page-intro wrap">
          <a className="text-button" href={home}><ArrowLeft size={16} />{t("Back to homepage", "返回首页")}</a>
          <h1>{t("Rates", "航线运价")}</h1>
        </div>
        <RatesPreview lang={lang} snapshot={snapshot} shipment={defaultShipment} samples={simulation?.rates ?? []} fullPage />
      </main>
      <footer className="wrap">
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} RedSeaRate</span>
          <span>{t("Operator details pending confirmation", "运营信息待确认")}</span>
          <a className="text-button" href={home}>{t("Back to homepage", "返回首页")}<ArrowUpRight size={14} /></a>
        </div>
      </footer>
    </div>
  );
}
