// Bilingual copy shared by the homepage, the guide pages and structured data.
const L = (en: string, zh: string) => ({ en, zh });
export type Localized = ReturnType<typeof L>;

export const guides = [
  {
    slug: "red-sea-freight-rate-factors",
    tag: L("MARKET OUTLOOK", "市场观察"),
    title: L(
      "What really moves your Red Sea freight rate?",
      "哪些因素真正影响红海运价？",
    ),
    body: L(
      `Four forces sit behind almost every Red Sea freight quote. Capacity: how much vessel space carriers deploy on the lane. Seasonality: cargo demand rises and falls through the year. Equipment availability: whether empty containers are on hand at your origin port. Routing: which services and transshipments a sailing relies on. When any of them moves, the same container on the same lane can quote differently within weeks.

That is why two numbers are comparable only when the scope matches. Our estimates are port-to-port ocean freight for the shipment you enter; local handling, customs, duties, insurance and inland transport sit outside the number. Check the sailing window and container type before judging any headline figure.

Our trend chart plots weekly medians of the prices our team collects in the market. Outliers far from the median are dropped, gaps are never filled with estimates, and the chart stays empty until real data exists. It is a reading of the market we see — not an official index, and not a bookable offer. Space and the final price are confirmed on WeChat or WhatsApp.`,
      `几乎每一份红海运价的背后，都有四种力量。运力：船公司在航线上投放的舱位多少。季节：全年货运需求有起有落。设备供应：起运港的空箱是否充足。航线安排：一班船依赖的经停与中转结构。任何一项变动，同一条航线上的同一个箱子，几周内报价就可能不同。

所以两个数字只有在口径一致时才可比。本站估价是按您所填货量计算的港到港海运费；本地操作、清关、税费、保险和内陆运输都不在这个数字里。判断任何报价之前，先核对出运窗口和柜型。

趋势图展示团队在市场上收集报价的周中位数。偏离中位数过远的样本会被剔除，缺口不用估算补位，没有真实数据时图表留空。它是我们看到的市场读数，不是官方指数，也不是可直接订舱的报价。舱位和最终价格以微信或 WhatsApp 确认为准。`,
    ),
  },
  {
    slug: "jeddah-sokhna-aqaba-gateway",
    tag: L("SHIPPING GUIDE", "运输指南"),
    title: L(
      "Jeddah, Sokhna or Aqaba: choose your gateway.",
      "吉达、苏赫纳或亚喀巴：如何选择门户港？",
    ),
    body: L(
      `Three gateways anchor most China–Red Sea moves. Jeddah serves western Saudi Arabia. Sokhna connects to the Egyptian market. Aqaba is Jordan’s maritime gateway. Port Sudan is on our map too, but services there require additional operational checks, so confirm with us case by case.

The sea leg is only part of the journey. Our prices are port-to-port: inland delivery, destination charges and customs sit outside the quote, so the lowest port-to-port number is not always the lowest landed cost. Before choosing a port, confirm inland delivery, customs requirements and destination charges for your cargo and consignee.

Compare gateways with the same discipline you compare rates: same scope, same sailing window. If you are unsure which gateway fits, run the route through the estimator first, then bring the details to us on WeChat or WhatsApp.`,
      `中国到红海的运输，通常围绕三个门户港。吉达服务沙特西部；苏赫纳连接埃及市场；亚喀巴是约旦的海运门户。苏丹港也在本站航线图上，但相关服务需额外核实运营条件，请逐票与我们确认。

海运只是全程的一部分。本站价格是港到港口径：内陆配送、目的港费用和清关不在报价之内，所以港到港最低的数字，未必是落地成本最低的选择。选定门户港之前，请先确认这票货的内陆配送、清关要求和目的港费用。

比较门户港，请用比较运价的同一套方法：口径一致、出运窗口一致。如果不确定哪个门户港合适，先用估价器跑一程，再通过微信或 WhatsApp 把细节发给我们。`,
    ),
  },
  {
    slug: "first-shipment-checklist",
    tag: L("PLAN YOUR SHIPMENT", "出运准备"),
    title: L(
      "Your first shipment? Start with this checklist.",
      "首次出运？从这份清单开始。",
    ),
    body: L(
      `A smooth first shipment starts with a complete enquiry. Prepare: cargo description and HS code, dimensions and gross weight, the date your cargo will be ready, and your Incoterms. Check the commercial invoice, packing list and consignee details early, so documents never become the bottleneck.

Match your details to the way ocean freight is quoted. FCL is priced per container — 20GP, 40GP or 40HC — so settle the container type and quantity first. LCL is priced per W/M, billed at the larger of cubic metres or metric tonnes, minimum 1 W/M. Port-to-port freight excludes origin and destination charges, customs, duties, insurance and inland transport — budget those separately.

Dangerous goods and battery cargo need separate review — flag them at the start, not after the quote. Then ask for a written, itemised quote and a confirmed sailing before committing. Space is reserved only after we confirm the sailing and price with you.`,
      `第一次出运顺利，从一份完整的询价开始。准备好：品名与 HS 编码、尺寸与毛重、备货日期、贸易条款（Incoterms）。商业发票、装箱单和收货人资料尽早核对，别让单证成为瓶颈。

信息口径要和海运计费方式对上。整箱按柜计价——20GP、40GP 或 40HC——先定柜型和数量。拼箱按 W/M 计费，取立方米与公吨中较大者，最低 1 W/M。港到港海运费不含起运港及目的港费用、清关、税费、保险和内陆运输，请单独预算。

危险品和带电池的货物需要单独审核——一开始就说明，不要等报价之后。确认前，请拿到书面、分项的报价和确认的船期。我们与您确认船期和价格后，舱位才算预留。`,
    ),
  },
];

