import { useState } from "react";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { indexCandidates, publicRateRows } from "../lib/platform";
import { demoIndex } from "../lib/index-demo";
import { destinations, origins, type Shipment, type Snapshot } from "../lib/rates";

type Locale = { lang: "en" | "zh" };
const translate = (lang: Locale["lang"]) =>
  (en: string, zh: string) => lang === "zh" ? zh : en;

export function IndexSnapshot({ lang }: Locale) {
  const t = translate(lang);
  const [showDemo, setShowDemo] = useState(true);
  const entries = showDemo ? demoIndex.entries : indexCandidates;
  const changeText = (change: number | null) => change === null
    ? t("Unavailable", "暂不可用")
    : change > 0 ? `↑ +${change.toFixed(1)}%`
    : change < 0 ? `↓ ${change.toFixed(1)}%`
    : t("0.0% · Flat", "0.0% · 持平");
  return (
    <section id="index" className="index-snapshot wrap" aria-labelledby="index-title" aria-describedby="index-disclaimer" data-mode={showDemo ? "demo" : "unpublished"}>
      <div className="platform-heading">
        <h2 id="index-title">{t("Red Sea index snapshot", "红海运价指数快照")}</h2>
        <div className="index-mode">
          <span className="platform-status">{showDemo ? t("Simulated data", "模拟数据") : t("Not yet published", "尚未发布")}</span>
          <button className="text-button" type="button" aria-pressed={showDemo} aria-controls="index-values" onClick={() => setShowDemo((value) => !value)}>
            {showDemo ? t("Hide demo", "隐藏模拟") : t("Show demo", "查看模拟")}
          </button>
        </div>
      </div>
      <p id="index-disclaimer" className="platform-note index-disclaimer">
        {showDemo ? t(
          "Demo only: illustrative Shanghai departures, USD per 40HQ. Rates, weekly changes and sample counts are all simulated, not actual quotes or booking prices. Live index rules and the fifth port remain unconfirmed.",
          "演示数据：模拟上海起运，美元 / 40HQ。运价、周环比和样本量均为模拟，非实际报价，不可用于订舱。正式指数口径与第五港口仍待确认。",
        ) : t(
          "The live 40HQ index has not been published. The port set and calculation rules are awaiting confirmation.",
          "正式 40HQ 指数尚未发布，港口名单与计算口径仍待确认。",
        )}
      </p>
      <div id="index-values" className="index-grid" aria-live="polite">
        {entries.map(({ port, median, weekChange, sampleSize }) => (
          <article className="index-port" key={port?.id ?? "pending"}>
            <span className="index-code">{port?.code ?? t("PENDING", "待确认")}</span>
            <h3>{port ? (lang === "zh" ? port.zh : port.id) : t("Fifth port pending", "第五港口待确认")}</h3>
            <dl>
              <div className="index-price-row"><dt>{t("40HQ median", "40HQ 中位数")}</dt><dd className="index-median">{median === null ? t("Unavailable", "暂不可用") : `$${median.toLocaleString("en-US")}`}</dd></div>
              <div><dt>{t("Week on week", "周环比")}</dt><dd className="index-change" data-direction={weekChange === null ? "unavailable" : weekChange > 0 ? "up" : weekChange < 0 ? "down" : "flat"}>{changeText(weekChange)}</dd></div>
              <div><dt>{t("Samples", "样本量")}</dt><dd>{sampleSize === null ? t("Unavailable", "暂不可用") : sampleSize}</dd></div>
            </dl>
            <span className="platform-note">{port ? (showDemo ? t("Simulated · not bookable", "模拟数据 · 不可订舱") : t("Candidate port", "候选港口")) : t("Port selection pending", "港口名单待确认")}</span>
          </article>
        ))}
      </div>
    </section>
  );
}

