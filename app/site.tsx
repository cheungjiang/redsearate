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
  Check,
  ShieldCheck,
  Clock3,
  MapPin,
  MoveRight,
  ChevronDown,
  Box,
  Info,
  Copy,
  MessageCircle,
} from "lucide-react";
import {
  defaultShipment,
  destinations,
  origins,
  estimate,
  laneKey,
  shipmentKey,
  MARKET_WINDOW_DAYS,
  MIN_MARKET_SAMPLES,
  type Shipment,
  type Snapshot,
} from "../lib/rates";

export type Contact = { operator: string; wechat: string; whatsapp: string[] };

export default function Home({
  lang,
  snapshot,
  contact,
}: {
  lang: "en" | "zh";
  snapshot: Snapshot;
  contact: Contact;
}) {
  const zh = lang === "zh";
  const t = (en: string, cn: string) => (zh ? cn : en);
  const [shipment, setShipment] = useState<Shipment>(defaultShipment);
  const [result, setResult] = useState<ReturnType<typeof estimate> | null>(
    null,
  );
  const [menu, setMenu] = useState(false);
  const trend =
    snapshot.trends[shipmentKey(shipment)] ??
    snapshot.trends[laneKey(shipment.origin, shipment.destination, "40HC")] ??
    [];
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
  const [article, setArticle] = useState<number | null>(null);
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
  const lane = snapshot.lanes[shipmentKey(shipment)];
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
          "Ocean freight quote request (redsearate.com)",
          "海运询价（redsearate.com）",
        )
      : t("Booking request (redsearate.com)", "订舱需求（redsearate.com）"),
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
      ?.scrollIntoView({ behavior: "smooth", block: "center" });
  }
  const guides = [
    {
      tag: t("MARKET OUTLOOK", "市场观察"),
      title: t(
        "What really moves your Red Sea freight rate?",
        "哪些因素真正影响红海运价？",
      ),
      body: t(
        "Capacity, seasonality, equipment availability and routing all affect a freight quote. Compare the same scope and sailing window, not just the headline number. Our trend chart shows weekly medians of prices our team collects in the market, with outliers removed; it is not an official index.",
        "运力、季节、设备供应和航线安排都会影响报价。比较报价时，应确保费用范围和出运窗口一致，而不只是比较数字。本页趋势是团队在市场上收集报价的周中位数，已剔除异常值，并非官方指数。",
      ),
    },
    {
      tag: t("SHIPPING GUIDE", "运输指南"),
      title: t(
        "Jeddah, Sokhna or Aqaba: choose your gateway.",
        "吉达、苏赫纳或亚喀巴：如何选择门户港？",
      ),
      body: t(
        "Jeddah serves western Saudi Arabia; Sokhna connects to the Egyptian market; Aqaba is Jordan’s maritime gateway. Confirm inland delivery, customs requirements and destination charges before choosing a port. Port Sudan services require additional operational checks.",
        "吉达服务沙特西部，苏赫纳连接埃及市场，亚喀巴是约旦的海运门户。选择前请确认内陆配送、清关要求和目的港费用。苏丹港航线需额外核实运营条件。",
      ),
    },
    {
      tag: t("PLAN YOUR SHIPMENT", "出运准备"),
      title: t(
        "Your first shipment? Start with this checklist.",
        "首次出运？从这份清单开始。",
      ),
      body: t(
        "Prepare cargo descriptions, HS codes, dimensions, gross weight, ready date and Incoterms. Check commercial invoice, packing list and consignee details. Dangerous goods and batteries need separate review. Ask for a written, itemized quote and confirmed sailing before committing.",
        "准备品名、HS 编码、尺寸、毛重、备货日期及贸易条款。核对商业发票、装箱单及收货人资料。危险品、电池货物需要单独审核。确认书面费用清单及实际船期后，再安排出运。",
      ),
    },
  ];
  return (
    <>
      <a className="skip" href="#main">
        {t("Skip to content", "跳至正文")}
      </a>
      <div className="announcement">
        <span>
          {t(
            "A clearer course for China–Red Sea shipping.",
            "让中国至红海的每一次出运，更有把握。",
          )}
        </span>
        <a href="#estimate">
          {t("Plan your next shipment", "规划下一次出运")}{" "}
          <ArrowUpRight size={12} />
        </a>
      </div>
      <header className="header wrap">
        <a
          href={zh ? "/zh" : "/"}
          className="brand"
          aria-label="Red Sea Rate home"
        >
          <span className="brand-symbol">≈</span>
          <span>
            redsea<span className="brand-light">rate</span>
            <span className="brand-dot">.</span>
          </span>
        </a>
        <nav
          className={menu ? "navigation open" : "navigation"}
          aria-label={t("Main navigation", "主导航")}
        >
          <a onClick={() => setMenu(false)} href="#routes">
            {t("Ocean rates", "海运运价")}
          </a>
          <a onClick={() => setMenu(false)} href="#trends">
            {t("Market insights", "市场趋势")}
          </a>
          <a onClick={() => setMenu(false)} href="#guides">
            {t("Shipping guides", "运输指南")}
          </a>
        </nav>
        <div className="header-actions">
          <a
            className="language"
            href={zh ? "/" : "/zh"}
            lang={zh ? "en" : "zh-CN"}
          >
            <Globe2 size={16} />
            {zh ? "EN" : "中文"}
          </a>
          {whatsappNumber && (
            <a
              className="button small whatsapp header-quote"
              href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(inquiryText)}`}
              target="_blank"
              rel="noopener"
            >
              <MessageCircle size={15} />
              WhatsApp
            </a>
          )}
          <button
            className="button small dark header-quote"
            onClick={() => openInquiry("quote")}
          >
            {t("Get a quote", "获取报价")}
            <ArrowUpRight size={15} />
          </button>
          <button
            className="menu-toggle"
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
            <div className="eyebrow">
              <span /> {t("CHINA → THE RED SEA", "中国 → 红海")}
            </div>
            <h1>
              {t("Less guesswork.", "运价，心中有数。")}
              <br />
              {t("More", "出运，")} <em>{t("horizon.", "更有把握。")}</em>
            </h1>
            <p>
              {t(
                "Know your freight. Plan your next move. Ocean rates from China to the Red Sea, from a team that books them every week.",
                "从中国到红海，看清本周海运价格，规划下一步。价格来自每周真实订舱的团队。",
              )}
            </p>
            <a className="button coral" href="#estimate">
              {t("Find your ocean rate", "估算我的海运费")}
              <ArrowRight size={18} />
            </a>
            <div className="hero-trust">
              <span>
                <ShieldCheck size={16} />
                {t("Dated, expiring prices", "价格标明有效期")}
              </span>
              <span>
                <Anchor size={16} />
                {t("Port-to-port expertise", "专注港到港运输")}
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
                <span /> {t("YOUR NEXT CHAPTER, OVERSEAS", "下一程，向海而行")}
              </span>
              <ArrowUpRight size={24} />
            </div>
            <div className="route-overlay">
              <div>
                <span>CN</span>
                <div>
                  <small>{t("ORIGIN", "起运地")}</small>
                  <strong>{t("China", "中国")}</strong>
                </div>
              </div>
              <div className="route-line">
                <span />
                <Ship size={19} />
                <span />
              </div>
              <div>
                <div>
                  <small>{t("DESTINATION", "目的地")}</small>
                  <strong>{t("Red Sea", "红海")}</strong>
                </div>
                <span>RS</span>
              </div>
            </div>
          </div>
        </section>
        <section id="estimate" className="estimator wrap">
          <div className="estimate-top">
            <div>
              <h2>
                <Ship size={20} />
                {t(
                  "A smarter start to your shipment.",
                  "从清晰的海运估价开始。",
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
                `USD · Updated ${snapshot.today}`,
                `美元 · ${snapshot.today} 更新`,
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
                          `Market reference appears once ${MIN_MARKET_SAMPLES} current prices are collected for this lane.`,
                          `该航线收集满 ${MIN_MARKET_SAMPLES} 条有效市场报价后显示市场参考。`,
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
        <div className="benefit-strip wrap">
          <span>{t("BUILT FOR YOUR NEXT MOVE", "为下一次出运而来")}</span>
          <div>
            <Check size={15} />
            {t("Major China origins", "覆盖中国主要港口")}
          </div>
          <div>
            <Check size={15} />
            {t("Red Sea gateways", "连接红海门户港")}
          </div>
          <div>
            <Check size={15} />
            {t("FCL & LCL options", "整柜与拼箱方案")}
          </div>
          <div>
            <Check size={15} />
            {t("Human support, start to finish", "从咨询到出运的支持")}
          </div>
        </div>
        <section id="routes" className="section wrap">
          <div className="section-heading">
            <div>
              <div className="eyebrow muted">
                {t("FIND YOUR WAY", "找到您的航线")}
              </div>
              <h2>
                {t("One sea. More possibilities.", "一片红海，更多可能。")}
              </h2>
              <p>
                {t(
                  "Explore the gateways connecting your business to what’s next.",
                  "探索连接中国与红海市场的海运门户。",
                )}
              </p>
            </div>
            <a href="#estimate" className="text-button">
              {t("Explore your route", "规划我的航线")}
              <ArrowUpRight size={17} />
            </a>
          </div>
          <div className="route-cards">
            {destinations.map((p) => {
              const card = snapshot.lanes[laneKey("Shanghai", p.id, "40HC")];
              return (
                <button
                  key={p.id}
                  className="route-card"
                  onClick={() => selectRoute(p.id)}
                >
                  <div className="route-card-top">
                    <span className="port-code">{p.code}</span>
                    <ArrowUpRight size={18} />
                  </div>
                  <span className="route-country">
                    {zh ? p.countryZh : p.country}
                  </span>
                  <h3>
                    {zh ? p.zh : p.id}
                    <span>↗</span>
                  </h3>
                  <div className="card-path">
                    {t("Shanghai", "上海")}
                    <span>⟶</span>
                    {zh ? p.zh : p.id}
                  </div>
                  <div className="card-price">
                    <small>
                      {card?.offer
                        ? t("Our offer from", "本站报价起")
                        : card?.market
                          ? t("Market median", "市场中位数")
                          : t("No current price", "暂无有效价格")}
                    </small>
                    <strong>
                      {card?.offer
                        ? money(card.offer.low)
                        : card?.market
                          ? money(card.market.median)
                          : t("On request", "请询价")}
                      {(card?.offer || card?.market) && <span> / 40HC</span>}
                    </strong>
                  </div>
                  <div className="card-bottom">
                    <span>
                      <Clock3 size={13} />
                      {card?.offer?.transitMin
                        ? `${card.offer.transitMin}–${card.offer.transitMax ?? card.offer.transitMin} ${t("days", "天")}`
                        : t("Transit on request", "航程请询价")}
                    </span>
                    <span className={card?.offer ? "badge" : "badge amber"}>
                      {card?.offer
                        ? `${t("Valid to", "有效至")} ${card.offer.validUntil.slice(5)}`
                        : card?.market
                          ? t("Market reference", "市场参考")
                          : t("Ask us", "联系询价")}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
          <p className="fine-print">
            <Info size={13} />
            {t(
              "Shanghai → destination, USD per 40HC, port-to-port ocean freight. Our offers are prices we can book; market references summarise prices collected by our team. Expired prices switch to “on request”.",
              "上海起运，美元 / 40HC，港到港海运费。本站报价是我们能订到的价格；市场参考是团队收集的市场报价统计。过期价格自动显示为请询价。",
            )}
          </p>
        </section>
        <section id="trends" className="insights-section">
          <div className="wrap insight-layout">
            <div className="insight-copy">
              <div className="eyebrow muted">
                {t("SEE THE BIGGER PICTURE", "看见市场的另一面")}
              </div>
              <h2>
                {t("The market moves.", "市场在变化。")}
                <br />
                {t("Stay a step ahead.", "规划快一步。")}
              </h2>
              <p>
                {t(
                  "A rate is only one part of the story. Understand the forces behind it and make your next shipping decision with more perspective.",
                  "运价只是故事的一部分。了解影响价格的因素，让下一次出运决策更从容。",
                )}
              </p>
              <div className="market-note">
                <span className="mini-line" />
                <div>
                  <strong>
                    {t(
                      "Plan for a range, not a promise.",
                      "用区间规划，不把估价当承诺。",
                    )}
                  </strong>
                  <p>
                    {t(
                      "Routing changes and capacity constraints can affect both cost and transit time. Confirm before booking.",
                      "航线调整与运力变化会影响费用及航程，订舱前请确认最新情况。",
                    )}
                  </p>
                </div>
              </div>
              <button
                className="text-button"
                onClick={() => {
                  setArticle(0);
                  articleDialog.current?.showModal();
                }}
              >
                {t("Understand the market", "了解运价影响因素")}
                <ArrowUpRight size={16} />
              </button>
            </div>
            <div className="chart-card">
              <div className="chart-top">
                <div>
                  <h3>
                    {port(shipment.origin)} → {port(shipment.destination)}
                  </h3>
                  <p>
                    {t(
                      `Weekly median of team-collected market prices · USD / ${trend.length && !snapshot.trends[shipmentKey(shipment)] ? "40HC" : shipment.mode === "LCL" ? "W/M" : shipment.container}`,
                      `团队收集的市场报价周中位数 · 美元 / ${trend.length && !snapshot.trends[shipmentKey(shipment)] ? "40HC" : shipment.mode === "LCL" ? "W/M" : shipment.container}`,
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
                      `A weekly trend appears once a week has ${MIN_MARKET_SAMPLES} or more market prices for this lane. We do not fill gaps with estimates.`,
                      `该航线某一周收集满 ${MIN_MARKET_SAMPLES} 条市场报价后显示周趋势，不用估算数据补空。`,
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
          </div>
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
            {guides.map((g, i) => (
              <button
                className="guide-card"
                key={g.tag}
                onClick={() => {
                  setArticle(i);
                  articleDialog.current?.showModal();
                }}
              >
                <div className={"guide-art art-" + i}>
                  {i === 0 ? (
                    <svg viewBox="0 0 300 140" aria-hidden="true">
                      <path
                        d="M0 115L40 90L65 102L100 51L130 73L170 34L200 52L245 14L300 35"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      />
                      <path
                        d="M0 137L45 115L100 130L150 89L210 108L260 67L300 77"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1"
                        opacity=".35"
                      />
                    </svg>
                  ) : i === 1 ? (
                    <>
                      <span className="map-word">
                        {t("THE RED SEA", "红海")}
                      </span>
                      <div className="map-route">
                        <span /> <span /> <span />
                      </div>
                      <span className="map-caption">
                        JEDDAH — SOKHNA — AQABA
                      </span>
                    </>
                  ) : (
                    <>
                      <div className="container-line" />
                      <Box size={64} strokeWidth={0.7} />
                      <span className="check-art">
                        <Check size={26} />
                      </span>
                    </>
                  )}
                  <ArrowUpRight size={18} className="art-arrow" />
                </div>
                <span className="article-tag">
                  {g.tag} <span>{t("QUICK READ", "出运速读")}</span>
                </span>
                <h3>{g.title}</h3>
                <span className="guide-read">
                  {t("Read the guide", "阅读全文")}
                  <ArrowRight size={15} />
                </span>
              </button>
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
            {[
              {
                q: t(
                  "What is the difference between our offer and market reference?",
                  "本站报价和市场参考有什么区别？",
                ),
                a: t(
                  "Our offers are prices we can book until the date shown. Market references are statistics of prices our team collects, not offers. Space and the final itemised price are confirmed on WeChat or WhatsApp.",
                  "本站报价是在标注日期前我们能订到的价格；市场参考是团队收集的市场报价统计，不是报价。舱位和最终费用明细以微信或 WhatsApp 确认为准。",
                ),
              },
              {
                q: t(
                  "What is included in the estimate?",
                  "参考运价包含哪些费用？",
                ),
                a: t(
                  "Port-to-port ocean freight for the total shipment entered. Local handling, documentation, customs, duties, insurance and inland transport are excluded. LCL bills the larger of cubic metres or metric tonnes, minimum 1 W/M.",
                  "按所填货量计算的港到港海运费合计，不含本地操作、单证、清关、税费、保险和内陆运输。拼箱按立方米与公吨中较大值计费，最低 1 W/M。",
                ),
              },
              {
                q: t(
                  "Can I reserve space through this website?",
                  "可以通过网站预订舱位吗？",
                ),
                a: t(
                  "Send us a booking request on WeChat or WhatsApp. Space is reserved only after we confirm the sailing and price with you.",
                  "通过微信或 WhatsApp 发送订舱需求。我们与您确认船期和价格后，舱位才算预留。",
                ),
              },
            ].map((f) => (
              <details key={f.q}>
                <summary>
                  {f.q}
                  <ChevronDown size={17} />
                </summary>
                <p>{f.a}</p>
              </details>
            ))}
          </div>
        </section>
      </main>
      <footer className="wrap">
        <div className="footer-main">
          <a href={zh ? "/zh" : "/"} className="brand">
            <span className="brand-symbol">≈</span>
            <span>
              redsea<span className="brand-light">rate</span>
              <span className="brand-dot">.</span>
            </span>
          </a>
          <p>
            {t(
              "A clearer course. From China to the Red Sea.",
              "从中国到红海，让每一次出运更清晰。",
            )}
          </p>
          <a href="#estimate">
            {t("Estimate a shipment", "估算运费")}
            <ArrowUpRight size={14} />
          </a>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} Red Sea Rate</span>
          <span>
            {t(
              `Operated by ${contact.operator}`,
              `由 ${contact.operator} 运营`,
            )}
          </span>
          <button
            onClick={() => {
              setArticle(3);
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
            "We reply on WeChat or WhatsApp, usually the same working day.",
            "我们通过微信或 WhatsApp 回复，通常当个工作日内。",
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
          aria-label={t("Close guide", "关闭文章")}
          onClick={() => articleDialog.current?.close()}
        >
          <X size={21} />
        </button>
        <div className="eyebrow">
          {article === 3
            ? t("YOUR DATA", "您的数据")
            : guides[article ?? 0].tag}
        </div>
        <h2 id="article-title">
          {article === 3
            ? t("Privacy, without the fine print.", "关于隐私，清楚说明。")
            : guides[article ?? 0].title}
        </h2>
        <p>
          {article === 3
            ? t(
                "This website does not collect names, emails or other personal data, and uses no analytics or advertising cookies. When you contact us, your message is handled in WeChat or WhatsApp under those apps' terms. Prices shown are aggregated from our team's records; individual market quotes are never published.",
                "本网站不收集姓名、邮箱等个人信息，也不使用统计或广告 Cookie。您联系我们时，消息在微信或 WhatsApp 中处理，适用各自的条款。页面价格来自团队记录的汇总，单条市场报价不会公开。",
              )
            : guides[article ?? 0].body}
        </p>
        {article !== 3 && (
          <button
            className="button coral"
            onClick={() => {
              articleDialog.current?.close();
              openInquiry("quote");
            }}
          >
            {t("Discuss your shipment", "咨询我的出运方案")}
            <ArrowRight size={16} />
          </button>
        )}
      </dialog>
    </>
  );
}
