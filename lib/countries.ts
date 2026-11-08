import type { Localized } from "./content.ts";
import { INDEX_WINDOW_DAYS } from "./platform.ts";
import { addDays, destinations, marketSummary, shanghaiDate, type PriceEntry } from "./rates.ts";

const L = (en: string, zh: string): Localized => ({ en, zh });

export type Country = {
  slug: string;
  destination: (typeof destinations)[number]["id"];
  name: Localized;
  title: Localized;
  transit: { range: Localized; note: Localized } | null;
  documents: Localized[];
  taxes: Localized | null;
  situation: Localized;
  sources: { title: string; url: string }[];
};

// Facts checked against the listed sources in November 2026. Prices on the
// pages come from the quote database, not from this file.
export const countries: Country[] = [
  {
    slug: "shipping-from-china-to-saudi-arabia",
    destination: "Jeddah",
    name: L("Saudi Arabia", "沙特阿拉伯"),
    title: L(
      "Shipping from China to Saudi Arabia: Jeddah Rates & Transit Time",
      "中国到沙特海运：吉达 40HQ 运价、航程与清关文件",
    ),
    transit: {
      range: L("17–31 days", "17–31 天"),
      note: L(
        "Port to port from Shanghai or Shenzhen to Jeddah. Direct services take about 17–18 days; sailings that tranship through another hub take up to 31 days.",
        "上海或深圳到吉达港到港。直航约 17–18 天，经其他枢纽中转最长约 31 天。",
      ),
    },
    documents: [
      L(
        "SABER Shipment Certificate for every shipment, regulated or not: SAR 350 before VAT, valid 90 days. It must match the bill of lading and commercial invoice.",
        "每票货都需要 SABER 平台的货物符合性证书（Shipment Certificate），不论是否受技术法规管制：费用 350 里亚尔（不含增值税），有效期 90 天，信息须与提单和商业发票一致。",
      ),
      L(
        "Regulated products also need a Product Certificate of Conformity (PCoC) registered on SABER; non-regulated products use an importer self-declaration.",
        "受管制产品还需在 SABER 上注册产品符合性证书（PCoC）；非管制产品使用进口商自我声明。",
      ),
      L(
        "Since 1 October 2026, products under ten technical regulations must show the importer's name and commercial registration number.",
        "自 2026 年 10 月 1 日起，10 项技术法规下的产品须标注进口商名称和商业登记号。",
      ),
      L(
        "Commercial invoice and bill of lading; the customs declaration is filed on FASAH at least 48 hours before the vessel arrives.",
        "商业发票和提单；报关单须在船舶到港前至少 48 小时通过 FASAH 平台提交。",
      ),
    ],
    taxes: L(
      "Most goods pay 5% customs duty (some up to 20%), plus 15% VAT and a 0.15% customs service fee.",
      "多数货物关税 5%（部分最高 20%），另加 15% 增值税和 0.15% 海关服务费。",
    ),
    situation: L(
      "The Strait of Hormuz has been effectively closed since 2026, so almost all Saudi container imports now arrive through Jeddah on the Red Sea. Underwriters treat the Red Sea up to Jeddah as a war-risk area, and congestion at Jeddah has added surcharges and berthing delays.",
      "2026 年霍尔木兹海峡实际关闭后，沙特集装箱进口几乎全部经红海的吉达港进入。保险方把红海直至吉达列为战争风险区，吉达拥堵带来了附加费和靠泊延误。",
    ),
    sources: [
      { title: "SABER platform (SASO)", url: "https://saber.sa/" },
      { title: "ZATCA import instructions", url: "https://zatca.gov.sa/ar/RulesRegulations/Taxes/Pages/customs-bussiness/import-pages/Import-Instructions.aspx" },
      { title: "SASO: shipment certificate validity extended to 90 days", url: "https://www.saso.gov.sa/ar/mediacenter/news/Pages/saber-shipment-certificates-validity-90-days.aspx" },
    ],
  },
  {
    slug: "shipping-from-china-to-egypt",
    destination: "Sokhna",
    name: L("Egypt", "埃及"),
    title: L(
      "Shipping from China to Egypt: Sokhna Rates, Transit & ACID",
      "中国到埃及海运：苏赫纳 40HQ 运价、航程与 ACID 申报",
    ),
    transit: {
      range: L("20–35 days", "20–35 天"),
      note: L(
        "Port to port to Ain Sokhna. Direct services from South China take about 20–23 days; sailings from North China with transshipment can take 32–35 days.",
        "到苏赫纳港到港。华南直航约 20–23 天；华北经中转可达 32–35 天。",
      ),
    },
    documents: [
      L(
        "ACID number: the Egyptian importer registers the shipment on NAFEZA and shares the ACID, which must appear on all shipping documents.",
        "ACID 编号：埃及进口商在 NAFEZA 系统登记货物并取得 ACID，所有单证上都必须注明。",
      ),
      L(
        "Advance Cargo Information (ACI) filed by the exporter on the CargoX platform: bill of lading, packing list, commercial invoice (PDF and structured Excel) and certificate of origin. The exporter's company must be verified on CargoX first.",
        "出口商通过 CargoX 平台提交预申报（ACI）：提单、装箱单、商业发票（PDF 和规定格式的 Excel）和原产地证。出口公司须先在 CargoX 完成认证。",
      ),
      L(
        "Filing ACI well before arrival lets the importer use the faster release lane; a last-minute filing gives no benefit.",
        "尽早提交 ACI，进口商才能走快速放行通道；到港前几小时才提交则享受不到。",
      ),
    ],
    taxes: null,
    situation: L(
      "Sokhna sits at the southern end of the Suez Canal and serves Cairo and the Suez industrial zone. Carriers reach it through the Red Sea, so war-risk and congestion surcharges on Red Sea services apply here too.",
      "苏赫纳位于苏伊士运河南端，服务开罗和苏伊士工业区。船公司经红海挂靠，因此红海航线的战争风险和拥堵附加费同样适用。",
    ),
    sources: [
      { title: "CargoX: Egypt ACI", url: "https://cargox.io/advance-cargo-information-egypt" },
      { title: "Egyptian Customs Authority: ACI FAQ", url: "https://customs.gov.eg/PDF_Docs/ACI_FAQ/Frequently%20asked%20questions.pdf" },
    ],
  },
  {
    slug: "shipping-from-china-to-jordan",
    destination: "Aqaba",
    name: L("Jordan", "约旦"),
    title: L(
      "Shipping from China to Jordan: Aqaba Rates, Transit & Customs",
      "中国到约旦海运：亚喀巴 40HQ 运价、航程与清关",
    ),
    transit: {
      range: L("20–35 days", "20–35 天"),
      note: L(
        "Port to port to Aqaba, Jordan's only seaport. Direct services take about 20–28 days; a transshipment adds 3–7 days.",
        "到约旦唯一海港亚喀巴港到港。直航约 20–28 天，中转多 3–7 天。",
      ),
    },
    documents: [
      L(
        "Commercial invoice, packing list, bill of lading and certificate of origin; the consignee needs an active Jordanian tax number matching the documents.",
        "商业发票、装箱单、提单和原产地证；收货人须有与单证名称一致的有效约旦税号。",
      ),
      L(
        "Regulated goods need JSMO (JISM) conformity approval; medicines and medical items need JFDA registration.",
        "受管制产品需 JSMO（JISM）合格评定；药品和医疗用品需 JFDA 注册。",
      ),
      L(
        "Declarations run on ASYCUDA World; clean cargo usually clears in 2–5 working days.",
        "报关使用 ASYCUDA World 系统，单证齐全的货物通常 2–5 个工作日清关。",
      ),
    ],
    taxes: L(
      "Outside the Aqaba Special Economic Zone, duty is commonly 5% (0–30%) plus 16% general sales tax; inside ASEZA a flat 5% applies.",
      "亚喀巴经济特区以外，关税通常 5%（0–30%），另加 16% 一般销售税；特区（ASEZA）内统一 5%。",
    ),
    situation: L(
      "Aqaba is reached through the Red Sea, so war-risk surcharges on Red Sea services apply. Free time at Aqaba is often short; check the free days in your quote.",
      "亚喀巴需经红海挂靠，红海航线的战争风险附加费适用。亚喀巴免柜期常较短，请核对报价中的免柜天数。",
    ),
    sources: [
      { title: "Jordan Customs trade portal: import procedure", url: "https://tradeportal.customs.gov.jo/procedure/1062?embed=true&includeSearch=true&l=en" },
    ],
  },
  {
    slug: "shipping-from-china-to-djibouti",
    destination: "Djibouti",
    name: L("Djibouti", "吉布提"),
    title: L(
      "Shipping from China to Djibouti & Ethiopia: Rates, Transit, ECTN",
      "中国到吉布提及埃塞俄比亚海运：运价、航程与 ECTN",
    ),
    transit: {
      range: L("19–30 days", "19–30 天"),
      note: L(
        "Port to port to Djibouti. Direct services take about 19–24 days; one-stop services via Singapore or Colombo take 25–30 days. For Ethiopia, add the Addis Ababa–Djibouti railway (12–15 hours) or 2–5 days by road.",
        "到吉布提港到港。直航约 19–24 天，经新加坡或科伦坡中转 25–30 天。去埃塞俄比亚再加亚吉铁路约 12–15 小时，或公路 2–5 天。",
      ),
    },
    documents: [
      L(
        "ECTN (Electronic Cargo Tracking Note) for all containers unloaded in Djibouti since 15 June 2023, applied for with the bill of lading, commercial invoice and freight invoice, ideally at least five days before departure.",
        "自 2023 年 6 月 15 日起，在吉布提卸货的集装箱都需 ECTN（电子货物跟踪单），凭提单、商业发票和运费发票申请，最好在开船前至少 5 天办好。",
      ),
      L(
        "Cargo in direct transit to Ethiopia is exempt from the Djibouti ECTN when the bill of lading states \"In transit to Ethiopia\" and the consignee is in Ethiopia.",
        "直接转运埃塞俄比亚的货物，如提单注明 \"In transit to Ethiopia\" 且收货人在埃塞俄比亚，可免办吉布提 ECTN。",
      ),
      L(
        "For Ethiopia, the importer needs an import licence and foreign-exchange approval through an Ethiopian bank before shipping; clearance happens at Modjo dry port.",
        "去埃塞俄比亚的货，进口商须在出运前持有进口许可证并通过埃塞银行取得外汇额度；清关在莫焦（Modjo）陆港进行。",
      ),
    ],
    taxes: null,
    situation: L(
      "Djibouti handles nearly all of landlocked Ethiopia's sea imports. Containers move under customs bond to Ethiopia, so the Djibouti transit papers must match the Ethiopian import declaration exactly.",
      "吉布提承接内陆国埃塞俄比亚几乎全部海运进口。集装箱在海关监管下转运埃塞，因此吉布提转运单证必须与埃塞进口申报完全一致。",
    ),
    sources: [
      { title: "CTN Djibouti: ECTN FAQ", url: "https://ctndjibouti.com/frequently-asked-questions/" },
    ],
  },
  {
    slug: "shipping-from-china-to-sudan",
    destination: "Port Sudan",
    name: L("Sudan", "苏丹"),
    title: L(
      "Shipping from China to Sudan: Port Sudan Rates & ACD Rules",
      "中国到苏丹海运：苏丹港 40HQ 运价与 ACD 申报",
    ),
    transit: null,
    documents: [
      L(
        "Advance Cargo Declaration (ACD, also called ECTN), mandatory for all Sudan-bound cargo on vessels sailing from 1 January 2026. Obtain the 15-digit ACD number before loading in China and print it on the bill of lading.",
        "预先货物申报（ACD，又称 ECTN）：2026 年 1 月 1 日起开航的所有去苏丹货物必须办理。须在中国装船前取得 15 位 ACD 编号并打印在提单上。",
      ),
      L(
        "The ACD application needs the draft bill of lading, commercial invoice, freight invoice, certificate of origin and packing list.",
        "申请 ACD 需提供提单草稿、商业发票、运费发票、原产地证和装箱单。",
      ),
      L(
        "Most commercial goods need an SSMO certificate of inspection from an authorised agency before leaving China, plus an import licence and IM form.",
        "多数商品出运前须由授权机构出具苏丹标准计量局（SSMO）检验证书，另需进口许可证和 IM 表。",
      ),
    ],
    taxes: L(
      "Customs duty is 5–25% for most goods, plus 17% VAT.",
      "多数货物关税 5–25%，另加 17% 增值税。",
    ),
    situation: L(
      "Sudan has been in armed conflict since April 2023, and Port Sudan is the country's working gateway. Direct sailings from China are limited, so much cargo is transhipped via Jeddah, Jebel Ali or Djibouti; a missed connection can add a week or more. Confirm port, banking and inland conditions with the consignee before booking.",
      "苏丹自 2023 年 4 月起处于武装冲突中，苏丹港是目前可用的主要门户。中国直航有限，很多货经吉达、杰贝阿里或吉布提中转，错过衔接可能多等一周以上。订舱前请与收货人确认港口、银行和内陆运输状况。",
    ),
    sources: [
      { title: "Maersk: mandatory ACD for Sudan imports", url: "https://www.maersk.com/news/articles/2026/02/09/mandatory-acd-requirement-sudan-imports" },
      { title: "Sudan Tribune: Port Sudan resumes transshipment", url: "https://sudantribune.com/article/315175" },
    ],
  },
];

