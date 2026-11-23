import type { Guide } from "./content.ts";

const L = (en: string, zh: string) => ({ en, zh });
const P = (en: string, zh: string) => ({ kind: "p" as const, text: L(en, zh) });
const UL = (items: [string, string][]) => ({ kind: "ul" as const, items: items.map(([en, zh]) => L(en, zh)) });
const LINKS = (items: [string, string, string][]) => ({
  kind: "links" as const,
  items: items.map(([href, en, zh]) => ({ href, text: L(en, zh) })),
});

const published = "2026-11-23";

export const comparisonGuides: Guide[] = [
  {
    slug: "red-sea-vs-jebel-ali",
    tag: L("DECISION", "决策"),
    title: L("Red Sea vs Jebel Ali: Which Gateway?", "红海还是杰贝阿里：怎么选门户？"),
    lead: L(
      "Jebel Ali is in Dubai, not on the Red Sea. The right gateway depends on the final address, the import regime and the inland leg.",
      "杰贝阿里在迪拜，不在红海。选门户要看最终地址、进口制度和内陆段，不能只看海运费。",
    ),
    published,
    updated: published,
    faqs: [
      {
        q: L("Is Jebel Ali a Red Sea port?", "杰贝阿里是红海港口吗？"),
        a: L(
          "No. Jebel Ali is in Dubai, in the United Arab Emirates. It is a major hub for the UAE and for transhipment, but it is not one of the five Red Sea destinations on this site. A Jebel Ali quote is not a substitute for a Jeddah, Sokhna, Aqaba, Djibouti or Port Sudan quote.",
          "不是。杰贝阿里在阿联酋迪拜，是阿联酋和转口的重要枢纽，但不是本站五个红海目的港之一。杰贝阿里报价不能替代吉达、苏赫纳、亚喀巴、吉布提或苏丹港报价。",
        ),
      },
      {
        q: L("Can I use Jebel Ali for Saudi cargo?", "去沙特的货能走杰贝阿里吗？"),
        a: L(
          "It can be part of a routing, but it is not the same product as Jeddah. Cargo would need a UAE customs entry or a transit regime, then a road leg into Saudi Arabia, with Saudi import clearance at the border. Compare the total cost and the customs risk with a direct Jeddah quote before choosing.",
          "可以作为航线的一部分，但和吉达不是同一个产品。货要先在阿联酋清关或走过境，再陆运进沙特，在边境完成沙特进口清关。选择前把总成本和海关风险与吉达直航报价一起比。",
        ),
      },
      {
        q: L("Which gateway is cheaper?", "哪个门户更便宜？"),
        a: L(
          "There is no general answer. A Jebel Ali ocean rate may look lower, but the UAE charges, the inland leg and the second customs regime can add more. A Red Sea port may have a higher ocean line but a shorter inland leg and one import file. Compare the delivered cost to the final address.",
          "没有统一答案。杰贝阿里海运费可能看起来低，但阿联酋费用、内陆段和第二套海关制度可能加得更多。红海港口海运费可能高，但内陆段短、只有一套进口文件。比到最终地址的总成本。",
        ),
      },
    ],
    sections: [
      {
        heading: L("They are not the same product", "不是同一个产品"),
        blocks: [
          P(
            "Jebel Ali is a UAE port in Dubai. Jeddah, Sokhna, Aqaba, Djibouti and Port Sudan are Red Sea ports in five different countries. The ocean leg may start from the same Chinese origin, but the destination country, the import regime, the duty, the documents and the inland leg are different. A quote to Jebel Ali and a quote to Jeddah answer different questions, even if both say “Middle East”.",
            "杰贝阿里是阿联酋迪拜的港口。吉达、苏赫纳、亚喀巴、吉布提和苏丹港是五个不同国家的红海港口。海上段可能从同一个中国起运港出发，但目的国、进口制度、关税、单证和内陆段都不同。杰贝阿里报价和吉达报价回答的是不同问题，哪怕都写着“中东”。",
          ),
          P(
            "The first question is the final address, not the port. If the warehouse is in Dubai, Jebel Ali is the natural gateway. If it is in Riyadh, Jeddah is the Red Sea gateway; Jebel Ali plus a truck is a different routing with a different customs file. If it is in Cairo, Sokhna is the Red Sea port. If it is in Amman, Aqaba. If it is in Addis Ababa, Djibouti. If it is in Khartoum, Port Sudan.",
            "第一个问题是最终地址，不是港口。仓库在迪拜，杰贝阿里是自然门户。仓库在利雅得，吉达是红海门户；杰贝阿里加拖车是另一条航线、另一套海关文件。仓库在开罗，苏赫纳是红海港口。在安曼，亚喀巴。在亚的斯亚贝巴，吉布提。在喀土穆，苏丹港。",
          ),
        ],
      },
      {
        heading: L("When Jebel Ali wins", "什么时候选杰贝阿里"),
        blocks: [
          P(
            "Jebel Ali is the right choice when the final destination is in the UAE, or when the cargo is genuinely transhipping through the UAE to another market. It has frequent sailings, a large hub network and a mature Dubai trading ecosystem. The site's Jebel Ali page lists a 26-day direct sailing from China and a separate market reference; it is deliberately outside the Red Sea index because it is a different destination.",
            "最终目的地在阿联酋，或者货确实要经阿联酋转口到其他市场，杰贝阿里才合适。它船期密、枢纽网络大、迪拜贸易生态成熟。本站杰贝阿里页面列了 26 天直航和单独的市场参考；它不属于红海指数，因为目的地不同。",
          ),
          P(
            "Jebel Ali can also be a transhipment hub for Red Sea cargo, but that is a routing decision, not a final destination. If the box is transhipped at Jebel Ali and then moves to a Red Sea port, the quote should name the connection and the final port. Do not compare the Jebel Ali ocean leg with a Red Sea door price as if they were the same.",
            "杰贝阿里也可以做红海货的中转枢纽，但那是航线选择，不是最终目的地。柜子在杰贝阿里中转、再运到红海港口，报价要写清衔接和最终目的港。不要把杰贝阿里海上段和红海到门价比成同一个产品。",
          ),
          UL([
            ["Final address in the UAE: Jebel Ali is the natural port.", "最终地址在阿联酋：杰贝阿里是自然门户。"],
            ["Transhipment through the UAE: name the final port and connection.", "经阿联酋转口：写清最终目的港和衔接。"],
            ["Dubai trading or free-zone cargo: confirm the customs regime.", "迪拜贸易或自由区货：确认海关制度。"],
            ["Do not treat Jebel Ali as a Saudi or Egyptian destination.", "不要把杰贝阿里当成沙特或埃及目的港。"],
          ]),
        ],
      },
      {
        heading: L("When a Red Sea port wins", "什么时候选红海港口"),
        blocks: [
          P(
            "A Red Sea port wins when the final address is in its hinterland and the cargo can clear there. Jeddah serves Saudi Arabia; Sokhna serves Egypt; Aqaba serves Jordan; Djibouti serves Djibouti and Ethiopia; Port Sudan serves Sudan. A direct call to that port avoids a second customs regime and an extra inland leg. For time-sensitive cargo, that can matter more than a lower ocean line through a hub.",
            "最终地址在港口腹地、且能在那里清关，红海港口就赢。吉达服务沙特，苏赫纳服务埃及，亚喀巴服务约旦，吉布提服务吉布提和埃塞俄比亚，苏丹港服务苏丹。直挂该港可以少一套海关制度、少一段内陆运输。时效紧的货，这可能比经枢纽的低海运费更重要。",
          ),
          P(
            "The Red Sea port is not automatically cheaper. War-risk surcharges, congestion and a shorter free time can make it more expensive than a Jebel Ali routing on paper. The point is to compare the delivered cost and the risk, not the ocean line. A port with a direct call but no empty equipment or no truck is not a working option.",
            "红海港口不一定更便宜。战争风险附加费、拥堵和较短的免柜期，可能让它在纸面上比杰贝阿里路线更贵。要比到门成本和风险，不是比海运费。有直航、但没箱源或没拖车的港口，不是可执行的选项。",
          ),
          UL([
            ["Saudi Arabia: Jeddah is the Red Sea gateway.", "沙特：吉达是红海门户。"],
            ["Egypt: Sokhna serves Cairo and the Suez zone.", "埃及：苏赫纳服务开罗和苏伊士区。"],
            ["Jordan: Aqaba is the only seaport.", "约旦：亚喀巴是唯一海港。"],
            ["Djibouti/Ethiopia: Djibouti is the gateway; Modjo is the dry port.", "吉布提/埃塞：吉布提是门户，Modjo 是陆港。"],
            ["Sudan: Port Sudan is the working gateway.", "苏丹：苏丹港是可用门户。"],
          ]),
        ],
      },
      {
        heading: L("The total cost comparison", "总成本怎么比"),
        blocks: [
          P(
            "Build the comparison from the factory to the final address. Include origin charges, ocean freight, war risk, destination port charges, customs broker, duty, VAT, inland trucking, insurance and the cost of one extra week of transit. For Jebel Ali plus a road into Saudi Arabia, add the UAE entry or transit cost, the border clearance and the Saudi inland leg. For a Red Sea port, add the local delivery and any storage.",
            "从工厂算到最终地址。包括起运港费用、海运费、战争风险、目的港费用、报关行、关税、增值税、内陆拖车、保险和多一周时效的成本。杰贝阿里加陆运进沙特，还要加阿联酋进口或过境费用、边境清关和沙特内陆段。红海港口则加本地派送和可能的仓储。",
          ),
          P(
            "Do not compare a port-to-port ocean rate with a door price. Do not compare a Jebel Ali quote that stops at the UAE border with a Jeddah quote that includes Saudi clearance. Put the same Incoterms, the same HS code, the same delivery address and the same free time in front of both. If one quote has a different scope, the difference is not a saving; it is a missing line.",
            "不要拿港到港海运费和到门价比。不要拿只到阿联酋边境的杰贝阿里报价，和含沙特清关的吉达报价比。两份报价用同一贸易条款、同一 HS 编码、同一送货地址和同一免柜期。口径不同，差额不是省钱，是少了一行。",
          ),
        ],
      },
      {
        heading: L("Cargo, risk and documentation", "货物、风险与单证"),
        blocks: [
          P(
            "Jebel Ali and the Red Sea ports have different import rules. Saudi Arabia needs SABER; Egypt needs ACID; Jordan needs its own customs declaration and product approvals; Djibouti needs ECTN, with an exemption for Ethiopia transit; Sudan needs ACD and SSMO. A Jebel Ali routing may need a UAE entry or a transit bond, plus the destination country's import file. Two customs regimes mean two sets of documents.",
            "杰贝阿里和红海港口的进口规则不同。沙特要 SABER，埃及要 ACID，约旦有自己的报关和产品批准，吉布提要 ECTN（埃塞过境可免），苏丹要 ACD 和 SSMO。杰贝阿里路线可能要阿联酋进口或过境保函，再加目的国的进口文件。两套海关制度就是两套单证。",
          ),
          P(
            "For dangerous goods, batteries and high-value cargo, the extra handover is a risk. A Jebel Ali transhipment may accept a class that a Red Sea feeder does not, or the other way around. Ask each carrier and each port. For high-value cargo, the security and insurance of the inland leg matter as much as the ocean leg.",
            "危险品、电池和高价值货，多一次交接就是多一个风险。杰贝阿里中转接受的类别，红海支线可能不接受，反过来也一样。船公司和港口要分别问。高价值货，内陆段的安保和保险和海上段一样重要。",
          ),
        ],
      },
      {
        heading: L("A decision checklist", "决策清单"),
        blocks: [
          P(
            "Write down the final address, the importer, the HS code, the Incoterms, the delivery date and the free time. Then ask for two quotes: one to the Red Sea port and one to Jebel Ali, each with the full scope to the final address. If the Jebel Ali quote stops at the UAE, ask for the border and inland lines. If the Red Sea quote stops at the port, ask for the delivery line.",
            "写下最终地址、进口商、HS 编码、贸易条款、交期和免柜期。然后要两份报价：一份到红海港口，一份到杰贝阿里，都要含到最终地址的完整范围。杰贝阿里报价只到阿联酋，就补边境和内陆段；红海报价只到港口，就补派送段。",
          ),
          P(
            "Choose the route with the lower delivered cost and the risk you can manage. If the cargo is time-sensitive, a direct Red Sea call may win even at a higher ocean rate. If the final address is in Dubai, Jebel Ali wins. If the final address is in Saudi Arabia, compare Jeddah with Jebel Ali plus road only when you have the full customs and inland numbers. The port name is not the answer; the final address is the answer, not the port name. The final address decides the route, not the port name.",
            "选到门成本更低、风险你能管的那条。货急，红海直航哪怕海运费高也可能赢。最终地址在迪拜，杰贝阿里赢。最终地址在沙特，只有在拿到完整海关和内陆数字后，才把吉达和杰贝阿里加陆运放在一起比。港口名字不是答案，最终地址才是。最终地址决定路线，不是港口名字。",
          ),
          LINKS([
            ["/jebel-ali/", "Jebel Ali rates and transit", "杰贝阿里运价与航程"],
            ["/shipping-from-china-to-saudi-arabia/", "Jeddah rates and SABER", "吉达运价与 SABER"],
            ["/shipping-from-china-to-egypt/", "Sokhna rates and ACID", "苏赫纳运价与 ACID"],
            ["/guides/direct-vs-transhipment-red-sea/", "Direct vs transhipment", "直航与中转怎么选"],
            ["/faq/", "Shipping FAQ", "海运常见问题"],
          ]),
        ],
      },
    ],
  },
  {
    slug: "direct-vs-transhipment-red-sea",
    tag: L("DECISION", "决策"),
    title: L("Direct vs Transhipment to the Red Sea", "直航还是中转：红海出货怎么选？"),
    lead: L(
      "Direct and transhipment are different products. Direct is not always faster, and transhipment is not always cheaper. Compare the connection and total cost.",
      "直航和中转是两种产品。直航不一定更快，中转也不一定更便宜。要比衔接、免柜期和总成本。",
    ),
    published,
    updated: published,
    faqs: [
      {
        q: L("Is a direct sailing always faster?", "直航一定更快吗？"),
        a: L(
          "No. A direct sailing can be delayed, full or omit a port, while a clean transhipment can arrive earlier. Compare the actual arrival window, not the label. Ask for the vessel, the ETD and the connection if the quote is not direct.",
          "不一定。直航可能延误、满舱或跳港，衔接顺的中转反而更早到。比实际到货窗口，不要只看标签。问船名、ETD，中转还要问衔接。",
        ),
      },
      {
        q: L("Is transhipment always cheaper?", "中转一定更便宜吗？"),
        a: L(
          "No. The ocean line may be lower, but the extra handover can add destination charges, storage and a longer free-time risk. A cheap transhipment with a missed connection can cost more than a direct sailing. Compare the total delivered cost.",
          "不一定。海运费可能低，但多一次交接会增加目的港费用、仓储和免柜期风险。中转便宜、却错过衔接，可能比直航更贵。要比到门总成本。",
        ),
      },
      {
        q: L("Which is better for dangerous goods?", "危险品选哪种？"),
        a: L(
          "It depends on the carrier and the hub. A direct sailing has fewer handovers, which is usually simpler for DG, but the direct vessel may not accept the class. A transhipment needs the hub to accept it too. Ask both carriers and confirm the routing in writing.",
          "看船公司和枢纽。直航交接少，通常对危险品更简单，但直航船不一定接受该类别。中转还要枢纽接受。两家船公司都要问，航线要书面确认。",
        ),
      },
    ],
    sections: [
      {
        heading: L("What the two products mean", "两种产品是什么"),
        blocks: [
          P(
            "A direct sailing carries the container from the Chinese origin to the Red Sea destination on one vessel. A transhipment carries it on a first vessel to a hub, then on a second vessel to the destination. The hub can be Jeddah, Jebel Ali, Djibouti, Colombo, Singapore or another port. The connection is the time the box waits at the hub, and it is part of the transit.",
            "直航是同一艘船把柜子从中国起运港运到红海目的港。中转是第一艘船先运到枢纽，再换第二艘船到目的港。枢纽可能是吉达、杰贝阿里、吉布提、科伦坡、新加坡或其他港口。衔接是柜子在枢纽等待的时间，也是航程的一部分。",
          ),
          P(
            "A feeder is not the same as a transhipment, but it has the same effect for the shipper: an extra handover. A feeder may move the box from Ningbo to Shanghai, or from Qingdao to a larger load port, before the ocean vessel. Ask whether the quote includes a feeder, a transhipment, or both. Each handover has a cut-off and a responsibility gap.",
            "支线不等同于中转，但对货主的影响一样：多一次交接。支线可能把柜子从宁波驳到上海，或从青岛驳到更大的装货港，再上海洋船。问报价含的是支线、中转，还是两者都有。每次交接都有截点和责任空档。",
          ),
        ],
      },
      {
        heading: L("When direct wins", "什么时候直航赢"),
        blocks: [
          P(
            "Direct wins when the cargo is time-sensitive, high-value, fragile or dangerous. Fewer handovers mean fewer chances for a delay, a document mismatch or damage. Direct also wins when the destination free time is short: a transhipment can eat several days at the hub before the box even arrives. For a project cargo or a production line, the simpler routing is often worth a higher ocean line.",
            "货急、价值高、易碎或属于危险品，直航赢。交接少，延误、单证不一致或货损的机会就少。目的港免柜期短，直航也赢：中转可能在枢纽先吃掉几天，柜子还没到。项目货或生产线用料，简单的航线往往值更高的海运费。",
          ),
          P(
            "Direct is not a guarantee. A direct vessel can be late, full or omit a port, and a direct quote can still have a feeder at the origin. Ask what “direct” means in the quote: one vessel from the named origin to the named destination, or a feeder plus one ocean vessel. If the quote cannot name the vessel and the routing, the label is doing too much work.",
            "直航不是保证。直航船也可能晚、满舱或跳港，直航报价也可能含起运港支线。问清报价里的“直航”是什么意思：从指定起运港到指定目的港一条船，还是支线加一条海洋船。报价说不出船名和航线，这个标签就不可靠。",
          ),
          UL([
            ["Time-sensitive or high-value cargo: fewer handovers.", "时效紧或高价值货：交接少。"],
            ["Dangerous goods: confirm the direct vessel accepts the class.", "危险品：确认直航船接受该类别。"],
            ["Short free time: direct avoids hub waiting.", "免柜期短：直航避免枢纽等待。"],
            ["Project cargo: one vessel is easier to control.", "项目货：一条船更好控制。"],
          ]),
        ],
      },
      {
        heading: L("When transhipment wins", "什么时候中转赢"),
        blocks: [
          P(
            "Transhipment wins when there is no direct space, the direct sailing is too expensive, or the destination has limited direct calls. Port Sudan is the clearest example: direct capacity from China is limited, so much cargo connects through Jeddah, Jebel Ali or Djibouti. A transhipment can also be the only way to reach a port with a small direct service.",
            "没有直航舱位、直航太贵，或者目的港直航挂靠少，中转就赢。苏丹港最典型：中国直航舱位有限，很多货经吉达、杰贝阿里或吉布提衔接。目的港直航服务很小，中转也可能是唯一走法。",
          ),
          P(
            "Transhipment can be cheaper on the ocean line, but the saving is not automatic. The extra handover can add destination charges, a second set of documents and a longer free-time risk. If the cargo is flexible and the connection is clean, the total can be lower. If the connection is tight or the hub is congested, the saving can disappear in storage and detention.",
            "中转的海运费可能更低，但省下的钱不是自动的。多一次交接会增加目的港费用、第二套单证和更长的免柜期风险。货期灵活、衔接顺，总成本可能更低。衔接紧或枢纽堵，省下的钱会在仓储和滞箱里消失。",
          ),
          UL([
            ["No direct space in the sailing window.", "出运窗口没有直航舱位。"],
            ["Destination with limited direct calls, such as Port Sudan.", "目的港直航少，例如苏丹港。"],
            ["Flexible cargo and a clean connection.", "货期灵活，衔接顺。"],
            ["Lower ocean line that survives the total-cost check.", "海运费更低，且经得起总成本核算。"],
          ]),
        ],
      },
      {
        heading: L("The costs people miss", "容易漏掉的成本"),
        blocks: [
          P(
            "The first missing line is the connection wait. A quote may show 30 days, but the box can sit at the hub for a week before the second vessel. The second is the destination charge: a transhipment can add handling, documentation and a delivery order at the hub or at destination. The third is the free time: it may start at discharge, and the connection can use it up before the consignee clears.",
            "第一项容易漏的是衔接等待。报价写 30 天，柜子可能在枢纽等一周才上第二艘船。第二项是目的港费用：中转可能在枢纽或目的港多出操作、单证和提货单。第三项是免柜期：可能从卸船算，衔接在收货人清关前就用掉了。",
          ),
          P(
            "The fourth is the missed-connection cost. If the first vessel is late, who pays the storage, the rebooking and the new freight? The fifth is insurance: the cover may not respond the same way at a hub. The sixth is the document risk: a transhipment has more parties, and a mismatch can stop the box at the connection. Ask for the contingency plan in writing.",
            "第四项是错过衔接的成本。第一程晚了，仓储、改配和新运费谁付？第五项是保险：枢纽段的承保可能不同。第六项是单证风险：中转参与方更多，一个不一致就可能在衔接点卡住。让货代把预案写下来。",
          ),
          P(
            "Free time is not the same at every port. A transhipment can add a week at the hub, and the destination free time may start only when the box arrives. If the consignee needs two weeks to clear, a sailing with seven free days is a false economy. Ask for the free time in writing and add the storage cost to the comparison.",
            "每个港口的免柜期不一样。中转可能在枢纽多一周，目的港免柜期又要等柜子到了才算。收货人清关要两周，只给 7 天免柜的船就是假便宜。让货代书面写清免柜期，并把仓储成本加进比较。",
          ),
        ],
      },
      {
        heading: L("How to compare the quotes", "两份报价怎么比"),
        blocks: [
          P(
            "Put the same cargo, the same origin, the same destination and the same sailing window in front of both quotes. Ask for the vessel, the routing, the connection port, the connection time and the free time. If the quote is direct, ask whether a feeder is included. If it is transhipped, ask which hub and what happens if the connection is missed.",
            "两份报价用同一票货、同一启运港、同一目的港、同一出运窗口。问船名、航线、中转港、衔接时间和免柜期。直航要问含不含支线；中转要问哪个枢纽、错过衔接怎么办。",
          ),
          P(
            "Then compare the total delivered cost, not the ocean line. Add origin charges, destination charges, duty, VAT, inland trucking, insurance and the cost of one extra week. If the direct quote is higher but arrives a week earlier and avoids a hub, it may be the better product. If the transhipment is cheaper and the cargo can wait, it may be the better total.",
            "然后比到门总成本，不是比海运费。加起运港费用、目的港费用、关税、增值税、内陆拖车、保险和多一周的成本。直航贵一点，但早到一周、少一个枢纽，可能是更好的产品。中转便宜、货又能等，可能是更好的总成本。",
          ),
        ],
      },
      {
        heading: L("A decision checklist", "决策清单"),
        blocks: [
          P(
            "Write down the cargo-ready date, the delivery date, the cargo value, the free time and whether the cargo is DG. Then ask for the next two sailings, one direct and one transhipment if both exist. Compare the arrival window, the connection port and the total cost. Do not choose on the label or the ocean line alone.",
            "写下备货日期、交期、货值、免柜期，以及货是否危险品。然后问最近两班船，直航和中转各一份（如果都有）。比到货窗口、中转港和总成本。不要只看标签或海运费。",
          ),
          P(
            "If the cargo is time-sensitive or high-value, start with direct and only move to transhipment if the direct option is unavailable or clearly worse. If the cargo is flexible, compare the total and the connection risk. If the destination is Port Sudan, assume a connection and plan for the extra week.",
            "货急或价值高，先看直航；直航没有或明显更差，再看中转。货期灵活，就比总成本和衔接风险。目的港是苏丹港，就按有衔接来做计划，并留出多一周的余量。",
          ),
          P(
            "Ask for the routing in writing: vessel, connection port, connection time and the next sailing if the connection is missed. A verbal “direct” or “fast” is not a routing. If the forwarder cannot name the connection, the quote is not complete. That is the minimum for a comparison. A written routing is part of the quote, not an optional extra.",
            "让货代书面写航线：船名、中转港、衔接时间，以及错过衔接后的下一班船。口头说“直航”或“快”，不是航线。货代说不出中转港，报价就不完整。这是比较的最低要求。书面航线不是可选项，是报价的一部分，必须写清楚。",
          ),
          UL([
            ["Written routing: vessel, hub and missed-connection plan.", "书面航线：船名、枢纽和错过衔接预案。"],
            ["Ask for it before you pay.", "付款前就要这份书面航线。"],
          ]),
          LINKS([
            ["/rates/", "Current Red Sea rates", "查看当前红海运价"],
            ["/guides/cape-of-good-hope-vs-suez-red-sea-freight/", "Cape vs Suez routing", "好望角与苏伊士航线"],
            ["/guides/red-sea-vs-jebel-ali/", "Red Sea vs Jebel Ali", "红海与杰贝阿里"],
            ["/faq/", "Shipping FAQ", "海运常见问题"],
          ]),
        ],
      },
    ],
  },
];