export type Guide = (typeof guides)[number];

export const faqs = [
  {
    q: L(
      "What is the difference between our offer and market reference?",
      "本站报价和市场参考有什么区别？",
    ),
    a: L(
      "Our offers are prices we can book until the date shown. Market references are statistics of prices our team collects, not offers. Space and the final itemised price are confirmed on WeChat or WhatsApp.",
      "本站报价是在标注日期前我们能订到的价格；市场参考是团队收集的市场报价统计，不是报价。舱位和最终费用明细以微信或 WhatsApp 确认为准。",
    ),
  },
  {
    q: L("What is included in the estimate?", "参考运价包含哪些费用？"),
    a: L(
      "Port-to-port ocean freight for the total shipment entered. Local handling, documentation, customs, duties, insurance and inland transport are excluded. LCL bills the larger of cubic metres or metric tonnes, minimum 1 W/M.",
      "按所填货量计算的港到港海运费合计，不含本地操作、单证、清关、税费、保险和内陆运输。拼箱按立方米与公吨中较大值计费，最低 1 W/M。",
    ),
  },
  {
    q: L(
      "Can I reserve space through this website?",
      "可以通过网站预订舱位吗？",
    ),
    a: L(
      "Send us a booking request on WeChat or WhatsApp. Space is reserved only after we confirm the sailing and price with you.",
      "通过微信或 WhatsApp 发送订舱需求。我们与您确认船期和价格后，舱位才算预留。",
    ),
  },
  {
    q: L("Which ports in China do you load from?", "中国哪些港口可以起运？"),
    a: L(
      "Shanghai, Ningbo, Shenzhen and Qingdao. If your cargo is inland, tell us the nearest origin port when you enquire.",
      "上海、宁波、深圳和青岛。如果货物在内陆，询价时告诉我们最近的起运港。",
    ),
  },
  {
    q: L("What do you need from me to quote?", "询价需要提供什么？"),
    a: L(
      "Cargo description and HS code, dimensions and gross weight, the cargo-ready date, your Incoterms, and the origin and destination ports. For FCL, add the container type and quantity; for LCL, the volume and weight. Dangerous goods and battery cargo need a separate review.",
      "品名与 HS 编码、尺寸与毛重、备货日期、贸易条款（Incoterms），以及起运港和目的港。整箱请补充柜型和数量；拼箱请补充体积和重量。危险品和带电池的货物需要单独审核。",
    ),
  },
  {
    q: L(
      "Who handles customs, duties and inland delivery?",
      "清关、税费和内陆运输由谁负责？",
    ),
    a: L(
      "Our estimate is port-to-port ocean freight only. Import customs, duties, destination charges, insurance and inland delivery are arranged separately by you or your consignee's broker. Compare quotes on the same scope before you decide.",
      "本站估价只含港到港海运费。进口清关、税费、目的港费用、保险和内陆运输由您或收货人的报关行另行安排。比较报价前，请先对齐费用范围。",
    ),
  },
];
