import { ArrowRight } from "lucide-react";
import { publicRateRows, type Rating, type SampleRate } from "../lib/platform";
import { addDays, destinations, extraOriginNames, origins, type Shipment, type Snapshot } from "../lib/rates";

export function RatesTable({
  lang, snapshot, shipment, samples = [], onSelect,
}: {
  lang: "en" | "zh";
  snapshot: Snapshot;
  shipment: Shipment;
  samples?: SampleRate[];
  onSelect?: (destination: string) => void;
}) {
  const t = (en: string, zh: string) => lang === "zh" ? zh : en;
  const port = (id: string) => lang === "zh"
    ? [...origins, ...destinations].find((p) => p.id === id)?.zh ?? extraOriginNames[id] ?? id
    : id;
  const money = (price: number) => `$${price.toLocaleString("en-US")}`;
  const labels = [
    t("Origin", "起运港"), t("Destination", "目的港"), t("Equipment", "柜型"),
    t("USD rate", "美元参考价"), t("Carrier", "船公司"), t("Grade", "等级"),
    t("Valid from", "有效期起"), t("Valid until", "有效至"), t("Updated", "更新时间"),
    ...(onSelect ? [t("Action", "操作")] : []),
  ];
  const ratingLabel = (rating: Rating) =>
    rating === "excellent" ? t("Excellent", "优秀") : t("Good", "友好");
  const legend: { rating: Rating; label: string }[] = [
    { rating: "excellent", label: t("At least 10% below the median of all China origins", "比中国各起运港中位数低 10% 以上") },
    { rating: "good", label: t("Current market level", "当前市场水平") },
  ];
  const testLabel = t("TEST DATA · Simulated · not bookable", "TEST DATA · 模拟数据 · 不可订舱");
  const unavailable = t("Unavailable", "暂不可用");
  const today = snapshot.today;
  const validUntil = addDays(today, 7);
  return (
    <>
      <dl className="grade-key grade-legend" aria-label={t("Grade legend", "等级说明")}>
        {legend.map(({ rating, label }) => (
          <div key={rating}>
            <dt><span className="rating" data-rating={rating}>{ratingLabel(rating)}</span></dt>
            <dd>{label}</dd>
          </div>
        ))}
      </dl>
      <p className="platform-note grade-explanation">
        {t("Ratings compare each price with the same destination and equipment from every China origin. They do not guarantee price or space.", "评级把每个价格与中国各起运港到同一目的港、同一柜型的价格比较，不保证价格或舱位。")}
      </p>
      {samples.length > 0 && (
        <p className="sample-notice platform-note">
          <strong>{testLabel}</strong>
          {" "}{t("Prices, carriers, grades, validity dates and update times below are fixed UI examples, not real quotes or verification results.", "下方样例价格、船公司、等级、有效期和更新时间均为固定界面示例，并非真实报价或核验结果。")}
        </p>
      )}
      <div className="rates-scroll" tabIndex={0} role="region" aria-label={t("Freight rates table", "航线运价表")}>
        <table className="rates-table">
          <caption className="visually-hidden">{t("Port-to-port rates, with test data clearly separated from public references", "港到港运价，测试数据与公开参考价明确分开")}</caption>
          <thead><tr>{labels.map((label) => <th scope="col" key={label}>{label}</th>)}</tr></thead>
          {samples.length > 0 && (
            <tbody data-kind="test">
              <tr className="rate-group"><th scope="rowgroup" colSpan={labels.length}>{testLabel}</th></tr>
              {samples.map((row) => (
                <tr key={row.id} data-kind="test">
                  <th scope="row" data-label={labels[0]}>{port(row.origin)}<small>{testLabel}</small></th>
                  <td data-label={labels[1]}>{port(row.destination)}</td>
                  <td data-label={labels[2]}>{row.container}</td>
                  <td data-label={labels[3]}><strong className="rate-value">{money(row.price)} / {row.container}</strong></td>
                  <td data-label={labels[4]}>{row.carrier}</td>
                  <td data-label={labels[5]}><span className="grade-badge" data-grade={row.grade}>{row.grade}</span></td>
                  <td data-label={labels[6]}><time dateTime={row.validFrom}>{row.validFrom}</time></td>
                  <td data-label={labels[7]}><time dateTime={row.validUntil}>{row.validUntil}</time></td>
                  <td data-label={labels[8]}><time dateTime={row.updatedAt}>{row.updatedAt.slice(0, 16).replace("T", " ")} UTC</time></td>
                  {onSelect && <td data-label={labels[9]}>{t("Not bookable", "不可订舱")}</td>}
                </tr>
              ))}
            </tbody>
          )}
          <tbody data-kind="public">
            <tr className="rate-group"><th scope="rowgroup" colSpan={labels.length}>{t("Public rate references", "公开参考运价")}</th></tr>
            {publicRateRows(snapshot, shipment).map((row) => (
              <tr key={row.destination} data-kind="public">
                <th scope="row" data-label={labels[0]}>{port(row.origin)}</th>
                <td data-label={labels[1]}>{port(row.destination)}</td>
                <td data-label={labels[2]}>{row.equipment === "LCL" ? "LCL / W/M" : row.equipment}</td>
                <td data-label={labels[3]}>
                  <strong className="rate-value">{row.offer
                    ? `${money(row.offer.low)}${row.offer.low !== row.offer.high ? `–${money(row.offer.high)}` : ""}`
                    : row.market ? `≈ ${money(row.market.median)}` : t("On request", "请询价")}</strong>
                  <small>{row.offer ? t("Bookable offer", "本站报价") : row.market ? (row.market.count === 1 ? t("Market price · 1 quote", "市场价 · 1 条报价") : t(`Market median · ${row.market.count} quotes`, `市场中位数 · ${row.market.count} 条报价`)) : t("No current price", "暂无有效价格")}</small>
                </td>
                <td data-label={labels[4]}>{row.carriers.length ? row.carriers.join(", ") : unavailable}</td>
                <td data-label={labels[5]}>{row.rating ? <span className="rating" data-rating={row.rating}>{ratingLabel(row.rating)}</span> : unavailable}</td>
                <td data-label={labels[6]}><time dateTime={today}>{today}</time></td>
                <td data-label={labels[7]}><time dateTime={validUntil}>{validUntil}</time></td>
                <td data-label={labels[8]}><time dateTime={today}>{today}</time></td>
                {onSelect && <td data-label={labels[9]}><button className="text-button" onClick={() => onSelect(row.destination)} aria-label={t(`Estimate ${port(row.origin)} to ${port(row.destination)}`, `估算${port(row.origin)}至${port(row.destination)}运费`)}>{t("Estimate", "估价")}<ArrowRight size={14} /></button></td>}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
