"use client";
import { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  ArrowDownRight,
  Anchor,
  Ship,
  Globe2,
  Menu,
  X,
  ShieldCheck,
  Clock3,
  MapPin,
  MoveRight,
  ChevronDown,
  Box,
  Copy,
  MessageCircle,
} from "lucide-react";
import {
  defaultShipment,
  destinations,
  origins,
  estimate,
  laneView,
  MARKET_WINDOW_DAYS,
  type Shipment,
  type Snapshot,
} from "../lib/rates";
import { platformNavigation, type IndexEntry, type LatestQuote, type SimulationPreview } from "../lib/platform";
import { marketBrief } from "../lib/seo";
import { CommunityPreview, IndexSnapshot, LatestPosts, RatesPreview } from "./platform-sections";
import { faqs, guides, type Localized } from "../lib/content";

export type Contact = { wechat: string; whatsapp: string[] };

export default function Home({
  lang,
  snapshot,
  index,
  latest,
  contact,
  simulation,
}: {
  lang: "en" | "zh";
  snapshot: Snapshot;
  index: IndexEntry[];
  latest: LatestQuote[];
  contact: Contact;
  simulation: SimulationPreview | null;
}) {
  const zh = lang === "zh";
  const t = (en: string, cn: string) => (zh ? cn : en);
  const pick = (text: Localized) => (zh ? text.zh : text.en);
  const [shipment, setShipment] = useState<Shipment>(defaultShipment);
  const [result, setResult] = useState<ReturnType<typeof estimate> | null>(
    null,
  );
  const [menu, setMenu] = useState(false);
  const { lane, trend, equipment } = laneView(snapshot, shipment);
  const trendValues = trend.map((p) => p.median);
  const trendTop = Math.ceil((Math.max(...trendValues) * 1.05) / 100) * 100;
  const trendBottom = Math.floor((Math.min(...trendValues) * 0.95) / 100) * 100;
  const trendY = (value: number) =>
    170 - ((value - trendBottom) / (trendTop - trendBottom || 1)) * 140;
  const trendPoints = trend
    .map(
      (p, index) =>
        `${48 + (index * 537) / Math.max(trend.length - 1, 1)},${trendY(p.median)}`,
    )
    .join(" ");
  const trendChange =
    trend.length > 1
      ? ((trendValues[trendValues.length - 1] / trendValues[0] - 1) * 100)
          .toFixed(1)
          .replace("-", "−")
      : "0.0";
  const [intent, setIntent] = useState<"quote" | "booking">("quote");
  const [cargo, setCargo] = useState("");
  const [copied, setCopied] = useState("");
  const dialog = useRef<HTMLDialogElement>(null);
  const articleDialog = useRef<HTMLDialogElement>(null);
  const [today, setToday] = useState("");
  const [estimatorVisible, setEstimatorVisible] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setEstimatorVisible(entry.isIntersecting),
      { rootMargin: "0px 0px -80px 0px" },
    );
    observer.observe(document.getElementById("estimate")!);
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    document.documentElement.lang = zh ? "zh-CN" : "en";
    setToday(
      new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Shanghai" }),
    );
    setShipment((s) => ({
      ...s,
      date: new Date(Date.now() + 14 * 86400000).toLocaleDateString("en-CA", {
        timeZone: "Asia/Shanghai",
      }),
    }));
  }, [zh]);
  const set = <K extends keyof Shipment>(key: K, value: Shipment[K]) => {
    setShipment((s) => ({ ...s, [key]: value }));
    setResult(null);
  };
  const money = (n: number) => "$" + n.toLocaleString("en-US");
  const port = (id: string) => {
    const p = [...origins, ...destinations].find((p) => p.id === id);
    return zh ? p?.zh : id;
  };
  function openInquiry(value: "quote" | "booking") {
    setIntent(value);
    setCopied("");
    dialog.current?.showModal();
  }
  const quoted = (() => {
    try {
      return estimate(lane, shipment);
    } catch {
      return null;
    }
  })();
  const inquiryText = [
    intent === "quote"
      ? t(
          "RedSeaRate ocean freight quote request (redsearate.com)",
          "RedSeaRate 海运询价（redsearate.com）",
        )
      : t("RedSeaRate booking request (redsearate.com)", "RedSeaRate 订舱需求（redsearate.com）"),
    `${t("Route", "航线")}: ${port(shipment.origin)} → ${port(shipment.destination)}`,
    shipment.mode === "FCL"
      ? `${t("Equipment", "柜型")}: ${shipment.quantity} × ${shipment.container}`
      : `${t("LCL", "拼箱")}: ${shipment.volume} CBM / ${shipment.weight} kg`,
    `${t("Cargo ready", "备货日期")}: ${shipment.date || "-"}`,
    quoted?.offer
      ? `${t("Page offer", "页面报价")}: ${money(quoted.offer.low)}${quoted.offer.high !== quoted.offer.low ? `–${money(quoted.offer.high)}` : ""} (${t("valid until", "有效至")} ${quoted.offer.validUntil})`
      : quoted?.market
        ? `${t("Market reference", "市场参考价")}: ≈ ${money(quoted.market.median)} (${t(`median of ${quoted.market.count} prices`, `${quoted.market.count} 条中位数`)})`
        : `${t("Page offer", "页面报价")}: ${t("on request", "请询价")}`,
    `${t("Cargo", "货物")}: ${cargo || "-"}`,
  ].join("\n");
  // Each visitor keeps the same randomly assigned colleague across visits.
  const [whatsapp, setWhatsapp] = useState("");
  useEffect(() => {
    const saved = localStorage.getItem("whatsapp-agent");
    const number =
      saved && contact.whatsapp.includes(saved)
        ? saved
        : contact.whatsapp[Math.floor(Math.random() * contact.whatsapp.length)];
    if (!number) return;
    localStorage.setItem("whatsapp-agent", number);
    setWhatsapp(number);
  }, [contact.whatsapp]);
  const whatsappNumber = whatsapp.replace(/\D/g, "");
  async function copyInquiry(then?: () => void) {
    try {
      await navigator.clipboard.writeText(inquiryText);
      setCopied(
        t("Copied. Paste it into WeChat.", "已复制，粘贴到微信发给我们。"),
      );
    } catch {
      setCopied(
        t(
          "Copy failed. Select the text above.",
          "复制失败，请手动选择上方文字。",
        ),
      );
    }
    then?.();
  }
  function selectRoute(id: string) {
    setShipment((s) => ({ ...s, destination: id }));
    setResult(null);
    document
      .getElementById("estimate")
      ?.scrollIntoView({ block: "center" });
  }
  return (
    <div className="editorial-site">
      <a className="skip" href="#main">
        {t("Skip to content", "跳至正文")}
      </a>
      <header className="header wrap">
        <a
          href={zh ? "/zh/" : "/"}
          className="brand"
          aria-label="RedSeaRate home"
        >
          <span className="brand-symbol" aria-hidden="true">≈</span>
          <span>
            RedSeaRate
          </span>
        </a>
        <nav
          id="main-navigation"
          className={menu ? "navigation open" : "navigation"}
          aria-label={t("Main navigation", "主导航")}
        >
          {platformNavigation.map((item) => (
            <a key={item.id} onClick={() => setMenu(false)} href={`#${item.id}`}>
              {t(item.en, item.zh)}
            </a>
          ))}
          <div className="mobile-menu-actions">
            <a className="button small join-button" href="#join" onClick={() => setMenu(false)}>{t("Join", "加入")}</a>
            <button className="button small coral" onClick={() => { setMenu(false); openInquiry("quote"); }}>{t("Get a quote", "获取报价")}</button>
          </div>
        </nav>
        <div className="header-actions">
          <a
            className="language"
            href={zh ? "/" : "/zh/"}
            lang={zh ? "en" : "zh-CN"}
          >
            <Globe2 size={16} />
            {zh ? "EN" : "中文"}
          </a>
          <a className="button small join-button header-join" href="#join">{t("Join", "加入")}</a>
          <button
            className="button small coral header-quote"
            onClick={() => openInquiry("quote")}
          >
            {t("Get a quote", "获取报价")}
            <ArrowUpRight size={15} />
          </button>
          <button
            className="menu-toggle"
            aria-controls="main-navigation"
            aria-expanded={menu}
            aria-label={t("Toggle navigation", "展开导航")}
            onClick={() => setMenu(!menu)}
          >
            {menu ? <X /> : <Menu />}
          </button>
        </div>
      </header>
      <main id="main">
        <section className="hero wrap">
          <div className="hero-copy">
            <h1 className="hero-title">
              <span className="eyebrow">
                {t("OCEAN FREIGHT · CHINA → RED SEA", "海运整箱与拼箱 · 中国 → 红海")}
              </span>
              <span className="hero-headline">
                {t("From China.", "从中国。")}
                <br />
                {t("To the Red Sea.", "到红海。")}
              </span>
            </h1>
            <p>
              {t(
                "Ocean freight from China to Jeddah, Sokhna, Aqaba, Djibouti and Port Sudan. Compare the route. Know the costs. Plan your next shipment.",
                "从中国出发，连接吉达、苏赫纳、亚喀巴、吉布提与苏丹港。看清航线与费用，再安排下一程。",
              )}
            </p>
            <div className="hero-actions">
              <a className="button coral" href="#estimate">
                {t("Get an Estimate", "获取海运估价")}
                <ArrowRight size={18} />
              </a>
              <a className="text-link" href="#rates">
                {t("Explore the route", "查看航线")}
                <ArrowUpRight size={15} />
              </a>
            </div>
            <div className="hero-trust">
              <span>
                <ShieldCheck size={16} />
                <span><strong>{t("Clear rate scope", "费用口径清楚")}</strong><small>{t("Ocean freight, port to port", "港到港海运费")}</small></span>
              </span>
              <span>
                <Anchor size={16} />
                <span><strong>{t("Dated references", "参考价有有效期")}</strong><small>{t("No expired quotes", "不展示过期报价")}</small></span>
              </span>
              <span>
                <Globe2 size={16} />
                <span><strong>{t("Talk to our team", "直接联系团队")}</strong><small>{t("WeChat & WhatsApp", "微信与 WhatsApp")}</small></span>
              </span>
            </div>
          </div>
          <div className="hero-visual">
            <img
              src="/ship.webp"
              alt={t(
                "Aerial view of a container ship crossing deep teal ocean",
                "集装箱船航行于深蓝海面的航拍画面",
              )}
              fetchPriority="high"
              width="1536"
              height="1024"
            />
            <div className="image-top">
              <span className="image-label">
                {t("A CLEARER ROUTE.", "下一程，向海而行。")}<br />
                {t("A BROADER HORIZON.", "先看清，再出发。")}
              </span>
              <ArrowUpRight size={24} />
            </div>
          </div>
        </section>
        <IndexSnapshot lang={lang} liveEntries={index} demoEntries={simulation?.index ?? null} asOf={snapshot.today} brief={marketBrief(index, snapshot.today, lang)} />
        <RatesPreview lang={lang} snapshot={snapshot} shipment={shipment} samples={simulation?.rates ?? []} onSelect={selectRoute} />
        <LatestPosts lang={lang} quotes={latest} />
        <section id="estimate" className="estimator wrap">
          <div className="estimate-top">
            <div>
              <h2>
                <Ship size={20} />
                {t(
                  "Get an ocean freight estimate",
                  "查一程海运，心中有数",
                )}
              </h2>
              <p>
                {t(
                  "Your route. Your cargo. A clearer picture.",
                  "输入航线与货量，获取预算参考。",
                )}
              </p>
            </div>
            <div
              className="segmented"
              aria-label={t("Shipping mode", "运输方式")}
            >
              {(["FCL", "LCL"] as const).map((mode) => (
                <button
                  key={mode}
                  aria-pressed={shipment.mode === mode}
                  className={shipment.mode === mode ? "active" : ""}
                  onClick={() => set("mode", mode)}
                >
                  {mode}{" "}
                  <span>
                    {mode === "FCL"
                      ? t("Full container", "整柜")
                      : t("Shared container", "拼箱")}
                  </span>
                </button>
              ))}
            </div>
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setResult(estimate(lane, shipment));
            }}
          >
            <div className="estimate-fields">
              <label>
                <span>
                  <MapPin size={13} />
                  {t("Origin port", "起运港")}
                </span>
                <select
                  value={shipment.origin}
                  onChange={(e) => set("origin", e.target.value)}
                >
                  {origins.map((p) => (
                    <option key={p.id} value={p.id}>
                      {zh ? p.zh : p.id}, {t("China", "中国")}
                    </option>
                  ))}
                </select>
              </label>
              <span className="field-arrow">
                <MoveRight size={20} />
              </span>
              <label>
                <span>
                  <MapPin size={13} />
                  {t("Destination port", "目的港")}
                </span>
                <select
                  value={shipment.destination}
                  onChange={(e) => set("destination", e.target.value)}
                >
                  {destinations.map((p) => (
                    <option key={p.id} value={p.id}>
                      {zh ? p.zh : p.id}, {zh ? p.countryZh : p.country}
                    </option>
                  ))}
                </select>
              </label>
              {shipment.mode === "FCL" ? (
                <>
                  <label>
                    <span>
                      <Box size={13} />
                      {t("Container type", "柜型")}
                    </span>
                    <select
                      value={shipment.container}
                      onChange={(e) => set("container", e.target.value)}
                    >
                      <option value="20GP">20GP · 20′</option>
                      <option value="40GP">40GP · 40′</option>
                      <option value="40HC">40HC · 40′</option>
                    </select>
                  </label>
                  <label className="quantity">
                    <span>{t("Quantity", "数量")}</span>
                    <input
                      aria-label={t("Container quantity", "集装箱数量")}
                      required
                      type="number"
                      min="1"
                      max="100"
                      value={shipment.quantity}
                      onChange={(e) => set("quantity", Number(e.target.value))}
                    />
                  </label>
                </>
              ) : (
                <>
                  <label>
                    <span>{t("Volume (CBM)", "体积（立方米）")}</span>
                    <input
                      required
                      type="number"
                      min="0.1"
                      step="0.1"
                      max="1000"
                      value={shipment.volume}
                      onChange={(e) => set("volume", Number(e.target.value))}
                    />
                  </label>
                  <label className="weight">
                    <span>{t("Weight (kg)", "重量（公斤）")}</span>
                    <input
                      required
                      type="number"
                      min="1"
                      max="1000000"
                      value={shipment.weight}
                      onChange={(e) => set("weight", Number(e.target.value))}
                    />
                  </label>
                </>
              )}
              <label>
                <span>
                  <Clock3 size={13} />
                  {t("Cargo ready date", "备货日期")}
                </span>
                <input
                  required
                  type="date"
                  min={today}
                  value={shipment.date}
                  onChange={(e) => set("date", e.target.value)}
                />
              </label>
              <button className="button coral estimate-button" type="submit">
                {t("Estimate rate", "获取估价")}
                <ArrowRight size={17} />
              </button>
            </div>
          </form>
          <div className="estimate-note">
            <ShieldCheck size={13} />
            {t(
              "No sign-up. No commitment. Just a better starting point.",
              "无需注册，无需承诺，先为出运做好准备。",
            )}
            <span>
              {t(
                `USD · Checked ${snapshot.today}`,
                `美元 · ${snapshot.today} 查询`,
              )}
            </span>
          </div>
          {result && (
            <div className="estimate-result" role="status">
              <div>
                <span className="eyebrow">
                  {result.offer
                    ? t("OUR OFFER", "本站报价")
                    : result.market
                      ? t("MARKET REFERENCE · MEDIAN", "市场参考价 · 中位数")
                      : t("NO CURRENT PRICE", "暂无有效价格")}
                </span>
                <h3>
                  {result.offer ? (
                    <>
                      {money(result.offer.low)}
                      {result.offer.high !== result.offer.low &&
                        ` – ${money(result.offer.high)}`}{" "}
                      <small>USD</small>
                    </>
                  ) : result.market ? (
                    <>
                      ≈ {money(result.market.median)} <small>USD</small>
                    </>
                  ) : (
                    t("Price on request", "请询价")
                  )}
                </h3>
                <p>
                  {port(shipment.origin)} → {port(shipment.destination)} ·{" "}
                  {shipment.mode === "FCL"
                    ? `${shipment.quantity} × ${shipment.container}`
                    : `${shipment.volume} CBM / ${shipment.weight} kg · ${result.units.toFixed(1)} W/M`}
                  {result.offer?.transitMin &&
                    ` · ${result.offer.transitMin}–${result.offer.transitMax ?? result.offer.transitMin} ${t("days", "天")}`}
                  {result.offer &&
                    ` · ${t("valid until", "有效至")} ${result.offer.validUntil}`}
                </p>
                <p className="market-line">
                  {result.market && !result.offer
                    ? t(
                        `Median of ${result.market.count} current prices collected by our team in the last ${MARKET_WINDOW_DAYS} days. Not a bookable offer: space and the final price are confirmed on WeChat or WhatsApp.`,
                        `近 ${MARKET_WINDOW_DAYS} 天团队收集的 ${result.market.count} 条有效报价的中位数，不是可直接订舱的报价；舱位和最终价格以微信或 WhatsApp 确认为准。`,
                      )
                    : result.market
                      ? t(
                          `Market reference: median ${money(result.market.median)} from ${result.market.count} team-collected prices in the last ${MARKET_WINDOW_DAYS} days.`,
                          `市场参考：近 ${MARKET_WINDOW_DAYS} 天团队收集的 ${result.market.count} 条报价，中位数 ${money(result.market.median)}。`,
                        )
                      : t(
                          "No current market price for this lane yet. Ask us for a quote.",
                          "该航线暂无有效市场报价，欢迎直接询价。",
                        )}
                </p>
              </div>
              <div className="result-actions">
                <button
                  className="button coral"
                  onClick={() => openInquiry("quote")}
                >
                  {t("Get a tailored quote", "获取专属报价")}
                  <ArrowRight size={16} />
                </button>
                <button
                  className="text-button"
                  onClick={() => openInquiry("booking")}
                >
                  {t("Request a booking", "提交订舱需求")}
                  <ArrowUpRight size={14} />
                </button>
              </div>
              <p className="result-disclaimer">
                {t(
                  "Total port-to-port ocean freight for the shipment entered. Excludes origin and destination charges, customs, insurance and inland transport. Space and final price are confirmed on WeChat or WhatsApp.",
                  "按所填货量计算的港到港海运费合计，不含起运港及目的港费用、清关、保险和内陆运输。舱位和最终价格以微信或 WhatsApp 确认为准。",
                )}
              </p>
            </div>
          )}
        </section>
        <div className="brief-overview wrap">
        <section id="brief" className="trend-section" aria-label={t("Brief: market reference", "市场简报：运价参考")}>
            <div className="chart-card">
              <div className="chart-top">
                <div>
                  <h2>{t("Rate trend", "运价走势")} <span>{port(shipment.origin)} → {port(shipment.destination)}</span></h2>
                  <p>
                    {t(
                      `Weekly market median · USD / ${equipment === "LCL" ? "W/M" : equipment}`,
                      `市场报价周中位数 · 美元 / ${equipment === "LCL" ? "W/M" : equipment}`,
                    )}
                  </p>
                </div>
              </div>
              {trend.length ? (
                <>
                  <div className="chart-summary">
                    <strong>
                      {money(trendValues[trendValues.length - 1])}
                    </strong>
                    {trend.length > 1 && (
                      <span>
                        {trendChange.startsWith("−") ? (
                          <ArrowDownRight size={14} />
                        ) : (
                          <ArrowUpRight size={14} />
                        )}
                        {trendChange}%{" "}
                        <small>
                          {t(
                            `since week of ${trend[0].week}`,
                            `较 ${trend[0].week} 当周`,
                          )}
                        </small>
                      </span>
                    )}
                  </div>
                  <svg
                    className="chart"
                    viewBox="0 0 600 190"
                    role="img"
                    aria-label={t(
                      `Weekly market median from ${trend[0].week}: ${trendValues.join(", ")} USD`,
                      `自 ${trend[0].week} 起的市场周中位数：${trendValues.join("、")} 美元`,
                    )}
                  >
                    {[trendTop, (trendTop + trendBottom) / 2, trendBottom].map(
                      (value) => (
                        <g key={value}>
                          <line
                            x1="45"
                            y1={trendY(value)}
                            x2="595"
                            y2={trendY(value)}
                            stroke="#e8e9e8"
                            strokeDasharray="3 4"
                          />
                          <text
                            x="0"
                            y={trendY(value) + 4}
                            fill="#86908f"
                            fontSize="11"
                          >
                            {Math.round(value)}
                          </text>
                        </g>
                      ),
                    )}
                    <polyline
                      points={trendPoints}
                      stroke="#e96650"
                      strokeWidth="2.5"
                      fill="none"
                      strokeLinejoin="round"
                    />
                    {trend.map((p, index) => (
                      <circle
                        key={p.week}
                        cx={48 + (index * 537) / Math.max(trend.length - 1, 1)}
                        cy={trendY(p.median)}
                        r={index === trend.length - 1 ? 4 : 2.5}
                        fill="#e96650"
                        stroke="white"
                        strokeWidth="1.5"
                      >
                        <title>{`${p.week}: ${money(p.median)} (${p.count})`}</title>
                      </circle>
                    ))}
                  </svg>
                  <div className="chart-months">
                    <span>{trend[0].week.slice(5)}</span>
                    {trend.length > 1 && (
                      <span>{trend[trend.length - 1].week.slice(5)}</span>
                    )}
                  </div>
                </>
              ) : (
                <div className="chart-empty">
                  <strong>{t("Collecting prices", "价格收集中")}</strong>
                  <p>
                    {t(
                      "No market prices collected for this lane yet. We do not fill gaps with estimates.",
                      "该航线暂未收集到市场报价，不用估算数据补空。",
                    )}
                  </p>
                </div>
              )}
              <div className="chart-footer">
                <span>
                  <i />
                  {t("Market reference, not our offer", "市场参考，非本站报价")}
                </span>
                <span>
                  {t(
                    "Outliers excluded · Not a forecast",
                    "已剔除异常值 · 非价格预测",
                  )}
                </span>
              </div>
            </div>
        </section>
        </div>
        <CommunityPreview lang={lang} onContact={() => openInquiry("quote")} />
        <section className="approach wrap">
          <h2>
            {t("More than a rate.", "不只是一个价格。")}<br />
            <span>{t("A straighter course.", "是一条更清楚的路。")}</span>
          </h2>
          <p>{t(
            "A useful quote starts with a clear scope. We connect your cargo, route and timing, then confirm the details with you.",
            "一份有用的报价，先把费用范围说清楚。从货物、航线到出运时间，我们与您逐项确认，让下一程更有把握。",
          )}</p>
          <button className="text-button" onClick={() => openInquiry("quote")}>
            {t("Discuss your shipment", "聊聊您的出运计划")}<ArrowRight size={20} />
          </button>
        </section>
        <section id="guides" className="section wrap">
          <div className="section-heading">
            <div>
              <div className="eyebrow muted">
                {t(
                  "A LITTLE KNOWLEDGE GOES A LONG WAY",
                  "多一点了解，少一点未知",
                )}
              </div>
              <h2>
                {t(
                  "Good cargo starts with good insight.",
                  "让知识，先于货物启航。",
                )}
              </h2>
            </div>
            <span className="guide-label">
              {t("THE RED SEA NOTEBOOK", "红海出运笔记")}
              <ArrowDownRight size={18} />
            </span>
          </div>
          <div className="guide-grid">
            {guides.map((g) => (
              <a
                className="guide-card"
                key={g.slug}
                href={`${zh ? "/zh" : ""}/guides/${g.slug}/`}
              >
                <span className="article-tag">
                  {pick(g.tag)} <span>{t("FULL GUIDE", "全文")}</span>
                </span>
                <h3>{pick(g.title)}</h3>
                <span className="guide-read">
                  {t("Read the guide", "阅读全文")}
                  <ArrowRight size={15} />
                </span>
              </a>
            ))}
          </div>
        </section>
        <section className="cta-section wrap">
          <div>
            <div className="eyebrow">
              {t("LET’S MOVE FORWARD", "下一程，一起出发")}
            </div>
            <h2>
              {t(
                "Your cargo. Our next conversation.",
                "您的货物，我们的下一次对话。",
              )}
            </h2>
            <p>
              {t(
                "Tell us what’s moving. We’ll help you find a clearer way forward.",
                "告诉我们您的出运计划，一起找到更清晰的运输方案。",
              )}
            </p>
          </div>
          <div>
            <button
              className="button coral"
              onClick={() => openInquiry("quote")}
            >
              {t("Let’s talk freight", "获取专属海运报价")}
              <ArrowUpRight size={18} />
            </button>
            <span>
              {t(
                "No obligation. Just a conversation.",
                "无需承诺，从一次咨询开始。",
              )}
            </span>
          </div>
        </section>
        <section className="faq wrap">
          <h2>{t("Before you set sail.", "出运前，您可能想了解。")}</h2>
          <div>
            {faqs.map((f) => (
              <details key={f.q.en}>
                <summary>
                  {pick(f.q)}
                  <ChevronDown size={17} />
                </summary>
                <p>{pick(f.a)}</p>
              </details>
            ))}
          </div>
        </section>
      </main>
      <footer className="wrap">
        <div className="footer-main">
          <a href={zh ? "/zh/" : "/"} className="brand">
            <span className="brand-symbol" aria-hidden="true">≈</span>
            <span>RedSeaRate</span>
          </a>
          <p>
            {t(
              "More than a rate. A straighter course.",
              "不止于运价，更是一条更直的航线。",
            )}
          </p>
          <a href="#estimate">
            {t("Estimate a shipment", "估算运费")}
            <ArrowUpRight size={14} />
          </a>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} RedSeaRate</span>
          <span>
            {t(
              "Operator details pending confirmation",
              "运营信息待确认",
            )}
          </span>
          <button
            onClick={() => {
              articleDialog.current?.showModal();
            }}
          >
            {t("Privacy & data", "隐私与数据")}
          </button>
        </div>
      </footer>
      <div className={`mobile-bar${estimatorVisible ? " context-hidden" : ""}`}>
        <a href="#estimate" className="button dark">
          {t("Estimate freight", "估算海运费")}
          <ArrowRight size={16} />
        </a>
        <button className="button coral" onClick={() => openInquiry("quote")}>
          {t("Get a quote", "获取报价")}
          <ArrowUpRight size={16} />
        </button>
        {whatsappNumber && (
          <a
            className="button whatsapp icon-only"
            href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(inquiryText)}`}
            target="_blank"
            rel="noopener"
            aria-label="WhatsApp"
          >
            <MessageCircle size={18} />
          </a>
        )}
      </div>
      <dialog
        ref={dialog}
        className="inquiry-dialog"
        aria-labelledby="inquiry-title"
        onClick={(e) => {
          if (e.target === e.currentTarget) dialog.current?.close();
        }}
      >
        <button
          className="dialog-close"
          aria-label={t("Close dialog", "关闭窗口")}
          onClick={() => dialog.current?.close()}
        >
          <X size={21} />
        </button>
        <div className="eyebrow">
          {t("LET’S TALK FREIGHT", "聊聊您的出运计划")}
        </div>
        <h2 id="inquiry-title">
          {intent === "quote"
            ? t("Send us your inquiry.", "把询价发给我们。")
            : t("Send us your booking request.", "把订舱需求发给我们。")}
        </h2>
        <p className="dialog-intro">
          {t(
            "Share your shipment details on WeChat or WhatsApp for a tailored quote.",
            "通过微信或 WhatsApp 发送出运信息，与团队确认专属报价。",
          )}
        </p>
        <label>
          {t("Cargo (optional)", "品名（选填）")}
          <input
            value={cargo}
            maxLength={120}
            onChange={(e) => setCargo(e.target.value)}
            placeholder={t("e.g. furniture, 18 t", "例如：办公家具，18 吨")}
          />
        </label>
        <pre className="inquiry-text">{inquiryText}</pre>
        <div className="contact-actions">
          <div className="contact-option">
            <span>
              {t("WeChat", "微信")} <b>{contact.wechat}</b>
            </span>
            <button className="button dark" onClick={() => copyInquiry()}>
              <Copy size={16} />
              {t("Copy for WeChat", "复制发微信")}
            </button>
          </div>
          {whatsappNumber && (
            <div className="contact-option">
              <span>
                WhatsApp <b>{whatsapp}</b>
              </span>
              <a
                className="button whatsapp"
                href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(inquiryText)}`}
                target="_blank"
                rel="noopener"
              >
                <MessageCircle size={16} />
                {t("Open WhatsApp", "打开 WhatsApp")}
              </a>
            </div>
          )}
        </div>
        <p className="copy-status" role="status">
          {copied}
        </p>
        <p className="fine-print">
          {t(
            "Nothing is sent or stored by this website. Space is reserved only after we confirm with you.",
            "本网站不发送也不保存任何信息。我们与您确认后，舱位才算预留。",
          )}
        </p>
      </dialog>
      <dialog
        ref={articleDialog}
        className="article-dialog"
        aria-labelledby="article-title"
        onClick={(e) => {
          if (e.target === e.currentTarget) articleDialog.current?.close();
        }}
      >
        <button
          className="dialog-close"
          aria-label={t("Close", "关闭")}
          onClick={() => articleDialog.current?.close()}
        >
          <X size={21} />
        </button>
        <div className="eyebrow">
          {t("YOUR DATA", "您的数据")}
        </div>
        <h2 id="article-title">
          {t("Privacy, without the fine print.", "关于隐私，清楚说明。")}
        </h2>
        <p>
          {t(
            "This website does not collect names, emails or other personal data, and uses no analytics or advertising cookies. When you contact us, your message is handled in WeChat or WhatsApp under those apps' terms. Market prices are shown without their source.",
            "本网站不收集姓名、邮箱等个人信息，也不使用统计或广告 Cookie。您联系我们时，消息在微信或 WhatsApp 中处理，适用各自的条款。市场价格展示时不包含来源信息。",
          )}
        </p>
      </dialog>
    </div>
  );
}