export type ContainerStat = { median: number; count: number; low: number; high: number };
export type OriginStat = {
  origin: string;
  containers: Partial<Record<"20GP" | "40GP" | "40HC", ContainerStat>>;
  carriers: string[];
  freeDays: [number, number] | null;
  direct: number;
  transhipped: number;
};
export type CountryStats = {
  containers: Partial<Record<"20GP" | "40GP" | "40HC", ContainerStat>>;
  origins: OriginStat[];
  quotes: number;
  latest: string | null;
};

const fclContainers = ["20GP", "40GP", "40HC"] as const;
const splitCarriers = (value = "") => value.split(/[,，/、;；]+/).map((c) => c.trim()).filter(Boolean);

function stat(list: PriceEntry[]): ContainerStat | undefined {
  const summary = marketSummary(list.map((e) => e.price));
  if (!summary) return undefined;
  const kept = list.map((e) => e.price).filter((p) => p >= summary.median * 0.5 && p <= summary.median * 1.5);
  return { ...summary, low: Math.min(...kept), high: Math.max(...kept) };
}

// Market quotes to one destination from every China origin in the index window.
export function countryStats(entries: PriceEntry[], today: string, destination: string): CountryStats {
  const since = addDays(today, 1 - INDEX_WINDOW_DAYS);
  const quotes = entries.filter((e) => {
    const date = shanghaiDate(new Date(e.createdAt));
    return e.tier === "market" && e.destination === destination && date >= since && date <= today;
  });
  const byContainer = (list: PriceEntry[]) =>
    Object.fromEntries(fclContainers.flatMap((c) => {
      const s = stat(list.filter((e) => e.container === c));
      return s ? [[c, s]] : [];
    }));
  const origins = [...new Set(quotes.map((e) => e.origin))].map((origin): OriginStat => {
    const list = quotes.filter((e) => e.origin === origin);
    const days = list.flatMap((e) => (e.freeDays ? [e.freeDays] : []));
    return {
      origin,
      containers: byContainer(list),
      carriers: [...new Set(list.flatMap((e) => splitCarriers(e.carrier)))].sort(),
      freeDays: days.length ? [Math.min(...days), Math.max(...days)] : null,
      direct: list.filter((e) => /直|direct/i.test(e.routing ?? "")).length,
      transhipped: list.filter((e) => /中转|转运|tranship|transship|via/i.test(e.routing ?? "")).length,
    };
  }).sort((a, b) => (a.containers["40HC"]?.median ?? Infinity) - (b.containers["40HC"]?.median ?? Infinity));
  const dates = quotes.map((e) => shanghaiDate(new Date(e.createdAt))).sort();
  return { containers: byContainer(quotes), origins, quotes: quotes.length, latest: dates.at(-1) ?? null };
}