export function RatesPreview({
  lang, snapshot, shipment, onSelect,
}: Locale & { snapshot: Snapshot; shipment: Shipment; onSelect: (id: string) => void }) {
  const t = translate(lang);
  const port = (id: string) => lang === "zh"
    ? [...origins, ...destinations].find((p) => p.id === id)?.zh ?? id
    : id;
  const money = (value: number) => `$${value.toLocaleString("en-US")}`;
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
        <a className="text-button" href="#estimate">{t("Estimate your shipment", "按货量估价")}<ArrowUpRight size={16} /></a>
      </div>
      <div className="grade-key" aria-label={t("Grading scheme pending", "评级规则待确认")}>
        <span>{t("Grades", "等级")}</span>
        {["A", "B", "C"].map((grade) => <span key={grade} className="grade-badge">{grade}</span>)}
        <span>{t("Definitions pending. No grades assigned.", "定义待确认，暂不为记录评级。")}</span>
      </div>
      <div className="rates-scroll" tabIndex={0} role="region" aria-label={t("Freight rates table, scroll horizontally on small screens", "航线运价表，小屏幕可横向滚动")}>
        <table className="rates-table">
          <caption className="visually-hidden">{t("Public port-to-port rates for the selected origin and equipment", "所选起运港与柜型的公开港到港参考运价")}</caption>
          <thead><tr>
            {[t("Route", "航线"), t("Equipment", "柜型"), t("USD rate", "美元参考价"), t("Grade", "等级"), t("Valid until", "有效至"), t("Updated", "更新时间"), t("Action", "操作")].map((label) => <th scope="col" key={label}>{label}</th>)}
          </tr></thead>
          <tbody>{publicRateRows(snapshot, shipment).map((row) => (
            <tr key={row.destination}>
              <th scope="row">{port(row.origin)} <span aria-hidden="true">→</span> {port(row.destination)}</th>
              <td>{row.equipment === "LCL" ? "LCL / W/M" : row.equipment}</td>
              <td>
                <strong className="rate-value">{row.offer
                  ? `${money(row.offer.low)}${row.offer.low !== row.offer.high ? `–${money(row.offer.high)}` : ""}`
                  : row.market ? `≈ ${money(row.market.median)}` : t("On request", "请询价")}</strong>
                <small>{row.offer ? t("Bookable offer", "本站报价") : row.market ? t(`Market median · ${row.market.count} samples`, `市场中位数 · ${row.market.count} 条样本`) : t("No current price", "暂无有效价格")}</small>
              </td>
              <td><span className="ungraded">{t("Ungraded", "未评级")}</span></td>
              <td>{row.offer ? <time dateTime={row.offer.validUntil}>{row.offer.validUntil}</time> : t("Unavailable", "暂不可用")}</td>
              <td>{t("Unavailable", "暂不可用")}</td>
              <td><button className="text-button" onClick={() => onSelect(row.destination)} aria-label={t(`Estimate ${port(row.origin)} to ${port(row.destination)}`, `估算${port(row.origin)}至${port(row.destination)}运费`)}>{t("Estimate", "估价")}<ArrowRight size={14} /></button></td>
            </tr>
          ))}</tbody>
        </table>
      </div>
      <p className="platform-note">{t(
        "Existing public references, separate from the unpublished index above. Local charges, customs and inland transport are excluded. Update times are unavailable until their source is defined.",
        "现有公开参考价，与上方尚未发布的指数分开。费用不含港杂、清关和内陆运输。更新时间口径确认前暂不展示。",
      )}</p>
    </section>
  );
}

export function LatestPosts({ lang }: Locale) {
  const t = translate(lang);
  return (
    <section className="latest-posts platform-section wrap" aria-labelledby="latest-title">
      <div className="platform-heading"><h2 id="latest-title">{t("Latest from the board", "最新供需")}</h2><span className="platform-status">{t("Publication pending", "待开放发布")}</span></div>
      <div className="posts-grid">
        <section id="space-board" aria-labelledby="spaces-title">
          <div className="post-heading"><h3 id="spaces-title">{t("Latest spaces", "最新舱位")}</h3><span>{t("Space Board", "舱位板")}</span></div>
          <div className="post-empty"><p>{t("No spaces published yet.", "暂无已发布舱位。")}</p><span>{t("Space listings will appear here once a publication source is confirmed.", "发布来源确认后，将在此展示舱位信息。")}</span></div>
        </section>
        <section id="loads" aria-labelledby="loads-title">
          <div className="post-heading"><h3 id="loads-title">{t("Latest loads", "最新货盘")}</h3><span>{t("Loads", "货盘")}</span></div>
          <div className="post-empty"><p>{t("No loads published yet.", "暂无已发布货盘。")}</p><span>{t("Cargo listings will appear here once a publication source is confirmed.", "发布来源确认后，将在此展示货盘信息。")}</span></div>
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
