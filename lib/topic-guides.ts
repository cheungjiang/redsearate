import type { Guide } from "./content.ts";

const L = (en: string, zh: string) => ({ en, zh });
const P = (en: string, zh: string) => ({ kind: "p" as const, text: L(en, zh) });
const UL = (items: [string, string][]) => ({ kind: "ul" as const, items: items.map(([en, zh]) => L(en, zh)) });
const LINKS = (items: [string, string, string][]) => ({
  kind: "links" as const,
  items: items.map(([href, en, zh]) => ({ href, text: L(en, zh) })),
});

const published = "2026-11-22";

export const topicGuides: Guide[] = [
  {
    slug: "cape-of-good-hope-vs-suez-red-sea-freight",
    tag: L("ROUTING", "航线"),
    title: L("Cape vs Suez: what it does to Red Sea rates", "好望角 vs 苏伊士：对红海运价的影响"),
    lead: L(
      "The Cape and Suez are two different networks, not two prices for the same sailing. Here is how the routing choice reaches a Red Sea quote.",
      "好望角和苏伊士是两张不同的航线网络，不是同一班船的两种价格。这篇讲绕行如何传导到红海报价。",
    ),
    published,
    updated: published,
    faqs: [
      {
        q: L(
          "Does every China–Red Sea container go around the Cape now?",
          "现在中国到红海的柜子都绕好望角吗？",
        ),
        a: L(
          "No. A container whose destination is inside the Red Sea still enters through Bab el-Mandeb. The Cape is a choice for services that continue to Europe, or for carriers repositioning capacity. What changes for Red Sea cargo is often the number of direct calls and the amount of transhipment, not a single detour on your own box.",
          "不是。目的港在红海里面的柜子，最终仍从曼德海峡进入。好望角是继续去欧洲的航线、或者船公司调配运力时的选择。对红海货来说，变的通常是直挂数量和转船比例，不是你的柜子单独绕一圈。",
        ),
      },
      {
        q: L(
          "Is the Cape route always more expensive?",
          "绕好望角一定更贵吗？",
        ),
        a: L(
          "Not as a simple rule. The longer voyage absorbs capacity and can raise the market, but a transhipment quote can be cheaper than a direct one on the same day. Compare the routing, the connection, the free time and the total cost, not the routing label alone.",
          "不能这么简单判断。更长的航程会吸走运力、抬高市场，但同一天里中转报价也可能比直航便宜。要比航线、衔接、免柜期和总成本，不能只看“绕行”两个字。",
        ),
      },
      {
        q: L(
          "How much longer does the Cape take?",
          "走好望角要多多久？",
        ),
        a: L(
          "On Asia–Europe services, often one to two weeks, depending on the port pair. For a Red Sea destination, the effect is usually felt through connections and schedules rather than one published transit time. Ask for the routing on your quote.",
          "亚洲到欧洲的航线，通常多一到两周，具体看港口组合。对红海目的港，影响更多体现在衔接和船期上，而不是一个统一的航程数字。询价时直接问走哪条航线。",
        ),
      },
    ],
    sections: [
      {
        heading: L("Two networks, not two prices for one ship", "两张网络，不是一条船的两种价格"),
        blocks: [
          P(
            "A container from China to Jeddah does not choose between the Cape and Suez the way a container to Rotterdam does. Jeddah is inside the Red Sea. The ship enters through Bab el-Mandeb either way. The Cape versus Suez decision belongs to the service network: carriers routing Asia–Europe vessels, repositioning capacity, and deciding which Red Sea ports get a direct call. That decision still reaches your quote, but through capacity and connections, not through a simple detour on your own box.",
            "从中国到吉达的柜子，不会像到鹿特丹的柜子那样直接在好望角和苏伊士之间二选一。吉达在红海里面，船最终都要从曼德海峡进入。好望角还是苏伊士，是船公司做亚洲—欧洲航线、调配运力和决定红海直挂港时的选择。这个选择会传导到你的报价，但靠的是运力和衔接，不是你的柜子单独绕一圈。",
          ),
          P(
            "The Suez routing is the shorter path from Asia to Europe and to the Red Sea. The Cape routing sends the vessel around Africa. For a service that continues to Europe, the Cape adds distance, time and vessels. For a Red Sea destination, the visible effect is usually fewer direct calls, more transhipment and a schedule that is harder to keep. Both routings can appear in the same week, from different carriers, and neither is automatically the better product for your cargo.",
            "苏伊士是亚洲到欧洲、也是到红海的短路径。好望角让船绕非洲走。对继续去欧洲的航线，绕行增加距离、时间和船舶数量。对红海目的港，看得见的影响通常不是船直接绕行，而是直挂减少、中转增多、船期更难保证。同一周里，不同船公司可能同时给出两种走法；哪一种更适合你的货，不能只看名字。",
          ),
        ],
      },
      {
        heading: L("Why a longer voyage absorbs capacity", "为什么更长的航程会吸走运力"),
        blocks: [
          P(
            "A ship is a fixed asset. If a round voyage takes two more weeks, the same vessel completes fewer voyages in a year. To keep a weekly service weekly, the carrier needs more ships or has to cut capacity somewhere. That is the first channel from routing to price: the longer voyage absorbs tonnage that would otherwise be available to carry cargo, including cargo to the Red Sea. The effect is not linear. One service changing its routing can tighten a specific port pair while another port pair stays loose.",
            "船是固定资产。一个往返航次多出两周，同一艘船一年就跑不了那么多趟。要把周班维持成周班，船公司要么加船，要么在别处砍运力。这是航线影响价格的第一条通道：更长的航程吸走了原本可以运货的运力，包括运往红海的运力。影响不是线性的。一条航线改道，可能让某个港口组合变紧，另一个组合仍然宽松。",
          ),
          P(
            "Fuel, crew, insurance and port time rise with the extra distance. Carriers also lose the ability to rotate boxes as quickly, so empty containers can be in the wrong place. None of these costs is a fixed surcharge on every quote. They show up as a higher base rate, a space shortage, or a sailing that is full earlier than usual. That is why a rate can move even when your cargo, your supplier and your destination have not changed.",
            "多出的距离带来燃油、船员、保险和港口时间。空箱周转也会变慢，箱子可能停在错误的地方。这些成本不会以一笔固定附加费出现在每份报价上，而是表现为更高的基础运价、更紧的舱位，或者比往常更早满舱的船。所以货没变、工厂没变、目的港没变，报价仍然会动。",
          ),
        ],
      },
      {
        heading: L("What Red Sea ports feel first", "红海港口最先感受到什么"),
        blocks: [
          P(
            "Red Sea ports feel the routing change through their connections. A direct call is simple: one vessel, one port, one bill of lading. A transhipment adds a hub, a second vessel and a connection window. If the first vessel is late, the box waits at the hub. Jeddah, Jebel Ali, Djibouti, Colombo and Singapore can all appear as hubs, and each has a different cut-off, free time and cost.",
            "红海港口通过衔接感受到航线变化。直挂很简单：一条船、一个港、一份提单。中转多一个枢纽、第二条船和一个衔接窗口。第一程晚了，柜子就在枢纽等。吉达、杰贝阿里、吉布提、科伦坡和新加坡都可能成为枢纽，各自的截点、免柜期和费用不同。",
          ),
          P(
            "That is why two quotes to the same port can look far apart. One is direct and includes a certain free time. The other tranships, uses a cheaper ocean rate, and pushes more cost to the destination. The ocean number alone does not tell you which product is cheaper for your cargo. Ask what the box actually does after it leaves the first vessel.",
            "所以同一个目的港的两份报价可能差很多。一份直航，含一定免柜期；另一份中转，海运费更低，但把更多成本推到目的港。只看海运费，判断不了哪个产品对你的货更便宜。要问清楚柜子离开第一条船之后到底怎么走。",
          ),
          UL([
            ["Direct: fewer handovers, usually faster, often less free time at destination.", "直航：交接少，通常更快，目的港免柜期往往更短。"],
            ["Transhipment: lower ocean rate possible, one more connection risk, more local charges.", "中转：海运费可能更低，多一个衔接风险，当地费用更多。"],
            ["Ask which hub, which vessel and how long the connection is.", "问清哪个枢纽、哪条船、衔接要等多久。"],
          ]),
        ],
      },
      {
        heading: L("War-risk, fuel and the add-ons", "战争风险、燃油和附加费"),
        blocks: [
          P(
            "War-risk insurance is priced separately from ocean freight. Underwriters can treat the Red Sea up to a port as a risk area, and the carrier may pass a war-risk surcharge through. The surcharge can change faster than the base rate. It is not a sign that the base market has moved, and it may not apply to every carrier or every sailing. Read it as a separate line, not as part of the median.",
            "战争风险保险和海运费是分开计的。保险方可以把红海到某个港口划为风险区，船公司也可能把战争风险附加费转嫁出来。附加费比基础运价变得更快。它不代表基础市场动了，也不是每家船公司、每个航次都收。把它当一条独立费用看，不要混进中位数里。",
          ),
          P(
            "Fuel and peak-season surcharges work the same way. Ask for a line-item quote: base ocean freight, origin charges, destination charges, war-risk, fuel, documentation, free time and validity. A single all-in number without those lines is hard to compare and easy to change after booking. The line that moves most is not always the line that matters most.",
            "燃油和旺季附加费也是这个逻辑。要分项报价：基础海运费、起运港费用、目的港费用、战争风险、燃油、单证、免柜期和有效期。只给一个总价，既难比较，也容易在订舱后变。变动最大的那一行，不一定是影响你决策最大的那一行。",
          ),
        ],
      },
      {
        heading: L("How to read a quote in a diverted market", "绕行市场里怎么看报价"),
        blocks: [
          P(
            "In a diverted market, read the routing before the number. Is the sailing direct or transhipped? Which hub? How many days is the connection? What is the free time at destination? Does the quote include war-risk? Is the space confirmed or subject to carrier approval? These questions matter more than a small difference in the ocean rate.",
            "在绕行市场里，先看航线，再看数字。直航还是中转？哪个枢纽？衔接几天？目的港免柜期多久？含不含战争风险？舱位是确认的还是待船公司批复？这些问题比海运费差几十美元更重要。",
          ),
          P(
            "Then compare the total. Add origin charges, destination charges, inland trucking, customs and the cost of one extra week of transit. A cheaper ocean rate with a missed connection can cost more than a direct sailing that looked expensive on the first line. If the cargo is time-sensitive, the schedule is part of the price.",
            "然后再比总成本。把起运港费用、目的港费用、内陆拖车、清关和多出来的一周时效都加进去。海运费便宜、但错过衔接的方案，可能比第一行看起来贵的直航更贵。货期紧的话，船期本身就是价格的一部分。",
          ),
        ],
      },
      {
        heading: L("The schedule buffer is a cost you cannot see", "船期缓冲：看不见的成本"),
        blocks: [
          P(
            "Published transit times already contain a buffer. A carrier that says 32 days may plan for 28 days of sailing and connection plus four days of recovery. In a diverted market the buffer gets longer, because the connection is less predictable, the hub is busier and the vessel can miss its window. The number on the quote is not a promise that the box will arrive on that day; it is the carrier's current planning allowance.",
            "公开的航程数字里已经带了缓冲。船公司写 32 天，可能实际按 28 天航行和衔接、再加 4 天恢复来排。绕行市场里缓冲会变长，因为衔接更难预测、枢纽更忙、船更容易错过窗口。报价上的数字不是“这天一定到”的承诺，而是船公司当前的计划余量。",
          ),
          P(
            "That buffer is a real cost for the shipper. If the cargo is for a promotion, a project or a production line, an extra week ties up working capital and may force air freight or a local purchase. If the consignee has a warehouse slot or a truck booked, a late arrival adds storage and rescheduling. A cheaper ocean rate with ten more days of transit can be the more expensive choice once those costs are counted.",
            "这个缓冲对货主是实打实的成本。货是促销、项目或生产线用料，多一周就占资金，还可能被迫空运或当地采购。收货人订了仓、约了车，晚到就多仓储和改期费。海运费便宜、时效多十天，把这些算进去，往往是更贵的选择。",
          ),
          UL([
            ["Ask what the transit is measured from: loaded on board, departed, or arrived at the hub.", "问清航程从哪天算：装船、开航，还是到枢纽。"],
            ["Ask for the connection window and the next sailing if it is missed.", "问衔接窗口，以及错过后的下一班船。"],
            ["Compare the arrival window, not only the fastest published day.", "比到货窗口，不要只比最快的那一天。"],
            ["Put the cost of one extra week into the comparison.", "把多一周的成本放进比较里。"],
          ]),
        ],
      },
      {
        heading: L("What to do before you book", "订舱前做什么"),
        blocks: [
          P(
            "If your cargo is ready now, ask for the next two sailings, not just the cheapest one. A sailing that leaves later but connects cleanly can arrive earlier. If your cargo is flexible, ask what changes in the following week; do not assume the direction will continue. A single week is a reading, not a trend.",
            "货已经好了，就问最近两班船，不要只问最便宜的那班。晚开但衔接顺的船，可能更早到。货期灵活，就问下周会有什么变化；不要假设涨跌会延续。一周只是一个读数，不是趋势。",
          ),
          P(
            "The index on this site is a market reading, not a bookable offer. Use it to see the level and the sample size, then ask for a quote on your actual cargo, route and date. The routing question is part of that quote, not a separate research project.",
            "本站指数是市场读数，不是可订舱报价。用它看水平和样本量，再按你的实际货物、航线和日期询价。航线问题应该包含在这份报价里，而不是另做一个研究项目。",
          ),
          LINKS([
            ["/rates/", "Current Red Sea rates", "查看当前红海运价"],
            ["/shipping-from-china-to-saudi-arabia/", "China to Saudi Arabia rates", "中国到沙特运价"],
            ["/guides/red-sea-freight-rate-factors/", "What moves a Red Sea rate", "哪些因素影响红海运价"],
            ["/faq/", "Shipping FAQ", "海运常见问题"],
          ]),
        ],
      },
    ],
  },
  {
    slug: "fcl-vs-lcl-red-sea",
    tag: L("SHIPPING MODE", "运输方式"),
    title: L("FCL vs LCL to the Red Sea: which fits?", "整柜还是拼箱：红海出货怎么选？"),
    lead: L(
      "FCL and LCL are different products with different cost lines. Compare them on total cost, handling and transit, not on the ocean freight alone.",
      "整柜和拼箱是两种产品，费用结构也不同。比较时要看总成本、操作和时效，不能只看海运费。",
    ),
    published,
    updated: published,
    faqs: [
      {
        q: L("Is LCL cheaper for 5 CBM?", "5 立方米走拼箱更便宜吗？"),
        a: L(
          "Often the ocean freight is lower, but the total may not be. LCL adds destination CFS handling, documentation and consolidation time, and those charges can be large relative to 5 CBM. Compare the door-to-door total, not just the freight line.",
          "海运费通常更低，但总成本不一定。拼箱多出目的港拆箱、单证和集拼时间，这些费用相对 5 立方米可能不低。要比门到门总成本，不要只比海运费那一行。",
        ),
      },
      {
        q: L("Can I ship less than 1 CBM?", "不足 1 立方米能走吗？"),
        a: L(
          "Yes, but LCL is billed on the larger of cubic metres or metric tonnes, with a minimum of 1 W/M. A small shipment still pays for at least 1 W/M plus destination charges. Ask for the minimum charge before you decide.",
          "可以，但拼箱按立方米与公吨中较大值计费，最低 1 W/M。货再小，也至少按 1 W/M 加目的港费用计。先问清最低收费再决定。",
        ),
      },
      {
        q: L("Is FCL always faster?", "整柜一定更快吗？"),
        a: L(
          "Usually it has fewer handovers, but the sailing and routing still decide. A direct FCL sailing can beat a transhipped LCL; a delayed FCL can lose to a clean LCL connection. Compare the actual schedule, not the label.",
          "通常交接更少，但还是要看船期和航线。直航整柜可能快过中转拼箱；延误的整柜也可能输给衔接顺的拼箱。比实际船期，不要只比标签。",
        ),
      },
    ],
    sections: [
      {
        heading: L("The short answer", "先说结论"),
        blocks: [
          P(
            "FCL means one shipper uses a whole container. LCL means several shippers share a container, and the forwarder consolidates the cargo at a warehouse. FCL is usually the better fit when the cargo fills a container, is heavy, fragile, high-value or time-sensitive. LCL is usually the better fit when the cargo is small and the destination charges are understood.",
            "整柜是一个货主用一个柜子；拼箱是几个货主共用一个柜子，由货代在仓库集拼。货量接近整柜、货重、易碎、高价值或时效紧，通常选整柜。货量小、并且已经算清目的港费用，拼箱才更合适。",
          ),
          P(
            "The mistake is comparing only the ocean freight. LCL often wins on the first line and loses on the total, because the destination charges are spread over a small volume. FCL often looks expensive on the first line and becomes competitive once you count the cargo volume and the handling.",
            "最常见的错误是只比海运费。拼箱常常在第一行赢，在总成本输，因为目的港费用摊在小体积上。整柜常常第一行看起来贵，把货量和操作算进去后才有可比性。",
          ),
        ],
      },
      {
        heading: L("How LCL is priced", "拼箱怎么计费"),
        blocks: [
          P(
            "LCL is billed per W/M: the larger of cubic metres and metric tonnes. If 3 CBM weighs 2 tonnes, the charge is 3 W/M. If 3 CBM weighs 4 tonnes, the charge is 4 W/M. There is usually a minimum of 1 W/M. The ocean freight is only one line; the forwarder also charges for origin CFS, documentation, destination CFS, customs and delivery.",
            "拼箱按 W/M 计费：立方米和公吨取较大值。3 立方米、2 吨，按 3 W/M；3 立方米、4 吨，按 4 W/M。通常最低 1 W/M。海运费只是一行，货代还会收起运港拼箱费、单证费、目的港拆箱费、清关和派送。",
          ),
          P(
            "Because the box is shared, the forwarder has to wait for every shipper's cargo before it can close the container. One late supplier can delay the whole group. The destination warehouse also has to separate the cargo and release it, which adds time and handling compared with a single container.",
            "柜子是共用的，货代要等所有货主的货到齐才能封柜。一个供应商晚了，整组都晚。目的港仓库还要分货、放货，比整柜多一道操作和时间。",
          ),
          UL([
            ["Billed on W/M, minimum 1 W/M.", "按 W/M 计费，最低 1 W/M。"],
            ["Origin CFS, documentation and destination CFS add lines.", "起运港拼箱、单证和目的港拆箱都会另计。"],
            ["Consolidation waits for the last cargo in the group.", "集拼要等整组最后一票货到齐。"],
          ]),
        ],
      },
      {
        heading: L("How FCL is priced", "整柜怎么计费"),
        blocks: [
          P(
            "FCL is priced per container, not per CBM. A 20GP, 40GP or 40HQ has its own ocean freight, origin charges, destination charges and free time. Once you pay for the container, the marginal cost of filling it with more cargo is low, as long as you stay within the payload and the destination rules.",
            "整柜按柜计费，不按立方米。20GP、40GP、40HQ 各有自己的海运费、起运港费用、目的港费用和免柜期。付了一个柜子的钱，只要不超载、不违反目的港规定，多装一点货的边际成本很低。",
          ),
          P(
            "FCL also gives you control of the box. You can load at your factory or warehouse, seal it, and track one unit. The consignee gets one container, one delivery order and one set of destination charges. That simplicity is part of what you pay for.",
            "整柜还把柜子交给你控制。可以在工厂或仓库装柜、加封，按一个单位跟踪。收货人拿到一个柜子、一份提货单和一套目的港费用。这种简单性本身就是你付的钱的一部分。",
          ),
        ],
      },
      {
        heading: L("The costs that decide it", "决定选择的费用"),
        blocks: [
          P(
            "Start with the cargo: volume, weight, package count and whether it can be stacked. Then add the destination. A 5 CBM LCL shipment to Jeddah may look cheap on the ocean line, but the destination CFS, documentation and delivery can make a small FCL or a different routing more attractive. The same 5 CBM to a port with fewer LCL services may have no good LCL option at all.",
            "先看货：体积、重量、件数、能不能叠。再看目的港。5 立方米到吉达，海运费那一行可能很便宜，但目的港拆箱、单证和派送加起来，可能让一个小柜或另一种走法更划算。同样是 5 立方米，去拼箱服务少的目的港，可能根本没有好的拼箱选择。",
          ),
          P(
            "Also count the time cost. LCL adds consolidation and destination separation. If the cargo is for a project, a promotion or a production line, a week of extra handling can cost more than the freight difference. If the cargo is slow-moving and the warehouse can wait, LCL's lower first line may be worth it.",
            "还要算时间成本。拼箱多出集拼和目的港分货。货是项目货、促销货或生产线用料，多一周操作可能比运费差更贵。货不急、仓库也能等，拼箱第一行更低才有意义。",
          ),
          UL([
            ["Volume above roughly 15 CBM: price FCL first.", "体积大约超过 15 立方米：先问整柜。"],
            ["Heavy cargo: check payload before comparing per-CBM prices.", "货重：先看载重，再比每立方米价格。"],
            ["High value, fragile or time-sensitive: FCL usually reduces handling risk.", "高价值、易碎、时效紧：整柜通常减少操作风险。"],
            ["Small cargo: compare LCL total including destination CFS.", "小货：拼箱要把目的港拆箱费算进总成本。"],
          ]),
        ],
      },
      {
        heading: L("Transit and handling", "时效与操作"),
        blocks: [
          P(
            "A direct FCL sailing is usually the shortest and simplest. LCL may route through a consolidation hub, and the connection can add days. The cargo also moves through more hands: origin warehouse, container freight station, vessel, destination CFS, then delivery. Each handover is a chance for a delay or a document mismatch.",
            "直航整柜通常最短、最简单。拼箱可能经集拼枢纽，衔接会多几天。货经过的手也更多：起运仓、拼箱站、船、目的港拆箱站、再派送。每次交接都可能带来延误或单证不一致。",
          ),
          P(
            "That does not make LCL unreliable. It makes the schedule less direct. If you need a specific arrival date, ask for the actual routing and the cut-off at the CFS, not only the vessel's ETD. If you need one supplier's cargo isolated, FCL is the cleaner choice.",
            "这不是说拼箱不可靠，而是船期没那么直接。要有明确到货日，就问实际航线和拼箱站的截货时间，不要只问船的 ETD。要把一个供应商的货单独隔开，整柜更干净。",
          ),
        ],
      },
      {
        heading: L("The 15 CBM rule, and when it fails", "15 立方米经验法则，以及它什么时候不成立"),
        blocks: [
          P(
            "A common rule of thumb is to price FCL once the cargo passes roughly 15 CBM. Below 10 CBM, LCL is usually the place to start. Between 10 and 15 CBM, the answer depends on density, destination charges and how much handling the cargo can take. The rule is a starting point, not a tariff boundary.",
            "一个常见的经验法则是：货量超过大约 15 立方米，就开始问整柜。低于 10 立方米，通常先从拼箱问起。10 到 15 立方米之间，答案取决于货重、目的港费用和货物能承受多少操作。这个法则是起点，不是运价分界线。",
          ),
          P(
            "Density breaks the rule first. Twelve CBM of machinery at nine tonnes is not the same shipment as twelve CBM of cartons at two tonnes. The heavy cargo may hit a 20GP payload limit, while the light cargo leaves most of the container empty by weight. Palletised cargo breaks it again: pallets waste height and floor space, so the usable CBM is lower than the carton count suggests. A 20GP may hold fewer pallets than the arithmetic says.",
            "最先打破法则的是货重。12 立方米、9 吨的机械，和 12 立方米、2 吨的纸箱，不是同一种货。重货可能碰到 20GP 的载重上限；轻货则重量远没到、柜里大半是空的。托盘货又会改写一次：托盘浪费高度和地面，实际可用容积比纸箱数量算出来的少。20GP 能装的托盘数，可能比算术结果少。",
          ),
          P(
            "Destination breaks it second. LCL needs a consolidation service and a destination CFS. Jeddah, Sokhna, Aqaba and Djibouti have regular LCL options; Port Sudan has fewer, and the routing may be longer. The destination CFS charge is also spread over your small volume, so a 3 CBM shipment can carry a disproportionate share of the handling cost. Always ask for the destination CFS, documentation and delivery as separate lines.",
            "第二个打破法则的是目的港。拼箱要有集拼服务和目的港拆箱站。吉达、苏赫纳、亚喀巴和吉布提有常规拼箱；苏丹港选择更少，航线也可能更长。目的港拆箱费还摊在你的小体积上，3 立方米的货可能承担了不成比例的操作成本。一定要让对方把目的港拆箱、单证和派送分开列。",
          ),
          UL([
            ["Under 10 CBM and not urgent: price LCL first.", "10 立方米以下、不急：先问拼箱。"],
            ["10–15 CBM: compare both totals, including destination CFS.", "10–15 立方米：两边总价都比，含目的港拆箱。"],
            ["Over 15 CBM or over 15 tonnes: price FCL first.", "超过 15 立方米或 15 吨：先问整柜。"],
            ["Palletised or high-value cargo: count the handling risk, not only the freight.", "托盘货或高价值货：算操作风险，不只算运费。"],
          ]),
        ],
      },
      {
        heading: L("A decision checklist", "决策清单"),
        blocks: [
          P(
            "Write down the volume, gross weight, package dimensions, cargo value, ready date and consignee address. Then ask for two quotes: one FCL with the right container, one LCL with the destination charges itemised. Compare the total delivered cost and the transit, not the ocean line alone.",
            "先写下体积、毛重、包装尺寸、货值、备货日期和收货地址。然后要两份报价：一份对应柜型的整柜，一份把目的港费用拆开的拼箱。比总到门成本和时效，不要只比海运费。",
          ),
          P(
            "If the two totals are close, choose the option with fewer handovers and clearer free time. If LCL is much cheaper and the cargo is not time-sensitive, LCL can be the right answer. The goal is not to pick a label; it is to pick the cost structure that fits the cargo.",
            "两个总价接近，就选交接少、免柜期更清楚的那个。拼箱明显便宜、货又不急，拼箱就是正确答案。目标不是选一个标签，而是选适合这批货的费用结构。",
          ),
          LINKS([
            ["/rates/", "Current Red Sea rates", "查看当前红海运价"],
            ["/guides/first-shipment-checklist/", "First shipment checklist", "首次出运清单"],
            ["/faq/", "Shipping FAQ", "海运常见问题"],
          ]),
        ],
      },
    ],
  },
  {
    slug: "20gp-40gp-40hq-container-choice",
    tag: L("CONTAINERS", "柜型"),
    title: L("20GP, 40GP or 40HQ: which container?", "20GP、40GP、40HQ：红海出货选哪种柜？"),
    lead: L(
      "20GP, 40GP and 40HQ carry different volumes and weights. Choose by cargo density, pallets, inland limits and equipment, not by the lowest ocean rate.",
      "20GP、40GP、40HQ 的容积和载重不同。选柜要看货重、托盘、内陆限高和箱源，不能只看最低海运费。",
    ),
    published,
    updated: published,
    faqs: [
      {
        q: L("Which container is cheapest?", "哪种柜最便宜？"),
        a: L(
          "A 20GP often has the lowest ocean freight per container, but not necessarily the lowest cost per CBM. A 40HQ usually carries more than twice the volume of a 20GP for a smaller premium. Compare cost per cubic metre and the total cargo, not the container price alone.",
          "20GP 的每柜海运费通常最低，但每立方米成本不一定最低。40HQ 的容积通常是 20GP 的两倍多，溢价却没有两倍。要比每立方米成本和整票货，不要只比每柜价格。",
        ),
      },
      {
        q: L("Can I load 28 tonnes in a 40HQ?", "40HQ 能装 28 吨吗？"),
        a: L(
          "The container may be rated for it, but the road limit and the carrier's payload limit decide. Many destinations restrict gross vehicle weight, and a 40HQ is heavier than a 20GP. Confirm the payload with the carrier and the trucker before you plan a dense load.",
          "柜子本身可能允许，但公路限重和船公司载重限制才算数。很多目的港限制车货总重，40HQ 自重也比 20GP 大。装重货前先和船公司、拖车确认可载重量。",
        ),
      },
      {
        q: L("Is a 40HQ always available?", "40HQ 一定有箱吗？"),
        a: L(
          "No. Equipment varies by port and week. A 40HQ can be scarce when a lot of light cargo is moving, and a 20GP can be scarce when dense cargo is moving. Ask about equipment when you ask for the rate, especially if your cargo-ready date is tight.",
          "不一定。箱源随港口和星期变化。轻货多的时候 40HQ 会紧，重货多的时候 20GP 会紧。询价时一起问箱源，货期紧尤其要问。",
        ),
      },
    ],
    sections: [
      {
        heading: L("The three boxes at a glance", "三种柜型一眼看"),
        blocks: [
          P(
            "The three dry containers use the same width and length family but different heights and volumes. A 20GP is about 33 CBM. A 40GP is about 67 CBM. A 40HQ is about 76 CBM, with the extra height coming from the high-cube design. Payload is typically in the mid-to-high twenties of tonnes, but the carrier's limit and the road limit at destination decide what you can actually load.",
            "三种干柜的宽度和长度体系相同，高度和容积不同。20GP 大约 33 立方米，40GP 大约 67 立方米，40HQ 大约 76 立方米，多出来的是高柜的高度。载重通常在二十多吨的中上段，但真正能装多少，要看船公司限制和目的港公路限重。",
          ),
          P(
            "Those numbers are planning figures, not a guarantee. Container weights and internal dimensions vary by manufacturer, and a carrier can impose a lower payload for a specific route or road. Use them to choose a direction, then confirm the exact limit with the carrier before you load.",
            "这些数字是计划用的，不是保证值。不同制造商的内尺寸和自重会有差异，船公司也可能对某条航线或公路给出更低载重。用它们判断方向，装柜前再和船公司确认具体限制。",
          ),
          UL([
            ["20GP: about 33 CBM, for dense cargo.", "20GP：约 33 立方米，适合重货。"],
            ["40GP: about 67 CBM, for voluminous cargo that fits standard height.", "40GP：约 67 立方米，适合体积货、且高度不超标准柜。"],
            ["40HQ: about 76 CBM, for light and voluminous cargo, pallets and taller cargo.", "40HQ：约 76 立方米，适合轻货、体积货、托盘和较高的货。"],
          ]),
        ],
      },
      {
        heading: L("20GP: the dense-cargo box", "20GP：重货柜"),
        blocks: [
          P(
            "The 20GP is the smallest of the three and the usual choice for dense cargo: tiles, hardware, machinery parts, bagged material and other freight that reaches the weight limit before it fills the volume. Its ocean freight per container is often lower, and it is easier to move on roads with tight weight limits.",
            "20GP 是三者里最小的，通常给重货：瓷砖、五金、机械配件、袋装料，以及其他先到重量上限、后到容积上限的货。它的每柜海运费往往更低，在限重紧的公路上也更好安排。",
          ),
          P(
            "The trade-off is cost per CBM. If the cargo is light and bulky, a 20GP fills up long before it reaches its payload, and you pay for a container that is mostly air. In that case, a 40GP or 40HQ usually lowers the cost per cubic metre, even if the ocean freight line is higher.",
            "代价是每立方米成本。货轻、体积大，20GP 很快就装满，但离载重上限还很远，等于为一个大部分是空气的柜子付钱。这种情况用 40GP 或 40HQ，通常能把每立方米成本拉低，哪怕海运费那一行更高。",
          ),
        ],
      },
      {
        heading: L("40GP: the standard forty", "40GP：标准四十尺"),
        blocks: [
          P(
            "The 40GP is the standard-height forty-foot box. It roughly doubles the volume of a 20GP without the extra height of a high cube. It suits cargo that is voluminous but not tall: cartons, furniture parts, appliances and mixed pallets that stay below the standard internal height.",
            "40GP 是标准高度的四十尺柜。容积大约是 20GP 的两倍，但没有高柜多出来的高度。适合体积大、但不算高的货：纸箱、家具部件、家电，以及高度不超过标准柜内高的混合托盘。",
          ),
          P(
            "Some carriers have fewer 40GP boxes than 40HQ boxes, especially on Red Sea services. If the cargo fits a 40GP, ask for both 40GP and 40HQ rates. The 40HQ may be easier to find and only slightly more expensive, while the 40GP may be cheaper when it is available.",
            "有些船公司的 40GP 箱源比 40HQ 少，红海航线尤其如此。货能装 40GP，就同时问 40GP 和 40HQ 的价。40HQ 可能更好找、只贵一点；40GP 有箱时可能更便宜。",
          ),
        ],
      },
      {
        heading: L("40HQ: the extra height", "40HQ：高柜多出来的高度"),
        blocks: [
          P(
            "The 40HQ is a high-cube forty-foot container. It has the same footprint as a 40GP but more internal height, which brings the volume to about 76 CBM. It is the usual choice for light, voluminous cargo, palletised goods and cartons that would otherwise leave a 40GP half empty by weight.",
            "40HQ 是高柜四十尺。底面和 40GP 一样，内部更高，容积大约 76 立方米。轻货、体积货、托盘货，以及装 40GP 会“重量没满、体积先满”的纸箱货，通常选它。",
          ),
          P(
            "The extra height is not free everywhere. Inland bridges, tunnels, warehouse doors and some truck chassis can limit a high cube after it leaves the port. If the consignee's delivery point has a low door or a restrictive road, a 40GP may be the safer choice even if the 40HQ is cheaper on the ocean.",
            "多出来的高度不是在哪里都能用。内陆桥梁、隧道、仓库门，以及某些拖车底盘，都可能在离开港口后限制高柜。收货人的卸货点门矮、道路有限制，哪怕 40HQ 海运费更便宜，40GP 也可能更稳。",
          ),
        ],
      },
      {
        heading: L("How to choose", "怎么选"),
        blocks: [
          P(
            "Start with the cargo volume and gross weight. If the cargo is dense, price a 20GP first. If it is light and bulky, price a 40HQ first. If it is in between, price both a 40GP and a 40HQ. Then add the pallet count and the internal height: a pallet that is too tall for a standard container can force a high cube, even when the volume is small.",
            "先看体积和毛重。货重，先问 20GP；货轻、体积大，先问 40HQ；介于两者之间，40GP 和 40HQ 都问。然后加托盘数量和货高：托盘太高、标准柜进不去，哪怕体积不大，也只能用高柜。",
          ),
          P(
            "Finally, check equipment and inland limits. A cheap rate for a container that is not available at your origin, or cannot be delivered at destination, is not a real option. Ask the carrier or forwarder about both before you book.",
            "最后看箱源和内陆限制。起运港没箱、或者目的港送不到的柜型，再便宜也不是真选项。订舱前把这两件事一起问掉。",
          ),
          UL([
            ["Dense cargo: 20GP first, then compare cost per CBM.", "重货：先看 20GP，再比每立方米成本。"],
            ["Light and bulky: 40HQ first, then 40GP.", "轻货、体积货：先看 40HQ，再看 40GP。"],
            ["Tall pallets or cargo: check internal height before choosing.", "高托盘或高货：先核对内高再选柜。"],
            ["Inland delivery: check door height and road limits.", "内陆派送：核对门高和道路限制。"],
          ]),
        ],
      },
      {
        heading: L("Payload and the road limit", "载重与公路限重"),
        blocks: [
          P(
            "The container's volume is only half the choice. Each box also has a tare weight, and the tare is larger on a forty-foot container than on a 20GP. That matters for dense cargo: a 20GP can often carry more cargo tonnes than a 40HQ because the box itself weighs less and the axle load is spread differently. The carrier's payload limit and the road limit at destination decide the real number, not the container's nominal capacity.",
            "容积只是选择的一半。每个柜子还有自重，四十尺的自重比 20GP 大。这对重货很关键：20GP 往往能比 40HQ 多装货吨，因为柜子本身更轻、轴荷分布也不同。真正能装多少，由船公司载重限制和目的港公路限重决定，不是柜子的名义容量。",
          ),
          P(
            "Most destinations limit gross vehicle weight, and some also limit axle weight. A 40HQ loaded to its nominal payload can be legal on the ship and illegal on the road. The trucker may need a permit, a different chassis or a split delivery. Inland bridges and seasonal road restrictions can tighten the limit further. If the cargo is dense, price a 20GP first and confirm the payload with the carrier and the trucker in writing.",
            "多数目的港限制车货总重，有些还限制轴重。40HQ 装到名义载重，可能在船上合法、在公路上超限。拖车可能要办许可、换底盘，或者分车送。内陆桥梁和季节性道路限制还会把上限压得更低。货重的话，先问 20GP，并让船公司和拖车书面确认可载重量。",
          ),
          P(
            "The shipper also has a legal obligation to provide a verified gross mass (VGM) before the container is loaded. Guessing the weight or using the booking weight is not enough. Weigh the packed container or use an approved method, and keep the figure consistent with the documents. A misdeclared weight can stop the box at the terminal or create a safety issue on the road.",
            "发货人还有一项法定义务：集装箱装船前要提供核实总重（VGM）。估重量、拿订舱重量顶替都不行。要称重，或者用经批准的方法计算，并保证和单证一致。重量申报不实，可能在码头被拦，也会带来公路安全风险。",
          ),
          UL([
            ["Dense cargo: compare payload, not only CBM.", "重货：比载重，不只比容积。"],
            ["Check the road limit at the delivery address.", "核对送货地址的公路限重。"],
            ["Confirm the carrier's payload limit for the route.", "确认船公司对该航线的载重限制。"],
            ["Provide a verified gross mass before loading.", "装船前提供核实总重。"],
          ]),
        ],
      },
      {
        heading: L("Red Sea checks", "红海航线的额外检查"),
        blocks: [
          P(
            "The site's index uses 40HQ because it is the common container for light cargo on this trade. That does not mean 40HQ is always the right box for your cargo. The country pages show 20GP and 40HQ medians by origin where quotes exist, and the route pages show the equipment behind each lane.",
            "本站指数用 40HQ，是因为它是这条航线上轻货的常用柜型。这不代表你的货一定该用 40HQ。目的港页面按起运港列出 20GP 和 40HQ 的中位数（有报价时），路线页面则显示每条航线对应的柜型数据。",
          ),
          P(
            "At Jeddah, Sokhna, Aqaba, Djibouti and Port Sudan, the destination charges and free time can differ by container type. A 20GP may have a lower terminal handling charge, while a 40HQ may have a lower cost per CBM. Ask for the destination charges by container, not one blended number.",
            "在吉达、苏赫纳、亚喀巴、吉布提和苏丹港，目的港费用和免柜期可能按柜型不同。20GP 的码头操作费可能更低，40HQ 的每立方米成本可能更低。要让对方按柜型列目的港费用，不要给一个混在一起的总数。",
          ),
          LINKS([
            ["/rates/", "Current Red Sea rates", "查看当前红海运价"],
            ["/shipping-from-china-to-saudi-arabia/", "China to Saudi Arabia rates", "中国到沙特运价"],
            ["/faq/", "Shipping FAQ", "海运常见问题"],
          ]),
        ],
      },
    ],
  },
  {
    slug: "ddp-dap-red-sea-door-cost",
    tag: L("INCOTERMS", "贸易条款"),
    title: L("DDP vs DAP to the Red Sea: what is included?", "DDP 与 DAP：红海到门成本怎么算？"),
    lead: L(
      "DAP leaves import clearance and duty with the buyer. DDP puts them on the seller. The difference is who owns the import file, not just who pays the tax.",
      "DAP 由买方负责进口清关和税费，DDP 由卖方负责。差别不只是谁付税，而是谁承担进口申报责任。",
    ),
    published,
    updated: published,
    faqs: [
      {
        q: L("Is DDP always cheaper than DAP?", "DDP 一定比 DAP 便宜吗？"),
        a: L(
          "No. DDP moves the import clearance, duty and VAT into the seller's price, and the seller may add a margin for the risk and the cash flow. DAP can be cheaper on the invoice while the buyer pays the same duty and VAT locally. Compare the total landed cost, not the quoted number alone.",
          "不一定。DDP 把进口清关、关税和增值税放进卖方价格，卖方可能为风险和垫资加一层利润。DAP 的发票价可能更低，但买方要在当地付同样的关税和增值税。要比总到岸成本，不能只比报价数字。",
        ),
      },
      {
        q: L("Can a foreign seller be the importer of record?", "外国卖方能做进口申报主体吗？"),
        a: L(
          "Not automatically. Many Red Sea markets require a local importer, a tax registration or a licensed broker to clear the goods. A DDP quote only works if the seller has that entity or a broker who can act for it. Confirm the importer of record before you agree to DDP.",
          "不一定。红海很多市场要求当地进口商、税号或持牌报关行才能清关。DDP 报价只有在卖方有当地主体、或者有能代其申报的报关行时才成立。同意 DDP 前先确认进口申报主体是谁。",
        ),
      },
      {
        q: L("Does DAP include duty?", "DAP 含关税吗？"),
        a: L(
          "No. Under DAP, the seller delivers to the named place, but the buyer handles import clearance and pays duty, VAT and any destination charges. The seller's price should include the transport to that place, not the import taxes.",
          "不含。DAP 下卖方送到指定地点，但进口清关、关税、增值税和目的港费用由买方负责。卖方价格应包含送到该地点的运输，不包含进口税费。",
        ),
      },
    ],
    sections: [
      {
        heading: L("The one-line difference", "一句话区别"),
        blocks: [
          P(
            "DAP and DDP are both delivery terms. Under DAP, the seller delivers the goods to the named place and the buyer handles import clearance and pays duty and VAT. Under DDP, the seller delivers to the named place and also handles import clearance and pays duty and VAT. The delivery point can be the same; the difference is who owns the import file and the tax liability.",
            "DAP 和 DDP 都是交货条款。DAP 下，卖方把货送到指定地点，买方负责进口清关并支付关税和增值税。DDP 下，卖方送到指定地点，同时负责进口清关并支付关税和增值税。交货点可以一样，差别在于谁承担进口申报和税负。",
          ),
          P(
            "That difference is bigger than it sounds. Import clearance needs an importer of record, a tax registration, a broker and a document set that matches the destination rules. A seller who can move cargo to the port may not be able to clear it. A DDP price that ignores this is not a complete DDP price.",
            "这个差别比听起来大。进口清关需要进口申报主体、税号、报关行，以及一套符合目的国规则的单证。能把货运到港口的卖方，不一定能清关。忽略这一点的 DDP 报价，不是完整的 DDP 报价。",
          ),
        ],
      },
      {
        heading: L("What a door price contains", "到门价格包含什么"),
        blocks: [
          P(
            "A real door price starts with the cargo and ends at a named address. In between: origin pickup or factory loading, export declaration, origin charges, ocean freight, destination terminal handling, documentation, customs broker, duty, VAT, any inspection, inland trucking, insurance and the free time before demurrage or detention starts. Each line can be in or out of the quote.",
            "真正的到门价格从货开始，到指定地址结束。中间包括：起运地提货或工厂装柜、出口申报、起运港费用、海运费、目的港码头操作、单证、报关行、关税、增值税、可能的查验、内陆拖车、保险，以及免柜期结束前的仓储。每一行都可能含或不合。",
          ),
          P(
            "Ask for the quote by line, not as one number. The same door price can hide very different assumptions: a terminal inside the port versus a warehouse three hours inland, a 20GP versus a 40HQ, a direct sailing versus a transhipment, or a free time of 7 days versus 14. The lines tell you what you are actually buying.",
            "要分项报价，不要一个总数。同样的到门价可能藏着完全不同的假设：港区堆场还是三小时外的仓库、20GP 还是 40HQ、直航还是中转、7 天还是 14 天免柜期。分项才看得出你买的是什么。",
          ),
          UL([
            ["Ocean freight and origin charges.", "海运费和起运港费用。"],
            ["Destination terminal handling and documentation.", "目的港码头操作和单证。"],
            ["Customs broker, duty, VAT and inspection.", "报关行、关税、增值税和查验。"],
            ["Inland trucking to the named place.", "到指定地点的内陆拖车。"],
            ["Insurance, demurrage, detention and storage.", "保险、滞箱、滞港和仓储。"],
          ]),
        ],
      },
      {
        heading: L("Why DDP is not just free delivery", "DDP 不只是“包送到门”"),
        blocks: [
          P(
            "DDP means the seller takes on the import side. That requires an importer of record, a tax registration, a broker and a compliance file. In Saudi Arabia, the file may need SABER; in Egypt, ACID; in Djibouti, ECTN; in Sudan, ACD and SSMO. The seller also has to fund the duty and VAT before the buyer pays.",
            "DDP 意味着卖方接下进口端。要有进口申报主体、税号、报关行和一套合规文件。沙特可能要做 SABER，埃及要 ACID，吉布提要 ECTN，苏丹要 ACD 和 SSMO。卖方还要在买方付款前先垫关税和增值税。",
          ),
          P(
            "Those obligations are why a DDP quote can be higher than a DAP quote even when the duty is the same. The seller is pricing a service, a compliance risk and a cash-flow cost. If the seller cannot legally be the importer, the DDP quote may rely on a local broker, and the broker's name and responsibility should be written into the quote.",
            "这些义务就是为什么关税一样，DDP 报价也可能高于 DAP。卖方报的是服务、合规风险和资金占用。卖方不能合法做进口商时，DDP 可能依赖当地报关行；报关行是谁、承担什么责任，应该写进报价。",
          ),
        ],
      },
      {
        heading: L("What DAP leaves with the buyer", "DAP 留给买方什么"),
        blocks: [
          P(
            "Under DAP, the seller delivers to the named place, but the buyer is the importer. The buyer needs the import registration, the broker, the duty and VAT, and the destination documents. The seller's job ends at delivery; unloading and import clearance are on the buyer's side.",
            "DAP 下，卖方送到指定地点，但买方是进口商。买方要有进口登记、报关行、关税和增值税，以及目的港单证。卖方的工作到交货为止；卸货和进口清关在买方这边。",
          ),
          P(
            "DAP is often the cleaner choice when the consignee already imports regularly and has a broker. It keeps the import file with the party who knows the product and the local rules. It also avoids a foreign seller pretending to be a local importer. The trade-off is that the buyer carries the duty and the clearance risk.",
            "收货人本来就经常进口、也有报关行，DAP 往往更干净。进口文件留在熟悉产品和当地规则的一方，也避免外国卖方硬做当地进口商。代价是买方承担税费和清关风险。",
          ),
        ],
      },
      {
        heading: L("Country checks before you choose", "选之前先看目的国"),
        blocks: [
          P(
            "Saudi Arabia: SABER shipment certificate, a commercial invoice and bill of lading that match, and duty plus VAT at import. Egypt: ACID before sailing, and the number must appear on the documents. Jordan: a customs declaration through the Jordanian portal and the right product documents. Djibouti: ECTN for containers unloaded there, with an exemption for direct transit to Ethiopia when the bill of lading says so. Sudan: ACD before loading, plus SSMO and an import licence for most goods.",
            "沙特：SABER 货物证书，商业发票和提单要一致，进口时缴关税和增值税。埃及：开船前办 ACID，编号要出现在单证上。约旦：通过约旦门户报关，并备好产品文件。吉布提：在当地卸货的集装箱要 ECTN；直接转运埃塞俄比亚且提单写明的可免。苏丹：装船前办 ACD，多数商品还要 SSMO 和进口许可证。",
          ),
          P(
            "The country page for each destination lists the documents and the taxes we have checked. Read it before you ask for a DDP price, because the answer changes by destination. A DDP quote for Jeddah is not a template for Sokhna, and a DAP quote for Djibouti is not a template for Port Sudan.",
            "每个目的港页面都列了我们核对过的单证和税费。问 DDP 价之前先看，因为答案随目的港变。吉达的 DDP 报价不能套到苏赫纳，吉布提的 DAP 报价也不能套到苏丹港。",
          ),
          LINKS([
            ["/shipping-from-china-to-saudi-arabia/", "Saudi Arabia: SABER and VAT", "沙特：SABER 与增值税"],
            ["/shipping-from-china-to-egypt/", "Egypt: ACID and Sokhna", "埃及：ACID 与苏赫纳"],
            ["/shipping-from-china-to-djibouti/", "Djibouti: ECTN and Ethiopia transit", "吉布提：ECTN 与埃塞转运"],
            ["/shipping-from-china-to-sudan/", "Sudan: ACD and SSMO", "苏丹：ACD 与 SSMO"],
          ]),
        ],
      },
      {
        heading: L("A landed-cost worksheet", "到岸成本工作表"),
        blocks: [
          P(
            "Build the comparison as a worksheet, not a single number. List the goods value, international freight, insurance, origin charges, destination port charges, duty, VAT, broker, inland delivery and a contingency for storage or demurrage. Next to each line, write who pays under DAP and who pays under DDP. The totals are only comparable when every line has an owner.",
            "比较要做成工作表，不要只放一个数字。列出货值、国际运费、保险、起运港费用、目的港费用、关税、增值税、报关行、内陆派送，以及一笔仓储或滞箱的预备金。每一行旁边写清 DAP 下谁付、DDP 下谁付。每一行都有归属，总数才可比。",
          ),
          P(
            "The VAT line is where many comparisons go wrong. A seller who is not registered in the destination may not be able to recover the VAT it pays on import, so the tax becomes a real cost inside the DDP price. A local buyer with a tax registration may recover it. The same duty and VAT can therefore produce different economics for the two parties. Ask whether the quote assumes recovery, and who holds the registration.",
            "增值税这一行最容易比错。卖方在目的国没有税号，进口时交的增值税可能退不回来，这笔税就成了 DDP 价格里的真实成本。当地买方有税号，可能可以抵扣。同样的关税和增值税，对两方的经济效果不同。要问报价是否假设可抵扣，以及税号在谁名下。",
          ),
          P(
            "The HS code and the declared value drive both duty and VAT. A DDP quote based on a different code, a lower value or a different product description is not comparable, even if the delivery address is the same. Keep one commercial invoice and one classification for both quotes, and put the assumed code in writing.",
            "HS 编码和申报货值同时决定关税和增值税。DDP 报价如果用了不同编码、更低货值或不同品名，哪怕送货地址一样，也不能直接比。两份报价用同一份商业发票、同一个归类，并把假设的编码写下来。",
          ),
          UL([
            ["Goods, freight and insurance.", "货值、运费和保险。"],
            ["Origin and destination charges.", "起运港和目的港费用。"],
            ["Duty, VAT and the recovery assumption.", "关税、增值税及抵扣假设。"],
            ["Broker, inland delivery and contingency.", "报关行、内陆派送和预备金。"],
          ]),
        ],
      },
      {
        heading: L("How to compare DDP and DAP quotes", "DDP 和 DAP 怎么比"),
        blocks: [
          P(
            "Put the same cargo, the same named place and the same Incoterms version in front of both quotes. Check the HS code, the declared value, the importer of record, the duty and VAT treatment, the broker, the free time and the validity. A DDP quote with a different HS code or a different delivery address is not comparable.",
            "两份报价要用同一票货、同一个指定地点、同一版 Incoterms。核对 HS 编码、申报货值、进口申报主体、关税和增值税处理、报关行、免柜期和有效期。HS 编码或送货地址不同的 DDP 报价，不能直接比。",
          ),
          P(
            "If you are the buyer and you already have a broker, ask for DAP and compare it with your own duty estimate. If you are the seller and you do not have a local importer, do not promise DDP until the broker and the importer of record are confirmed in writing. The cheapest quote is the one that does not surprise you at destination.",
            "你是买方、已经有报关行，就要 DAP，再和你自己的税费估算比。你是卖方、没有当地进口主体，就不要在报关行和进口申报主体书面确认前承诺 DDP。最好的报价，是到了目的港不给你惊喜的那份。",
          ),
        ],
      },
    ],
  },
  {
    slug: "dangerous-goods-battery-red-sea",
    tag: L("COMPLIANCE", "合规"),
    title: L("Dangerous goods and batteries to the Red Sea", "危险品与电池货出红海：先查什么？"),
    lead: L(
      "Batteries and dangerous goods need a carrier approval, the right UN number and documents before booking. Red Sea transhipment adds another check.",
      "电池和危险品订舱前要拿到船公司批复、正确的 UN 编号和单证。红海航线还要多一道中转审核。",
    ),
    published,
    updated: published,
    faqs: [
      {
        q: L("Can I ship a lithium battery in a container?", "锂电池能装柜走海运吗？"),
        a: L(
          "Sometimes, but it is not a default yes. It depends on the UN number, the battery type, the state of charge, the packaging, the carrier's acceptance and the transhipment port. A lithium battery booked as general cargo is an undeclared dangerous good, and that can stop the container at the first inspection.",
          "有时可以，但不是默认可以。要看 UN 编号、电池类型、电量、包装、船公司是否接受，以及中转港是否接受。把锂电池当普货订舱，就是未申报危险品，第一次查验就可能把柜子扣下。",
        ),
      },
      {
        q: L("Is a power bank dangerous goods?", "充电宝算危险品吗？"),
        a: L(
          "Often yes, because it contains a lithium battery. The UN number depends on whether it is shipped alone, packed with equipment or contained in equipment. The carrier will also ask for the MSDS, the UN38.3 summary and the state of charge.",
          "通常算，因为里面有锂电池。UN 编号取决于它是单独运输、与设备同箱，还是装在设备里。船公司还会要 MSDS、UN38.3 摘要和电量信息。",
        ),
      },
      {
        q: L("Do I need UN38.3 for every battery shipment?", "每票电池货都要 UN38.3 吗？"),
        a: L(
          "For lithium batteries, the UN38.3 test summary is a standard part of the file. The carrier may also ask for the test report, the packaging specification and a DG declaration. Requirements vary by carrier and route, so send the documents before you book, not after.",
          "锂电池通常都要 UN38.3 测试摘要。船公司还可能要求测试报告、包装说明和危险品申报单。不同船公司、不同航线要求不同，单证要在订舱前发，不要等订舱后再补。",
        ),
      },
    ],
    sections: [
      {
        heading: L("Why it is a separate booking", "为什么是单独订舱"),
        blocks: [
          P(
            "Dangerous goods are not a normal container booking with an extra fee. They are a separate acceptance process under the IMDG Code. The carrier has to approve the UN number, the packing, the quantity and the route. The vessel has to be allowed to carry the class, and the transhipment port has to accept it. Any one of those can say no.",
            "危险品不是普通订舱加一笔费用，而是 IMDG 规则下的一套独立接收流程。船公司要批复 UN 编号、包装、数量和航线；船舶要允许装这一类别；中转港要接受。任何一环都可以说不。",
          ),
          P(
            "That is why a dangerous goods quote can take longer than a general cargo quote. The forwarder cannot confirm space until the carrier has the DG file. If you book first and declare later, the carrier can reject the container at the gate, and the cargo may sit while you look for another vessel.",
            "所以危险品报价比普货慢。船公司拿到危险品资料之前，货代确认不了舱位。先订舱、后申报，船公司可能在闸口拒收，货就卡在那里等下一班船。",
          ),
        ],
      },
      {
        heading: L("Battery types and UN numbers", "电池类型与 UN 编号"),
        blocks: [
          P(
            "Lithium-ion and lithium-metal batteries have different UN numbers depending on how they are packed. A battery shipped alone is not the same as a battery packed with equipment or contained in equipment. The UN number on the declaration has to match the actual packing, not the product's marketing name.",
            "锂离子和锂金属电池按包装方式分不同的 UN 编号。单独运输的电池，和与设备同箱、装在设备里的电池，不是同一个编号。申报单上的 UN 编号要和实际包装一致，不能按产品的市场名称填。",
          ),
          P(
            "Other dangerous goods have their own classes and UN numbers: flammables, corrosives, oxidisers, aerosols, chemicals, vehicles and machinery with fuel or batteries. The class decides the packing, the label, the segregation and the carrier's acceptance. Do not guess the class from the product name.",
            "其他危险品有自己的类别和 UN 编号：易燃、腐蚀、氧化、气雾剂、化学品、带燃料或电池的车辆和机械。类别决定包装、标签、隔离和船公司是否接收。不要凭产品名称猜类别。",
          ),
          UL([
            ["UN3480: lithium-ion batteries shipped alone.", "UN3480：单独运输的锂离子电池。"],
            ["UN3481: lithium-ion batteries packed with or contained in equipment.", "UN3481：与设备同箱或装在设备里的锂离子电池。"],
            ["UN3090: lithium-metal batteries shipped alone.", "UN3090：单独运输的锂金属电池。"],
            ["UN3091: lithium-metal batteries packed with or contained in equipment.", "UN3091：与设备同箱或装在设备里的锂金属电池。"],
          ]),
        ],
      },
      {
        heading: L("The documents the carrier will ask for", "船公司会要的单证"),
        blocks: [
          P(
            "A typical lithium battery file includes the MSDS, the UN38.3 test summary, a dangerous goods declaration, a packing certificate, the commercial invoice and packing list, and the carrier's DG booking approval. The declaration has to be signed by a trained person, and the packing has to match the declared specification.",
            "典型的锂电池资料包括 MSDS、UN38.3 测试摘要、危险品申报单、包装证明、商业发票和装箱单，以及船公司的危险品订舱批复。申报单要由受过培训的人签署，包装要和申报规格一致。",
          ),
          P(
            "The carrier may also ask for the state of charge, the watt-hour rating, the net quantity per package, the package marks and the emergency contact. If the cargo is packed with equipment, the declaration has to say so. If the battery is damaged or defective, it is a different, harder acceptance and may be refused.",
            "船公司还可能问电量、瓦时数、每件净重、包装标记和应急联系人。与设备同箱，申报要写明。电池损坏或有缺陷，属于另一种更难接收的情形，可能直接被拒。",
          ),
          UL([
            ["MSDS and UN38.3 test summary.", "MSDS 和 UN38.3 测试摘要。"],
            ["Dangerous goods declaration and packing certificate.", "危险品申报单和包装证明。"],
            ["Commercial invoice, packing list and package marks.", "商业发票、装箱单和包装标记。"],
            ["Carrier DG approval and, where required, port approval.", "船公司危险品批复；需要时还有港口批复。"],
          ]),
        ],
      },
      {
        heading: L("Carrier and port acceptance", "船公司与港口接收"),
        blocks: [
          P(
            "Not every carrier accepts every DG class on every route. A carrier may accept a class on a direct sailing but refuse it on a service that tranships through a hub. The transhipment port can also have its own storage and segregation rules. A booking that is accepted at origin can still fail at the connection.",
            "不是每家船公司、每条航线都接所有危险品类别。某家船公司可能接受直航，但不接受经枢纽中转的同一票货。中转港还有自己的仓储和隔离规则。起运港接受的订舱，到了衔接点仍可能出问题。",
          ),
          P(
            "Expect a DG surcharge, a separate allocation and a longer cut-off. The surcharge is not the same as the ocean freight, and it can change by class, quantity and route. Ask for the DG surcharge as a line item, and ask whether the transhipment port has confirmed acceptance in writing.",
            "预期会有危险品附加费、单独舱位分配和更早的截点。附加费不等于海运费，会按类别、数量和航线变。让货代把危险品附加费单列，并确认中转港是否书面接受。",
          ),
        ],
      },
      {
        heading: L("Red Sea-specific checks", "红海航线的额外检查"),
        blocks: [
          P(
            "Red Sea routings can involve a transhipment at Jeddah, Jebel Ali, Djibouti, Colombo or Singapore. Each hub has its own DG rules. War-risk insurance and the carrier's war-risk surcharge are separate from the DG acceptance, but both can affect whether the booking is commercially viable.",
            "红海航线可能经吉达、杰贝阿里、吉布提、科伦坡或新加坡中转，每个枢纽有自己的危险品规则。战争风险保险和船公司的战争风险附加费与危险品接收是两件事，但都会影响这票货是否划算。",
          ),
          P(
            "At destination, the import rules also apply. Saudi Arabia, Egypt, Jordan, Djibouti and Sudan each have their own restricted goods, labelling and inspection requirements. A DG that is accepted by the carrier can still be stopped by the import authority if the product documents do not match.",
            "到了目的港，还有进口规则。沙特、埃及、约旦、吉布提和苏丹各有自己的限制商品、标签和检验要求。船公司接受的危险品，如果产品文件和进口要求不一致，仍可能被主管部门拦下。",
          ),
          LINKS([
            ["/guides/first-shipment-checklist/", "First shipment checklist", "首次出运清单"],
            ["/shipping-from-china-to-saudi-arabia/", "Saudi Arabia documents", "沙特单证"],
            ["/shipping-from-china-to-egypt/", "Egypt documents", "埃及单证"],
            ["/faq/", "Shipping FAQ", "海运常见问题"],
          ]),
        ],
      },
      {
        heading: L("State of charge and packing", "电量与包装"),
        blocks: [
          P(
            "State of charge is a transport condition, not a performance specification. Many carriers apply a limit to lithium-ion cells and batteries shipped alone, often 30% or less, and ask the shipper to measure and document it. A low state of charge reduces the energy available if a cell fails, but it does not make the shipment non-dangerous. The battery still needs the correct UN number, packaging and marks.",
            "电量是运输条件，不是产品性能指标。很多船公司对单独运输的锂离子电芯和电池设电量上限，常见是 30% 或更低，并要求发货人测量、记录。低电量会降低电芯失效时释放的能量，但不会把货变成非危险品。电池仍然需要正确的 UN 编号、包装和标记。",
          ),
          P(
            "Packing has to prevent short circuits and protect the terminals. That means inner packaging that holds each battery or pack in place, insulation against contact, cushioning for shock and a strong outer packaging that meets the applicable UN specification. Cells and batteries shipped alone, packed with equipment or contained in equipment each have their own packaging rules, and the marks on the box have to match the way it is packed.",
            "包装要防短路、保护端子。内包装要把每个电池或电池组固定住，做好绝缘，避免相互接触，加缓冲防震，外包装要符合适用的 UN 规格。单独运输、与设备同箱、装在设备里，三种方式的包装规则不同，箱上的标记要和实际包装方式一致。",
          ),
          P(
            "The package also carries the class 9 label and the lithium battery mark where required, plus the shipper's name and the emergency contact. An overpack needs its own mark and must not hide the labels underneath. If the cargo is mixed with equipment, the declaration has to say so, and the packing must stop the battery from moving inside the box. A photo of the actual packing is often the fastest way to settle a carrier's question.",
            "包装上还要有第 9 类标签、需要时的锂电池标记，以及发货人名称和应急联系人。外套箱有自己的标记要求，不能把里面的标签遮住。货和设备混装，申报要写明，包装要防止电池在箱内移动。实际包装的照片，往往是回答船公司疑问最快的方式。",
          ),
          UL([
            ["Measure and declare the state of charge.", "测量并申报电量。"],
            ["Protect terminals and prevent movement.", "保护端子，防止移动。"],
            ["Use the packaging and marks that match the packing method.", "包装和标记要与包装方式匹配。"],
            ["Photograph the packed carton before it is closed.", "封箱前拍下实际包装。"],
          ]),
        ],
      },
      {
        heading: L("What not to do", "不要做的事"),
        blocks: [
          P(
            "Do not book a battery or a chemical as general cargo and declare it later. Do not use the UN number from an old shipment without checking the packing and the current carrier requirements. Do not ship damaged, recalled or prototype cells without a separate acceptance. Do not assume a forwarder's verbal yes is a carrier approval.",
            "不要把电池或化学品按普货订舱、之后再申报。不要拿上一票的 UN 编号直接套，先核对包装和船公司当前要求。损坏、召回或原型电芯，不要在没有单独接收的情况下走。货代口头说可以，不等于船公司批复。",
          ),
          P(
            "If you are unsure, send the product specification, the battery type, the UN number, the MSDS, the packing photos and the route before you ask for a price. A complete file gets a real answer. A partial file gets a maybe, and a maybe is not a booking.",
            "拿不准，就在问价前把产品规格、电池类型、UN 编号、MSDS、包装照片和航线发过来。资料完整，才有真答案；资料不全，只能得到“也许”，而“也许”不是订舱。",
          ),
          UL([
            ["No undeclared batteries in general cargo.", "普货里不要夹带未申报电池。"],
            ["No damaged or recalled cells without separate acceptance.", "损坏或召回电芯，没有单独接收不要走。"],
            ["No booking without the carrier's DG approval.", "没有船公司危险品批复，不要订舱。"],
            ["No assumption that the transhipment port will accept it.", "不要假设中转港一定接收。"],
          ]),
        ],
      },
    ],
  },
  {
    slug: "port-sudan-clearance-transit-local-charges",
    tag: L("PORT GUIDE", "港口指南"),
    title: L("Port Sudan: clearance, transit and charges", "苏丹港：清关、时效与当地杂费"),
    lead: L(
      "Port Sudan has limited direct sailings, an ACD filing before loading and local charges that sit outside the ocean freight. Here is the checklist.",
      "苏丹港直航有限，装船前要办 ACD，当地杂费也不在海运费里。这篇给出清关、时效和费用的核对清单。",
    ),
    published,
    updated: published,
    faqs: [
      {
        q: L("How long does shipping from China to Port Sudan take?", "中国到苏丹港海运要多久？"),
        a: L(
          "There is no single reliable range. Direct sailings from China are limited, and much cargo tranships through Jeddah, Jebel Ali or Djibouti. The connection decides the transit, and a missed connection can add a week or more. Ask for the routing and the connection port on every quote.",
          "没有一个可靠统一的数字。中国直航有限，很多货经吉达、杰贝阿里或吉布提中转。衔接决定时效，错过衔接可能多等一周以上。每份报价都要问航线和衔接港。",
        ),
      },
      {
        q: L("What is the ACD for Sudan?", "苏丹的 ACD 是什么？"),
        a: L(
          "The Advance Cargo Declaration is a 15-digit number required for Sudan-bound cargo on vessels sailing from 1 January 2026. It must be obtained before loading in China and printed on the bill of lading. The application uses the draft bill of lading, commercial invoice, freight invoice, certificate of origin and packing list.",
          "预先货物申报（ACD）是 2026 年 1 月 1 日起开航的去苏丹货物必须办理的 15 位编号。须在中国装船前取得，并打印在提单上。申请要用提单草稿、商业发票、运费发票、原产地证和装箱单。",
        ),
      },
      {
        q: L("Are Port Sudan local charges included in the ocean rate?", "苏丹港当地费用含在海运费里吗？"),
        a: L(
          "No. The ocean rate is port-to-port freight. Port dues, terminal handling, documentation, customs broker, duty, VAT, storage, demurrage and inland transport are separate. Ask for a line-item destination quote before you compare two ocean rates.",
          "不含。海运费是港到港运费。港务费、码头操作、单证、报关行、关税、增值税、仓储、滞箱和内陆运输都另计。比较两份海运费之前，先要一份分项目的目的港报价。",
        ),
      },
    ],
    sections: [
      {
        heading: L("The short version", "先说结论"),
        blocks: [
          P(
            "Port Sudan is Sudan's working sea gateway. The country has been in armed conflict since April 2023, and the port's operating conditions can change. Direct sailings from China are limited, so much cargo is transhipped through Jeddah, Jebel Ali or Djibouti. The routing, the connection and the consignee's ability to clear and pay are part of the quote, not background information.",
            "苏丹港是目前苏丹可用的海上门户。苏丹自 2023 年 4 月起处于武装冲突中，港口运营条件可能变化。中国直航有限，很多货经吉达、杰贝阿里或吉布提中转。航线、衔接，以及收货人能否清关和付款，都是报价的一部分，不是背景信息。",
          ),
          P(
            "Before booking, confirm the port, the terminal, the banking channel and the inland leg with the consignee. A rate that works on paper can fail if the consignee cannot get the foreign exchange or the cargo cannot move inland. Ask for a written confirmation of the current situation, not an old quote from last month.",
            "订舱前，和收货人确认港口、码头、银行渠道和内陆段。纸面上成立的运价，如果收货人拿不到外汇、或者货走不了内陆，也会失败。要书面的当前情况确认，不要拿上个月的旧报价。",
          ),
        ],
      },
      {
        heading: L("Transit: why there is no single number", "时效：为什么没有统一数字"),
        blocks: [
          P(
            "A direct sailing is the short version, but direct capacity to Port Sudan is limited. A transhipment adds a hub and a connection window. If the first vessel is late, or the connection is full, the box waits. That is why a quote can say 30 days one week and 45 the next without either number being wrong.",
            "直航是短的走法，但去苏丹港的直航舱位有限。中转多一个枢纽和一个衔接窗口。第一程晚了，或者衔接舱位满了，柜子就等。所以同一票货，这周报 30 天、下周报 45 天，两个数字都可能没错。",
          ),
          P(
            "Ask which hub, which carrier, how long the connection is and what happens if the connection is missed. Ask whether the free time at destination starts on discharge or on availability, and who pays the storage if the consignee cannot take the box. Those answers decide the real transit cost.",
            "问清哪个枢纽、哪家船公司、衔接要等多久、错过衔接怎么办。问目的港免柜期是从卸船算还是从可提货算，收货人提不了柜时仓储谁付。这些答案才决定真实的时效成本。",
          ),
        ],
      },
      {
        heading: L("Documents before loading", "装船前的单证"),
        blocks: [
          P(
            "The Advance Cargo Declaration (ACD, also called ECTN) is mandatory for Sudan-bound cargo on vessels sailing from 1 January 2026. Obtain the 15-digit number before loading in China and print it on the bill of lading. The application needs the draft bill of lading, commercial invoice, freight invoice, certificate of origin and packing list.",
            "预先货物申报（ACD，也称 ECTN）对 2026 年 1 月 1 日起开航的去苏丹货物是强制要求。须在中国装船前取得 15 位编号，并打印在提单上。申请需要提单草稿、商业发票、运费发票、原产地证和装箱单。",
          ),
          P(
            "Most commercial goods also need an SSMO certificate of inspection from an authorised agency before leaving China, plus an import licence and an IM form. The consignee and the bank have their own requirements. A missing ACD or a mismatched invoice can stop the cargo before it reaches the vessel.",
            "多数商品出运前还要由授权机构出具苏丹标准计量局（SSMO）检验证书，另需进口许可证和 IM 表。收货人和银行还有各自的要求。少一个 ACD，或者发票信息不一致，货可能在装船前就被拦下。",
          ),
          UL([
            ["ACD 15-digit number, printed on the bill of lading.", "ACD 15 位编号，打印在提单上。"],
            ["Draft bill of lading, commercial invoice, freight invoice.", "提单草稿、商业发票、运费发票。"],
            ["Certificate of origin and packing list.", "原产地证和装箱单。"],
            ["SSMO inspection certificate, import licence and IM form where required.", "需要时的 SSMO 检验证书、进口许可证和 IM 表。"],
          ]),
        ],
      },
      {
        heading: L("Clearance at Port Sudan", "苏丹港清关"),
        blocks: [
          P(
            "Clearance is handled by a local broker with the consignee. The broker files the customs declaration, presents the documents, arranges inspection if required and obtains the delivery order. The consignee needs the import registration, the licence and the bank documents. The port and the terminal have their own release process.",
            "清关由当地报关行和收货人办理。报关行提交报关单、递交单证、安排查验（如需要），并取得提货单。收货人要有进口登记、许可证和银行单证。港口和码头还有自己的放货流程。",
          ),
          P(
            "Duty is 5–25% for most goods, plus 17% VAT, according to the country page. The HS code and the declared value decide the amount. A broker can give you an estimate, but the customs authority decides. Do not treat a broker's verbal estimate as a fixed landed cost.",
            "根据目的港页面，多数货物关税为 5–25%，另加 17% 增值税。HS 编码和申报货值决定金额。报关行可以给估算，但最终由海关决定。不要把报关行口头估算当成固定的到岸成本。",
          ),
        ],
      },
      {
        heading: L("Local charges: what to ask for", "当地杂费：要问哪些"),
        blocks: [
          P(
            "Local charges at Port Sudan sit outside the ocean freight. They can include port dues, terminal handling, documentation, delivery order, customs broker, inspection, storage, demurrage, detention, container deposit and inland transport. The amounts vary by terminal, container type and how long the box stays.",
            "苏丹港的当地杂费不在海运费里。可能包括港务费、码头操作、单证、提货单、报关行、查验、仓储、滞港、滞箱、柜押金和内陆运输。金额随码头、柜型和停留时间变化。",
          ),
          P(
            "Ask for a line-item destination quote, not one lump sum. Ask what is included in the terminal handling, what the free time is, when demurrage starts, and whether the consignee can pay in local currency. A cheap ocean rate with a large, undisclosed destination charge is not a cheap route.",
            "要分项目的目的港报价，不要一个总数。问码头操作含什么、免柜期多久、滞箱从哪天算、收货人能否用当地货币支付。海运费便宜、目的港却有一大笔没说清的费用，不是便宜的航线。",
          ),
          UL([
            ["Port dues and terminal handling.", "港务费和码头操作。"],
            ["Documentation, delivery order and broker fees.", "单证、提货单和报关行费用。"],
            ["Inspection, storage and demurrage/detention.", "查验、仓储和滞港/滞箱。"],
            ["Container deposit and inland transport.", "柜押金和内陆运输。"],
          ]),
        ],
      },
      {
        heading: L("Conflict, banking and the inland leg", "冲突、银行与内陆段"),
        blocks: [
          P(
            "Sudan has been in armed conflict since April 2023, and the operating picture can change faster than a shipping schedule. Port operations, inland roads, border crossings and banking services may be affected in different ways at the same time. Check the current status with the carrier, the local broker and the consignee before each shipment. A route that worked two months ago is not evidence that it works this month.",
            "苏丹自 2023 年 4 月起处于武装冲突中，运营情况可能比船期变得更快。港口作业、内陆道路、边境口岸和银行服务可能同时受到不同影响。每票货出运前，向船公司、当地报关行和收货人确认当前状态。两个月前能走的路线，不代表这个月还能走。",
          ),
          P(
            "Banking is part of the routing. The consignee needs the foreign exchange and the payment channel to release the documents and pay the destination charges. If the bank cannot transfer or the importer cannot obtain FX, the cargo can arrive and still not move. Ask the consignee to confirm the bank, the account and the payment steps in writing, and ask whether the bank requires a specific document set before it releases the bill of lading.",
            "银行是航线的一部分。收货人要有外汇和付款渠道，才能赎单、支付目的港费用。银行转不出钱，或者进口商拿不到外汇，货到了也动不了。让收货人书面确认银行、账户和付款步骤，并问清银行放提单前是否需要特定单证。",
          ),
          P(
            "The inland leg from Port Sudan to Khartoum and other cities is a separate operation with its own risk and cost. Roads, checkpoints and fuel availability can change. Insurance may exclude war and related risks, so confirm the cover with the insurer, not only the freight forwarder. If the consignee cannot arrange the inland leg, the container may sit at the port and storage will start.",
            "从苏丹港到喀土穆和其他城市的内陆段，是另一套操作，有自己的风险和成本。道路、检查站和燃油供应都可能变化。保险可能排除战争及相关风险，要向保险方确认承保范围，不要只问货代。收货人安排不了内陆段，柜子就可能压在港口，仓储开始计费。",
          ),
          UL([
            ["Confirm the port and terminal status before booking.", "订舱前确认港口和码头状态。"],
            ["Confirm the consignee's bank, FX and document release steps.", "确认收货人的银行、外汇和放单步骤。"],
            ["Name the inland carrier and the delivery point.", "明确内陆承运人和交货地点。"],
            ["Check war-risk cover with the insurer.", "向保险方核对战争风险承保范围。"],
          ]),
        ],
      },
      {
        heading: L("A booking checklist", "订舱清单"),
        blocks: [
          P(
            "Before you confirm, put these in writing: the port and terminal, the routing and connection, the transit range, the ACD number and who files it, the SSMO and import licence status, the consignee's bank and import registration, the destination charges by line, the free time, and the plan if the connection is missed. Send the completed checklist to the broker and the carrier well before the cargo-ready date so any gap can be fixed.",
            "确认之前，把这些写下来：港口和码头、航线和衔接、时效区间、ACD 编号及由谁办理、SSMO 和进口许可证状态、收货人的银行和进口登记、分项目的目的港费用、免柜期，以及错过衔接的预案。把填好的清单在备货日前发给报关行和船公司，留出补漏时间。",
          ),
          P(
            "If any line is missing, ask before the cargo leaves the factory. Port Sudan is not a route where a verbal promise is enough. The country page lists the documents we have checked, and the route pages show the current market reading by origin.",
            "少任何一行，就在货离开工厂前问。苏丹港不是靠口头承诺就能走的航线。目的港页面列了我们核对过的单证，路线页面显示各起运港的当前市场读数。",
          ),
          LINKS([
            ["/shipping-from-china-to-sudan/", "China to Sudan country page", "中国到苏丹目的港页"],
            ["/shipping-from-shanghai-to-port-sudan/", "Shanghai to Port Sudan route", "上海到苏丹港航线"],
            ["/guides/first-shipment-checklist/", "First shipment checklist", "首次出运清单"],
            ["/faq/", "Shipping FAQ", "海运常见问题"],
          ]),
        ],
      },
    ],
  },
  {
    slug: "djibouti-clearance-transit-local-charges",
    tag: L("PORT GUIDE", "港口指南"),
    title: L("Djibouti: clearance, transit and charges", "吉布提：清关、时效与当地杂费"),
    lead: L(
      "Djibouti is the gateway for Ethiopia and a transhipment hub for the region. The ECTN, the Ethiopia transit route and the local charges decide the real cost.",
      "吉布提是埃塞俄比亚的门户，也是区域中转枢纽。ECTN、埃塞过境路线和当地杂费决定真实成本。",
    ),
    published,
    updated: published,
    faqs: [
      {
        q: L("How long does shipping from China to Djibouti take?", "中国到吉布提海运要多久？"),
        a: L(
          "Allow about 19–24 days for a direct sailing and 25–30 days with one transhipment, plus clearance and the inland leg. From Djibouti to Addis Ababa, the rail takes about 12–15 hours and the road about 2–5 days. The Ethiopia import licence and foreign exchange can add time before the cargo moves.",
          "直航约 19–24 天，一次中转约 25–30 天，另加清关和内陆段。吉布提至亚的斯亚贝巴，铁路约 12–15 小时，公路约 2–5 天。埃塞进口许可证和外汇可能让货在转运前多等。",
        ),
      },
      {
        q: L("Do I need an ECTN for Djibouti?", "去吉布提需要 ECTN 吗？"),
        a: L(
          "Yes, since 15 June 2023. The ECTN must be obtained before loading and the number shown on the bill of lading. Cargo in direct transit to Ethiopia is exempt when the bill of lading states “In transit to Ethiopia” and the consignee is in Ethiopia. The exemption is documentary, so the wording must be exact.",
          "需要，自 2023 年 6 月 15 日起。ECTN 须在装船前取得，编号显示在提单上。直接过境到埃塞俄比亚的货物，在提单注明“In transit to Ethiopia”且收货人在埃塞俄比亚时可豁免。豁免是单证层面的，措辞必须准确。",
        ),
      },
      {
        q: L("Are Djibouti local charges included in the ocean rate?", "吉布提当地费用含在海运费里吗？"),
        a: L(
          "No. Port dues, terminal handling, documentation, ECTN fee, broker, storage, demurrage, container deposit and the inland or rail leg are separate. Ask for a line-item quote that separates Djibouti port charges from the Ethiopia transit cost.",
          "不含。港务费、码头操作、单证、ECTN 费、报关行、仓储、滞箱、柜押金和内陆或铁路段都另计。要一份把吉布提港杂费和埃塞过境成本分开列出的分项报价。",
        ),
      },
    ],
    sections: [
      {
        heading: L("The short version", "先说结论"),
        blocks: [
          P(
            "Djibouti serves its own market and, more importantly, the Ethiopian hinterland. Most cargo moving to Addis Ababa enters through Djibouti and continues by rail or road, often via the Modjo dry port. The port is also a transhipment hub for Red Sea and East African destinations, so the same terminal handles local, transit and transhipment cargo.",
            "吉布提服务本国市场，更重要的是服务埃塞俄比亚腹地。去亚的斯亚贝巴的货大多经吉布提入境，再走铁路或公路，常经 Modjo 陆港。吉布提港也是红海和东非目的地的中转枢纽，同一个码头要处理本地、过境和中转货。",
          ),
          P(
            "The ocean rate is only the first line. The ECTN, the Ethiopia import licence and foreign exchange, the transit corridor and the local charges decide whether the cargo arrives on budget. Ask for the destination quote in two parts: Djibouti port and the onward leg.",
            "海运费只是第一行。ECTN、埃塞进口许可证和外汇、过境走廊和当地杂费，才决定货是否在预算内到。目的港报价要分两部分要：吉布提港和后续段。",
          ),
        ],
      },
      {
        heading: L("Transit and the Ethiopia corridor", "时效与埃塞走廊"),
        blocks: [
          P(
            "From China, allow about 19–24 days to Djibouti on a direct sailing and 25–30 days with one transhipment, plus clearance. From Djibouti to Addis Ababa, the rail takes about 12–15 hours and the road about 2–5 days, depending on the border and the corridor. These are sailing and transport times, not a door-to-door promise.",
            "从中国到吉布提，直航约 19–24 天，一次中转约 25–30 天，另加清关。吉布提至亚的斯亚贝巴，铁路约 12–15 小时，公路约 2–5 天，取决于口岸和走廊。这些是航程和运输时间，不是门到门承诺。",
          ),
          P(
            "The Ethiopia import licence and foreign exchange are often the real constraint. The consignee needs the licence, the bank permit and the FX before the cargo can be cleared for transit. If those are not ready, the box waits at Djibouti and storage starts. Confirm the documents before booking, not after arrival.",
            "埃塞进口许可证和外汇往往才是真正的瓶颈。收货人要有许可证、银行许可和外汇，货才能办过境。这些没准备好，柜子就在吉布提等，仓储开始计费。订舱前确认单证，不要等到港后。",
          ),
        ],
      },
      {
        heading: L("Documents before loading", "装船前的单证"),
        blocks: [
          P(
            "The ECTN is required for Djibouti-bound cargo since 15 June 2023. Obtain it before loading and show the number on the bill of lading. The application typically needs the bill of lading, commercial invoice, packing list, certificate of origin and freight invoice. A mismatch between the ECTN and the bill of lading can stop the cargo.",
            "去吉布提的货物自 2023 年 6 月 15 日起需要 ECTN。装船前取得，并在提单上显示编号。申请通常需要提单、商业发票、装箱单、原产地证和运费发票。ECTN 与提单信息不一致，货可能被拦。",
          ),
          P(
            "For cargo in direct transit to Ethiopia, the ECTN is exempt when the bill of lading states “In transit to Ethiopia” and the consignee is in Ethiopia. The exemption is checked on the documents, so the exact wording and the consignee's details matter. Do not assume a verbal instruction is enough.",
            "直接过境到埃塞俄比亚的货物，提单注明“In transit to Ethiopia”且收货人在埃塞俄比亚时，可免 ECTN。豁免按单证审核，措辞和收货人信息都要准确。不要以为口头说明就够了。",
          ),
          UL([
            ["ECTN number, or the exact Ethiopia transit wording on the bill of lading.", "ECTN 编号，或提单上准确的埃塞过境措辞。"],
            ["Bill of lading, commercial invoice, packing list, certificate of origin.", "提单、商业发票、装箱单、原产地证。"],
            ["Ethiopia import licence and bank permit/FX where the cargo moves to Ethiopia.", "货去埃塞俄比亚时的进口许可证和银行许可/外汇。"],
            ["Freight invoice and any certificate required for the commodity.", "运费发票和商品所需的证书。"],
          ]),
        ],
      },
      {
        heading: L("Clearance at Djibouti", "吉布提清关"),
        blocks: [
          P(
            "A local broker files the declaration with the consignee and obtains the delivery order. Local cargo is cleared into Djibouti. Transit cargo to Ethiopia is cleared under the transit regime and moves by rail or road, often through Modjo. The broker needs the ECTN, the bill of lading, the invoice, the packing list and the transit documents.",
            "当地报关行和收货人提交报关，取得提货单。本地货清关进入吉布提。去埃塞俄比亚的过境货按过境制度清关，走铁路或公路，常经 Modjo。报关行需要 ECTN、提单、发票、装箱单和过境单证。",
          ),
          P(
            "Ask the broker to confirm the corridor, the border post and the rail or road schedule before the cargo arrives. Ask who handles the Ethiopia side and who pays the storage if the transit documents are incomplete. The port and the corridor are two different operations, and both need an owner.",
            "货到前，让报关行确认走廊、口岸和铁路或公路班期。问埃塞一侧由谁处理、过境单证不齐时仓储谁付。港口和走廊是两套操作，都要有负责人。",
          ),
        ],
      },
      {
        heading: L("Local charges: what to ask for", "当地杂费：要问哪些"),
        blocks: [
          P(
            "Djibouti local charges sit outside the ocean freight. They can include port dues, terminal handling, documentation, ECTN fee, delivery order, broker, inspection, storage, demurrage, detention, container deposit and the onward rail or road leg. The amounts vary by terminal, container type and dwell time.",
            "吉布提当地杂费不在海运费里。可能包括港务费、码头操作、单证、ECTN 费、提货单、报关行、查验、仓储、滞港、滞箱、柜押金和后续铁路或公路段。金额随码头、柜型和停留时间变化。",
          ),
          P(
            "Ask for the Djibouti port charges and the Ethiopia transit charges as separate lines. Ask what the ECTN fee covers, what the free time is, when storage starts, and whether the rail or road rate includes the border and the dry port. A single lump sum hides the part that will grow.",
            "吉布提港杂费和埃塞过境费要分开列。问 ECTN 费含什么、免柜期多久、仓储从哪天算、铁路或公路价是否含口岸和陆港。一个总数会把以后会涨的那部分藏起来。",
          ),
          UL([
            ["Port dues and terminal handling.", "港务费和码头操作。"],
            ["Documentation, ECTN and broker fees.", "单证、ECTN 和报关行费用。"],
            ["Storage, demurrage and detention.", "仓储、滞港和滞箱。"],
            ["Container deposit, rail or road to the dry port.", "柜押金、铁路或公路到陆港。"],
          ]),
        ],
      },
      {
        heading: L("The last mile: rail, road and Modjo", "最后一程：铁路、公路与 Modjo"),
        blocks: [
          P(
            "From Djibouti, the container can continue by rail or road. The rail leg to Addis Ababa takes about 12–15 hours, but the total door-to-door time includes the terminal handling at both ends, the train schedule and the clearance at Modjo. The road leg takes about 2–5 days and is more flexible on timing, but it depends on the border, the corridor and the truck available. Neither option is automatically cheaper; the cargo, the volume and the delivery point decide.",
            "从吉布提出来，柜子可以走铁路或公路。铁路到亚的斯亚贝巴约 12–15 小时，但门到门总时长还要加两端的码头操作、班列计划和 Modjo 的清关。公路约 2–5 天，时间上更灵活，但取决于口岸、走廊和可用车辆。两种方式没有绝对的便宜，货种、货量和送货点决定选择。",
          ),
          P(
            "Modjo is a dry port, not a final destination. Cargo can be cleared there and then delivered locally, or moved onward. The consignee needs a broker who can handle the dry-port release, and the trucker needs the right documents to collect the container. If the container is not returned within the free time, detention continues even after the cargo is unloaded. Ask who is responsible for the empty return and where it goes.",
            "Modjo 是陆港，不是最终目的地。货可以在那里清关后再本地派送，也可以继续转运。收货人要有能处理陆港放货的报关行，拖车要有正确单证才能提柜。柜子没有在免柜期内还回，哪怕货已经卸了，滞箱费还会继续。要问清空柜由谁负责还、还到哪里。",
          ),
          P(
            "The Ethiopia-side broker and the Djibouti-side broker are often different companies. Make one of them the owner of the full chain, or define the handover point in writing. The most common failure is not the ocean leg; it is a document that arrives after the container, or a truck that cannot cross because the transit paper is wrong. Put the handover point, the contact and the document list in the booking confirmation.",
            "埃塞一侧的报关行和吉布提一侧的报关行，往往是两家公司。让其中一家负责全链条，或者把交接点写清楚。最常见的失败不在海上，而是单证比柜子晚到，或者过境纸错了、车过不了口岸。把交接点、联系人和单证清单写进订舱确认。",
          ),
          UL([
            ["Rail: faster line-haul, fixed schedule, terminal handling at both ends.", "铁路：干线快、班期固定，两端有码头操作。"],
            ["Road: flexible, but border and corridor time vary.", "公路：灵活，但口岸和走廊时间会变。"],
            ["Modjo: clearance and release, not the final address.", "Modjo：清关和放货点，不是最终地址。"],
            ["Empty return: confirm who returns the box and by when.", "空柜：确认谁还、什么时候还。"],
          ]),
        ],
      },
      {
        heading: L("A booking checklist", "订舱清单"),
        blocks: [
          P(
            "Before you confirm, put these in writing: the ECTN status or the Ethiopia transit wording, the bill of lading details, the import licence and FX status, the corridor and border post, the rail or road schedule, the destination charges by line, the free time, and who handles the Ethiopia side.",
            "确认之前，把这些写下来：ECTN 状态或埃塞过境措辞、提单信息、进口许可证和外汇状态、走廊和口岸、铁路或公路班期、分项目的目的港费用、免柜期，以及埃塞一侧由谁负责。",
          ),
          P(
            "If the cargo is for Ethiopia, treat the Djibouti port and the corridor as one plan with two owners. If the cargo is for Djibouti itself, confirm the local clearance and delivery address. The country page and the route pages give the current reading and the documents we have checked.",
            "货去埃塞俄比亚，就把吉布提港和走廊当成一个计划、两个负责人。货去吉布提本地，就确认本地清关和送货地址。目的港页面和路线页面给出当前市场读数和我们核对过的单证。",
          ),
          LINKS([
            ["/shipping-from-china-to-djibouti/", "China to Djibouti country page", "中国到吉布提目的港页"],
            ["/shipping-from-ningbo-to-djibouti/", "Ningbo to Djibouti route", "宁波到吉布提航线"],
            ["/guides/first-shipment-checklist/", "First shipment checklist", "首次出运清单"],
            ["/faq/", "Shipping FAQ", "海运常见问题"],
          ]),
        ],
      },
    ],
  },
];
