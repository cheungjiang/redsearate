import type { GuideBlock, GuideSection, Localized } from "./content.ts";

// Seed copy for /methodology/. The page reads the bilingual document from the
// Notion content snapshot; this object is the migration source and the last
// local fallback.
const L = (en: string, zh: string): Localized => ({ en, zh });
const P = (en: string, zh: string): GuideBlock => ({ kind: "p", text: L(en, zh) });
const UL = (items: [string, string][]): GuideBlock => ({
  kind: "ul",
  items: items.map(([en, zh]) => L(en, zh)),
});
const LINKS = (items: [string, string, string][]): GuideBlock => ({
  kind: "links",
  items: items.map(([href, en, zh]) => ({ href, text: L(en, zh) })),
});

export type MethodologyDoc = {
  slug: "methodology";
  tag: Localized;
  title: Localized;
  description: Localized;
  lead: Localized;
  published: string;
  updated: string;
  sections: GuideSection[];
};

export const methodologyContent: MethodologyDoc = {
  slug: "methodology",
  tag: L("DATA & METHOD", "数据与方法"),
  title: L("How RedSeaRate builds its rate index", "红海运价指数的方法与边界"),
  description: L(
    "How RedSeaRate collects China–Red Sea 40HQ quotes, builds the 28-day median, removes outliers and what the index leaves out.",
    "红海运价指数如何收集中国至红海 40HQ 报价、计算近 28 天中位数、剔除离群值，以及这些数字不包含什么。",
  ),
  lead: L(
    "The index is a dated market reading, not a bookable price. This page explains what is measured, how the median is built, and what the number leaves out.",
    "这个指数是有日期的市场读数，不是可订舱价格。本页说明我们衡量什么、中位数怎么算，以及这个数字不包含什么。",
  ),
  published: "2026-11-08",
  updated: "2026-11-23",
  sections: [
    {
      heading: L("What the index measures", "指数衡量什么"),
      blocks: [
        P(
          "RedSeaRate publishes 40HQ port-to-port ocean freight readings for five Red Sea destinations: Jeddah, Sokhna, Aqaba, Djibouti and Port Sudan. The reading is a median of market quotes collected from China origins, not a carrier's published tariff and not a quote we can book on the date shown.",
          "RedSeaRate 发布五个红海目的港的 40HQ 港到港海运费读数：吉达、苏赫纳、亚喀巴、吉布提和苏丹港。这个读数是收集到的中国市场报价的中位数，不是船公司的公开运价表，也不是标注日期当天一定能订到的价格。",
        ),
        P(
          "Each destination has its own sample. A port with a large sample and a port with a thin sample are not equally reliable, even when both show a median. The sample count is part of the reading, not a footnote. When the sample is too thin, we show no median rather than a number that looks more precise than it is.",
          "每个目的港有自己的样本。样本大的港口和样本小的港口，哪怕都显示中位数，可靠程度也不同。样本量是读数的一部分，不是脚注。样本太薄时，我们宁可不给中位数，也不给一个看起来比实际更精确的数字。",
        ),
      ],
    },
    {
      heading: L("How the median is built", "中位数怎么算"),
      blocks: [
        P(
          "We use quotes collected in the last 28 days. The window is deliberately longer than a week so a quiet week does not erase the market level, and short enough that an old rate does not set the current reading. The median is the middle value of the sample after outliers are removed.",
          "我们使用近 28 天收集的报价。窗口比一周长，是为了避免某一周成交少就把市场水平抹掉；又不会太长，避免旧价格决定当前读数。中位数是剔除离群值后样本的中间值。",
        ),
        UL([
          ["Container: 40HQ, the common equipment for light cargo on this trade.", "柜型：40HQ，这条航线上轻货的常用柜型。"],
          ["Window: the last 28 days, counted in Shanghai time.", "窗口：近 28 天，按上海时间计算。"],
          ["Outliers: quotes far outside the sample are removed before the median.", "离群值：明显偏离样本的报价在中位数计算前剔除。"],
          ["Sample: the number of quotes behind the median is shown with the figure.", "样本：中位数旁边显示背后的报价条数。"],
          ["Origins: quotes can come from Shanghai, Ningbo, Shenzhen, Qingdao, Nansha and other collected origins.", "起运港：报价可能来自上海、宁波、深圳、青岛、南沙及其他收集到的起运港。"],
        ]),
        P(
          "The median is not weighted by volume. A single large shipper and a single small shipper count as one quote each. That keeps the method simple and reproducible, but it means the reading describes the quote sample, not the whole market.",
          "中位数不按货量加权。一个大货主和一个小货主，各算一条报价。这样方法简单、可复现，但也意味着这个读数描述的是报价样本，不是整个市场。",
        ),
      ],
    },
    {
      heading: L("What the numbers leave out", "数字不包含什么"),
      blocks: [
        P(
          "The reading is port-to-port ocean freight only. It does not include origin charges in China, destination port charges, customs clearance, duty, VAT, insurance, inland trucking or the cost of a missed connection. Those lines can change the delivered cost by more than the difference between two ocean quotes.",
          "这个读数只含港到港海运费。不含中国起运港费用、目的港费用、清关、关税、增值税、保险、内陆拖车，也不含错过衔接的成本。这些项目对到门成本的影响，可能比两份海运费之间的差额更大。",
        ),
        UL([
          ["Origin: terminal handling, documentation, export declaration and trucking.", "起运港：码头操作、单证、出口申报和拖车。"],
          ["Destination: port dues, terminal handling, delivery order and broker.", "目的港：港务费、码头操作、提货单和报关行。"],
          ["Import: duty, VAT, inspection and any product approval.", "进口：关税、增值税、查验和产品批准。"],
          ["Inland: trucking, rail, dry-port handling and empty return.", "内陆：拖车、铁路、陆港操作和空柜返还。"],
          ["Risk: war-risk surcharge, storage, demurrage and detention.", "风险：战争风险附加费、仓储、滞港和滞箱。"],
        ]),
      ],
    },
    {
      heading: L("Why some ports show no median", "为什么有些港口没有中位数"),
      blocks: [
        P(
          "A port may show “no recent quotes” or “sample too thin” instead of a median. That is a data statement, not a missing page. It usually means the quote window did not contain enough comparable 40HQ market quotes, or the quotes that arrived were too dispersed to summarise. Ask for a quote on the specific sailing instead of reading a thin sample as a price.",
          "有些港口会显示“近期无报价”或“样本不足”，而不是中位数。这是数据说明，不是页面缺失。通常意味着窗口内没有足够可比的 40HQ 市场报价，或者报价太分散、无法汇总。按具体船期询价，不要把薄样本当成价格。",
        ),
        P(
          "The same rule applies to the week-on-week figure. A change built on a small sample is a reading, not a trend. The market brief shows the sample count next to every move for that reason.",
          "周环比也用同一规则。小样本上的变动是读数，不是趋势。市场周报在每一个涨跌旁边都列出样本量，就是这个原因。",
        ),
      ],
    },
    {
      heading: L("How to use a reading", "怎么用这个读数"),
      blocks: [
        P(
          "Use the index to see the level, the direction and the sample size. Then ask for a quote on your actual cargo, origin, destination and date. A bookable quote should name the sailing, the routing, the container, the free time, the surcharges and the validity. If a quote cannot name those lines, it is not comparable with the index or with another quote.",
          "用指数看水平、方向和样本量，再按你的实际货物、起运港、目的港和日期询价。可订舱报价应写清船期、航线、柜型、免柜期、附加费和有效期。报价写不清这些，就无法和指数或另一份报价比较。",
        ),
        P(
          "The index is not a forecast. A weekly move can reverse, and a route can change its direct/transhipment mix without changing the median. If the cargo is time-sensitive, compare the arrival window and the connection, not only the ocean line.",
          "指数不是预测。周环比可能反转，航线也可能在中位数不变的情况下改变直航/中转比例。货急，要比到货窗口和衔接，不要只比海运费。",
        ),
      ],
    },
    {
      heading: L("Corrections and contact", "更正与联系"),
      blocks: [
        P(
          "If a figure looks wrong, send the page URL, the date and the quote or source you are checking. We will review the sample and correct the page if needed. For a shipment, use the estimate form or contact the team on WeChat or WhatsApp; a message does not reserve space until we confirm the sailing and price.",
          "如果某个数字看起来不对，把页面 URL、日期和你在核对的报价或来源发给我们。我们会检查样本，必要时更正页面。要走出运，用估价表或通过微信、WhatsApp 联系团队；我们确认船期和价格前，消息不代表舱位已留。",
        ),
      ],
    },
    {
      heading: L("Related pages", "相关页面"),
      blocks: [
        LINKS([
          ["/rates/", "Current Red Sea rate index", "查看当前红海运价指数"],
          ["/market-brief/", "Market brief archive", "市场简报归档"],
          ["/guides/red-sea-freight-rate-factors/", "What moves a Red Sea rate", "哪些因素影响红海运价"],
          ["/faq/", "Shipping FAQ", "海运常见问题"],
        ]),
      ],
    },
  ],
};
