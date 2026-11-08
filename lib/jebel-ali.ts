import { extraOriginNames, origins } from "./rates.ts";

export const JEBEL_ALI_SLUG = "shipping-from-china-to-jebel-ali";
export const JEBEL_ALI_CODE = "AEJEA";
export const JEBEL_ALI_PRICE = 7800;

// Sailing offers supplied for this page. The ETD is the only date given, so the
// row stays up through that day and drops on the next build after it.
export const jebelAliSailings = [
  { origin: "Qingdao", etd: "2026-11-15" },
  { origin: "Shanghai", etd: "2026-11-15" },
  { origin: "Ningbo", etd: "2026-11-15" },
  { origin: "Shenzhen", etd: "2026-11-18" },
  { origin: "Guangzhou (Nansha)", etd: "2026-11-15" },
] as const;

export type JebelAliSailing = (typeof jebelAliSailings)[number];

export function openJebelAliSailings(today: string) {
  return jebelAliSailings.filter((sailing) => sailing.etd >= today);
}

export function jebelAliOriginName(id: string, lang: "en" | "zh") {
  if (lang === "en") return id;
  return origins.find((port) => port.id === id)?.zh ?? extraOriginNames[id] ?? id;
}

const money = "US$7,800";

export function jebelAliDescription(today: string, lang: "en" | "zh") {
  const open = openJebelAliSailings(today);
  if (!open.length) {
    return lang === "zh"
      ? "已列的中国到杰贝阿里船期已过。杰贝阿里在迪拜，不是沙特港。请重新询价。"
      : "The listed China to Jebel Ali sailings have passed. Jebel Ali is in Dubai, not Saudi Arabia. Ask for a new quote.";
  }
  return lang === "zh"
    ? `中国到杰贝阿里 40HQ 每柜 ${money}，五个起运港同价，港到港，对应所列 ETD。此港在迪拜。`
    : `China to Jebel Ali 40HQ is ${money} per container on the listed ETD. Five origins, one price, port to port. Dubai, not Saudi Arabia.`;
}

export function jebelAliFaqs(today: string, lang: "en" | "zh") {
  const zh = lang === "zh";
  const open = openJebelAliSailings(today);
  if (!open.length) {
    return [{
      q: zh ? "中国到杰贝阿里现在还有船期价吗？" : "Is there a current China to Jebel Ali sailing rate?",
      a: zh
        ? "页面上列出的船期已经过了 ETD。杰贝阿里在迪拜，不是沙特港。请重新询价。"
        : "The sailings listed on this page are past their ETD. Jebel Ali is in Dubai, not Saudi Arabia. Ask for a new quote.",
    }];
  }
  return [
    {
      q: zh ? "中国到杰贝阿里 40HQ 多少钱？" : "How much is 40HQ from China to Jebel Ali?",
      a: zh
        ? `青岛、上海、宁波、深圳、南沙都是每柜 ${money}。这是所列 ETD 的港到港海运费，不是近 28 天的市场中位数，也不含港杂、关税和内陆运输。`
        : `Qingdao, Shanghai, Ningbo, Shenzhen and Nansha are each ${money} per 40HQ. That is the port-to-port ocean freight for the listed ETD, not a 28-day market median, and it excludes local charges, duty and inland transport.`,
    },
    {
      q: zh ? "这几条船的 ETD 是哪天？" : "What are the ETDs?",
      a: zh
        ? "青岛、上海、宁波、南沙的 ETD 是 2026-11-15。深圳的 ETD 是 2026-11-18。这里不写航程天数。"
        : "ETD is 2026-11-15 from Qingdao, Shanghai, Ningbo and Nansha, and 2026-11-18 from Shenzhen. Transit days are not stated.",
    },
    {
      q: zh ? "杰贝阿里是沙特的港口吗？" : "Is Jebel Ali a Saudi port?",
      a: zh
        ? "不是。杰贝阿里在迪拜。沙特的运价看吉达页。"
        : "No. Jebel Ali is in Dubai. Saudi rates on this site are for Jeddah.",
    },
  ];
}
