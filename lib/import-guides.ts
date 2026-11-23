import type { Guide } from "./content.ts";

const L = (en: string, zh: string) => ({ en, zh });
const P = (en: string, zh: string) => ({ kind: "p" as const, text: L(en, zh) });
const UL = (items: [string, string][]) => ({ kind: "ul" as const, items: items.map(([en, zh]) => L(en, zh)) });
const LINKS = (items: [string, string, string][]) => ({
  kind: "links" as const,
  items: items.map(([href, en, zh]) => ({ href, text: L(en, zh) })),
});

const published = "2026-11-23";

export const importGuides: Guide[] = [
  {
    slug: "jordan-import-clearance-aqaba",
    tag: L("IMPORT & CLEARANCE", "进口清关"),
    title: L("Jordan Import Clearance: Aqaba Guide", "约旦进口清关：亚喀巴单证与到门"),
    lead: L(
      "Aqaba is Jordan's only seaport. Most cargo clears on the consignee's tax number, but regulated products need JSMO or JFDA approval before arrival.",
      "亚喀巴是约旦唯一的海港。多数货物用收货人的税号清关，但受管制产品要在到港前拿到 JSMO 或 JFDA 的批准。",
    ),
    published,
    updated: published,
    faqs: [
      {
        q: L("How long does clearance at Aqaba take?", "亚喀巴清关要多久？"),
        a: L(
          "The country page lists 2–5 working days for clean cargo with complete documents. An inspection, a missing product approval or a mismatch between the invoice and the bill of lading can add time. Free time at Aqaba is often short, so start the clearance file before the vessel arrives.",
          "目的港页面写的是单证齐全、无需查验的货通常 2–5 个工作日。遇到查验、缺产品批准，或者发票和提单不一致，就会更久。亚喀巴免柜期常较短，船到前就要开始准备清关文件。",
        ),
      },
      {
        q: L("Do I need an import licence for Jordan?", "去约旦需要进口许可证吗？"),
        a: L(
          "Most goods do not need a general import licence, but the importer needs an importer card or commercial registration, and specific categories such as telecommunications, security equipment, some food and agricultural products need a licence or pre-approval. Regulated products also need JSMO, JFDA or another ministry approval. Confirm the product rules before you ship, not after arrival.",
          "多数货物不需要通用进口许可证，但进口商要有进口商卡或商业登记；电信、安防设备、部分食品和农产品等特定类别需要许可证或预批准。受管制产品还要 JSMO、JFDA 或其他部门批准。产品规则要在出运前确认，不要等货到。",
        ),
      },
      {
        q: L("Are Aqaba local charges included in the ocean rate?", "亚喀巴当地费用含在海运费里吗？"),
        a: L(
          "No. The ocean rate is port-to-port freight. Port dues, terminal handling, documentation, delivery order, broker, inspection, storage, demurrage, detention, container deposit and inland trucking are separate. Ask for a line-item destination quote.",
          "不含。海运费是港到港运费。港务费、码头操作、单证、提货单、报关行、查验、仓储、滞港、滞箱、柜押金和内陆拖车都另计。要一份分项目的目的港报价。",
        ),
      },
    ],
    sections: [
      {
        heading: L("Who is the importer", "谁是进口商"),
        blocks: [
          P(
            "Jordan's import file belongs to a Jordanian importer with an active tax number and an importer card or commercial registration. The importer can be the consignee or a local company acting for it, but the name on the invoice, the bill of lading and the customs declaration has to match. A foreign seller cannot clear the cargo without a local importer or a broker acting for one. Confirm the importer of record before the cargo leaves China.",
            "约旦的进口文件属于一个有有效税号、并有进口商卡或商业登记的约旦进口商。进口商可以是收货人，也可以是代其操作的当地公司，但发票、提单和报关单上的名称必须一致。外国卖方没有当地进口商或代其申报的报关行，就清不了关。货离开中国前，先确认进口申报主体。",
          ),
          P(
            "Aqaba is the only seaport, and the port area sits inside the Aqaba Special Economic Zone (ASEZA). That matters for the tax treatment and for the delivery address. A warehouse inside ASEZA and a warehouse in Amman are not the same customs destination. Ask the consignee for the exact address and whether the goods are entering the zone or moving outside it.",
            "亚喀巴是唯一海港，港区位于亚喀巴经济特区（ASEZA）内。这会影响税务处理和送货地址。特区内仓库和安曼仓库不是同一个海关目的地。让收货人给出准确地址，并说明货是进特区还是转到特区外。",
          ),
        ],
      },
      {
        heading: L("Licences and product approvals", "许可与产品批准"),
        blocks: [
          P(
            "Most goods enter Jordan without a general import licence, but the importer still needs an importer card or commercial registration. Telecommunications and security equipment need a specific licence, and some food and agricultural products need a pre-approval. Regulated goods also need approval from the Jordan Standards and Metrology Organization (JSMO/JISM), and medicines, medical devices and some food products need JFDA registration. The HS code decides which approval applies.",
            "多数货物进入约旦不需要通用进口许可证，但进口商仍要有进口商卡或商业登记。电信和安防设备需要专项许可证，部分食品和农产品需要预批准。受管制商品还要约旦标准计量局（JSMO/JISM）批准；药品、医疗器械和部分食品要 JFDA 注册。HS 编码决定适用哪种批准。",
          ),
          P(
            "Product approvals take time, and some need samples or a factory audit. If the approval is not ready when the vessel arrives, the container waits and storage starts. Ask the supplier for the test reports, the certificate of conformity and the Arabic label before booking. A certificate issued for another country is not automatically accepted in Jordan.",
            "产品批准需要时间，有些还要样品或工厂审核。船到港时批准没下来，柜子就等，仓储开始计费。订舱前向供应商要测试报告、符合性证书和阿拉伯语标签。在其他国家出的证书，约旦不一定直接接受。",
          ),
          UL([
            ["JSMO/JISM approval for regulated products.", "受管制产品需 JSMO/JISM 批准。"],
            ["JFDA registration for medicines and medical items.", "药品和医疗用品需 JFDA 注册。"],
            ["Arabic labelling and product test reports where required.", "需要时的阿拉伯语标签和产品测试报告。"],
            ["HS code checked before the proforma invoice is final.", "形式发票定稿前核对 HS 编码。"],
          ]),
        ],
      },
      {
        heading: L("Documents before sailing", "装船前的单证"),
        blocks: [
          P(
            "The core set is a commercial invoice, packing list, bill of lading and certificate of origin. The invoice should show the importer's name and tax number, the HS code, the Incoterms, the currency and a clear description of the goods. The bill of lading, invoice and packing list must agree on the quantity, the package count and the consignee. A small mismatch can stop the declaration.",
            "核心单证是商业发票、装箱单、提单和原产地证。发票要写进口商名称和税号、HS 编码、贸易条款、币种和清楚的品名。提单、发票和装箱单在数量、件数和收货人上必须一致。一个小差异就可能让申报卡住。",
          ),
          P(
            "Regulated products add the JSMO/JISM approval, the certificate of conformity and the product label. Food, cosmetics and chemicals may need additional health or safety certificates. Send the draft set to the broker before the vessel sails; the broker can catch a missing field while there is still time to correct it. Do not wait for the arrival notice.",
            "受管制产品还要 JSMO/JISM 批准、符合性证书和产品标签。食品、化妆品和化工品可能需要额外的卫生或安全证书。开船前把草稿发给报关行；还有时间改的时候，报关行能发现缺项。不要等到到货通知才处理。",
          ),
        ],
      },
      {
        heading: L("Clearance at Aqaba", "亚喀巴清关"),
        blocks: [
          P(
            "Jordan uses ASYCUDA World for the customs declaration. The broker files the declaration, presents the documents, arranges inspection if required and obtains the release. Clean cargo usually clears in 2–5 working days. The importer pays the duty and the general sales tax before release. Outside ASEZA, the country page lists duty commonly at 5% (0–30%) plus 16% general sales tax; inside ASEZA a flat 5% applies.",
            "约旦使用 ASYCUDA World 报关。报关行提交申报、递交单证、安排查验（如需要）并取得放行。单证齐全的货通常 2–5 个工作日清关。进口商在放行前缴关税和一般销售税。目的港页面写的是：ASEZA 以外关税通常 5%（0–30%）加 16% 一般销售税；ASEZA 内统一 5%。",
          ),
          P(
            "The customs value is based on the transaction, and the broker may ask for the freight and insurance breakdown. Keep the commercial invoice and the freight invoice consistent. If the declaration is amended after submission, the release can slip. Ask the broker for the expected release date and the free time before the vessel arrives, not after storage starts.",
            "海关估价按交易价格，报关行可能要运费和保险的明细。商业发票和运费发票要保持一致。申报提交后再改，放行可能往后拖。船到前就问报关行预计放行日和免柜期，不要等仓储开始计费才问。",
          ),
        ],
      },
      {
        heading: L("Door delivery and inland notes", "到门与内陆注意事项"),
        blocks: [
          P(
            "Aqaba to Amman is a long inland leg, and the route to Irbid or Zarqa can be longer. The trucker needs the release, the delivery order and the consignee's instructions. If the cargo moves from ASEZA to a warehouse outside the zone, the customs status changes; confirm whether a transit document or a new declaration is needed. Do not assume the port release is also the delivery release.",
            "亚喀巴到安曼是一段长内陆运输，到伊尔比德或扎尔卡可能更远。拖车要放行单、提货单和收货人的指示。货从 ASEZA 转到特区外仓库，海关状态会变；确认是否需要过境单或新的申报。不要以为港口放行就等于可以送货。",
          ),
          P(
            "Delivery addresses in Jordan can be informal, so ask for a map pin, a contact and a receiving window. Check whether the truck can enter the site, whether there is a forklift and who unloads. If the consignee cannot take the container, detention continues. For high-value cargo, arrange insurance and a sealed truck; the ocean cover may not extend to the inland leg.",
            "约旦的送货地址有时不够正式，要地图定位、联系人和收货时间窗。确认拖车能否进厂、有没有叉车、谁卸货。收货人提不了柜，滞箱继续。高价值货要安排保险和封条车；海运保险不一定覆盖内陆段。",
          ),
          P(
            "Delivery is not automatic after customs release. The consignee needs a delivery order, a truck booking and a receiving slot. For a warehouse outside Aqaba, the broker may need a transit declaration; for a delivery inside ASEZA, the zone rules apply. Ask who books the truck, who pays the waiting time and who signs the proof of delivery. If the container is not unloaded at the appointment, detention can start before the cargo is stored. A clear delivery plan is part of the clearance, not a separate task.",
            "海关放行不等于自动送货。收货人要有提货单、拖车订舱和收货时间窗。送到亚喀巴以外的仓库，报关行可能需要过境申报；送到 ASEZA 内，适用特区规则。问谁订车、谁付等待费、谁签收货单。约了时间没卸成，货还没入库，滞箱就可能开始。清楚的派送计划是清关的一部分，不是另一件事。",
          ),
          P(
            "For high-value cargo, keep the original documents and the release in one handover. Send scanned copies in advance, but do not release the original bill of lading until the payment terms are met. If the consignee uses a broker, confirm the broker's authority in writing. A cargo that is cleared but cannot be delivered is still a cost. Keep the delivery appointment, the truck plate and the receiving contact in writing before the container is released. Written details prevent a gate dispute.",
            "高价值货，正本单证和放行文件要在一次交接里点清。可以提前发扫描件，但付款条件没满足前不要放正本提单。收货人用报关行，要书面确认报关行的授权。清关完成却送不到，仍然是成本。放行前把送货预约、车牌和收货联系人写下来。写清楚能减少闸口争议。",
          ),
        ],
      },
      {
        heading: L("Local charges: what to ask for", "当地杂费：要问哪些"),
        blocks: [
          P(
            "Aqaba local charges sit outside the ocean freight. They can include port dues, terminal handling, documentation, delivery order, customs broker, inspection, storage, demurrage, detention, container deposit and inland trucking. The amounts vary by terminal, container type and dwell time. Ask for a line-item quote in Jordanian dinars or US dollars, with the exchange rate stated.",
            "亚喀巴当地杂费不在海运费里。可能包括港务费、码头操作、单证、提货单、报关行、查验、仓储、滞港、滞箱、柜押金和内陆拖车。金额随码头、柜型和停留时间变化。要一份以约旦第纳尔或美元计价的分项报价，并写明汇率。",
          ),
          P(
            "Ask what the terminal handling includes, when free time starts, whether it is calendar or working days, and who pays if the consignee cannot collect. For ASEZA cargo, ask whether the zone has a separate charge. A cheap ocean rate with a short free time and an unclear zone charge is not a cheap door price.",
            "问码头操作含什么、免柜期从哪天算、按自然日还是工作日、收货人提不了柜时谁付。货进 ASEZA，还要问特区是否有单独收费。海运费便宜、免柜期短、特区费用又没说清，不是便宜的到门价。",
          ),
          UL([
            ["Port dues and terminal handling.", "港务费和码头操作。"],
            ["Documentation, delivery order and broker fees.", "单证、提货单和报关行费用。"],
            ["Inspection, storage and demurrage/detention.", "查验、仓储和滞港/滞箱。"],
            ["Container deposit and inland trucking.", "柜押金和内陆拖车。"],
          ]),
          LINKS([
            ["/shipping-from-china-to-jordan/", "China to Jordan rates and customs", "中国到约旦运价与清关"],
            ["/shipping-from-shanghai-to-aqaba/", "Shanghai to Aqaba route", "上海到亚喀巴航线"],
            ["/guides/ddp-dap-red-sea-door-cost/", "DDP vs DAP door cost", "DDP 与 DAP 到门成本"],
            ["/faq/", "Shipping FAQ", "海运常见问题"],
          ]),
        ],
      },
    ],
  },
  {
    slug: "sudan-import-clearance-port-sudan",
    tag: L("IMPORT & CLEARANCE", "进口清关"),
    title: L("Sudan Import Clearance: Port Sudan Guide", "苏丹进口清关：苏丹港单证与到门"),
    lead: L(
      "Port Sudan requires an ACD before loading, an SSMO certificate for most goods, and a consignee who can clear and pay.",
      "苏丹港要求装船前办 ACD、多数商品有 SSMO 证书，收货人还要能清关和付款。订舱前先确认港口和银行情况。",
    ),
    published,
    updated: published,
    faqs: [
      {
        q: L("What is the ACD for Sudan?", "苏丹的 ACD 是什么？"),
        a: L(
          "The Advance Cargo Declaration is a 15-digit number required for Sudan-bound cargo on vessels sailing from 1 January 2026. It must be obtained before loading in China and printed on the bill of lading. The application uses the draft bill of lading, commercial invoice, freight invoice, certificate of origin and packing list.",
          "预先货物申报（ACD）是 2026 年 1 月 1 日起开航的去苏丹货物必须办理的 15 位编号。须在中国装船前取得，并打印在提单上。申请要用提单草稿、商业发票、运费发票、原产地证和装箱单。",
        ),
      },
      {
        q: L("How long does shipping to Port Sudan take?", "到苏丹港要多久？"),
        a: L(
          "There is no single reliable range. Direct sailings from China are limited, and much cargo tranships through Jeddah, Jebel Ali or Djibouti. The connection decides the transit, and a missed connection can add a week or more. Ask for the routing and the connection port on every quote.",
          "没有一个可靠统一的数字。中国直航有限，很多货经吉达、杰贝阿里或吉布提中转。衔接决定时效，错过衔接可能多等一周以上。每份报价都要问航线和衔接港。",
        ),
      },
      {
        q: L("Are Port Sudan local charges included in the ocean rate?", "苏丹港当地费用含在海运费里吗？"),
        a: L(
          "No. Port dues, terminal handling, documentation, delivery order, broker, inspection, storage, demurrage, detention, container deposit and inland transport are separate. Ask for a line-item destination quote before you compare two ocean rates.",
          "不含。港务费、码头操作、单证、提货单、报关行、查验、仓储、滞港、滞箱、柜押金和内陆运输都另计。比较两份海运费之前，先要一份分项目的目的港报价。",
        ),
      },
    ],
    sections: [
      {
        heading: L("Who is the importer", "谁是进口商"),
        blocks: [
          P(
            "The import file belongs to a Sudanese importer with an import licence and the bank channel to pay for the goods. The importer, the bank and the broker are three different roles, and each can stop the shipment. Before booking, confirm who holds the licence, who releases the documents and who pays the destination charges. A foreign seller cannot assume the consignee can do all three.",
            "进口文件属于一个有进口许可证、且有银行付款渠道的苏丹进口商。进口商、银行和报关行是三个角色，任何一个都可能让货走不动。订舱前确认许可证在谁名下、谁赎单、谁付目的港费用。外国卖方不能假设收货人三件事都能办。",
          ),
          P(
            "Sudan has been in armed conflict since April 2023, and the operating picture can change. Port Sudan is the working gateway, but port operations, inland roads and banking services may be affected. Confirm the current status with the carrier, the local broker and the consignee before each shipment. A route that worked two months ago is not evidence that it works this month.",
            "苏丹自 2023 年 4 月起处于武装冲突中，运营情况可能变化。苏丹港是目前可用的门户，但港口作业、内陆道路和银行服务都可能受影响。每票货出运前，向船公司、当地报关行和收货人确认当前状态。两个月前能走的路线，不代表这个月还能走。",
          ),
        ],
      },
      {
        heading: L("Licences and pre-shipment approvals", "许可与装船前批准"),
        blocks: [
          P(
            "Most commercial goods need a Sudanese import licence and an IM form. The licence is product- and importer-specific; it is not a generic permit for any cargo. The consignee should confirm the licence covers the HS code and the quantity before the proforma invoice is final. If the licence does not match, the cargo can be stopped before loading or at destination.",
            "多数商品需要苏丹进口许可证和 IM 表。许可证按产品和进口商签发，不是任何货都能用的通用许可。形式发票定稿前，收货人要确认许可证覆盖该 HS 编码和数量。许可证不匹配，货可能在装船前或目的港被拦。",
          ),
          P(
            "Most goods also need an SSMO certificate of inspection from an authorised agency before leaving China. The ACD is separate: it is the advance cargo declaration, and it must be obtained before loading for vessels sailing from 1 January 2026. Do not confuse the three. The ACD is not an import licence, and the SSMO certificate is not a customs declaration.",
            "多数商品出运前还要由授权机构出具苏丹标准计量局（SSMO）检验证书。ACD 是另一件事：它是预先货物申报，2026 年 1 月 1 日起开航的船必须在装船前取得。三者不要混。ACD 不是进口许可证，SSMO 证书也不是报关单。",
          ),
          UL([
            ["Import licence covering the HS code and quantity.", "覆盖 HS 编码和数量的进口许可证。"],
            ["IM form for the import file.", "进口文件中的 IM 表。"],
            ["SSMO inspection certificate before leaving China.", "出运前的 SSMO 检验证书。"],
            ["ACD 15-digit number before loading.", "装船前的 ACD 15 位编号。"],
          ]),
        ],
      },
      {
        heading: L("Documents before sailing", "装船前的单证"),
        blocks: [
          P(
            "The ACD application needs the draft bill of lading, commercial invoice, freight invoice, certificate of origin and packing list. Once issued, the 15-digit number must appear on the bill of lading. The invoice should show the importer, the HS code, the Incoterms and a clear description. The packing list should match the invoice and the container load.",
            "ACD 申请需要提单草稿、商业发票、运费发票、原产地证和装箱单。编号出来后，15 位数字必须出现在提单上。发票要写进口商、HS 编码、贸易条款和清楚品名。装箱单要和发票、柜内装载一致。",
          ),
          P(
            "The SSMO certificate, import licence and IM form sit alongside the core set. Some products need additional health, agricultural or standards approvals. Send the draft set to the broker before the cargo leaves the factory. The broker can check the Arabic description, the HS code and the licence match while there is still time to correct them.",
            "SSMO 证书、进口许可证和 IM 表和核心单证放在一起。部分产品还要卫生、农业或标准方面的额外批准。货离开工厂前，把草稿发给报关行。报关行还有时间改的时候，可以核对阿拉伯语品名、HS 编码和许可证是否匹配。",
          ),
        ],
      },
      {
        heading: L("Clearance at Port Sudan", "苏丹港清关"),
        blocks: [
          P(
            "A local broker files the customs declaration with the consignee, presents the documents, arranges inspection if required and obtains the delivery order. The consignee needs the import registration, the licence and the bank documents. The port and the terminal have their own release process. Clearance is not finished when the vessel arrives; it is finished when the delivery order is issued and the container can move.",
            "当地报关行和收货人提交报关、递交单证、安排查验（如需要）并取得提货单。收货人要有进口登记、许可证和银行单证。港口和码头还有自己的放货流程。清关不是船到就结束，而是提货单出来、柜子能走才算结束。",
          ),
          P(
            "Duty is 5–25% for most goods, plus 17% VAT, according to the country page. The HS code and the declared value decide the amount. A broker can give an estimate, but the customs authority decides. Do not treat a broker's verbal estimate as a fixed landed cost. Ask for the duty and VAT assumptions in writing, separately from the local charges.",
            "根据目的港页面，多数货物关税 5–25%，另加 17% 增值税。HS 编码和申报货值决定金额。报关行可以给估算，但最终由海关决定。不要把报关行口头估算当成固定的到岸成本。让报关行把关税和增值税假设书面列出，和当地杂费分开。",
          ),
        ],
      },
      {
        heading: L("Door delivery and inland notes", "到门与内陆注意事项"),
        blocks: [
          P(
            "Port Sudan to Khartoum and other cities is a separate operation with its own risk and cost. Roads, checkpoints and fuel availability can change. Insurance may exclude war and related risks, so confirm the cover with the insurer, not only the freight forwarder. If the consignee cannot arrange the inland leg, the container may sit at the port and storage will start.",
            "从苏丹港到喀土穆和其他城市，是另一套操作，有自己的风险和成本。道路、检查站和燃油供应都可能变化。保险可能排除战争及相关风险，要向保险方确认承保范围，不要只问货代。收货人安排不了内陆段，柜子就可能压在港口，仓储开始计费。",
          ),
          P(
            "Ask for the inland carrier's name, the truck plate and the delivery contact before the container is released. Confirm whether the cargo needs an escort, a permit or a specific route. For high-value or sensitive cargo, consider splitting the shipment and keeping one part at the port until the inland leg is confirmed. A single large shipment is harder to recover if the route changes.",
            "柜子放行前，问清内陆承运人名称、车牌和收货联系人。确认货是否需要押运、许可或特定路线。高价值或敏感货，可以考虑分票，先留一部分在港口，等内陆段确认再走。路线一变，一票大货更难调整。",
          ),
          P(
            "Port storage is the clock that matters after discharge. The consignee should have the broker, the bank and the truck ready before the vessel arrives, because a missing document can turn into a storage bill. For inland delivery, ask for a written route plan and a contact at each checkpoint. Keep a copy of the ACD, the bill of lading and the customs declaration in the truck. If the route changes, stop and confirm before the container moves; a truck stuck between checkpoints is harder to recover than a container waiting at the port.",
            "卸船后，港口仓储就是计时器。船到前，收货人要把报关行、银行和拖车都准备好；少一份单证，就可能变成一笔仓储费。内陆派送要书面路线计划和每个检查站的联系人。车上带 ACD、提单和报关单副本。路线变了，先停下来确认再走；车卡在检查站之间，比柜子留在港口更难处理。",
          ),
          P(
            "Cash and fuel can be practical constraints. Confirm who pays the truck, the fuel and any local handling, and whether the driver can use the agreed route. For high-value cargo, split the shipment or keep part at the port until the first truck completes the route. A plan that assumes the road is unchanged is not a plan. Confirm the truck's fuel, cash and communication plan before the container is released, and keep a written copy at the port. A written plan is better than a phone promise.",
            "现金和燃油是实际约束。确认拖车、燃油和当地操作由谁付，司机能否走约定路线。高价值货可以分票，或者先留一部分在港口，等第一车走通再发。假设道路不会变的计划，不算计划。放行前确认拖车的燃油、现金和通信方案，并在港口留一份书面记录。书面计划比电话承诺可靠。",
          ),
        ],
      },
      {
        heading: L("Local charges: what to ask for", "当地杂费：要问哪些"),
        blocks: [
          P(
            "Port Sudan local charges sit outside the ocean freight. They can include port dues, terminal handling, documentation, delivery order, customs broker, inspection, storage, demurrage, detention, container deposit, inland transport and bank charges. The amounts vary by terminal, container type and dwell time. Ask for a line-item quote and the currency.",
            "苏丹港当地杂费不在海运费里。可能包括港务费、码头操作、单证、提货单、报关行、查验、仓储、滞港、滞箱、柜押金、内陆运输和银行费用。金额随码头、柜型和停留时间变化。要分项报价，并写清币种。",
          ),
          P(
            "Ask what the terminal handling includes, when free time starts, who pays storage if the consignee cannot take the box, and whether the broker's fee includes the inspection attendance. A cheap ocean rate with a large, undisclosed destination charge is not a cheap route. The country page and the Port Sudan guide list the document checks in more detail.",
            "问码头操作含什么、免柜期从哪天算、收货人提不了柜时仓储谁付、报关行费用是否含查验陪同。海运费便宜、目的港却有一大笔没说清的费用，不是便宜的航线。目的港页面和苏丹港指南有更详细的单证核对。",
          ),
          UL([
            ["Port dues and terminal handling.", "港务费和码头操作。"],
            ["Documentation, delivery order and broker fees.", "单证、提货单和报关行费用。"],
            ["Inspection, storage and demurrage/detention.", "查验、仓储和滞港/滞箱。"],
            ["Container deposit, inland transport and bank charges.", "柜押金、内陆运输和银行费用。"],
          ]),
          LINKS([
            ["/shipping-from-china-to-sudan/", "China to Sudan rates and ACD", "中国到苏丹运价与 ACD"],
            ["/guides/port-sudan-clearance-transit-local-charges/", "Port Sudan clearance and local charges", "苏丹港清关与当地杂费"],
            ["/guides/first-shipment-checklist/", "First shipment checklist", "首次出运清单"],
            ["/faq/", "Shipping FAQ", "海运常见问题"],
          ]),
        ],
      },
    ],
  },
  {
    slug: "djibouti-import-clearance-ethiopia-transit",
    tag: L("IMPORT & CLEARANCE", "进口清关"),
    title: L("Djibouti Clearance & Ethiopia Transit", "吉布提清关与埃塞俄比亚过境"),
    lead: L(
      "Djibouti is two flows in one port: local Djibouti cargo and Ethiopia-bound transit. The ECTN and the Ethiopia import file decide which one you are in.",
      "吉布提港同时处理两类货：吉布提本地货和去埃塞俄比亚的过境货。ECTN 和埃塞进口文件决定你走哪一类。",
    ),
    published,
    updated: published,
    faqs: [
      {
        q: L("Do I need an ECTN for Djibouti?", "去吉布提需要 ECTN 吗？"),
        a: L(
          "Yes, since 15 June 2023. The ECTN must be obtained before loading and the number shown on the bill of lading. Cargo in direct transit to Ethiopia is exempt when the bill of lading states “In transit to Ethiopia” and the consignee is in Ethiopia. The exemption is documentary, so the wording must be exact.",
          "需要，自 2023 年 6 月 15 日起。ECTN 须在装船前取得，编号显示在提单上。直接过境到埃塞俄比亚的货物，在提单注明“In transit to Ethiopia”且收货人在埃塞俄比亚时可豁免。豁免是单证层面的，措辞必须准确。",
        ),
      },
      {
        q: L("How long does Djibouti to Addis Ababa take?", "吉布提到亚的斯亚贝巴要多久？"),
        a: L(
          "The rail takes about 12–15 hours and the road about 2–5 days, plus clearance at Djibouti and Modjo. The ocean leg is 19–24 days direct or 25–30 days with one transhipment. The Ethiopia import licence and foreign exchange can add time before the cargo moves.",
          "铁路约 12–15 小时，公路约 2–5 天，另加吉布提和 Modjo 的清关。海上段直航约 19–24 天，一次中转约 25–30 天。埃塞进口许可证和外汇可能让货在转运前多等。",
        ),
      },
      {
        q: L("Are Djibouti local charges included in the ocean rate?", "吉布提当地费用含在海运费里吗？"),
        a: L(
          "No. Port dues, terminal handling, documentation, ECTN fee, delivery order, broker, inspection, storage, demurrage, detention, container deposit, rail or road and dry-port charges are separate. Ask for the Djibouti port charges and the Ethiopia transit charges as separate lines.",
          "不含。港务费、码头操作、单证、ECTN 费、提货单、报关行、查验、仓储、滞港、滞箱、柜押金、铁路或公路和陆港费用都另计。要一份把吉布提港杂费和埃塞过境费分开列出的报价。",
        ),
      },
    ],
    sections: [
      {
        heading: L("Two flows in one port", "一个港口，两类货"),
        blocks: [
          P(
            "Djibouti handles local imports for its own market and transit cargo for landlocked Ethiopia. The two flows use different documents, different customs treatments and often different brokers. Local cargo is cleared into Djibouti; Ethiopia-bound cargo moves under customs bond to the border and then to Modjo dry port. Before you book, decide which flow your cargo belongs to.",
            "吉布提既处理本国进口，也处理内陆国埃塞俄比亚的过境货。两类货的单证、海关处理和报关行往往不同。本地货清关进入吉布提；去埃塞的货在海关监管下运到边境，再到 Modjo 陆港。订舱前先确定你的货属于哪一类。",
          ),
          P(
            "The ECTN is the first filter. Since 15 June 2023, containers unloaded in Djibouti need an ECTN, unless the cargo is in direct transit to Ethiopia and the bill of lading says “In transit to Ethiopia” with an Ethiopian consignee. The exemption is checked on the documents, not on a verbal instruction. If the wording is wrong, the cargo can be treated as local import.",
            "ECTN 是第一道筛选。自 2023 年 6 月 15 日起，在吉布提卸货的集装箱需要 ECTN；直接过境埃塞俄比亚、提单注明“In transit to Ethiopia”且收货人在埃塞的货物可免。豁免按单证审核，不认口头说明。措辞不对，货可能被按本地进口处理。",
          ),
        ],
      },
      {
        heading: L("Licences and approvals", "许可与批准"),
        blocks: [
          P(
            "For local Djibouti imports, the consignee needs a registered importer and a broker. For Ethiopia-bound cargo, the Ethiopian importer needs an import licence and foreign-exchange approval through an Ethiopian bank before shipping. The licence and the bank permit are Ethiopian documents, not Djibouti documents, but the Djibouti transit file has to match them.",
            "吉布提本地进口，收货人要有注册进口商和报关行。去埃塞俄比亚的货，埃塞进口商要在出运前持有进口许可证，并通过埃塞银行取得外汇批准。许可证和银行许可是埃塞文件，不是吉布提文件，但吉布提过境文件必须和它们一致。",
          ),
          P(
            "The Ethiopia import licence is product-specific, and the bank permit is tied to the invoice and the supplier. If the licence does not cover the HS code, or the bank permit does not match the invoice, the cargo can reach Djibouti and still not move. Confirm both before the vessel sails. A late correction can take longer than the ocean leg.",
            "埃塞进口许可证按产品签发，银行许可和发票、供应商绑定。许可证不覆盖 HS 编码，或者银行许可和发票不一致，货到了吉布提也走不了。开船前把两者确认好。事后改，可能比海上段还久。",
          ),
          UL([
            ["Djibouti local importer registration and broker.", "吉布提本地进口商注册和报关行。"],
            ["Ethiopia import licence covering the HS code.", "覆盖 HS 编码的埃塞进口许可证。"],
            ["Ethiopian bank permit and FX approval.", "埃塞银行许可和外汇批准。"],
            ["ECTN or the exact Ethiopia transit wording on the bill of lading.", "ECTN 或提单上准确的埃塞过境措辞。"],
          ]),
        ],
      },
      {
        heading: L("Documents before sailing", "装船前的单证"),
        blocks: [
          P(
            "The ECTN application typically needs the bill of lading, commercial invoice, packing list, certificate of origin and freight invoice. For Ethiopia transit, add the Ethiopian import declaration, the bank permit and the transit documents required by the corridor. The bill of lading, invoice and packing list must agree on the consignee, the quantity and the description.",
            "ECTN 申请通常需要提单、商业发票、装箱单、原产地证和运费发票。去埃塞过境，还要埃塞进口申报、银行许可和走廊要求的过境单证。提单、发票和装箱单在收货人、数量和品名上必须一致。",
          ),
          P(
            "The Ethiopia-side broker and the Djibouti-side broker are often different companies. Make one of them the owner of the full chain, or define the handover point in writing. The most common failure is not the ocean leg; it is a document that arrives after the container, or a transit paper that does not match the Ethiopian declaration. Put the document list and the handover point in the booking confirmation.",
            "埃塞一侧和吉布提一侧的报关行往往是两家公司。让其中一家负责全链条，或者把交接点写清楚。最常见的失败不在海上，而是单证比柜子晚到，或者过境纸和埃塞申报不一致。把单证清单和交接点写进订舱确认。",
          ),
        ],
      },
      {
        heading: L("Clearance and the Ethiopia corridor", "清关与埃塞走廊"),
        blocks: [
          P(
            "A local broker files the Djibouti declaration and obtains the delivery order. Local cargo is cleared into Djibouti. Transit cargo moves under customs bond to the border and then to Modjo dry port, where the Ethiopian declaration is completed. The rail takes about 12–15 hours; the road takes about 2–5 days. The total door-to-door time includes terminal handling at both ends and the train or truck schedule.",
            "当地报关行提交吉布提申报并取得提货单。本地货清关进入吉布提。过境货在海关监管下运到边境，再到 Modjo 陆港完成埃塞申报。铁路约 12–15 小时，公路约 2–5 天。门到门总时长还要加两端的码头操作和铁路或卡车班期。",
          ),
          P(
            "Modjo is a dry port, not the final address. Cargo can be cleared there and delivered locally, or moved onward. The consignee needs a broker who can handle the dry-port release, and the trucker needs the right documents to collect the container. If the container is not returned within the free time, detention continues even after the cargo is unloaded.",
            "Modjo 是陆港，不是最终地址。货可以在那里清关后再本地派送，也可以继续转运。收货人要有能处理陆港放货的报关行，拖车要有正确单证才能提柜。柜子没有在免柜期内还回，哪怕货已经卸了，滞箱费还会继续。",
          ),
        ],
      },
      {
        heading: L("Door delivery and empty return", "到门与空柜返还"),
        blocks: [
          P(
            "For Djibouti local delivery, confirm the address, the truck access and the unloading arrangement. For Ethiopia, confirm the final warehouse, the Modjo release and the truck or rail booking. The delivery address may be in Addis Ababa or another city; Modjo is only the customs point. Do not quote a door price to Addis if the quote stops at Modjo.",
            "吉布提本地派送，确认地址、拖车进出和卸货安排。去埃塞，确认最终仓库、Modjo 放货和铁路或卡车订舱。送货地址可能在亚的斯亚贝巴或其他城市；Modjo 只是海关点。报价到 Modjo 为止，就不要说成到亚的斯门到门。",
          ),
          P(
            "Ask who returns the empty container, where it goes and by when. The free time may start at discharge or at availability, and the rail or road leg can eat most of it. If the consignee cannot return the box, detention can exceed the value of the cargo. Put the empty-return responsibility in the booking confirmation, not in a phone call.",
            "问清空柜由谁还、还到哪里、什么时候还。免柜期可能从卸船算，也可能从可提货算，铁路或公路段会吃掉大部分时间。收货人还不了柜，滞箱费可能超过货值。把空柜返还责任写进订舱确认，不要只打电话说。",
          ),
          P(
            "Rail and road are not interchangeable. The rail has a fixed schedule and terminal handling at both ends; the road is more flexible but depends on the border and the truck. Ask for the train cut-off, the Modjo release and the empty-return point before you choose. If the consignee needs the cargo in Addis on a specific date, compare the total door-to-door time, not only the line-haul time. A rail booking that misses the train can be slower than a road trip that leaves on time.",
            "铁路和公路不能互换。铁路班期固定，两端有码头操作；公路更灵活，但取决于口岸和车辆。选择前问清铁路截点、Modjo 放货和空柜返还点。收货人要在某天到亚的斯，就比门到门总时长，不要只比干线时间。铁路订舱错过班列，可能比按时出发的公路更慢。",
          ),
          P(
            "For local Djibouti delivery, confirm the address and the truck access. For Ethiopia, confirm the final warehouse and who clears at Modjo. Do not let the Djibouti broker and the Ethiopia broker each assume the other has booked the next leg. The handover point should be written, with a name and a phone number. Write the handover point, the named contact and the document list into the booking confirmation before the vessel arrives, not into a chat message that disappears, and keep a copy with the driver. The written handover is the one both brokers can follow.",
            "吉布提本地派送，确认地址和拖车进出。去埃塞，确认最终仓库和 Modjo 由谁清关。不要让吉布提报关行和埃塞报关行都以为对方订了下一段。交接点要写下来，有名字和电话。把交接点、联系人和单证清单写进订舱确认，不要只发一条会消失的聊天消息，并让司机带一份。书面交接是两边都能执行的版本。",
          ),
        ],
      },
      {
        heading: L("Local charges: what to ask for", "当地杂费：要问哪些"),
        blocks: [
          P(
            "Djibouti local charges sit outside the ocean freight. They can include port dues, terminal handling, documentation, ECTN fee, delivery order, customs broker, inspection, storage, demurrage, detention, container deposit and the onward rail or road leg. The amounts vary by terminal, container type and dwell time. Ask for the Djibouti port charges and the Ethiopia transit charges as separate lines.",
            "吉布提当地杂费不在海运费里。可能包括港务费、码头操作、单证、ECTN 费、提货单、报关行、查验、仓储、滞港、滞箱、柜押金和后续铁路或公路段。金额随码头、柜型和停留时间变化。吉布提港杂费和埃塞过境费要分开列。",
          ),
          P(
            "Ask what the ECTN fee covers, when free time starts, whether storage is charged by calendar or working day, and who pays the dry-port handling at Modjo. A single lump sum hides the part that will grow. The Djibouti port guide and the country page list the document checks in more detail.",
            "问 ECTN 费含什么、免柜期从哪天算、仓储按自然日还是工作日、Modjo 陆港操作谁付。一个总数会把以后会涨的那部分藏起来。吉布提港口指南和目的港页面有更详细的单证核对。",
          ),
          UL([
            ["Port dues and terminal handling.", "港务费和码头操作。"],
            ["Documentation, ECTN and broker fees.", "单证、ECTN 和报关行费用。"],
            ["Storage, demurrage and detention.", "仓储、滞港和滞箱。"],
            ["Container deposit, rail or road and dry-port handling.", "柜押金、铁路或公路和陆港操作。"],
          ]),
          LINKS([
            ["/shipping-from-china-to-djibouti/", "China to Djibouti and Ethiopia", "中国到吉布提与埃塞俄比亚"],
            ["/guides/djibouti-clearance-transit-local-charges/", "Djibouti clearance and local charges", "吉布提清关与当地杂费"],
            ["/guides/fcl-vs-lcl-red-sea/", "FCL vs LCL guide", "整柜与拼箱指南"],
            ["/faq/", "Shipping FAQ", "海运常见问题"],
          ]),
        ],
      },
    ],
  },
];
