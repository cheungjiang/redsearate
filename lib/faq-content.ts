// Human-written FAQ answers. Price and transit questions are generated from
// live data in lib/faq.ts; these answers are seeded into Notion and read back
// through lib/content-store.ts at build time.
export type FaqItem = { q: string; a: string };

export function staticFaqItems(lang: "en" | "zh"): FaqItem[] {
  const zh = lang === "zh";
  return [
    {
      q: zh ? "舱位怎么订？" : "How do I book space?",
      a: zh
        ? "把品名、HS 编码、件数、尺寸、毛重、备货日期、贸易条款、起运港和目的港发给我们；整柜补充柜型和数量，拼箱补充体积和重量。我们确认船期和价格后，舱位才算预留。可以先用首页估价器，再通过微信或 WhatsApp 发订舱需求。"
        : "Send the cargo description and HS code, packages, dimensions and gross weight, the cargo-ready date, your Incoterms, and the origin and destination ports. For FCL, add the container type and quantity; for LCL, the volume and weight. Space is reserved only after we confirm the sailing and price. You can start with the homepage estimator, then send the booking request on WeChat or WhatsApp.",
    },
    {
      q: zh ? "报价包含哪些费用？" : "What is included in the rate?",
      a: zh
        ? "本站报价和估价只含港到港海运费。起运港费用、目的港费用、清关、关税、增值税、保险和内陆运输不含在内。拼箱按立方米与公吨中较大值计费，最低 1 W/M。比较报价前先对齐费用范围。"
        : "Our rates and estimates cover port-to-port ocean freight only. Origin charges, destination charges, customs, duty, VAT, insurance and inland transport are excluded. LCL bills the larger of cubic metres or metric tonnes, with a minimum of 1 W/M. Align the scope before comparing two quotes.",
    },
    {
      q: zh ? "从中国哪个港口出运更合适？" : "Which Chinese port should I use?",
      a: zh
        ? "先看离工厂最近的港口，再确认那里有箱、有船期。上海、宁波、深圳和青岛是本站覆盖的主要起运港；同一目的港在不同起运港的运价和舱位可能不同。可以看各目的港页面的“各条航线”，再按起运港询价。"
        : "Start with the port nearest your factory, then check that it has both equipment and a sailing. Shanghai, Ningbo, Shenzhen and Qingdao are the main origins covered here; rates and space to the same destination can differ by origin. Open a destination page and compare its route pages before you ask for a quote.",
    },
    {
      q: zh ? "清关和目的港单证你们能处理吗？" : "Can you handle customs and destination documents?",
      a: zh
        ? "不同目的港的单证不同：吉达需要 SABER 货物证书，苏赫纳需要 ACID，吉布提需要 ECTN，苏丹港需要 ACD 和 SSMO 等。我们可以协助核对，但清关结果由目的港报关行和主管部门决定；订舱前先把单证清单确认好。"
        : "The documents depend on the destination: SABER for Jeddah, ACID for Sokhna, ECTN for Djibouti, and ACD plus SSMO for Port Sudan. We can help check the list, but clearance is decided by the destination broker and authority. Confirm the document list before booking.",
    },
    {
      q: zh ? "危险品或带电池的货能走红海吗？" : "Can I ship dangerous goods or batteries to the Red Sea?",
      a: zh
        ? "可以，但要单独审核：UN 编号、MSDS、UN38.3、危包证、船公司批复和中转港接受条件都要先确认。不要按普货订舱后再补申报。详细检查清单见危险品与电池专题。"
        : "Sometimes, but it needs a separate review: UN number, MSDS, UN38.3, DG packing certificate, carrier approval and transhipment-port acceptance all have to be confirmed first. Do not book it as general cargo and declare it later. See the dangerous goods and battery guide for the checklist.",
    },
    {
      q: zh ? "整柜和拼箱怎么选？" : "Should I choose FCL or LCL?",
      a: zh
        ? "整柜按柜计费，操作少、时效通常更稳；拼箱按 W/M 计费，适合小货，但目的港拼箱费用和操作环节更多。不要只比海运费，要把起运港、目的港、清关和拖车一起算。详细比较见整柜与拼箱专题。"
        : "FCL is priced per container, with fewer handovers and usually a more predictable transit; LCL is priced per W/M and suits small shipments, but destination CFS charges and handling add lines. Compare the total, not the ocean freight alone. See the FCL vs LCL guide for the full comparison.",
    },
    {
      q: zh ? "DDP 和 DAP 有什么区别？" : "What is the difference between DDP and DAP?",
      a: zh
        ? "DAP 是卖方送到指定地点，买方负责进口清关和税费；DDP 是卖方负责进口清关并缴税。DDP 不是“包送到门”这么简单，它要求卖方或当地代理能作为进口申报主体。详细拆解见 DDP 与 DAP 专题。"
        : "Under DAP, the seller delivers to the named place and the buyer handles import clearance and duty. Under DDP, the seller handles import clearance and pays the duty. DDP is not simply free delivery: the seller or a local broker must be able to act as the importer of record. See the DDP vs DAP guide for the cost breakdown.",
    },
  ];
}
