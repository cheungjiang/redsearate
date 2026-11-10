// Bilingual copy shared by the homepage, the guide pages and structured data.
import { documentGuides } from "./document-guides.ts";

const L = (en: string, zh: string) => ({ en, zh });
export type Localized = ReturnType<typeof L>;

export type GuideBlock =
  | { kind: "p"; text: Localized }
  | { kind: "ul"; items: Localized[] }
  | { kind: "links"; items: { href: string; text: Localized }[] };

type GuideSection = { heading: Localized; blocks: GuideBlock[] };

const P = (en: string, zh: string): GuideBlock => ({ kind: "p", text: L(en, zh) });
const UL = (items: [string, string][]): GuideBlock => ({
  kind: "ul",
  items: items.map(([en, zh]) => L(en, zh)),
});
const LINKS = (items: [string, string, string][]): GuideBlock => ({
  kind: "links",
  items: items.map(([href, en, zh]) => ({ href, text: L(en, zh) })),
});

export type GuideFaq = { q: Localized; a: Localized };

export type Guide = {
  slug: string;
  tag: Localized;
  title: Localized;
  lead: Localized;
  published?: string;
  updated?: string;
  faqs?: GuideFaq[];
  sections: GuideSection[];
};

export const guides: Guide[] = [
  {
    slug: "red-sea-freight-rate-factors",
    tag: L("MARKET OUTLOOK", "市场观察"),
    title: L(
      "What really moves your Red Sea freight rate?",
      "哪些因素真正影响红海运价？",
    ),
    lead: L(
      "A Red Sea freight rate moves when capacity, demand, empty boxes or the routing changes. Compare two quotes only when the scope matches.",
      "红海运价随运力、货量、空箱和航线变化。两份报价只有口径一致时才能放在一起比。",
    ),
    sections: [
      {
        heading: L("What the number on a quote actually is", "报价上的数字到底是什么"),
        blocks: [
          P(
            "The number on a quote is ocean freight for one container, from one Chinese port to one Red Sea port, on one sailing. It is not the cost of getting the goods into a warehouse in Riyadh, Cairo or Amman. Local charges at origin, destination charges, duty, tax, insurance and the truck after the port sit outside it.",
            "报价上的数字，是一个柜子从中国某一个港口到红海某一个港口、某一班船的海运费。它不是货进利雅得、开罗或安曼仓库的总费用。起运港的本地费用、目的港费用、关税、税费、保险，还有港口之后的拖车，都不在里面。",
          ),
          P(
            "Two numbers can be compared only when those boundaries match, and when the container type and the sailing window match too. A port-to-port 40HQ rate and an all-in rate for a 20GP are answers to different questions, even when both say Jeddah.",
            "这些边界一致、柜型一致、出运窗口也一致，两个数字才比得了。一份港到港的 40HQ，和一份全包的 20GP，哪怕都写着吉达，回答的也不是同一个问题。",
          ),
        ],
      },
      {
        heading: L("Capacity, and why this lane is tight", "运力，以及这条航线为什么紧"),
        blocks: [
          P(
            "Space on a ship is the first force. Carriers decide how many vessels to put on the China to Red Sea run, which Chinese ports those vessels call, and how much of each voyage they will still sell on the spot market. A blank sailing, a skipped port call, or a block of space held for contract customers all shrink what is left to quote this week. Shanghai having space does not mean Ningbo has space.",
            "舱位是第一项。船公司决定这条中国到红海的航线派几艘船、挂哪些中国港口、现货市场还能卖出多少。抽掉一班船、跳过一个挂港，或者把一块舱位留给协议客户，这一周能报出来的就少了。上海有舱，不代表宁波有舱。",
          ),
          P(
            "The Red Sea itself has narrowed the options. Since late 2023 many services have sailed around the Cape of Good Hope instead of through the Suez Canal. The voyage takes longer, so the same ship makes fewer trips in a year. In 2026 the Strait of Hormuz has been effectively closed, and cargo that used to enter Saudi Arabia through the Gulf now comes in through Jeddah. More volume through one gateway means fuller ships and a congested berth. Underwriters treat the Red Sea up to Jeddah as a war-risk area, and that risk is priced on top of the freight.",
            "红海本身把选择收窄了。2023 年底以来，不少航线绕开苏伊士运河，改走好望角。航程变长，同一艘船一年能跑的航次就少了。2026 年霍尔木兹海峡实际关闭后，原来从海湾一侧进沙特的货，改走红海从吉达进。货挤到一个门户港，船更容易满，泊位也堵。保险把红海直到吉达列为战争风险区，这笔风险加在运费之外。",
          ),
          P(
            "None of this tells you next week's rate. It tells you why a quote can move even when your cargo has not changed.",
            "这些说明不了下周的具体价格。它说明的是：货没有变，报价也可以变。",
          ),
        ],
      },
      {
        heading: L("The calendar", "日历"),
        blocks: [
          P(
            "Demand is the second force, and it follows a calendar you can plan around. Chinese factories push cargo out in the weeks before Chinese New Year, then go quiet, then refill the ships after the holiday. Ramadan and the Eid holidays slow customs desks and trucking in Saudi Arabia, Egypt and Jordan, so a container can arrive on the day the schedule promised and still wait. The run-up to year-end in the Gulf does the same at the other end of the year.",
            "货量是第二项，而且有日历可循。春节前几周工厂集中出货，假期里产量掉下去，节后再把船填满。斋月和开斋节期间，沙特、埃及、约旦的清关和拖车都会变慢。船按期到了，柜子仍可能等。海湾年底假期之前，另一头也是这个节奏。",
          ),
          P(
            "A busy week is a reason to book earlier and to ask whether the sailing you want still has space. It is not a formula that adds a fixed percentage to last month's price. A quiet week is a better moment to ask again. It is not a promise that the market will be cheaper.",
            "旺的那一周，该早点订，并问清楚想要的那班船还有没有舱。这不是在上个月的价格上加一个固定百分比。淡的那一周适合再问一次，也不保证市场一定更便宜。",
          ),
        ],
      },
      {
        heading: L("Whether there is a box", "港口有没有箱子"),
        blocks: [
          P(
            "The third force is the empty container. A 40HQ rate assumes a 40-foot high cube is sitting at the loading port. When a port runs short, the carrier has less to sell, or prices the scarce box higher. Nansha can have equipment when Shekou does not, in the same week, for the same destination. That is one reason the country pages show a separate median for each Chinese origin instead of one national price.",
            "第三项是空箱。40HQ 的运价默认装货港有一只 40 英尺高箱。港口缺这种箱子时，船公司能卖的就少，或者把紧俏的箱子报得更贵。同一周、同一个目的港，南沙有箱，蛇口未必有。所以国家页按中国起运港分开写中位数，不给一个全国统一价。",
          ),
          P(
            "If the factory is inland, the nearest port that has both a box and a sailing often beats a slightly cheaper ocean rate from a port that needs a long truck haul. Tell us the factory city when you enquire, not only the port you guessed.",
            "工厂在内陆的话，最近的、又有箱子又有船期的港口，常常比运费略低但拖车很长的港口更划算。询价时告诉工厂所在的城市，不要只报一个猜的港口。",
          ),
        ],
      },
      {
        heading: L("Direct, or via somewhere else", "直航，还是中转"),
        blocks: [
          P(
            "The fourth force is the routing. A direct sailing is the short version of the trip. From Shanghai or Shenzhen to Jeddah, direct services take about 17 to 18 days, and a sailing that connects through another hub can stretch the same move toward 31 days. Sokhna is about 20 to 23 days direct from South China, and can run to 32 to 35 days from North China when there is a connection. Aqaba direct is about 20 to 28 days, and a connection adds 3 to 7. Djibouti direct is about 19 to 24 days, or 25 to 30 with a call via Singapore or Colombo. These are port-to-port ranges, not a promise for a named vessel.",
            "第四项是航线。直航是短的那种走法。上海或深圳到吉达，直航大约 17 到 18 天，经其他枢纽中转可以拉到 31 天左右。苏赫纳从华南直航大约 20 到 23 天，华北若要中转，可以到 32 到 35 天。亚喀巴直航大约 20 到 28 天，中转再加 3 到 7 天。吉布提直航大约 19 到 24 天，经新加坡或科伦坡大约 25 到 30 天。这些是港到港的区间，不是某一班船的承诺。",
          ),
          P(
            "Port Sudan is the exception. Direct sailings from China are limited, and a lot of cargo connects through Jeddah, Jebel Ali or Djibouti. Miss that connection and the box can wait a week or more. The connection decides the transit time, so we do not publish one for Port Sudan. Ask for the routing on every Sudan quote.",
            "苏丹港是例外。中国直航有限，很多货经吉达、杰贝阿里或吉布提中转。错过衔接，柜子可能再等一周以上。衔接决定时效，所以我们不公布苏丹港的航程。每一份苏丹报价都要问清航线。",
          ),
          P(
            "A cheaper rate with a connection is a different product, not a discount on the same one. You trade money for days, and for one more port where the connection can fail. Free time at destination is part of that product. One quote may include 14 days, another 21, and the longer free time is often already in the price. Read that line before you decide the freight number is low.",
            "中转更便宜，不是同一产品打了折，而是另一种产品。你用时间换运费，还多一个可能错过衔接的港口。目的港免柜期也是这个产品的一部分。一份报价含 14 天，另一份含 21 天，较长的免柜期往往已经算进价格。先看这一行，再决定运费数字低不低。",
          ),
        ],
      },
      {
        heading: L("Charges that move on their own", "自己会变的那些费用"),
        blocks: [
          P(
            "Carriers adjust other lines on the invoice on their own timetable. A fuel or bunker adjustment follows oil. A war-risk or contingency charge follows the security picture on the Red Sea. A peak-season surcharge appears when ships are full. A general rate increase is a carrier's announced step-up for a given month, and it does not always stick at the announced level. At the far end, a drop-off or congestion charge can be billed at the destination port.",
            "船公司还会按自己的时间表改发票上的其他项目。燃油附加跟着油价走。红海的战争风险或应急附加跟着安全局势走。船满的时候会出现旺季附加费。一般费率上调是船公司宣布的某个月涨价，宣布的幅度不一定全部落地。目的港还可能另收还箱费或拥堵费。",
          ),
          P(
            "Two quotes a hundred dollars apart on ocean freight can swap places once those lines are written out. Ask for the quote split into ocean freight, origin charges, anything billed at destination, and what is excluded. The medians on the rates page and the country pages are ocean freight only. They show where the market is. They are not the amount you will pay, and they are not a booking.",
            "海运费相差一百美元的两份报价，把这些项目列出来之后，高低可能对调。请对方把报价分开写：海运费、起运港费用、在目的港收取的费用，以及不包含什么。运价页和国家页上的中位数只有海运费。用来看市场，不是你要付的总额，也不能拿来订舱。",
          ),
        ],
      },
      {
        heading: L("Spot prices and contract prices", "现货价和协议价"),
        blocks: [
          P(
            "Most of what we publish is the spot market: a price for a near sailing, valid for days rather than for a year. A contract rate can sit far from that median and still be real for the shipper who signed it. Comparing a contract offer with the median on this site is comparing two different deals. The median describes the spot market. The contract describes what you already locked.",
            "本站公布的大多是现货市场：近一班船的价格，有效期是几天，不是一年。协议价可以离这个中位数很远，对签了协议的货主仍然有效。拿一份协议价去比本站的中位数，比的是两笔不同的交易。中位数描述现货市场。协议描述你已经锁住的条件。",
          ),
          P(
            "Validity is easy to mix up in the other direction too. The rates table shows a reading dated today, displayed as valid for seven days, because that is how we present the quotes we have collected. A carrier's own quote can expire sooner, on that vessel's cut-off. The date on our page is the date of the reading. The date on the quote is the date you can still book. Do not treat them as the same date.",
            "有效期也容易弄反。运价表上的日期是今天的读数，页面上按七天展示，因为我们就是这样呈现已收集的报价。船公司自己的报价可以更短，到那班船的截关为止。本站页面上的日期是读数的日期。报价单上的日期才是你还能订的日期。不要当成同一天。",
          ),
        ],
      },
      {
        heading: L("How a pile of quotes becomes one median", "一堆报价怎么变成一个中位数"),
        blocks: [
          P(
            "The index is the median of 40HQ market quotes collected from every China origin over the last 28 days, one figure per destination port. A price more than 50 percent away from the median is dropped, so one wild quote does not drag the line. The sample count is printed next to the figure. A median built on two quotes will jump when the next quote arrives. A median built on twenty will not. Week on week compares today's 28-day reading with the same reading a week earlier.",
            "指数是近 28 天、中国各起运港 40HQ 市场报价的中位数，每个目的港一个数。偏离中位数超过 50% 的价格会被剔除，避免一条离谱报价把线拽走。数字旁边写着样本量。两条报价做出来的中位数，下一条进来就会跳。二十条做出来的，就稳得多。周环比是拿今天这个 28 天读数，和一周前的同口径读数比。",
          ),
          P(
            "Gaps stay empty. We do not fill a missing week with an estimate, and we do not publish a median when there is no quote. The chart and the table are a reading of the market we see. Space and the final price are confirmed on WeChat or WhatsApp.",
            "没有报价的地方就空着。我们不用估算去填缺口，也没有报价就不发中位数。图和表是我们看到的市场读数。舱位和最终价格以微信或 WhatsApp 确认为准。",
          ),
        ],
      },
      {
        heading: L("Five checks before you pick a quote", "选定之前先对齐这五项"),
        blocks: [
          UL([
            ["Same origin port, or a clear reason the two ports differ.", "起运港相同，或者不同的理由说得清。"],
            ["Same destination, same container.", "目的港相同，柜型相同。"],
            ["Same scope: ocean freight against ocean freight, not against an all-in number.", "口径相同：海运费对海运费，不要拿纯海运费去比全包价。"],
            ["The dates the price is valid, and the sailing it sits on.", "价格有效期，以及对应的船期。"],
            ["The routing and the free days.", "航线和免柜期。"],
          ]),
          P(
            "If a quote sits far under the recent median, ask what is missing before you call it a bargain. A short free time, a connection, or a charge that appears only at destination explains a lot of those gaps.",
            "报价比近期中位数低很多时，先问少了什么，再把它当成便宜。免柜期短、需要中转，或者有一笔费用要到目的港才出现，往往就是原因。",
          ),
          LINKS([
            ["/rates/", "Current Red Sea rates", "当前红海运价"],
            ["/shipping-from-china-to-saudi-arabia/", "China to Saudi Arabia", "中国到沙特"],
            ["/shipping-from-china-to-egypt/", "China to Egypt", "中国到埃及"],
            ["/shipping-from-china-to-jordan/", "China to Jordan", "中国到约旦"],
            ["/shipping-from-china-to-djibouti/", "China to Djibouti and Ethiopia", "中国到吉布提及埃塞俄比亚"],
            ["/shipping-from-china-to-sudan/", "China to Sudan", "中国到苏丹"],
          ]),
        ],
      },
    ],
  },
  {
    slug: "jeddah-sokhna-aqaba-gateway",
    tag: L("SHIPPING GUIDE", "运输指南"),
    title: L(
      "Jeddah, Sokhna or Aqaba: choose your gateway.",
      "吉达、苏赫纳或亚喀巴：如何选择门户港？",
    ),
    lead: L(
      "Pick the Red Sea port that serves your consignee. The cheapest port-to-port rate is not always the cheapest once trucking and customs are included.",
      "先按收货人的地址选港口。港到港最低的运价，加上拖车和清关后不一定最低。",
    ),
    sections: [
      {
        heading: L("Start from the address, not the rate", "从地址选起，不要从运价选起"),
        blocks: [
          P(
            "The gateway is the port that can clear your cargo and hand it to the consignee. Jeddah, Sokhna and Aqaba cover most shipments from China to the Red Sea. Djibouti and Port Sudan cover two more. They are not substitutes. A low rate into the wrong port means a second move, a second set of documents, and often a higher total than the rate that looked expensive.",
            "门户港是能把这票货清关、再交到收货人手里的那个港口。中国到红海的货，大多走吉达、苏赫纳或亚喀巴。吉布提和苏丹港覆盖另外两种货。它们不能互相替代。运价低但港口选错，就要再运一次、再办一套单证，总数常常高于那份看起来贵的运价。",
          ),
          P(
            "Decide in this order. Where does the consignee want the goods? Which port clears cargo for that place as an ordinary import? What does the haul from that port cost? Only then compare ocean freight, on the same container and the same scope.",
            "按这个顺序定。收货人要把货送到哪里？哪个港口按普通进口为那个地方清关？从那个港口拉过去要多少钱？然后才比较海运费，而且柜型和口径要一样。",
          ),
        ],
      },
      {
        heading: L("A consignee in Cairo is not a consignee in Jeddah", "开罗的收货人不是吉达的收货人"),
        blocks: [
          P(
            "Three short cases show why the port comes first. The consignee is in Cairo. Sokhna is the normal gateway. A cheaper rate into Jeddah still leaves the box outside Egypt, with a land border and a second customs entry between the cargo and the buyer. The consignee is in Addis Ababa. Djibouti is the sea gate, and the cost to compare is China to Djibouti plus the rail or the truck and clearance at Modjo, not a rate to Jeddah. The consignee is in Amman. Aqaba is Jordan's only seaport, so the question is the sailing and whether the goods sit inside the Aqaba zone, not which port to pick.",
            "三个短例子可以看出为什么港口要先定。收货人在开罗，苏赫纳是通常的门户。一份更便宜的吉达运价，柜子仍在埃及境外，中间还隔着陆路口岸和第二次清关。收货人在亚的斯亚贝巴，海运门户是吉布提，要比较的是中国到吉布提的运费，加上铁路或公路，以及莫焦的清关，不是一份到吉达的运价。收货人在安曼，亚喀巴是约旦唯一的海港，要问的是船期，以及货在不在亚喀巴特区里，不是选哪个港。",
          ),
        ],
      },
      {
        heading: L("Jeddah, for Saudi Arabia", "吉达，对应沙特"),
        blocks: [
          P(
            "Jeddah serves western Saudi Arabia, and in 2026 it is the practical gateway for most Saudi container imports. With the Strait of Hormuz effectively closed, cargo that once arrived through the Gulf is coming down the Red Sea instead. Ships are fuller, the berth is congested, and war-risk cover applies up to Jeddah.",
            "吉达服务沙特西部。2026 年它也是沙特大部分集装箱进口的实际门户。霍尔木兹海峡实际关闭后，原来从海湾进的货改走红海。船更满，泊位拥堵，战争风险覆盖到吉达。",
          ),
          P(
            "Port to port from Shanghai or Shenzhen is about 17 to 31 days: roughly 17 to 18 days direct, longer when the sailing connects somewhere else. Every shipment needs a SABER shipment certificate, whether or not the product is regulated, and the customs declaration is filed on FASAH at least 48 hours before arrival. Duty is often 5 percent and sometimes as high as 20, plus 15 percent VAT. If the consignee is in Jeddah, Yanbu or another western city, this is the port. If the consignee is in Riyadh or Dammam, ask which gateway their broker actually clears through before you book a cheap rate into a port they do not use.",
            "上海或深圳到港大约 17 到 31 天：直航大约 17 到 18 天，中转更长。每票货都要办 SABER 货物符合性证书，不论产品是否受管制。报关单至少在到港前 48 小时通过 FASAH 提交。关税常见是 5%，有的高到 20%，另加 15% 的增值税。收货人在吉达、延布或其他西部城市，就走这个港。收货人在利雅得或达曼，先问他们的报关行实际从哪个港清关，再去订一个他们不用的港口的低价。",
          ),
          LINKS([["/shipping-from-china-to-saudi-arabia/", "Saudi Arabia: documents, transit and live rates", "沙特：单证、航程和当前运价"]]),
        ],
      },
      {
        heading: L("Sokhna, for Egypt", "苏赫纳，对应埃及"),
        blocks: [
          P(
            "Ain Sokhna sits at the southern end of the Suez Canal and serves Cairo and the Suez industrial zone. Direct services from South China take about 20 to 23 days. Sailings from North China that connect elsewhere can take 32 to 35. War-risk and congestion charges on Red Sea services apply here as well.",
            "苏赫纳在苏伊士运河南端，服务开罗和苏伊士工业区。华南直航大约 20 到 23 天。华北经其他港中转，可以到 32 到 35 天。红海航线上的战争风险和拥堵附加，这里同样有。",
          ),
          P(
            "Egypt requires Advance Cargo Information. The importer registers the shipment and receives an ACID number, and that number has to appear on the documents. The exporter files the bill of lading, packing list, invoice and certificate of origin on CargoX, and the exporting company has to be verified there before the first shipment. Filing early is what lets the importer use the faster release lane. A filing made hours before arrival does not.",
            "埃及要求提前货物信息申报。进口商登记这票货并取得 ACID 编号，单证上必须写上这个号。出口商在 CargoX 提交提单、装箱单、发票和原产地证，出口公司第一次出运前要先在那里完成认证。早点申报，进口商才能走更快的放行通道。到港前几小时才提交，就享受不到。",
          ),
          LINKS([["/shipping-from-china-to-egypt/", "Egypt: ACID, transit and live rates", "埃及：ACID、航程和当前运价"]]),
        ],
      },
      {
        heading: L("Aqaba, for Jordan", "亚喀巴，对应约旦"),
        blocks: [
          P(
            "Aqaba is Jordan's only seaport. Direct services take about 20 to 28 days, and a connection adds 3 to 7. The consignee needs an active Jordanian tax number that matches the documents, and the HS code belongs on the bill of lading. Regulated goods need JSMO approval. Medicines and medical items need JFDA approval. A clean file usually clears in 2 to 5 working days on ASYCUDA World.",
            "亚喀巴是约旦唯一的海港。直航大约 20 到 28 天，中转再加 3 到 7 天。收货人要有与单证一致的有效约旦税号，提单上要写 HS 编码。受管制的产品需要 JSMO 批准。药品和医疗用品需要 JFDA 批准。单证齐全的话，在 ASYCUDA World 上通常 2 到 5 个工作日清关。",
          ),
          P(
            "Outside the Aqaba Special Economic Zone, duty is commonly 5 percent plus 16 percent general sales tax. Inside the zone a flat 5 percent applies, which changes the landed cost on its own, so ask the consignee which side of that line they are on. Free time at Aqaba is often short. Read the days on the quote instead of assuming you have two weeks.",
            "亚喀巴经济特区以外，关税常见是 5%，另加 16% 的一般销售税。特区内统一 5%，到岸成本会因此差一截，所以要问收货人在线的哪一边。亚喀巴的免柜期常常偏短。看报价上的天数，不要默认有两周。",
          ),
          LINKS([["/shipping-from-china-to-jordan/", "Jordan: customs, transit and live rates", "约旦：清关、航程和当前运价"]]),
        ],
      },
      {
        heading: L("Djibouti, and the road on to Ethiopia", "吉布提，以及继续去埃塞俄比亚"),
        blocks: [
          P(
            "Djibouti is a destination of its own and the sea gate for landlocked Ethiopia. Port to port is about 19 to 30 days. For Ethiopia, add the railway to Addis Ababa, about 12 to 15 hours, or 2 to 5 days by road, and clearance at Modjo dry port.",
            "吉布提本身是一个目的地，也是内陆国埃塞俄比亚的海运门户。港到港大约 19 到 30 天。去埃塞俄比亚，还要加上到亚的斯亚贝巴的铁路，大约 12 到 15 小时，或者公路 2 到 5 天，清关在莫焦陆港。",
          ),
          P(
            "Containers for Ethiopia move under customs bond, so the Djibouti transit papers have to match the Ethiopian import declaration exactly. An ECTN is required for containers unloaded in Djibouti, and it should be in hand before departure. Cargo in direct transit to Ethiopia can be exempt when the bill of lading says \"In transit to Ethiopia\" and the consignee is in Ethiopia. The importer there also needs an import licence and foreign-exchange approval through an Ethiopian bank before you ship.",
            "去埃塞俄比亚的柜子在海关监管下转运，吉布提的转运单证必须和埃塞的进口申报完全一致。在吉布提卸货的集装箱需要 ECTN，最好开船前就办好。直接转运埃塞俄比亚的货，提单写明 “In transit to Ethiopia”、且收货人在埃塞俄比亚时，可以免办。那边的进口商还要在出运前办妥进口许可证，并通过埃塞的银行拿到外汇额度。",
          ),
          LINKS([["/shipping-from-china-to-djibouti/", "Djibouti and Ethiopia: ECTN, transit and live rates", "吉布提和埃塞俄比亚：ECTN、航程和当前运价"]]),
        ],
      },
      {
        heading: L("Port Sudan, only after extra checks", "苏丹港，先多核实再订"),
        blocks: [
          P(
            "Sudan has been in armed conflict since April 2023, and Port Sudan is the gateway that is working. Direct sailings from China are limited. Much of the cargo connects via Jeddah, Jebel Ali or Djibouti, and a missed connection can add a week or more. We do not state a transit time, because the connection is the transit time.",
            "苏丹自 2023 年 4 月起处于武装冲突中，苏丹港是目前能用的门户。中国直航有限。很多货经吉达、杰贝阿里或吉布提中转，错过衔接可能再多一周以上。我们不写航程，因为衔接本身就是航程。",
          ),
          P(
            "For vessels sailing from 1 January 2026, Sudan-bound cargo needs an Advance Cargo Declaration number before it is loaded in China, and that number has to be printed on the bill of lading. Most commercial goods also need an SSMO inspection certificate before they leave China, plus an import licence. Confirm the port, the bank and the inland leg with the consignee before you book.",
            "2026 年 1 月 1 日起开航的船，去苏丹的货要在中国装船前取得预先货物申报编号，并印在提单上。多数商品离开中国前还要有 SSMO 检验证书，另加进口许可证。订舱前先和收货人确认港口、银行和内陆这段还能不能走。",
          ),
          LINKS([["/shipping-from-china-to-sudan/", "Sudan: ACD rules and live rates", "苏丹：ACD 规则和当前运价"]]),
        ],
      },
      {
        heading: L("Then compare the rates", "港口定了，再比运价"),
        blocks: [
          P(
            "Once the consignee has named a gateway, compare quotes on one container type, one scope and one sailing window. A 40HQ median into Sokhna and a 40HQ median into Jeddah answer different questions. Use each one to see that port's market, then add the truck, the duty and the free time for the port you are actually using.",
            "收货人指定门户港之后，再按同一种柜型、同一种口径、同一个出运窗口比报价。苏赫纳的 40HQ 中位数和吉达的 40HQ 中位数，回答的是不同的问题。各自用来看那个港的市场，然后加上你真正要走的那个港的拖车、关税和免柜期。",
          ),
          P(
            "If the city is still unclear, run the shipment through the estimator and send us the consignee's city on WeChat or WhatsApp. The port is a question about the delivery. The rate comes after it. The checklist for a first shipment is the other half of this decision.",
            "城市还不确定的话，先用估价器跑一遍，再在微信或 WhatsApp 上把收货人的城市发给我们。港口是配送问题。运价排在它后面。第一次出运还要配一份清单。",
          ),
          LINKS([
            ["/rates/", "All Red Sea rates", "全部红海运价"],
            ["/guides/first-shipment-checklist/", "First shipment checklist", "首次出运清单"],
            ["/guides/red-sea-freight-rate-factors/", "What moves a Red Sea rate", "哪些因素影响红海运价"],
          ]),
        ],
      },
    ],
  },
  {
    slug: "first-shipment-checklist",
    tag: L("PLAN YOUR SHIPMENT", "出运准备"),
    title: L(
      "Your first shipment? Start with this checklist.",
      "首次出运？从这份清单开始。",
    ),
    lead: L(
      "A first shipment from China to the Red Sea needs a full enquiry, a price built the right way, and destination documents filed before the cargo is ready.",
      "第一次走红海，先把询价信息、计费方式和目的港申报备齐，再安排出货。",
    ),
    sections: [
      {
        heading: L("What to send before anyone prices it", "报价之前先发这些"),
        blocks: [
          P(
            "A quote is only as good as the facts behind it. Send the cargo description and the HS code, the number of packages, the dimensions and the gross weight, the date the cargo will be ready, and the Incoterms you sold on. Name an origin you can actually load from, the destination port, and the consignee's city. For a full container, add the type and how many: 20GP, 40GP or 40HQ. For groupage, add the volume in cubic metres and the weight in tonnes.",
            "报价好不好，取决于后面的事实。发品名和 HS 编码、件数、尺寸、毛重、货好的日期，以及你成交用的贸易条款。起运港要是你真正能装货的那个，再加上目的港和收货人的城市。整箱写明柜型和数量：20GP、40GP 或 40HQ。拼箱写立方米体积和吨数。",
          ),
          P(
            "Dangerous goods, and anything with batteries, belong in that first message. A quote built for general cargo cannot be reused for them. Finding out after the booking wastes the sailing.",
            "危险品和任何带电池的货，第一条消息里就要说。按普货做的报价不能挪来用。订完才发现，这班船就浪费了。",
          ),
        ],
      },
      {
        heading: L("How the price is built", "价格是怎么算的"),
        blocks: [
          P(
            "Full containers are priced per box, so settle the type first. A 40HQ carries more cubic cargo than a 40GP, and it is the box most of the market quotes on this site are for. A 20GP is the better fit when the cargo is heavy and would hit the weight limit of a 40-foot box long before it filled the space. Mixing those up makes every comparison meaningless.",
            "整箱按柜计价，所以先定柜型。40HQ 比 40GP 装更多泡货，本站大多数市场报价也是这种柜。货很重、40 英尺柜还没装满就超重时，20GP 更合适。柜型弄混，后面的比较都没有意义。",
          ),
          P(
            "Groupage, LCL, is priced per W/M. The carrier bills the larger of the cubic metres and the metric tonnes, with a minimum of 1 W/M. Dense cargo pays on weight. Light cargo pays on volume. The minimum means a small shipment is billed as one unit even when it is smaller than that.",
            "拼箱按 W/M 计价。船公司取立方米和公吨中较大的那个，最低 1 W/M。重货按重量付，泡货按体积付。最低收费的意思是，货再小，也按一个单位计。",
          ),
          P(
            "Either way, a port-to-port figure is ocean freight. Origin charges in China, destination charges, customs, duty, insurance and inland delivery are separate budgets. An all-in quote can be the right way to buy, but only if you can see the lines. Ask for it written out.",
            "不管哪种，港到港的数字都只是海运费。中国的起运港费用、目的港费用、清关、关税、保险和内陆运输，要分开做预算。全包价可以是合适的买法，但前提是你看得到分项。请对方逐行写出来。",
          ),
        ],
      },
      {
        heading: L("Documents every file needs", "每一票都要有的单证"),
        blocks: [
          P(
            "Check the commercial invoice, the packing list and the consignee's details while the cargo is still at the factory. The invoice needs a real description, the HS code, the value and the currency, and the seller and buyer named as they appear on the contract. The packing list needs marks, package counts, weights and measures that match the invoice. The consignee's name has to match their tax or commercial registration, not a shortened trading name.",
            "货还在工厂时，就把商业发票、装箱单和收货人资料核对完。发票要有真实品名、HS 编码、金额和币种，买卖双方的名称要和合同上一致。装箱单上的唛头、件数、重量和尺寸要和发票对得上。收货人名称要和税号或商业登记一致，不要用简称。",
          ),
          P(
            "The bill of lading is drawn from those papers. If the consignee, the HS code or a destination reference such as an ACID is wrong on the draft, the filing at the far end fails, and the correction costs time at both ends. Read the draft. Do not leave it until the day of departure.",
            "提单是从这些文件里抽出来的。草稿上的收货人、HS 编码，或 ACID 这类目的港编号写错了，那边的申报就会失败，两头都要花时间改。草稿要读。不要留到开船当天。",
          ),
        ],
      },
      {
        heading: L("The filing each destination adds", "每个目的港另外要的申报"),
        blocks: [
          P(
            "Each Red Sea destination adds a filing of its own, and most of them have to be done before the ship sails, not after it arrives. A generic export file will not catch a missing one.",
            "红海每个目的港都有自己的申报，而且多数要在开船前办，不是到港之后。一套通用的出口文件查不出漏了哪一项。",
          ),
          UL([
            ["Saudi Arabia: a SABER shipment certificate for every shipment, plus a product certificate when the goods are regulated. The customs declaration is filed on FASAH at least 48 hours before the vessel arrives.", "沙特：每票货都要 SABER 货物符合性证书，受管制的产品还要产品证书。报关单至少在船舶到港前 48 小时通过 FASAH 提交。"],
            ["Egypt: an ACID number from the importer, printed on the documents, and an Advance Cargo Information filing by the exporter on CargoX. The exporting company has to be verified on CargoX first.", "埃及：进口商提供 ACID 编号并印在单证上，出口商在 CargoX 做提前货物信息申报。出口公司要先在 CargoX 完成认证。"],
            ["Jordan: a consignee tax number that matches the documents, the HS code on the bill of lading, and JSMO or JFDA approval when the goods are regulated.", "约旦：与单证一致的收货人税号，提单上的 HS 编码，受管制产品还要 JSMO 或 JFDA 的批准。"],
            ["Djibouti: an ECTN before departure, unless the cargo is in direct transit to Ethiopia and the bill of lading says so. Cargo for Ethiopia also needs the importer's licence and bank approval before you ship.", "吉布提：开船前办 ECTN。直接转运埃塞俄比亚、且提单写明的，可以免。去埃塞的货，出运前还要有进口商的许可证和银行额度。"],
            ["Sudan: an Advance Cargo Declaration number obtained before loading and printed on the bill of lading, for vessels sailing from 1 January 2026, plus an SSMO inspection certificate for most commercial goods.", "苏丹：2026 年 1 月 1 日起开航的船，装船前取得预先货物申报编号并印在提单上。多数商品还要 SSMO 检验证书。"],
          ]),
          P(
            "The country pages spell out the fees, the validity and the papers each filing takes. Read the page for the port you are using.",
            "费用、有效期和每项申报要哪些材料，写在对应的国家页上。走哪个港，就读哪一页。",
          ),
          LINKS([
            ["/shipping-from-china-to-saudi-arabia/", "Saudi Arabia", "沙特"],
            ["/shipping-from-china-to-egypt/", "Egypt", "埃及"],
            ["/shipping-from-china-to-jordan/", "Jordan", "约旦"],
            ["/shipping-from-china-to-djibouti/", "Djibouti and Ethiopia", "吉布提和埃塞俄比亚"],
            ["/shipping-from-china-to-sudan/", "Sudan", "苏丹"],
          ]),
        ],
      },
      {
        heading: L("Three clocks before the ship sails", "开船前的三个时间"),
        blocks: [
          P(
            "Three clocks run before departure, and missing any of them rolls the cargo to a later sailing. Shipping instructions have to reach the forwarder in time for the carrier's document cut-off. The verified gross mass has to be filed before the container is loaded on the vessel. The cargo itself has to be inside the terminal before the cargo cut-off.",
            "开船前有三个时间，错过任何一个，货就得改下一班。提单补料要赶在船公司的截单时间之前交给货代。核实总重必须在集装箱装上船之前申报。货本身要在截关前进入码头。",
          ),
          P(
            "Those cut-offs are often a couple of days before departure, and a holiday in between makes the window shorter than it looks. Ask for all three times in writing when the booking is confirmed. \"The ship leaves on the 20th\" is not a cargo cut-off.",
            "这些截点常常比开船早几天，中间再夹一个假期，窗口比看上去更短。订舱确认时把三个时间都要成书面的。“船 20 号开”不是截关时间。",
          ),
        ],
      },
      {
        heading: L("A workable order", "比较顺的做法"),
        blocks: [
          P(
            "A workable order is: confirm the cargo and the consignee, choose the port, start the destination filing while the booking is being made, send shipping instructions before the document cut-off, and deliver the container before the cargo cut-off. Do not send the truck to the factory until the sailing and the price are confirmed. Doing the documents after the ship has sailed is how a first shipment loses a week.",
            "比较顺的顺序是：先确认货和收货人，选定港口，订舱的同时办目的港申报，截单前交补料，截关前把柜子送进码头。船期和价格确认之前，不要派车去工厂。单证留到开船之后再补，第一次出运往往就这样多等一周。",
          ),
          P(
            "Which port to choose, and why a rate moves, are covered in the other two notes. This list assumes you have read them, or that you already know the consignee's gateway.",
            "港口怎么选、运价为什么会变，写在另外两篇里。这份清单默认你已经看过，或者已经知道收货人走哪个港。",
          ),
          LINKS([
            ["/guides/jeddah-sokhna-aqaba-gateway/", "Choose the gateway", "选择门户港"],
            ["/guides/red-sea-freight-rate-factors/", "What moves the rate", "运价受什么影响"],
          ]),
        ],
      },
      {
        heading: L("What a confirmation is", "怎样才算确认"),
        blocks: [
          P(
            "Sending an enquiry through this site does not hold space. A rate here is a market reading or an estimate, valid for the window we state, and space moves. A container is reserved only after we confirm the sailing and the price with you on WeChat or WhatsApp.",
            "在本站提交询价，并不占舱。这里的价格是市场读数或估价，只在我们写明的窗口内有意义，舱位本身在变。只有我们在微信或 WhatsApp 上和你确认了船期和价格，柜子才算留住。",
          ),
          P(
            "Keep that confirmation. It should name the carrier or the service, the ports, the container, the sailing, the price, what the price includes, the free days, and the three cut-offs above. If a line is missing, ask before the cargo leaves the factory. Changing a bill of lading after departure is slower and more expensive than writing it correctly the first time.",
            "把这封确认留着。上面应写明船公司或航线、港口、柜型、船期、价格、价格包含什么、免柜期，以及上面那三个截点。少一行，就在货离开工厂之前问。提单开船后再改，比第一次写对更慢，也更贵。",
          ),
        ],
      },
      {
        heading: L("Send this list back with the enquiry", "询价时把这份清单对一遍"),
        blocks: [
          UL([
            ["Cargo name, HS code, packages, dimensions, gross weight.", "品名、HS 编码、件数、尺寸、毛重。"],
            ["Ready date, Incoterms, origin port, destination port, consignee city.", "货好日期、贸易条款、起运港、目的港、收货人城市。"],
            ["Container type and quantity, or volume and weight for LCL.", "柜型和数量；拼箱则是体积和重量。"],
            ["Dangerous goods or batteries named at the start, if there are any.", "有危险品或电池，一开始就写明。"],
            ["Invoice, packing list and consignee details checked against each other.", "发票、装箱单和收货人资料互相核对过。"],
            ["The destination filing started: SABER, ACID, ECTN or ACD, as that port requires.", "目的港申报已经开始：按港口办理 SABER、ACID、ECTN 或 ACD。"],
            ["A written quote, itemised, with the routing and the free days.", "书面分项报价，含航线和免柜期。"],
            ["Sailing, price and cut-offs confirmed on WeChat or WhatsApp before the cargo moves.", "货动之前，船期、价格和截点已在微信或 WhatsApp 上确认。"],
          ]),
          P(
            "You can start with the estimator and send whatever you already have. A partial enquiry gets a partial answer. A complete one gets a quote you can book against.",
            "也可以先用估价器，把你已经有的资料发过来。询价不完整，回答就不完整。资料齐的那一份，才能拿去订舱。",
          ),
        ],
      },
    ],
  },
  ...documentGuides,
];

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
