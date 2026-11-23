import type { Guide } from "./content.ts";

const L = (en: string, zh: string) => ({ en, zh });
const P = (en: string, zh: string) => ({ kind: "p" as const, text: L(en, zh) });
const UL = (items: [string, string][]) => ({ kind: "ul" as const, items: items.map(([en, zh]) => L(en, zh)) });
const LINKS = (items: [string, string, string][]) => ({
  kind: "links" as const,
  items: items.map(([href, en, zh]) => ({ href, text: L(en, zh) })),
});

const published = "2026-11-23";

export const originGuides: Guide[] = [
  {
    slug: "shipping-from-shanghai-to-red-sea",
    tag: L("ORIGIN PORT", "起运港"),
    title: L("Shanghai to Red Sea Shipping: Routes & Transit", "上海到红海海运：船期、时效与货型"),
    lead: L(
      "Shanghai offers the widest carrier choice on this trade, but the cheapest ocean line is not always the cheapest door cost.",
      "上海的优势是船公司和船期选择多，但海运费最低不一定到门最便宜。这篇讲上海出红海怎么选。",
    ),
    published,
    updated: published,
    faqs: [
      {
        q: L("Is Shanghai the best origin for every Red Sea shipment?", "上海是发红海的最佳起运港吗？"),
        a: L(
          "No. Shanghai has the widest carrier choice, but a factory in Zhejiang may save more by loading at Ningbo, and a factory in Shandong may save more at Qingdao. Compare the total cost including trucking, not only the ocean freight.",
          "不一定。上海船公司选择最多，但浙江工厂走宁波可能更省，山东工厂走青岛可能更省。要把拖车费算进去比总成本，不能只看海运费。",
        ),
      },
      {
        q: L("How long does Shanghai to Jeddah take?", "上海到吉达要多久？"),
        a: L(
          "The country page lists 17–31 days port to port: about 17–18 days on a direct sailing, up to 31 days with a transhipment. The exact figure depends on the carrier and the connection, so ask for the routing on your quote.",
          "目的港页面给出 17–31 天港到港：直航约 17–18 天，中转最长约 31 天。具体看船公司和衔接，询价时问清航线。",
        ),
      },
      {
        q: L("Can I ship dangerous goods from Shanghai?", "上海能出危险品吗？"),
        a: L(
          "Sometimes. The carrier must approve the UN number, packing and route, and the transhipment port must accept the class. Send the MSDS, UN38.3 summary and packing details before booking; a general cargo booking cannot be converted later.",
          "有时可以。船公司要批复 UN 编号、包装和航线，中转港也要接受该类别。订舱前先发 MSDS、UN38.3 摘要和包装资料；普货订舱不能事后改成危险品。",
        ),
      },
    ],
    sections: [
      {
        heading: L("Why Shanghai, and who it suits", "为什么选上海，适合谁"),
        blocks: [
          P(
            "Shanghai is China's largest container gateway and the main outlet for the Yangtze Delta. Its advantage is choice: more carriers, more sailings and more routing combinations than any other Chinese port on this trade. For a shipper in Shanghai, southern Jiangsu or northern Zhejiang, that choice can mean a direct sailing to Jeddah, Sokhna, Aqaba or Djibouti, and a workable connection to Port Sudan.",
            "上海是中国最大的集装箱门户，也是长三角的主要出海口。它的优势是选择多：这条航线上，船公司、船期和航线组合都比其他中国港口多。对上海、苏南、浙北的货主来说，这种选择可能意味着到吉达、苏赫纳、亚喀巴或吉布提有直航，到苏丹港也能接上中转。",
          ),
          P(
            "Choice is not the same as the lowest total cost. Shanghai's local charges and trucking can be higher than Ningbo's, and a factory in Zhejiang may be closer to Ningbo. Shanghai suits time-sensitive cargo, high-value goods, mixed SKUs and shippers who need several sailing options in the same week. It is less compelling when the cargo is heavy, the factory is far away and the only goal is the lowest ocean line.",
            "选择多不等于总成本最低。上海的本地费用和拖车可能高于宁波，浙江工厂离宁波也更近。上海适合时效紧的货、高价值货、多品种拼票，以及同一周需要几个船期备选的货主。货重、工厂远、只追求海运费最低时，上海的优势就没那么明显。",
          ),
        ],
      },
      {
        heading: L("Sailing options and transit", "船期与时效"),
        blocks: [
          P(
            "Direct and transhipment sailings both exist. The country pages give port-to-port ranges: Jeddah 17–31 days, Sokhna 20–35 days, Aqaba 20–35 days, Djibouti 19–30 days. Jeddah has direct sailings from Shanghai and Shenzhen at about 17–18 days; Sokhna has direct sailings from South China at about 20–23 days, while North China cargo often tranships and can take 32–35 days. Port Sudan has limited direct capacity and much cargo connects via Jeddah, Jebel Ali or Djibouti.",
            "直航和中转都有。目的港页面给出港到港区间：吉达 17–31 天，苏赫纳 20–35 天，亚喀巴 20–35 天，吉布提 19–30 天。吉达有上海和深圳直航，约 17–18 天；苏赫纳有华南直航，约 20–23 天，华北货常需中转，可能 32–35 天。苏丹港直航舱位有限，很多货经吉达、杰贝阿里或吉布提衔接。",
          ),
          P(
            "Those ranges are not a schedule. A carrier may publish 18 days and still miss the connection, and a transhipment quote can arrive earlier than a direct one if the direct sailing is full or delayed. Ask for the next two ETDs, the connection port, the cut-off at each end and the free time at destination. If the cargo has a fixed delivery date, compare the arrival window, not the fastest published number.",
            "这些区间不是船期表。船公司可能写 18 天，实际仍会错过衔接；直航满舱或延误时，中转报价也可能更早到。问最近两个 ETD、中转港、两端截点和目的港免柜期。货有固定交期，就比到货窗口，不要只比最快的那一天。",
          ),
        ],
      },
      {
        heading: L("What the route costs", "费用结构"),
        blocks: [
          P(
            "The ocean freight is only one line. Origin charges at Shanghai can include terminal handling, documentation, export declaration, trucking from the factory and, for LCL, warehouse handling and consolidation. War-risk and peak-season surcharges may sit on top. The same destination can quote differently from Shanghai and Ningbo because the sailing, the equipment and the local charges are different.",
            "海运费只是一行。上海的起运港费用可能包括码头操作、单证、出口申报、工厂拖车；拼箱还有仓库操作和集拼。战争风险和旺季附加费可能另加。同一个目的港，上海和宁波的报价不同，因为船期、箱源和本地费用不同。",
          ),
          P(
            "Compare a line-item quote, not a single number. Ask what is included in the terminal handling, whether the trucking is to the port or only to a depot, how many free days the destination gives, and how long the rate is valid. A low ocean line with a long truck leg or a short free time can cost more than a slightly higher all-in quote.",
            "要比分项报价，不要只比一个总数。问码头操作含什么、拖车是到港区还是只到堆场、目的港免柜几天、价格有效期多久。海运费低、拖车远或免柜期短，最后可能比贵一点的全包价更贵。",
          ),
          P(
            "Rates on this trade are usually valid for a short window, not the whole month. The ocean line, the war-risk surcharge and the space can change together. Ask for the validity date and the date by which the container must be gated in. If the rate expires before your cargo is ready, the next quote may be different. A booking that holds a rate but misses the vessel is not a saving.",
            "这条航线的价格通常只在一段短窗口内有效，不是整月不变。海运费、战争风险附加费和舱位可能一起变。问有效期和进闸截止日。运价在货好之前到期，下一份报价可能就不同了。拿着旧价却赶不上船，不算省钱。",
          ),
        ],
      },
      {
        heading: L("Cargo that fits Shanghai", "适合什么货"),
        blocks: [
          P(
            "Shanghai handles high-value electronics, machinery, mixed consumer goods, e-commerce cargo and time-sensitive shipments well because there are more sailings to choose from. LCL consolidation is also broad, which helps smaller shippers. Dangerous goods and batteries can move, but only with carrier approval, the right UN number and a transhipment port that accepts the class.",
            "上海适合高价值电子、机械、混合消费品、电商货和时效紧的货，因为船期选择多。拼箱集拼也广，小货主更容易找到舱位。危险品和电池可以走，但要有船公司批复、正确 UN 编号，以及接受该类别的中转港。",
          ),
          P(
            "For dense cargo, price a 20GP first and confirm the payload; for light, voluminous cargo, a 40HQ usually lowers the cost per cubic metre. Project cargo and out-of-gauge units need a separate review of equipment, lifting and road permits. Do not assume a container rate applies to a flat rack or an open-top.",
            "重货先问 20GP 并确认载重；轻货、体积货用 40HQ 通常能把每立方米成本拉低。项目货和超尺寸货要单独看设备、吊装和公路许可。不要以为普通柜的运价能套到框架柜或开顶柜。",
          ),
          P(
            "Booking early matters in peak weeks. Shanghai's sailings fill from both local and feeder cargo, and equipment can tighten before the rate does. If the cargo is ready, book before the cut-off, not after. If it is not ready, ask for a later sailing rather than holding space you cannot use. A confirmed booking with the wrong cargo-ready date is worse than a later sailing with the right one.",
            "旺季要早订。上海的舱位同时被本地货和驳船货占用，箱源可能比运价更早紧张。货好了就在截点前订，不要拖到截点后。货没好，就问下一班船，不要占着舱位却用不上。备货日期填错的确认订舱，比晚一班船更麻烦。",
          ),
          UL([
            ["Time-sensitive or high-value cargo: Shanghai's sailing choice helps.", "时效紧或高价值货：上海的船期选择有帮助。"],
            ["Factory in Zhejiang: compare Ningbo before booking.", "工厂在浙江：订舱前先比宁波。"],
            ["Heavy cargo: 20GP first, then check payload and road limits.", "重货：先看 20GP，再核对载重和公路限重。"],
            ["DG or batteries: carrier approval before the booking.", "危险品或电池：先拿船公司批复再订舱。"],
          ]),
        ],
      },
      {
        heading: L("Connections to the five ports", "到五个目的港的衔接"),
        blocks: [
          P(
            "Jeddah is the most straightforward: direct sailings from Shanghai are listed at about 17–18 days, with transhipment options up to 31 days. Sokhna depends on the sailing; South China direct services are faster, while East and North China cargo often connects through a hub. Aqaba has direct services at about 20–28 days, and a transhipment adds roughly 3–7 days. Djibouti has direct services at about 19–24 days and one-stop options at 25–30 days.",
            "吉达最直接：上海直航约 17–18 天，中转最长约 31 天。苏赫纳看船期：华南直航更快，华东和华北货常经枢纽衔接。亚喀巴有直航，约 20–28 天，中转多约 3–7 天。吉布提直航约 19–24 天，一次中转约 25–30 天。",
          ),
          P(
            "Port Sudan is the exception. Direct sailings from China are limited, and much cargo tranships through Jeddah, Jebel Ali or Djibouti. A missed connection can add a week or more. Confirm the port, terminal, banking channel and inland leg with the consignee before booking; the country page lists the ACD and SSMO documents we have checked.",
            "苏丹港是例外。中国直航有限，很多货经吉达、杰贝阿里或吉布提中转。错过衔接可能多等一周以上。订舱前和收货人确认港口、码头、银行渠道和内陆段；目的港页面列了我们核对过的 ACD 和 SSMO 单证。",
          ),
          UL([
            ["Jeddah: direct 17–18 days; transhipment up to 31 days.", "吉达：直航 17–18 天；中转最长 31 天。"],
            ["Sokhna: South China direct 20–23 days; North China transhipment 32–35 days.", "苏赫纳：华南直航 20–23 天；华北中转 32–35 天。"],
            ["Aqaba: direct 20–28 days; transhipment adds 3–7 days.", "亚喀巴：直航 20–28 天；中转多 3–7 天。"],
            ["Djibouti: direct 19–24 days; one-stop 25–30 days.", "吉布提：直航 19–24 天；一次中转 25–30 天。"],
            ["Port Sudan: limited direct; confirm the hub and connection.", "苏丹港：直航有限；确认枢纽和衔接。"],
          ]),
        ],
      },
      {
        heading: L("Booking checklist", "订舱清单"),
        blocks: [
          P(
            "Before you ask for a rate, write down the cargo-ready date, the factory address, the nearest origin port, the destination port, the container type and quantity, the HS code and the Incoterms. Add the consignee's document requirements and the delivery address. A complete enquiry gets a quote you can compare; a partial one gets a maybe.",
            "询价前先写下备货日期、工厂地址、最近起运港、目的港、柜型和数量、HS 编码和贸易条款。再加上收货人的单证要求和送货地址。资料完整，拿到的是能比较的报价；资料不全，只能得到“也许”。",
          ),
          P(
            "If the cargo is ready now, ask for the next two sailings. If it is flexible, ask what changes next week. Do not book on the ocean line alone: check the routing, the connection, the free time and the total cost. The links below go to the Shanghai route pages, the destination pages and the current market reading.",
            "货已经好了，就问最近两班船；货期灵活，就问下周有什么变化。不要只看海运费订舱：航线、衔接、免柜期和总成本都要看。下面的链接通向上海航线页、目的港页面和当前市场读数。",
          ),
          LINKS([
            ["/shipping-from-shanghai-to-jeddah/", "Shanghai to Jeddah route", "上海到吉达航线"],
            ["/shipping-from-shanghai-to-sokhna/", "Shanghai to Sokhna route", "上海到苏赫纳航线"],
            ["/shipping-from-shanghai-to-aqaba/", "Shanghai to Aqaba route", "上海到亚喀巴航线"],
            ["/shipping-from-shanghai-to-djibouti/", "Shanghai to Djibouti route", "上海到吉布提航线"],
            ["/shipping-from-shanghai-to-port-sudan/", "Shanghai to Port Sudan route", "上海到苏丹港航线"],
            ["/shipping-from-china-to-saudi-arabia/", "China to Saudi Arabia rates and documents", "中国到沙特运价与单证"],
            ["/guides/shipping-from-ningbo-to-red-sea/", "Compare Ningbo as an origin", "对比宁波起运"],
            ["/rates/", "Current Red Sea rates", "查看当前红海运价"],
            ["/faq/", "Shipping FAQ", "海运常见问题"],
          ]),
        ],
      },
    ],
  },
  {
    slug: "shipping-from-ningbo-to-red-sea",
    tag: L("ORIGIN PORT", "起运港"),
    title: L("Ningbo to Red Sea Shipping: Routes & Transit", "宁波到红海海运：船期、时效与货型"),
    lead: L(
      "Ningbo is Zhejiang's deep-water outlet. It can beat Shanghai on total cost for heavy cargo, but has fewer direct Red Sea calls.",
      "宁波是浙江制造业的深水出海口。重货走宁波的总成本可能低于上海，但红海直航较少。订舱前两个港都值得比。",
    ),
    published,
    updated: published,
    faqs: [
      {
        q: L("Is Ningbo cheaper than Shanghai for Red Sea cargo?", "宁波比上海便宜吗？"),
        a: L(
          "Not always. Ningbo can be cheaper for cargo originating in Zhejiang because the truck leg is shorter, and its ocean rates are often competitive. Shanghai has more sailings and sometimes more direct options. Compare the total cost, including trucking and local charges, for the same sailing window.",
          "不一定。浙江起运的货走宁波，拖车更短，海运费也常有竞争力。上海船期更多，直航选择有时更多。要在同一个出运窗口里比总成本，含拖车和本地费用。",
        ),
      },
      {
        q: L("Does Ningbo have direct sailings to the Red Sea?", "宁波有红海直航吗？"),
        a: L(
          "Some services call directly, but the choice is narrower than Shanghai's. Many Red Sea sailings from Ningbo connect through Shanghai, Singapore, Colombo or another hub. Ask whether the quote is direct, which hub it uses and how long the connection is.",
          "有船直挂，但选择比上海少。宁波很多红海货经上海、新加坡、科伦坡或其他枢纽衔接。问清是直航还是中转、走哪个枢纽、衔接多久。",
        ),
      },
      {
        q: L("What cargo suits Ningbo?", "什么货适合走宁波？"),
        a: L(
          "Heavy and voluminous cargo from Zhejiang: machinery, furniture, tiles, auto parts, building materials and project cargo. The port's deep water and equipment make it a practical choice for dense loads. Small, urgent shipments may still find more sailings at Shanghai.",
          "浙江起运的重货和体积货：机械、家具、瓷砖、汽车配件、建材和项目货。宁波水深、设备条件好，适合重柜。小批量、时效紧的货，上海船期可能更多。",
        ),
      },
    ],
    sections: [
      {
        heading: L("Why Ningbo, and who it suits", "为什么选宁波，适合谁"),
        blocks: [
          P(
            "Ningbo is the main seaport for Zhejiang and one of the busiest container ports in the world. Its deep-water berths and strong feeder network make it a natural outlet for machinery, furniture, tiles, auto parts, building materials and project cargo from Ningbo, Hangzhou, Wenzhou, Taizhou and the surrounding manufacturing belt. For a factory in Zhejiang, the truck leg is often shorter and cheaper than trucking to Shanghai.",
            "宁波是浙江的主要出海口，也是全球最繁忙的集装箱港之一。深水泊位和密集的支线网络，使它适合宁波、杭州、温州、台州及周边制造业的机械、家具、瓷砖、汽车配件、建材和项目货。浙江工厂走宁波，拖车通常比到上海更短、更便宜。",
          ),
          P(
            "The trade-off is choice. Ningbo has fewer direct Red Sea calls than Shanghai, and some sailings feed into Shanghai or connect through an Asian hub. That can add a day or a week, depending on the connection. Ningbo suits cost-sensitive cargo, heavy loads and shippers who value a short inland leg; it is less ideal when the delivery date is tight and only a direct sailing will do.",
            "代价是选择少。宁波的红海直航比上海少，有些船要先驳到上海，或者经亚洲枢纽衔接。衔接可能多一天，也可能多一周。宁波适合对成本敏感、货重、看重短拖车的货主；交期很紧、只要直航时，就没那么合适。",
          ),
        ],
      },
      {
        heading: L("Sailing options and transit", "船期与时效"),
        blocks: [
          P(
            "Ningbo's Red Sea services mix direct calls and transhipment. Jeddah is listed at 17–31 days port to port, Sokhna at 20–35 days, Aqaba at 20–35 days and Djibouti at 19–30 days. Direct sailings are faster; a connection through Shanghai, Singapore or Colombo can add several days. Port Sudan has limited direct capacity and often connects via Jeddah, Jebel Ali or Djibouti.",
            "宁波的红海航线直航和中转都有。吉达港到港 17–31 天，苏赫纳 20–35 天，亚喀巴 20–35 天，吉布提 19–30 天。直航更快；经上海、新加坡或科伦坡衔接可能多几天。苏丹港直航有限，常经吉达、杰贝阿里或吉布提衔接。",
          ),
          P(
            "Ask whether the first vessel actually loads at Ningbo or feeds to Shanghai. A feeder leg adds a handover and a cut-off, and it changes who is responsible if the connection is missed. Ask for the connection port and the next sailing after a missed connection. A quote that says only “Ningbo to Jeddah” does not answer those questions.",
            "问清第一程是在宁波装船，还是先驳到上海。支线多一次交接和截点，也会改变错过衔接时的责任。问中转港，以及错过后的下一班船。只写“宁波到吉达”的报价，回答不了这些问题。",
          ),
        ],
      },
      {
        heading: L("What the route costs", "费用结构"),
        blocks: [
          P(
            "The ocean freight, origin charges and trucking decide the total. Ningbo's local charges can be lower than Shanghai's for some cargo, and the truck leg from a Zhejiang factory is often shorter. But a feeder to Shanghai adds a leg, and a transhipment adds destination handling. The cheapest ocean line may not be the cheapest door cost.",
            "总成本由海运费、起运港费用和拖车决定。某些货走宁波，本地费用比上海低，浙江工厂的拖车也更短。但驳到上海会多一段，中转会在目的港多一次操作。海运费最低，不一定到门最便宜。",
          ),
          P(
            "Ask for a line-item quote: terminal handling, documentation, export declaration, trucking, feeder if any, ocean freight, war risk, destination charges and free time. If the cargo is heavy, confirm the payload and the road limit before you compare per-container rates. A 20GP may carry more cargo tonnes than a 40HQ, even if the ocean line looks higher.",
            "要分项报价：码头操作、单证、出口申报、拖车、可能的驳船、海运费、战争风险、目的港费用和免柜期。货重的话，比每柜运价前先确认载重和公路限重。20GP 可能比 40HQ 多装货吨，哪怕海运费看起来更高。",
          ),
          P(
            "Equipment is part of the cost. A 40HQ may be easier to find than a 40GP, and a 20GP may be scarce when dense cargo is moving. Ask about the container type and the pick-up location, not only the ocean rate. If the box has to be trucked empty from another depot, that leg belongs in the comparison.",
            "箱源也是成本的一部分。40HQ 可能比 40GP 好找；重货多的时候 20GP 也会紧。问柜型和提柜地点，不要只问海运费。空柜要从另一个堆场拖过来，这段也要算进比较。",
          ),
        ],
      },
      {
        heading: L("Cargo that fits Ningbo", "适合什么货"),
        blocks: [
          P(
            "Ningbo is a good fit for dense and voluminous cargo: machinery, furniture, tiles, sanitary ware, auto parts, steel products, building materials and project units. The port has the equipment and the feeder network to handle heavy loads, and the shorter truck leg from Zhejiang reduces road risk. For light consumer goods, the choice between Ningbo and Shanghai often comes down to the sailing, not the port.",
            "宁波适合重货和体积货：机械、家具、瓷砖、洁具、汽车配件、钢材、建材和项目设备。港口设备和支线网络能处理重柜，浙江短拖车也降低公路风险。轻泡消费品走宁波还是上海，往往取决于船期，不取决于港口本身。",
          ),
          P(
            "Dangerous goods and batteries need the same carrier approval as any other origin. Do not assume a Ningbo sailing accepts a class because Shanghai does. Ask the carrier and the transhipment port separately. For high-value or fragile cargo, the extra handover of a feeder or transhipment is a risk to price into the decision.",
            "危险品和电池同样要船公司批复。不要以为上海接受的类别，宁波也一定接受。船公司和中转港要分别确认。高价值或易碎货，要把支线或中转多一次交接的风险算进决策。",
          ),
          P(
            "Consolidation is another reason to compare. Ningbo has LCL services, but departure frequency may be lower than Shanghai's. If the cargo is small, waiting for the next consolidation can cost more than the truck to Shanghai. If it fills a 20GP or 40HQ, the sailing choice matters more than the LCL schedule. For inland factories in Hangzhou, Shaoxing or Taizhou, rail and barge options can move boxes to Ningbo without a long truck leg; ask whether the quote includes that leg and who owns the cut-off.",
            "集拼也是比较的理由。宁波有拼箱服务，但班次可能比上海少。货少，等下一班集拼的成本可能高于拖到上海。货能装满 20GP 或 40HQ，船期就比拼箱班次更重要。杭州、绍兴、台州等内陆工厂，可以用铁路或驳船把柜子运到宁波，减少长拖车；问报价是否含这一段、截点由谁负责。",
          ),
          UL([
            ["Heavy machinery and project cargo: check equipment and lifting.", "重型机械和项目货：确认设备和吊装。"],
            ["Furniture, tiles and building materials: 40HQ for volume, 20GP for weight.", "家具、瓷砖、建材：体积货看 40HQ，重货看 20GP。"],
            ["Zhejiang factory: compare the truck leg to Ningbo and Shanghai.", "浙江工厂：比较到宁波和上海的拖车。"],
            ["DG or batteries: confirm the class on the actual sailing.", "危险品或电池：按实际船期确认类别。"],
          ]),
        ],
      },
      {
        heading: L("Connections to the five ports", "到五个目的港的衔接"),
        blocks: [
          P(
            "Jeddah, Sokhna, Aqaba and Djibouti are all reachable from Ningbo, but the mix of direct and transhipment changes by carrier and week. Jeddah is the most mature route, with direct and connecting options. Sokhna can be direct from South China and transhipped from East/North China. Aqaba and Djibouti often connect through a hub, so the connection window matters as much as the ocean leg.",
            "宁波到吉达、苏赫纳、亚喀巴和吉布提都能走，但直航和中转的比例随船公司、星期变化。吉达最成熟，直航和中转都有。苏赫纳华南有直航，华东/华北常中转。亚喀巴和吉布提常经枢纽衔接，衔接窗口和海上段一样重要。",
          ),
          P(
            "Port Sudan is the least direct. Much cargo connects through Jeddah, Jebel Ali or Djibouti, and a missed connection can add a week or more. If the consignee needs a specific arrival window, ask for the connection port and the contingency plan before booking. The country page lists the ACD and SSMO requirements.",
            "苏丹港最不直接。很多货经吉达、杰贝阿里或吉布提衔接，错过衔接可能多等一周以上。收货人有明确到货窗口，就订舱前问清中转港和预案。目的港页面列了 ACD 和 SSMO 要求。",
          ),
          UL([
            ["Jeddah: direct and transhipment options; 17–31 days.", "吉达：直航和中转都有；17–31 天。"],
            ["Sokhna: 20–35 days; North China cargo often tranships.", "苏赫纳：20–35 天；华北货常中转。"],
            ["Aqaba: 20–35 days; confirm the connection.", "亚喀巴：20–35 天；确认衔接。"],
            ["Djibouti: 19–30 days; direct or one-stop.", "吉布提：19–30 天；直航或一次中转。"],
            ["Port Sudan: limited direct; plan for a hub connection.", "苏丹港：直航有限；按枢纽衔接做计划。"],
          ]),
        ],
      },
      {
        heading: L("Booking checklist", "订舱清单"),
        blocks: [
          P(
            "Write down the factory address, cargo-ready date, destination, container type, gross weight, HS code and Incoterms. Add the consignee's document requirements and the delivery address. If the factory is in Zhejiang, get trucking quotes to both Ningbo and Shanghai; the difference can decide the origin.",
            "写下工厂地址、备货日期、目的港、柜型、毛重、HS 编码和贸易条款。再加上收货人的单证要求和送货地址。工厂在浙江，就同时问宁波和上海的拖车价；差额可能直接决定起运港。",
          ),
          P(
            "Ask for the next two sailings, the routing, the connection port and the free time. Do not compare a Ningbo transhipment quote with a Shanghai direct quote as if they were the same product. If the cargo is time-sensitive, the direct option may be worth the higher ocean line. If it is not, the cheaper connection may be the better total. If the two totals are close, choose the shorter inland leg and the clearer free time.",
            "问最近两班船、航线、中转港和免柜期。不要拿宁波中转报价和上海直航报价当同一个产品比。货急，直航可能值更高的海运费；货不急，便宜的中转可能总成本更低。如果两个总价接近，选内陆段更短、免柜期更清楚的那个。",
          ),
          LINKS([
            ["/shipping-from-ningbo-to-jeddah/", "Ningbo to Jeddah route", "宁波到吉达航线"],
            ["/shipping-from-ningbo-to-sokhna/", "Ningbo to Sokhna route", "宁波到苏赫纳航线"],
            ["/shipping-from-ningbo-to-aqaba/", "Ningbo to Aqaba route", "宁波到亚喀巴航线"],
            ["/shipping-from-ningbo-to-djibouti/", "Ningbo to Djibouti route", "宁波到吉布提航线"],
            ["/shipping-from-ningbo-to-port-sudan/", "Ningbo to Port Sudan route", "宁波到苏丹港航线"],
            ["/shipping-from-china-to-egypt/", "China to Egypt rates and ACID", "中国到埃及运价与 ACID"],
            ["/guides/shipping-from-shanghai-to-red-sea/", "Compare Shanghai as an origin", "对比上海起运"],
            ["/rates/", "Current Red Sea rates", "查看当前红海运价"],
            ["/faq/", "Shipping FAQ", "海运常见问题"],
          ]),
        ],
      },
    ],
  },
  {
    slug: "shipping-from-shenzhen-to-red-sea",
    tag: L("ORIGIN PORT", "起运港"),
    title: L("Shenzhen to Red Sea Shipping: Routes & Transit", "深圳到红海海运：船期、时效与货型"),
    lead: L(
      "Shenzhen is South China's gateway for electronics, batteries and consumer goods. It has direct Red Sea options, but DG needs carrier approval.",
      "深圳是华南电子、电池和消费品的出海口。红海有直航选择，但危险品要单独拿船公司批复。",
    ),
    published,
    updated: published,
    faqs: [
      {
        q: L("Does Shenzhen have direct sailings to the Red Sea?", "深圳有红海直航吗？"),
        a: L(
          "Yes, for some destinations. Jeddah has direct sailings from Shenzhen at about 17–18 days, and Sokhna has direct South China services at about 20–23 days. Aqaba and Djibouti may be direct or connect through a hub, depending on the carrier. Ask for the routing on the specific sailing.",
          "部分目的港有。深圳到吉达直航约 17–18 天，华南到苏赫纳直航约 20–23 天。亚喀巴和吉布提可能直航，也可能经枢纽衔接，看船公司。按具体船期问航线。",
        ),
      },
      {
        q: L("Can I ship lithium batteries from Shenzhen?", "深圳能出锂电池吗？"),
        a: L(
          "Only with carrier approval and the correct UN number, MSDS, UN38.3 summary, DG declaration and packing. The transhipment port must also accept the class. Shenzhen has a lot of battery experience, but that does not make every sailing available; send the file before booking.",
          "要有船公司批复、正确 UN 编号、MSDS、UN38.3 摘要、危险品申报和包装。中转港也要接受该类别。深圳电池货经验多，但不代表每条船都能走；订舱前先发资料。",
        ),
      },
      {
        q: L("Is Shenzhen cheaper than Shanghai for Red Sea cargo?", "深圳比上海便宜吗？"),
        a: L(
          "It depends on the destination and the sailing. South China direct services can be competitive to Sokhna and Djibouti, while Shanghai may have more options to Jeddah and Aqaba. Compare the total cost from the factory, including trucking and local charges.",
          "看目的港和船期。华南直航到苏赫纳、吉布提可能有竞争力；上海到吉达、亚喀巴的选择可能更多。要从工厂算总成本，含拖车和本地费用。",
        ),
      },
    ],
    sections: [
      {
        heading: L("Why Shenzhen, and who it suits", "为什么选深圳，适合谁"),
        blocks: [
          P(
            "Shenzhen is the container gateway for the Pearl River Delta and the manufacturing belt around Shenzhen, Dongguan, Huizhou and Guangzhou. Yantian and Shekou handle a large share of South China's electronics, batteries, appliances, furniture and consumer goods. For a factory in Guangdong, the truck leg is short, and the port has deep experience with high-value and dangerous goods cargo.",
            "深圳是珠三角和深圳、东莞、惠州、广州制造业带的集装箱门户。盐田和蛇口承接华南大量电子、电池、家电、家具和消费品。广东工厂走深圳，拖车短，港口在高价值和危险品货方面经验多。",
          ),
          P(
            "Shenzhen's advantage is not just cost. It is the combination of direct South China sailings, a dense feeder network and a supply chain that understands export documentation. That suits electronics, e-commerce, high-value consumer goods and time-sensitive shipments. For heavy, low-value cargo from outside Guangdong, the truck leg may erase the advantage; compare Ningbo or Shanghai.",
            "深圳的优势不只是价格，而是华南直航、密集支线和熟悉出口单证的供应链。适合电子、电商、高价值消费品和时效紧的货。广东以外的重货、低值货，拖车可能把优势吃掉；可以比宁波或上海。",
          ),
        ],
      },
      {
        heading: L("Sailing options and transit", "船期与时效"),
        blocks: [
          P(
            "South China has direct services to several Red Sea ports. Jeddah is listed at 17–31 days port to port, with direct sailings from Shenzhen at about 17–18 days. Sokhna has direct South China services at about 20–23 days; North China cargo often tranships and can take 32–35 days. Aqaba is 20–35 days, Djibouti 19–30 days, and Port Sudan has limited direct capacity.",
            "华南到几个红海港口有直航。吉达港到港 17–31 天，深圳直航约 17–18 天。苏赫纳华南直航约 20–23 天；华北货常中转，可能 32–35 天。亚喀巴 20–35 天，吉布提 19–30 天，苏丹港直航有限。",
          ),
          P(
            "The direct sailing is usually the simpler product: one vessel, one bill of lading, fewer handovers. A transhipment through Singapore, Colombo or a Middle East hub can be cheaper or the only option in a given week. Ask which port the box connects at, how long the connection is, and what happens if the first vessel is late. For batteries and DG, the connection port's acceptance is part of the routing.",
            "直航通常更简单：一条船、一份提单、交接少。经新加坡、科伦坡或中东枢纽中转，可能更便宜，也可能是当周唯一选择。问清在哪个港衔接、等多久、第一程晚了怎么办。电池和危险品，还要把中转港是否接受算进航线。",
          ),
        ],
      },
      {
        heading: L("What the route costs", "费用结构"),
        blocks: [
          P(
            "Shenzhen's ocean freight can be competitive on South China direct services, but the total depends on origin charges, trucking and the destination. Yantian and Shekou are different terminals with different cut-offs and truck routes; the quote should name the terminal. For high-value cargo, security and insurance may add cost, and a direct sailing may be worth a premium over a longer connection.",
            "深圳海运费在华南直航上可能有竞争力，但总成本还看起运港费用、拖车和目的港。盐田和蛇口是不同的码头，截点和拖车路线不同；报价要写清码头。高价值货还有安保和保险成本，直航比长中转贵一点也可能值得。",
          ),
          P(
            "Ask for a line-item quote and compare the same sailing window. A cheap ocean line with a feeder to another South China port, or a transhipment with a short free time, can cost more at destination. If the cargo is batteries or DG, the DG surcharge and the separate allocation are additional lines, not part of the normal ocean freight.",
            "要分项报价，并在同一个出运窗口比较。海运费便宜、但要驳到另一个华南港口，或者中转免柜期短，目的港可能更贵。电池或危险品，危险品附加费和单独舱位分配是另外的费用，不是普通海运费的一部分。",
          ),
          P(
            "Destination free time is another line. A cheaper sailing with five free days can cost more than a slightly higher sailing with fourteen, especially if the consignee needs time to clear. Ask when free time starts, whether it is calendar or working days, and who pays storage and detention. Those answers matter more than a small difference in the ocean rate.",
            "目的港免柜期也是费用。便宜 100 美元、只给 5 天免柜的船，可能比贵一点、给 14 天的船更贵，尤其收货人清关需要时间。问免柜从哪天算、按自然日还是工作日、仓储和滞箱谁付。这些答案比海运费差几十美元更重要。",
          ),
        ],
      },
      {
        heading: L("Cargo that fits Shenzhen", "适合什么货"),
        blocks: [
          P(
            "Shenzhen is a natural fit for electronics, appliances, batteries, e-commerce parcels, high-value consumer goods and time-sensitive shipments. The port handles a lot of DG, but the carrier still decides per UN number and per sailing. Lithium batteries need the right UN number, MSDS, UN38.3 summary, DG declaration and packing; damaged or recalled cells need a separate acceptance.",
            "深圳适合电子、家电、电池、电商包裹、高价值消费品和时效紧的货。港口危险品经验多，但船公司仍按 UN 编号和具体船期决定。锂电池要正确 UN 编号、MSDS、UN38.3 摘要、危险品申报和包装；损坏或召回电芯要单独接收。",
          ),
          P(
            "For furniture, appliances and mixed consumer goods, a 40HQ is usually the volume choice; for dense machinery or hardware, a 20GP may carry more payload. If the cargo is high-value, ask about security, sealing and insurance, and avoid unnecessary handovers. If the cargo is low-value and heavy, the South China truck leg may make another origin cheaper.",
            "家具、家电和混合消费品通常用 40HQ 装体积；重机械、五金可能 20GP 装得更多。高价值货要问安保、封条和保险，尽量减少交接。低值重货，华南拖车可能让另一个起运港更便宜。",
          ),
          P(
            "Terminal choice matters in Shenzhen. Yantian and Shekou have different sailing lists, cut-offs and truck routes, and a quote that says only “Shenzhen” can hide which one. Ask for the terminal and the latest gate-in time. For e-commerce cargo, ask how the forwarder handles multiple suppliers and whether the cargo can be consolidated before the cut-off. For batteries, ask whether the carrier accepts the watt-hour rating and the state of charge on that specific sailing. A direct sailing from Yantian is not the same product as a feeder from Shekou.",
            "深圳的码头选择很重要。盐田和蛇口的船期、截点和拖车路线不同，只写“深圳”的报价可能藏着具体码头。问清码头和最晚进闸时间。电商货要问货代怎么处理多个供应商、截点前能否集拼。电池货要问船公司是否接受该票的瓦时数和电量。盐田直航和蛇口驳船不是同一个产品。",
          ),
          UL([
            ["Electronics and high-value goods: direct sailing reduces handovers.", "电子和高价值货：直航减少交接。"],
            ["Batteries and DG: carrier approval before booking.", "电池和危险品：订舱前拿船公司批复。"],
            ["Light consumer goods: 40HQ for volume.", "轻泡消费品：40HQ 装体积。"],
            ["Dense hardware: 20GP first, then check payload.", "重五金：先看 20GP，再核对载重。"],
          ]),
        ],
      },
      {
        heading: L("Connections to the five ports", "到五个目的港的衔接"),
        blocks: [
          P(
            "Jeddah and Sokhna have the strongest direct South China options. Jeddah is about 17–18 days direct; Sokhna about 20–23 days direct. Aqaba and Djibouti can be direct or connect through Singapore, Colombo or a Middle East hub; the connection decides whether the transit is closer to 20 days or 30. Port Sudan usually needs a connection through Jeddah, Jebel Ali or Djibouti.",
            "吉达和苏赫纳的华南直航最强。吉达直航约 17–18 天，苏赫纳直航约 20–23 天。亚喀巴和吉布提可能直航，也可能经新加坡、科伦坡或中东枢纽衔接；衔接决定是 20 天还是 30 天。苏丹港通常经吉达、杰贝阿里或吉布提衔接。",
          ),
          P(
            "If the cargo is for Ethiopia, Djibouti is the gateway and the Ethiopia transit file matters as much as the ocean leg. If the cargo is for Saudi Arabia, Jeddah is the Red Sea gateway; Jebel Ali is in Dubai and is a different customs destination. Do not compare a Jeddah quote with a Jebel Ali quote without adding the inland leg and the import regime.",
            "货去埃塞俄比亚，吉布提是门户，埃塞过境文件和海上段一样重要。货去沙特，吉达是红海门户；杰贝阿里在迪拜，是另一个海关目的地。吉达报价和杰贝阿里报价，不加上内陆段和进口制度，不能直接比。",
          ),
          UL([
            ["Jeddah: direct 17–18 days; transhipment up to 31 days.", "吉达：直航 17–18 天；中转最长 31 天。"],
            ["Sokhna: direct South China 20–23 days.", "苏赫纳：华南直航 20–23 天。"],
            ["Aqaba: direct or connection; 20–35 days.", "亚喀巴：直航或中转；20–35 天。"],
            ["Djibouti: direct 19–24 days; one-stop 25–30 days.", "吉布提：直航 19–24 天；一次中转 25–30 天。"],
            ["Port Sudan: connect via Jeddah, Jebel Ali or Djibouti.", "苏丹港：经吉达、杰贝阿里或吉布提衔接。"],
          ]),
        ],
      },
      {
        heading: L("Booking checklist", "订舱清单"),
        blocks: [
          P(
            "Write down the factory address, cargo-ready date, terminal preference, destination, container type, gross weight, HS code and Incoterms. For batteries or DG, add the UN number, MSDS, UN38.3 summary, packing photos and the carrier approval status. For high-value cargo, add the insurance and security requirements.",
            "写下工厂地址、备货日期、码头偏好、目的港、柜型、毛重、HS 编码和贸易条款。电池或危险品，再加 UN 编号、MSDS、UN38.3 摘要、包装照片和船公司批复状态。高价值货，再加保险和安保要求。",
          ),
          P(
            "Ask for the next two sailings and the routing. If the quote is direct, confirm the vessel and the terminal. If it tranships, confirm the hub and the connection. Do not book a DG cargo as general cargo and declare it later; that can stop the container at the gate and cost more than the freight difference. A complete DG file is part of the booking, not a postscript.",
            "问最近两班船和航线。直航就确认船名和码头；中转就确认枢纽和衔接。危险品不要按普货订舱后再申报；可能在闸口被拒，损失比运费差更大。完整的危险品资料是订舱的一部分，不是事后补的附件。",
          ),
          LINKS([
            ["/shipping-from-shenzhen-to-jeddah/", "Shenzhen to Jeddah route", "深圳到吉达航线"],
            ["/shipping-from-shenzhen-to-sokhna/", "Shenzhen to Sokhna route", "深圳到苏赫纳航线"],
            ["/shipping-from-shenzhen-to-aqaba/", "Shenzhen to Aqaba route", "深圳到亚喀巴航线"],
            ["/shipping-from-shenzhen-to-djibouti/", "Shenzhen to Djibouti route", "深圳到吉布提航线"],
            ["/shipping-from-shenzhen-to-port-sudan/", "Shenzhen to Port Sudan route", "深圳到苏丹港航线"],
            ["/shipping-from-china-to-djibouti/", "China to Djibouti and Ethiopia", "中国到吉布提与埃塞俄比亚"],
            ["/guides/dangerous-goods-battery-red-sea/", "Dangerous goods and battery guide", "危险品与电池指南"],
            ["/rates/", "Current Red Sea rates", "查看当前红海运价"],
            ["/faq/", "Shipping FAQ", "海运常见问题"],
          ]),
        ],
      },
    ],
  },
  {
    slug: "shipping-from-qingdao-to-red-sea",
    tag: L("ORIGIN PORT", "起运港"),
    title: L("Qingdao to Red Sea Shipping: Routes & Transit", "青岛到红海海运：船期、时效与货型"),
    lead: L(
      "Qingdao is North China's gateway for machinery, tyres and building materials. Most Red Sea sailings connect through a hub.",
      "青岛是华北机械、轮胎和建材的出海口。红海航线常经枢纽衔接，所以衔接本身就是时效的一部分。",
    ),
    published,
    updated: published,
    faqs: [
      {
        q: L("Does Qingdao have direct sailings to the Red Sea?", "青岛有红海直航吗？"),
        a: L(
          "Some carriers call directly, but many Qingdao Red Sea shipments connect through Shanghai, Ningbo, Singapore or Colombo. The direct/transhipment mix changes by week. Ask for the connection port and the total transit, not only the ocean leg.",
          "有船直挂，但很多青岛红海货经上海、宁波、新加坡或科伦坡衔接。直航和中转的比例每周变化。问中转港和总时效，不要只看海上段。",
        ),
      },
      {
        q: L("Why is Qingdao transit longer?", "青岛的时效为什么更长？"),
        a: L(
          "Qingdao is further north, so the vessel may need a feeder or a connection to join a Red Sea service. The extra handover adds time. The country ranges already include this: Sokhna can be 20–35 days, and Port Sudan has limited direct capacity.",
          "青岛位置更北，船可能需要支线或衔接才能接上红海航线。多一次交接就多一段时间。目的港区间已经包含这一点：苏赫纳可能 20–35 天，苏丹港直航有限。",
        ),
      },
      {
        q: L("What cargo suits Qingdao?", "什么货适合走青岛？"),
        a: L(
          "Machinery, tyres, chemicals, steel, building materials and project cargo from Shandong and North China. Dense cargo can use a 20GP; light building materials may need a 40HQ. Dangerous goods need carrier approval and a connection port that accepts the class.",
          "山东和华北的机械、轮胎、化工品、钢材、建材和项目货。重货用 20GP，轻泡建材可能用 40HQ。危险品要船公司批复，且中转港接受该类别。",
        ),
      },
    ],
    sections: [
      {
        heading: L("Why Qingdao, and who it suits", "为什么选青岛，适合谁"),
        blocks: [
          P(
            "Qingdao is the main container gateway for Shandong and a practical outlet for Hebei, Henan and other North China manufacturing regions. Its cargo mix is heavier and more industrial than Shenzhen's: machinery, tyres, chemicals, steel, building materials, agricultural equipment and project cargo. For a factory in Shandong, the truck or rail leg to Qingdao is usually the shortest.",
            "青岛是山东的主要集装箱门户，也是河北、河南等华北制造业的实用出海口。货种比深圳更重、更工业：机械、轮胎、化工品、钢材、建材、农业设备和项目货。山东工厂到青岛的拖车或铁路通常最短。",
          ),
          P(
            "The trade-off is connectivity. Qingdao has fewer direct Red Sea calls than Shanghai or Shenzhen, and many shipments connect through Shanghai, Ningbo, Singapore or Colombo. That can add days and a handover. Qingdao suits cost-sensitive, dense or project cargo where the inland leg matters; it is less ideal for a tight delivery date that requires a direct sailing.",
            "代价是衔接。青岛的红海直航比上海、深圳少，很多货经上海、宁波、新加坡或科伦坡衔接。这会多几天、多一次交接。青岛适合对成本敏感、货重或项目货、看重内陆段的货主；交期紧、必须直航时，就没那么合适。",
          ),
        ],
      },
      {
        heading: L("Sailing options and transit", "船期与时效"),
        blocks: [
          P(
            "The country ranges are port to port: Jeddah 17–31 days, Sokhna 20–35 days, Aqaba 20–35 days, Djibouti 19–30 days. From Qingdao, the longer end of each range is more likely when the sailing connects through a hub. Port Sudan has limited direct capacity and often connects via Jeddah, Jebel Ali or Djibouti; a missed connection can add a week or more.",
            "目的港区间是港到港：吉达 17–31 天，苏赫纳 20–35 天，亚喀巴 20–35 天，吉布提 19–30 天。从青岛走，经枢纽衔接时更容易落在区间上端。苏丹港直航有限，常经吉达、杰贝阿里或吉布提衔接；错过衔接可能多等一周以上。",
          ),
          P(
            "Ask whether the first vessel loads at Qingdao or feeds to another Chinese port. A feeder adds a cut-off and a handover; a connection in Singapore or Colombo adds a hub. Ask for the next two ETDs and the connection window. If the cargo is time-sensitive, compare a Qingdao connection with a Shanghai or Ningbo direct sailing before you decide.",
            "问第一程是在青岛装船，还是驳到另一个中国港口。支线多一个截点和交接；在新加坡或科伦坡衔接多一个枢纽。问最近两个 ETD 和衔接窗口。货急，就把青岛中转和上海/宁波直航放在一起比。",
          ),
        ],
      },
      {
        heading: L("What the route costs", "费用结构"),
        blocks: [
          P(
            "Qingdao's ocean freight can be competitive for dense cargo, but the total includes origin charges, trucking or rail to the port, a possible feeder and the destination charges. The longer transit also has a cost: more working capital, more inventory and a later delivery. For heavy cargo, a 20GP may carry more payload than a 40HQ and reduce the cost per tonne.",
            "青岛海运费对重货可能有竞争力，但总成本还包括起运港费用、拖车或铁路、可能的支线和目的港费用。更长的时效也有成本：资金占用、库存和更晚交付。重货用 20GP 可能比 40HQ 装得更多，降低每吨成本。",
          ),
          P(
            "Compare line items and the same sailing window. A low ocean line with a feeder to Shanghai and a transhipment in Singapore is a different product from a direct Shanghai sailing. Ask for the free time, the war-risk line and the validity. If the cargo is project cargo, ask about lifting, lashing and road permits separately.",
            "比同一出运窗口的分项报价。海运费低、但要驳到上海再经新加坡中转，和上海直航不是同一个产品。问免柜期、战争风险和有效期。项目货还要单独问吊装、绑扎和公路许可。",
          ),
          P(
            "Schedule reliability is part of the cost. A connection that is advertised as one week can become two if the feeder is late or the hub is congested. Ask for the buffer and the next sailing. If the cargo has a fixed delivery date, add a contingency to the budget, not only to the transit time. The cheapest quote is not necessarily the one with the shortest published transit; it is the one whose arrival window you can plan around.",
            "船期可靠性也是成本。写着等一周的衔接，支线晚了或枢纽堵了，可能变成两周。问缓冲和下一班船。货有固定交期，预算里要留预备金，不只是时效上留余量。最便宜的报价不一定写着最短航程，而是到货窗口你能安排的那一份。",
          ),
        ],
      },
      {
        heading: L("Cargo that fits Qingdao", "适合什么货"),
        blocks: [
          P(
            "Qingdao is a strong fit for machinery, tyres, chemicals, steel, building materials, agricultural equipment and project cargo. Dense cargo should start with a 20GP and a payload check; light building materials or bulky equipment may need a 40HQ or a flat rack. The port's industrial hinterland means many suppliers are used to export packing and heavy lifts.",
            "青岛适合机械、轮胎、化工品、钢材、建材、农业设备和项目货。重货先看 20GP 和载重；轻泡建材或大件设备可能需要 40HQ 或框架柜。港口腹地工业多，供应商通常熟悉出口包装和重吊。",
          ),
          P(
            "Chemicals and batteries are dangerous goods and need a separate acceptance. Do not assume a Qingdao sailing accepts a class because another Chinese port does. For project cargo, check the road from the factory to the port, the lifting capacity and the vessel's gear. A cheap ocean rate cannot fix a cargo that cannot be loaded.",
            "化工品和电池属于危险品，要单独接收。不要以为别的中国港口接受，青岛也一定接受。项目货要核对工厂到港口的道路、吊装能力和船舶设备。海运费再便宜，装不上船也没用。",
          ),
          P(
            "North China cargo often reaches Qingdao by truck or rail. For a factory in Jinan, Zibo or Weifang, the truck leg is manageable; for Hebei or Henan, rail may be cheaper but adds a handover. Ask whether the quote starts at the factory or at the port, and who pays for the rail or truck. For project cargo, a road survey can change the route and the cost before the ocean rate matters. Winter weather can also affect trucking in Shandong, so leave a buffer before the cut-off.",
            "华北货到青岛，常走拖车或铁路。济南、淄博、潍坊的工厂，拖车可控；河北、河南走铁路可能更省，但多一次交接。问报价从工厂算还是从港口算，铁路或拖车谁付。项目货先做道路勘察，路线和成本可能在比海运费之前就变了。山东冬季天气也会影响拖车，截点前要留缓冲。",
          ),
          UL([
            ["Machinery and project cargo: check lifting, lashing and road permits.", "机械和项目货：核对吊装、绑扎和公路许可。"],
            ["Tyres and dense cargo: 20GP first, then payload.", "轮胎和重货：先看 20GP，再核对载重。"],
            ["Building materials: 40HQ for volume, 20GP for weight.", "建材：体积货看 40HQ，重货看 20GP。"],
            ["Chemicals and batteries: carrier approval before booking.", "化工品和电池：订舱前拿船公司批复。"],
          ]),
        ],
      },
      {
        heading: L("Connections to the five ports", "到五个目的港的衔接"),
        blocks: [
          P(
            "Jeddah and Sokhna are the main Red Sea gateways from North China, but the routing often includes a connection. Jeddah is 17–31 days; Sokhna 20–35 days. Aqaba and Djibouti are reachable, with 20–35 and 19–30 days respectively. Port Sudan is the least direct and may require a hub connection through Jeddah, Jebel Ali or Djibouti.",
            "吉达和苏赫纳是华北到红海的主要门户，但航线常含衔接。吉达 17–31 天，苏赫纳 20–35 天。亚喀巴和吉布提也能走，分别 20–35 天和 19–30 天。苏丹港最不直接，可能经吉达、杰贝阿里或吉布提衔接。",
          ),
          P(
            "For Saudi Arabia, Jeddah is the Red Sea destination; Jebel Ali is in Dubai and is not a substitute without the inland leg and the UAE customs regime. For Egypt, Sokhna is the Red Sea port. For Jordan, Aqaba is the only seaport. For Ethiopia, Djibouti is the gateway and the transit file matters. Match the port to the final address before comparing rates.",
            "去沙特，吉达是红海目的港；杰贝阿里在迪拜，不加上内陆段和阿联酋海关制度，不能替代。去埃及，苏赫纳是红海港口。去约旦，亚喀巴是唯一海港。去埃塞俄比亚，吉布提是门户，过境文件很重要。先按最终地址选港口，再比运价。",
          ),
          UL([
            ["Jeddah: 17–31 days; often a connection from Qingdao.", "吉达：17–31 天；青岛常需衔接。"],
            ["Sokhna: 20–35 days; North China transhipment.", "苏赫纳：20–35 天；华北常中转。"],
            ["Aqaba: 20–35 days; confirm the routing.", "亚喀巴：20–35 天；确认航线。"],
            ["Djibouti: 19–30 days; direct or one-stop.", "吉布提：19–30 天；直航或一次中转。"],
            ["Port Sudan: limited direct; plan the hub.", "苏丹港：直航有限；规划枢纽。"],
          ]),
        ],
      },
      {
        heading: L("Booking checklist", "订舱清单"),
        blocks: [
          P(
            "Write down the factory address, cargo-ready date, destination, container type, gross weight, dimensions, HS code and Incoterms. For project cargo, add the lifting plan and the road survey. For chemicals or batteries, add the UN number, MSDS and packing details. A complete file gets a real routing answer.",
            "写下工厂地址、备货日期、目的港、柜型、毛重、尺寸、HS 编码和贸易条款。项目货加吊装方案和道路勘察。化工品或电池加 UN 编号、MSDS 和包装资料。资料完整，才有真正的航线答案。",
          ),
          P(
            "Ask for the next two sailings, the connection port and the free time. Compare the Qingdao quote with a Shanghai or Ningbo option on the same cargo and date. The cheapest ocean line may not be the cheapest total once the feeder, the connection and the longer transit are counted. If the two totals are close, choose the shorter inland leg, the clearer free time and the more reliable connection.",
            "问最近两班船、中转港和免柜期。把青岛报价和同一票货、同一日期的上海/宁波方案放在一起比。把支线、衔接和更长时效算进去，海运费最低不一定总成本最低。两个总价接近，就选内陆段更短、免柜期更清楚、衔接更可靠的那个。",
          ),
          LINKS([
            ["/shipping-from-qingdao-to-jeddah/", "Qingdao to Jeddah route", "青岛到吉达航线"],
            ["/shipping-from-qingdao-to-sokhna/", "Qingdao to Sokhna route", "青岛到苏赫纳航线"],
            ["/shipping-from-qingdao-to-aqaba/", "Qingdao to Aqaba route", "青岛到亚喀巴航线"],
            ["/shipping-from-qingdao-to-djibouti/", "Qingdao to Djibouti route", "青岛到吉布提航线"],
            ["/shipping-from-qingdao-to-port-sudan/", "Qingdao to Port Sudan route", "青岛到苏丹港航线"],
            ["/shipping-from-china-to-jordan/", "China to Jordan rates and customs", "中国到约旦运价与清关"],
            ["/guides/fcl-vs-lcl-red-sea/", "FCL vs LCL guide", "整柜与拼箱指南"],
            ["/rates/", "Current Red Sea rates", "查看当前红海运价"],
            ["/faq/", "Shipping FAQ", "海运常见问题"],
          ]),
        ],
      },
    ],
  },
];
