import { useState } from "react";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { type IndexEntry, type LatestQuote, type SampleRate } from "../lib/platform";
import { sparklinePoints } from "../lib/sparkline";
import { RatesTable } from "./rates-table";
import { destinations, extraOriginNames, origins, type Shipment, type Snapshot } from "../lib/rates";

type Locale = { lang: "en" | "zh" };
const translate = (lang: Locale["lang"]) =>
  (en: string, zh: string) => lang === "zh" ? zh : en;

export function IndexSnapshot({ lang, liveEntries, demoEntries, asOf }: Locale & { liveEntries: IndexEntry[]; demoEntries: IndexEntry[] | null; asOf: string }) {
  const t = translate(lang);
  const [showDemo, setShowDemo] = useState(demoEntries !== null);
  const displayingDemo = demoEntries !== null && showDemo;
  const entries = displayingDemo ? demoEntries : liveEntries;
  const live = liveEntries.some((entry) => entry.median !== null);
  const changeText = (change: number | null) => change === null
    ? t("Unavailable", "暂不可用")
    : change > 0 ? `↑ +${change.toFixed(1)}%`
    : change < 0 ? `↓ ${change.toFixed(1)}%`
    : t("0.0% · Flat", "0.0% · 持平");
  return (
    <section id="index" className="index-snapshot wrap" aria-labelledby="index-title" aria-describedby="index-disclaimer" data-mode={displayingDemo ? "demo" : live ? "live" : "unpublished"}>
      <div className="platform-heading">
        <h2 id="index-title">{t("Red Sea index snapshot", "红海运价指数快照")}</h2>
        <div className="index-mode">
          <span className="platform-status">{displayingDemo ? t("Simulated data", "模拟数据") : live ? t("Market data", "市场数据") : t("Not enough data yet", "样本不足")}</span>
          {demoEntries !== null && <button className="text-button" type="button" aria-pressed={displayingDemo} aria-controls="index-values" onClick={() => setShowDemo((value) => !value)}>
            {showDemo ? t("Hide demo", "隐藏模拟") : t("Show demo", "查看模拟")}
          </button>}
        </div>
      </div>
      <p id="index-disclaimer" className="platform-note index-disclaimer">
        {displayingDemo ? t(
          "Demo only: illustrative Shanghai departures, USD per 40HQ. Rates, trends, weekly changes and sample counts are all simulated, not actual quotes or booking prices. Each line uses its own vertical scale. Live index rules remain unconfirmed.",
          "演示数据：模拟上海起运，美元 / 40HQ。运价、走势、周环比和样本量均为模拟，非实际报价，不可用于订舱。各折线独立缩放纵轴，不用于比较波动幅度。正式指数口径仍待确认。",
        ) : t(
          `Median of 40HQ market quotes collected in the last 28 days from all China origins, USD per container, port-to-port ocean freight. Outliers are dropped and the sample count shows how many quotes each median rests on; week on week compares with the same 28-day reading a week earlier. A market reading, not a bookable offer. Data as of ${asOf}.`,
          `各港口近 28 天收集的中国各起运港 40HQ 市场报价中位数，美元/柜，仅港到港海运费。已剔除异常值，样本量显示中位数基于几条报价；周环比对比一周前的同口径读数。这是市场读数，不是可订舱报价。数据截至 ${asOf}。`,
        )}
      </p>
      <div id="index-values" className="index-grid" aria-live="polite">
        {entries.map(({ port, median, weekChange, sampleSize, weeklyMedians }) => (
          <article className="index-port" key={port.id}>
            <span className="index-code">{port.code}</span>
            <h3>{lang === "zh" ? port.zh : port.id}</h3>
            <dl>
              <div className="index-price-row"><dt>{t("40HQ median", "40HQ 中位数")}</dt><dd className="index-median">{median === null ? t("Unavailable", "暂不可用") : `$${median.toLocaleString("en-US")}`}</dd></div>
              <div><dt>{t("Week on week", "周环比")}</dt><dd className="index-change" data-direction={weekChange === null ? "unavailable" : weekChange > 0 ? "up" : weekChange < 0 ? "down" : "flat"}>{changeText(weekChange)}</dd></div>
              <div><dt>{t("Samples", "样本量")}</dt><dd>{sampleSize === null ? t("Unavailable", "暂不可用") : sampleSize}</dd></div>
            </dl>
            {displayingDemo && weeklyMedians.length > 1 && (
              <figure className="index-trend">
                <svg
                  className="index-sparkline"
                  viewBox="0 0 120 40"
                  role="img"
                  aria-label={t(
                    `${port.id}: simulated eight-week trend, USD per 40HQ: ${weeklyMedians.join(", ")}`,
                    `${port.zh}：八周模拟走势，美元 / 40HQ：${weeklyMedians.join("、")}`,
                  )}
                >
                  <line x1="4" y1="36" x2="116" y2="36" className="sparkline-baseline" />
                  <polyline points={sparklinePoints(weeklyMedians)} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
                </svg>
                <figcaption>{t("8-week simulated trend", "八周模拟走势")}</figcaption>
              </figure>
            )}
            <span className="platform-note">{displayingDemo ? t("Simulated · not bookable", "模拟数据 · 不可订舱") : t("Core port", "核心港口")}</span>
          </article>
        ))}
      </div>
    </section>
  );
}

