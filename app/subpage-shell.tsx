"use client";

import { useState, type ReactNode } from "react";
import { ArrowUpRight, Globe2, Menu, X } from "lucide-react";
import { platformNavigation } from "../lib/platform";
import BrandLogo from "./brand-logo";

export default function SubpageShell({
  lang, className, current, languageHref, children,
}: {
  lang: "en" | "zh";
  className: string;
  current?: string;
  languageHref: string;
  children: ReactNode;
}) {
  const [menu, setMenu] = useState(false);
  const zh = lang === "zh";
  const t = (en: string, cn: string) => zh ? cn : en;
  const home = zh ? "/zh/" : "/";
  return (
    <div className={`editorial-site ${className}`}>
      <a className="skip" href="#main">{t("Skip to content", "跳至正文")}</a>
      <header className="header wrap">
        <a href={home} className="brand" aria-label="RedSeaRate home">
          <BrandLogo />
        </a>
        <nav id="main-navigation" className={menu ? "navigation open" : "navigation"} aria-label={t("Main navigation", "主导航")}>
          {platformNavigation.map((item) => (
            <a key={item.id} aria-current={item.id === current ? "page" : undefined}
              href={item.id === "rates" ? (zh ? "/zh/rates/" : "/rates/") : `${home}#${item.id}`}
              onClick={() => setMenu(false)}>{t(item.en, item.zh)}</a>
          ))}
          <div className="mobile-menu-actions">
            <a className="button small join-button" href={`${home}#join`}>{t("Join", "加入")}</a>
            <a className="button small coral" href={`${home}#estimate`}>{t("Get a quote", "获取报价")}</a>
          </div>
        </nav>
        <div className="header-actions">
          <a className="language" href={languageHref} lang={zh ? "en" : "zh-CN"}><Globe2 size={16} />{zh ? "EN" : "中文"}</a>
          <a className="button small join-button header-join" href={`${home}#join`}>{t("Join", "加入")}</a>
          <a className="button small coral header-quote" href={`${home}#estimate`}>{t("Get a quote", "获取报价")}<ArrowUpRight size={15} /></a>
          <button className="menu-toggle" aria-controls="main-navigation" aria-expanded={menu}
            aria-label={t("Toggle navigation", "展开导航")} onClick={() => setMenu(!menu)}>{menu ? <X /> : <Menu />}</button>
        </div>
      </header>
      <main id="main">{children}</main>
      <footer className="wrap">
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} RedSeaRate</span>
          <span>{t("Operator details pending confirmation", "运营信息待确认")}</span>
          <a className="text-button" href={zh ? "/zh/market-brief/" : "/market-brief/"}>{t("Market brief archive", "市场简报归档")}</a>
          <a className="text-button" href={home}>{t("Back to homepage", "返回首页")}<ArrowUpRight size={14} /></a>
        </div>
      </footer>
    </div>
  );
}
