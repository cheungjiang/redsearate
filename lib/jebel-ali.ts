import { extraOriginNames, origins } from "./rates.ts";

export const JEBEL_ALI_SLUG = "jebel-ali";
export const JEBEL_ALI_CODE = "AEJEA";
// 40HQ port-to-port reference for every origin below. 20GP and 40GP have no figure.
export const JEBEL_ALI_PRICE = 7800;
export const JEBEL_ALI_TRANSIT_DAYS = 26;
export const JEBEL_ALI_DIRECT = true;
export const JEBEL_ALI_CARRIER = "HPL";

// Rows stay on the page until this list is edited. Do not drop them by date.
// Unpublished, no figure supplied: throughput, terminal operator, depth, free time,
// Dubai customs documents, free-zone rules, duty rates, 20GP and 40GP prices.
export const jebelAliSailings = [
  { origin: "Qingdao", etd: "2026-11-15" },
  { origin: "Shanghai", etd: "2026-11-15" },
  { origin: "Ningbo", etd: "2026-11-15" },
  { origin: "Shenzhen", etd: "2026-11-18" },
  { origin: "Guangzhou (Nansha)", etd: "2026-11-15" },
] as const;

export type JebelAliSailing = (typeof jebelAliSailings)[number];
export type JebelAliContainer = "20GP" | "40GP" | "40HQ";

export function jebelAliOriginName(id: string, lang: "en" | "zh") {
  if (lang === "en") return id;
  return origins.find((port) => port.id === id)?.zh ?? extraOriginNames[id] ?? id;
}

export function jebelAliEarliestEtd() {
  return jebelAliSailings.map((sailing) => sailing.etd).sort()[0] ?? "";
}

export function jebelAliMoney(amount: number) {
  return "US$" + amount.toLocaleString("en-US");
}

export function jebelAliQuote(origin: string, container: JebelAliContainer) {
  const sailing = jebelAliSailings.find((row) => row.origin === origin);
  if (!sailing) return null;
  return {
    origin: sailing.origin,
    etd: sailing.etd,
    container,
    price: container === "40HQ" ? JEBEL_ALI_PRICE : null,
  };
}

function joinNames(names: string[], lang: "en" | "zh") {
  if (lang === "zh" || names.length < 2) return names.join("、");
  if (names.length === 2) return `${names[0]} and ${names[1]}`;
  return `${names.slice(0, -1).join(", ")}, and ${names.at(-1)}`;
}

const etdLines = (sailings: readonly JebelAliSailing[], lang: "en" | "zh") => {
  const groups = new Map<string, string[]>();
  for (const sailing of sailings) {
    const names = groups.get(sailing.etd) ?? [];
    names.push(jebelAliOriginName(sailing.origin, lang));
    groups.set(sailing.etd, names);
  }
  return [...groups].map(([etd, names]) =>
    lang === "zh" ? `${names.join("、")}的 ETD 是 ${etd}` : `ETD is ${etd} from ${joinNames(names, "en")}`,
  );
};

export function jebelAliDescription(_today: string, lang: "en" | "zh") {
  if (!jebelAliSailings.length) {
    return lang === "zh"
      ? "已列的中国到杰贝阿里船期已过。杰贝阿里在迪拜，不是沙特港。请重新询价。"
      : "The listed China to Jebel Ali sailings have passed. Jebel Ali is in Dubai, not Saudi Arabia. Ask for a new quote.";
  }
  return lang === "zh"
    ? "青岛、上海、宁波、深圳、广州南沙可出运到杰贝阿里。40HQ 港到港参考价按 ETD 列出。此页不属于红海指数。"
    : "Qingdao, Shanghai, Ningbo, Shenzhen and Nansha can load for Jebel Ali. 40HQ port-to-port reference rate, by ETD. Separate from the Red Sea index.";
}

export function jebelAliFaqs(_today: string, lang: "en" | "zh") {
  const zh = lang === "zh";
  const money = jebelAliMoney(JEBEL_ALI_PRICE);
  const etd = zh
    ? `${etdLines(jebelAliSailings, lang).join("。")}。`
    : `${etdLines(jebelAliSailings, lang).join(". ")}.`;
  return [
    {
      q: zh ? "页面上有价格吗？" : "Does this page show a price?",
      a: zh
        ? `40HQ 港到港参考价是 ${money}，按 ETD 列出。20GP 和 40GP 请询价。`
        : `The 40HQ port-to-port reference rate is ${money}, listed by ETD. 20GP and 40GP are on request.`,
    },
    { q: zh ? "这几条船的 ETD 是哪天？" : "What are the ETDs?", a: etd },
    {
      q: zh ? "航程几天，中转吗？" : "How long is the transit, and does it transship?",
      a: zh
        ? `航程 ${JEBEL_ALI_TRANSIT_DAYS} 天，不中转，船公司 ${JEBEL_ALI_CARRIER}。`
        : `Transit time is ${JEBEL_ALI_TRANSIT_DAYS} days, with no transshipment. The carrier is ${JEBEL_ALI_CARRIER}.`,
    },
    {
      q: zh ? "杰贝阿里是沙特的港口吗？" : "Is Jebel Ali a Saudi port?",
      a: zh ? "不是。杰贝阿里在迪拜。沙特的运价看吉达页。" : "No. Jebel Ali is in Dubai. Saudi rates on this site are for Jeddah.",
    },
    {
      q: zh ? "这个页面属于红海指数吗？" : "Is this page part of the Red Sea index?",
      a: zh
        ? "不属于。首页估价只覆盖吉达、苏赫纳、亚喀巴、吉布提和苏丹港。"
        : "No. The homepage estimator covers Jeddah, Sokhna, Aqaba, Djibouti and Port Sudan.",
    },
    {
      q: zh ? "这份服务含什么？" : "What does this service include?",
      a: zh
        ? `港到港海运费。40HQ 参考价是 ${money}。`
        : `Port-to-port ocean freight. The 40HQ reference rate is ${money}.`,
    },
    {
      q: zh ? "这份服务不含什么？" : "What does this service leave out?",
      a: zh
        ? "不含港杂、清关、关税、保险和内陆运输。"
        : "Local charges, customs clearance, duty, insurance and inland transport.",
    },
    {
      q: zh ? "怎么询这一水？" : "How do I ask about this sailing?",
      a: zh
        ? "用页面上的获取估价，或底部的微信、WhatsApp。消息发出去还不代表舱位已留。"
        : "Use Get a quote on this page, or the WeChat and WhatsApp buttons at the bottom. Sending a message does not hold space.",
    },
  ];
}