export function RatesPreview({
  lang, snapshot, shipment, samples = [], onSelect, fullPage = false,
}: Locale & {
  snapshot: Snapshot;
  shipment: Shipment;
  samples?: SampleRate[];
  onSelect?: (id: string) => void;
  fullPage?: boolean;
}) {
  const t = translate(lang);
  const port = (id: string) => lang === "zh"
    ? [...origins, ...destinations].find((p) => p.id === id)?.zh ?? id
    : id;
  const home = lang === "zh" ? "/zh/" : "/";
  return (
    <section id="rates" className="platform-section wrap" aria-labelledby="rates-title">
      <div className="platform-heading">
        <div>
          <h2 id="rates-title">{t("Rates at a glance", "航线运价一览")}</h2>
          <p className="platform-note">{t(
            `From ${port(shipment.origin)}. Per container or W/M, not the shipment total.`,
            `${port(shipment.origin)}起运。每柜或每 W/M 参考价，非整票合计。`,
          )}</p>
        </div>
        <div className="rates-preview-actions">
          {!fullPage && <a className="text-button" href={lang === "zh" ? "/zh/rates/" : "/rates/"}>{t("All rates", "全部运价")}<ArrowUpRight size={16} /></a>}
          <a className="text-button" href={fullPage ? `${home}#estimate` : "#estimate"}>{t("Estimate your shipment", "按货量估价")}<ArrowUpRight size={16} /></a>
        </div>
      </div>
      <RatesTable lang={lang} snapshot={snapshot} shipment={shipment} samples={samples} onSelect={onSelect} />
      <p className="platform-note">{t(
        "Per-origin public references; the index above pools all origins. Local charges, customs and inland transport are excluded. Carriers are those named on the quotes behind each price.",
        "按起运港分列的公开参考价；上方指数合并所有起运港。费用不含港杂、清关和内陆运输。船公司为该价格所依据报价上的船公司。",
      )}</p>
    </section>
  );
}

export function LatestPosts({ lang, quotes }: Locale & { quotes: LatestQuote[] }) {
  const t = translate(lang);
  const port = (id: string) => lang === "zh"
    ? [...origins, ...destinations].find((p) => p.id === id)?.zh ?? extraOriginNames[id] ?? id
    : id;
  return (
    <section className="latest-posts platform-section wrap" aria-labelledby="latest-title">
      <div className="platform-heading"><h2 id="latest-title">{t("Latest from the board", "最新供需")}</h2><span className="platform-status">{quotes.length ? t(`Newest ${quotes.length} quotes`, `最新 ${quotes.length} 条报价`) : t("Publication pending", "待开放发布")}</span></div>
      <div className="posts-grid">
        <section id="space-board" aria-labelledby="spaces-title">
          <div className="post-heading"><h3 id="spaces-title">{t("Latest spaces", "最新舱位")}</h3><span>{t("Space Board", "舱位板")}</span></div>
          {quotes.length ? (
            <ol className="latest-quotes">
              {quotes.map((q) => (
                <li key={q.id}>
                  <div>
                    <strong>{port(q.origin)} → {port(q.destination)}</strong>
                    <span>{[q.container, q.carrier, q.date].filter(Boolean).join(" · ")}</span>
                  </div>
                  <span className="latest-price">${q.price.toLocaleString("en-US")}</span>
                </li>
              ))}
            </ol>
          ) : (
            <div className="post-empty"><p>{t("No spaces published yet.", "暂无已发布舱位，发布来源确认后展示。")}</p>{lang !== "zh" && <span>Space listings will appear here once a publication source is confirmed.</span>}</div>
          )}
        </section>
        <section id="loads" aria-labelledby="loads-title">
          <div className="post-heading"><h3 id="loads-title">{t("Latest loads", "最新货盘")}</h3><span>{t("Loads", "货盘")}</span></div>
          <div className="post-empty"><p>{t("No loads published yet.", "暂无已发布货盘，发布来源确认后展示。")}</p>{lang !== "zh" && <span>Cargo listings will appear here once a publication source is confirmed.</span>}</div>
        </section>
      </div>
    </section>
  );
}

export function CommunityPreview({ lang, onContact }: Locale & { onContact: () => void }) {
  const t = translate(lang);
  return (
    <section className="community-preview platform-section wrap">
      <div id="agents">
        <h2>{t("Agents", "代理")}</h2>
        <p className="platform-note">{t("The agent directory is not open yet. No agent profiles have been published.", "代理名录尚未开放，目前没有已发布的代理资料。")}</p>
      </div>
      <div id="join">
        <h2>{t("Join RedSeaRate", "加入 RedSeaRate")}</h2>
        <p className="platform-note">{t("Membership registration is not open yet. You can still contact the team about a shipment.", "会员注册尚未开放，您仍可联系团队咨询出运需求。")}</p>
        <button className="text-button" onClick={onContact}>{t("Contact the team", "联系团队")}<ArrowRight size={16} /></button>
      </div>
    </section>
  );
}
