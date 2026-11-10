import {
  dailyLineSegments,
  dailySampleIsThin,
  type DailyIndexSeries,
} from "../lib/platform";

const colors: Record<string, string> = {
  Jeddah: "#1f7a6b",
  Sokhna: "#a06a2c",
  Aqaba: "#2c6cb0",
  Djibouti: "#c4475b",
  "Port Sudan": "#3d8f4a",
};

const width = 720;
const height = 280;
const padLeft = 52;
const padRight = 16;
const padTop = 16;
const padBottom = 32;

function money(amount: number) {
  return `US$${amount.toLocaleString("en-US")}`;
}

function scale(values: number[]) {
  const min = Math.min(...values);
  const max = Math.max(...values);
  const pad = Math.max(100, Math.round((max - min) * 0.12));
  let low = Math.floor((min - pad) / 100) * 100;
  let high = Math.ceil((max + pad) / 100) * 100;
  if (high <= low) {
    low -= 200;
    high += 200;
  }
  const span = high - low;
  const step = span <= 500 ? 100 : span <= 1200 ? 200 : 500;
  const ticks: number[] = [];
  for (let value = Math.ceil(low / step) * step; value <= high; value += step) ticks.push(value);
  if (ticks.length < 2) ticks.push(low, high);
  return { low, high, ticks };
}

export default function DailyIndexChart({ lang, series }: { lang: "en" | "zh"; series: DailyIndexSeries[] }) {
  const zh = lang === "zh";
  const t = (en: string, cn: string) => (zh ? cn : en);
  const dates = series[0]?.points.map((point) => point.date) ?? [];
  const values = series.flatMap((row) => row.points.flatMap((point) => point.median ?? []));
  const name = (row: DailyIndexSeries) => (zh ? row.port.zh : row.port.id);
  if (!dates.length || !values.length) {
    return (
      <section className="daily-index" aria-label={t("40HQ median trend, daily", "40HQ 中位数走势（每日）")}>
        <h2>{t("40HQ median trend, daily", "40HQ 中位数走势（每日）")}</h2>
        <p className="daily-footnote">{t("No daily median yet.", "还没有可计算的每日中位数。")}</p>
      </section>
    );
  }
  const { low, high, ticks } = scale(values);
  const plotWidth = width - padLeft - padRight;
  const plotHeight = height - padTop - padBottom;
  const xAt = (index: number) => padLeft + (dates.length === 1 ? plotWidth / 2 : (index * plotWidth) / (dates.length - 1));
  const yAt = (value: number) => padTop + (1 - (value - low) / (high - low)) * plotHeight;
  const latestText = series.map((row) => {
    const latest = row.points.at(-1);
    return `${name(row)} ${latest?.median == null ? "—" : money(latest.median)}`;
  }).join(", ");
  return (
    <section className="daily-index" aria-label={t("40HQ median trend, daily", "40HQ 中位数走势（每日）")}>
      <h2>{t("40HQ median trend, daily", "40HQ 中位数走势（每日）")}</h2>
      <div className="daily-index-scroll" tabIndex={0} role="region" aria-label={t("Daily 40HQ median chart", "每日 40HQ 中位数图")}>
        <svg className="daily-index-chart" viewBox={`0 0 ${width} ${height}`} role="img" aria-label={t(
          `Daily 40HQ median, rolling 28-day window: ${latestText}`,
          `每日 40HQ 中位数，近 28 天滚动窗口：${latestText}`,
        )}>
          {ticks.map((tick) => (
            <g key={tick}>
              <line x1={padLeft} y1={yAt(tick)} x2={width - padRight} y2={yAt(tick)} className="daily-grid" />
              <text x={padLeft - 8} y={yAt(tick) + 4} textAnchor="end" className="daily-axis">{tick.toLocaleString("en-US")}</text>
            </g>
          ))}
          {dates.map((date, index) => (
            <text key={date} x={xAt(index)} y={height - 8} textAnchor="middle" className="daily-axis">{date.slice(5)}</text>
          ))}
          {series.map((row) => {
            const color = colors[row.port.id] ?? "#333";
            return (
              <g key={row.port.id}>
                {dailyLineSegments(row.points).map((segment) => {
                  const left = row.points[segment.from];
                  const right = row.points[segment.to];
                  return (
                    <line
                      key={`${row.port.id}-${left.date}`}
                      x1={xAt(segment.from)}
                      y1={yAt(left.median!)}
                      x2={xAt(segment.to)}
                      y2={yAt(right.median!)}
                      stroke={color}
                      strokeWidth="2"
                      strokeDasharray={segment.dashed ? "5 4" : undefined}
                      data-dashed={segment.dashed ? "true" : "false"}
                    />
                  );
                })}
                {row.points.map((point, index) => point.median == null ? null : (
                  <circle
                    key={point.date}
                    cx={xAt(index)}
                    cy={yAt(point.median)}
                    r={dailySampleIsThin(point.count) ? 4 : 3.2}
                    fill={dailySampleIsThin(point.count) ? "#fff" : color}
                    stroke={color}
                    strokeWidth="2"
                    data-port={row.port.id}
                    data-date={point.date}
                    data-thin={dailySampleIsThin(point.count) ? "true" : "false"}
                  >
                    <title>{`${name(row)} ${point.date}: ${money(point.median)} (n=${point.count})`}</title>
                  </circle>
                ))}
              </g>
            );
          })}
        </svg>
      </div>
      <ul className="daily-legend">
        {series.map((row) => {
          const latest = row.points.at(-1);
          return (
            <li key={row.port.id}>
              <i style={{ background: colors[row.port.id] ?? "#333" }} />
              {name(row)} {latest?.median == null ? "—" : money(latest.median)}
            </li>
          );
        })}
      </ul>
      <p className="daily-footnote">{t(
        "Days with fewer than 5 quotes are shown as open dots and are only a reference.",
        "样本不足 5 条的天数以空心点标示，仅供参考。",
      )}</p>
      <p className="daily-footnote">{t(
        "Each daily median is the rolling median of 40HQ market quotes from the previous 28 days, with outliers removed. A market reading, not a bookable offer and not a forecast.",
        "每个每日中位数是近 28 天 40HQ 市场报价的滚动中位数，已剔除离群值。这是市场参考，不是可订舱报价，也不是预测。",
      )}</p>
    </section>
  );
}
