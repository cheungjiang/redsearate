import {
  JEBEL_ALI_LAND,
  JEBEL_ALI_ROUTE,
  JEBEL_ALI_ROUTE_END,
  JEBEL_ALI_ROUTE_START,
} from "../lib/jebel-ali-land";

export function JebelAliMap({ lang }: { lang: "en" | "zh" }) {
  const zh = lang === "zh";
  const label = zh
    ? "从中国沿海经马六甲海峡、阿拉伯海和霍尔木兹海峡到杰贝阿里的路线示意"
    : "Schematic route from the China coast through Malacca, the Arabian Sea and Hormuz to Jebel Ali";
  const [x1, y1] = JEBEL_ALI_ROUTE_START;
  const [x2, y2] = JEBEL_ALI_ROUTE_END;
  return (
    <figure className="jebel-map">
      <svg viewBox="0 0 720 400" role="img" aria-label={label}>
        <path className="jebel-land" d={JEBEL_ALI_LAND} />
        <path className="jebel-route" pathLength={1} d={JEBEL_ALI_ROUTE} />
        <circle className="jebel-port" cx={x1} cy={y1} r="4.5" />
        <circle className="jebel-port" cx={x2} cy={y2} r="4.5" />
        <text x={x1 - 10} y={y1 - 10} textAnchor="end">{zh ? "中国" : "China"}</text>
        <text x={x2 + 12} y={y2 - 12}>{zh ? "杰贝阿里 / 迪拜" : "Jebel Ali / Dubai"}</text>
      </svg>
      <figcaption>{zh ? "路线示意，非实际航行轨迹。" : "Schematic route, not an actual track."}</figcaption>
    </figure>
  );
}
