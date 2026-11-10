// Jeddah SABER and Sokhna ACID notes. Facts are only the ones already in the
// Instagram card briefs and on the Saudi Arabia and Egypt country pages.
const L = (en: string, zh: string) => ({ en, zh });
type Localized = ReturnType<typeof L>;

type GuideBlock =
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

export type DocumentGuide = {
  slug: string;
  tag: Localized;
  title: Localized;
  lead: Localized;
  published: string;
  updated: string;
  faqs: { q: Localized; a: Localized }[];
  sections: GuideSection[];
};

const published = "2026-11-10";

type PublishedLane = {
  slug: string;
  destination: string;
  originEn: string;
  originZh: string;
  destEn: string;
  destZh: string;
};

// Only lanes this build actually publishes. A thin or retired route is not linked.
export function guideLaneLinks(slug: string, active: readonly PublishedLane[]) {
  const destination = slug === "shipping-to-jeddah-saber"
    ? "Jeddah"
    : slug === "shipping-to-sokhna-acid"
      ? "Sokhna"
      : null;
  if (!destination) return [];
  return active
    .filter((lane) => lane.destination === destination)
    .map((lane) => ({
      href: `/${lane.slug}/`,
      en: `${lane.originEn} to ${lane.destEn}`,
      zh: `${lane.originZh}到${lane.destZh}`,
    }))
    .sort((a, b) => a.href.localeCompare(b.href));
}

export const documentGuides: DocumentGuide[] = [
  {
    slug: "shipping-to-jeddah-saber",
    tag: L("SHIPPING GUIDE", "运输指南"),
    title: L(
      "Shipping to Jeddah: SABER in 5 steps",
      "运往吉达：SABER 分五步",
    ),
    lead: L(
      "Five SABER steps for Jeddah: check the HS code, open the importer account, then the product certificate and the shipment certificate.",
      "吉达 SABER 分五步：核对 HS 编码，进口商开户，再办产品证书和货物证书。",
    ),
    published,
    updated: published,
    faqs: [
      {
        q: L(
          "Does every shipment to Jeddah need a SABER shipment certificate?",
          "运到吉达的每一票都要 SABER 货物证书吗？",
        ),
        a: L(
          "Yes. Every shipment needs a SABER shipment certificate, whether or not the product is regulated. Without that certificate, Jeddah cannot clear the cargo.",
          "要。每一票都要 SABER 货物符合性证书，不论产品是否受管制。没有这张证书，吉达清不了关。",
        ),
      },
      {
        q: L(
          "How long do the SABER certificates last?",
          "SABER 的证书有效期是多久？",
        ),
        a: L(
          "A product certificate (PCoC) is valid for up to 1 year. The shipment certificate (SCoC) stated on the Saudi Arabia page is valid for 90 days, costs SAR 350 before VAT, and must match the bill of lading and the commercial invoice.",
          "产品符合性证书（PCoC）有效期最长 1 年。沙特页上写的货物符合性证书（SCoC）有效期 90 天，费用 350 里亚尔（不含增值税），并且必须与提单和商业发票一致。",
        ),
      },
      {
        q: L(
          "What if the product is not regulated?",
          "产品不受管制怎么办？",
        ),
        a: L(
          "On SABER, a product that is not regulated only needs its basic information recorded. The Saudi Arabia page describes non-regulated products as an importer self-declaration. The shipment still needs a shipment certificate.",
          "在 SABER 上，不受管制的产品只录入基本信息。沙特页把非管制产品写成进口商自我声明。这一票仍然要货物符合性证书。",
        ),
      },
      {
        q: L(
          "What stops the shipment certificate?",
          "什么情况会让货物证书办不下来？",
        ),
        a: L(
          "There is no shipment certificate without a valid product certificate. Jeddah customs checks the shipment certificate electronically, because SABER is linked to the customs platform. Changing the declared specification stalls the shipment certificate, and the product certificate has to be renewed before it expires.",
          "没有有效的产品符合性证书，就没有货物符合性证书。吉达海关电子核验货物证书，因为 SABER 与海关平台联动。中途改申报规格会卡住货物证书。产品证书要在到期前续好。",
        ),
      },
    ],
    sections: [
      {
        heading: L("A process note, not clearance advice", "这是流程说明，不是清关意见"),
        blocks: [
          P(
            "This is a general process note for the SABER steps on a shipment to Jeddah. It is not legal advice, and it is not customs advice. The certificate a product needs depends on its HS code and on the rules in force when the file is made. Check the HS code, and treat the clearance partner's confirmation as the result that counts. Nothing on this page promises an outcome for a named product.",
            "这篇只写运往吉达时 SABER 的通用流程。它不是法律意见，也不是清关意见。具体要哪一种证书，取决于产品的 HS 编码，以及办理当时的现行法规。先核对 HS 编码，再以清关伙伴的确认为准。本页不对任何具体产品承诺结果。",
          ),
          P(
            "SABER is SASO's platform. The five steps below are the same sequence as the short note already written for this subject: find out whether the HS code is regulated, have the Saudi importer open the record, obtain the product certificate where one is required, obtain the shipment certificate for this cargo, and leave a certificate that Jeddah customs can read electronically. Read them in that order. A later step does not repair a code or a product record that was wrong at the start.",
            "SABER 是 SASO 的平台。下面五步和这个题目已有的短稿是同一条顺序：先按 HS 编码确认是否受管制，再由沙特进口商建档，需要产品证书的就去办，然后为这一票办理货物证书，最后留下吉达海关能够电子读取的证书。按这个顺序读。后面的步骤补不回一开始就写错的编码或产品记录。",
          ),
        ],
      },
      {
        heading: L("Step 1: check the HS code", "第 1 步：核对 HS 编码"),
        blocks: [
          P(
            "Start with the HS code. On SABER, that code is how you tell whether the product is regulated. A regulated product needs a certificate. A product that is not regulated is not asked for that certificate: only the basic information is recorded.",
            "从 HS 编码开始。在 SABER 上，用这个编码确认产品是否受管制。受管制的产品要证书。不受管制的产品不要那张证书，只录入基本信息。",
          ),
          P(
            "The Saudi Arabia page describes the non-regulated path in its own words: non-regulated products use an importer self-declaration. This note does not merge that sentence with the line above into a new rule. Both are already written. The code decides which description you are in. A code copied from a similar product, or guessed from a trade name, sends the file through the wrong door. The person who knows the goods should confirm the code before anyone opens a SABER record.",
            "沙特页用自己的说法写非管制这一路：非管制产品使用进口商自我声明。这里不把这句话和上面那句合成一条新规则。两句都是已经写过的。编码决定你落在哪一种说法里。从相近产品抄来的编码，或用品名猜出来的编码，会把档案送进另一扇门。了解这票货的人，应该在任何人开设 SABER 记录之前确认编码。",
          ),
          P(
            "Do this before the booking is treated as ready. The product certificate, where the product is regulated, is issued against the product and the model that the code describes. A code that changes later is not a clerical fix. It changes the product the certificates were built for, and the shipment certificate that hangs on those certificates stalls. Confirm the code once, write it the same way on the invoice, and leave it.",
            "在把订舱当成已经就绪之前做这一步。产品受管制时，产品证书是按这个编码所描述的产品和型号签发的。事后改编码不是改一个笔误。它改的是证书所对应的产品，挂在那些证书下面的货物证书会卡住。编码确认一次，发票上按同一个写法，然后不要再改。",
          ),
        ],
      },
      {
        heading: L("Step 2: the importer opens SABER", "第 2 步：进口商开设 SABER"),
        blocks: [
          P(
            "The Saudi-registered importer opens the SABER account, or a representative that importer has authorized does it. The record they enter is the product and the importer. A shipper in China does not take the importer's place on the platform. If the buyer has not opened the account, and has not named the representative who will, the certificates in the next steps have nowhere to sit.",
            "由在沙特注册的进口商开设 SABER 账户，或由其授权代表开设。录入的是产品和进口商信息。中国的发货人不能在平台上代替这个进口商。买方还没有开户，也没有指定由谁作为授权代表来办，后面的证书就没有地方挂。",
          ),
          P(
            "Ask whether that account exists while the cargo is still at the factory. The product information and the importer information in the account have to be the information the commercial invoice and the bill of lading will carry. The shipment certificate has to match those two papers. An account opened under a shortened trading name, or under a product description the invoice will not use, has to be corrected before the shipment certificate is requested, not after Jeddah has already tried to read it.",
            "货还在工厂时就问这个账户在不在。账户里的产品信息和进口商信息，必须是商业发票和提单将要写的那些信息。货物证书必须和这两份文件一致。用简称开的户，或用发票上不会出现的品名开的户，要在申请货物证书之前改好，而不是等吉达已经读过一次之后。",
          ),
          P(
            "The importer is also the party named when a marking rule applies. Since 1 October 2026, the Saudi Arabia page says products under ten technical regulations must show the importer's name and commercial registration number. This note does not list those ten regulations. They are not listed on that page either. Whether this product is one of them is a question for the HS code and for the clearance partner, not a conclusion this page can make.",
            "涉及标识要求时，写上的也是这个进口商。沙特页写明：自 2026 年 10 月 1 日起，10 项技术法规下的产品须标注进口商名称和商业登记号。本篇不列出那 10 项。沙特页也没有逐项列出。这票货是不是其中之一，问 HS 编码和清关伙伴，不是本页能下的结论。",
          ),
        ],
      },
      {
        heading: L("Step 3: the product certificate", "第 3 步：产品符合性证书"),
        blocks: [
          P(
            "The product certificate of conformity, the PCoC, comes next for a regulated product. It is one certificate per product and per model. A conformity body that SASO recognizes issues it, against the Saudi standard that applies. Where that standard requires testing, the file includes the test evidence.",
            "受管制的产品下一步是产品符合性证书，PCoC。每个产品、每个型号一份。由 SASO 认可的符合性机构签发，按适用的沙特标准。适用标准要求检测时，档案里附上检测证据。",
          ),
          P(
            "A PCoC is valid for up to 1 year. Testing can add 2–4 weeks, so the work has to start several weeks before the shipment certificate is needed. A product certificate that expires before you apply for the shipment certificate is not a valid product certificate. Renew it before the expiry. Waiting until a file has already been refused is the late version of the same task.",
            "PCoC 的有效期最长 1 年。检测可能再加 2–4 周，所以要在需要货物证书之前数周就启动。申请货物证书时产品证书已经过期，它就不是一份有效的产品证书。在到期前续办。等档案已经被退了再去续，只是同一件事的晚版本。",
          ),
          P(
            "One model is one certificate. A second model is a second certificate, even when the commercial name looks the same. Keep the model, the applicable standard and the test evidence on the version of the product that will actually be loaded. If the declared specification changes while the certificate is in progress, the shipment certificate that has to hang on this PCoC stalls. Finish the specification before the application, and do not revise it in the middle.",
            "一个型号一份证书。第二个型号就是另一份证书，哪怕商品名称看起来一样。型号、适用标准和检测证据，都要对上真正要装的那一版产品。证书还在办、申报规格中途改了，必须挂在这份 PCoC 下面的货物证书会卡住。规格在申请之前定下来，办到一半不要改。",
          ),
        ],
      },
      {
        heading: L("Step 4: the shipment certificate", "第 4 步：货物符合性证书"),
        blocks: [
          P(
            "The shipment certificate of conformity, the SCoC, is one certificate for this shipment. It hangs on a PCoC that is still valid. The application uses the invoice and the bill of lading data. No valid PCoC means there is no SCoC. No SCoC means Jeddah cannot clear the cargo.",
            "货物符合性证书，SCoC，是这一票一份。它挂在仍然有效的 PCoC 下面。申请时用发票和提单上的数据。没有有效的 PCoC，就没有 SCoC。没有 SCoC，吉达清不了关。",
          ),
          P(
            "The Saudi Arabia page states the same certificate for every shipment, regulated or not. It states the fee as SAR 350 before VAT, the validity as 90 days, and the match: the certificate must agree with the bill of lading and the commercial invoice. Those 90 days are the life of the shipment certificate. They are not the period of up to 1 year on the PCoC. A shipment certificate built on an old consignee, an old model or an old value will not match the papers, and a certificate that does not match is not the certificate customs will accept.",
            "沙特页写的是同一张证书：每一票都要，不论是否受管制。费用写的是 350 里亚尔（不含增值税），有效期 90 天，并且必须与提单和商业发票一致。这 90 天是货物证书的有效期，不是 PCoC 最长 1 年的那个期限。货物证书如果按旧的收货人、旧的型号或旧的货值来做，就和单证对不上。对不上的证书，不是海关会接受的那一张。",
          ),
          P(
            "Read the draft invoice and the draft bill of lading against the SABER application before you treat the shipment certificate as finished. The data on the application are the data customs will compare. A correction after the certificate is issued is a new pass through the same match, not a note in the margin. For a product that is not regulated, SABER still only records the basic information at the product step, and the Saudi Arabia page still calls that path an importer self-declaration. The shipment step does not disappear. Every shipment still needs the shipment certificate.",
            "把货物证书当成办完之前，拿发票草稿和提单草稿对一遍 SABER 里的申请。申请上的数据就是海关要核对的数据。证书签发后再改，是按同样的一致性再走一遍，不是在页边补一句。产品不受管制时，SABER 在产品这一步仍然只录入基本信息，沙特页仍把这一路称为进口商自我声明。货物这一步不会因此取消。每一票仍然要货物证书。",
          ),
        ],
      },
      {
        heading: L("Step 5: Jeddah customs reads it", "第 5 步：吉达海关读取证书"),
        blocks: [
          P(
            "At Jeddah, customs checks the SCoC electronically. SABER and the customs platform are linked. The certificate is the record on that link, for this shipment. There is nothing useful to add at the counter if the shipment certificate was never issued, or if the product certificate under it has already expired.",
            "在吉达，海关电子核验 SCoC。SABER 与海关平台联动。证书就是这条联动上、属于这一票的那条记录。货物证书根本没有签发，或者它下面的产品证书已经过期，到柜台再补也没有用。",
          ),
          P(
            "Renew the PCoC before it expires. A product certificate that runs out while the shipment certificate still depends on it leaves the shipment without a valid PCoC, and without a valid PCoC there is no SCoC. Changing the declared specification at this stage stalls the SCoC as well. The specification customs reads has to be the specification the certificates were issued for.",
            "PCoC 在到期前续好。货物证书还依赖它的时候产品证书先到期，这一票就没有有效的 PCoC；没有有效的 PCoC，就没有 SCoC。这个阶段再改申报规格，同样会卡住 SCoC。海关读到的规格，必须是签发证书时的那个规格。",
          ),
          P(
            "The Saudi Arabia page adds a separate clock for the customs declaration. It is filed on FASAH at least 48 hours before the vessel arrives. That 48 hours is the declaration before arrival. It is not the 2–4 weeks that testing can add to a PCoC, and it does not stand in for the shipment certificate. Both have to be done. The declaration does not create the SCoC, and the SCoC does not replace the declaration.",
            "沙特页另外写了一个报关时间：报关单至少在船舶到港前 48 小时通过 FASAH 提交。这 48 小时是到港前的申报，不是 PCoC 检测可能加上的那 2–4 周，也不能代替货物证书。两件事都要做。申报不会生成 SCoC，SCoC 也不代替申报。",
          ),
        ],
      },
      {
        heading: L("Before the cargo is called ready", "货还不能算好的时候"),
        blocks: [
          P(
            "A workable order is the five steps, started while the cargo is still at the factory. Confirm the HS code and whether SABER treats the product as regulated. Have the Saudi-registered importer, or the authorized representative, open the account and enter the product and the importer. If the product is regulated, start the PCoC several weeks ahead, allow 2–4 weeks where testing is required, and keep a certificate whose validity is at most 1 year. Apply for the SCoC against a PCoC that is still valid, using the invoice and the bill of lading, and check the match. The Saudi Arabia page is where the shipment-certificate fee of SAR 350 before VAT and the 90-day validity are stated. Leave the declared specification unchanged once that chain is built. Renew the PCoC before it expires, so the electronic check at Jeddah has a shipment certificate to read.",
            "比较顺的做法，是货还在工厂时就把五步启动。确认 HS 编码，以及 SABER 是否把这个产品当作受管制。由沙特注册进口商或其授权代表开户，录入产品和进口商。产品受管制的，PCoC 提前数周开始；需要检测时留出 2–4 周；证书有效期最长 1 年。在 PCoC 仍然有效时，用发票和提单申请 SCoC，并核对是否一致。货物证书 350 里亚尔（不含增值税）的费用和 90 天有效期，写在沙特页上。这条链一旦建好，申报规格就不要再改。PCoC 在到期前续办，吉达的电子核验才读得到货物证书。",
          ),
          P(
            "If the product is not regulated, the product step is the basic information only, which the Saudi Arabia page describes as an importer self-declaration, and the shipment still needs its SCoC. Check the HS code again with the clearance partner before the file is treated as ready. This page does not confirm a certificate for any named product. The country page is the place for the rest of the Saudi file, including the FASAH declaration at least 48 hours before arrival.",
            "产品不受管制时，产品这一步只录入基本信息，沙特页称之为进口商自我声明，这一票仍然要 SCoC。把档案当成就绪之前，再和清关伙伴核对一次 HS 编码。本页不确认任何具体产品的证书。沙特文件的其余部分在国家页上，包括至少在到港前 48 小时通过 FASAH 提交的报关单。",
          ),
          LINKS([
            ["/shipping-from-china-to-saudi-arabia/", "Saudi Arabia: the SABER shipment certificate on the country page", "沙特：国家页上的 SABER 货物证书"],
          ]),
        ],
      },
    ],
  },
  {
    slug: "shipping-to-sokhna-acid",
    tag: L("SHIPPING GUIDE", "运输指南"),
    title: L(
      "Shipping to Sokhna: the ACID number in 3 steps",
      "运往苏赫纳：ACID 编号分三步",
    ),
    lead: L(
      "Sokhna needs the 19-digit ACID on the documents. The importer files it on NAFEZA, and the exporter uploads on CargoX.",
      "苏赫纳的单证要有 19 位 ACID。进口商在 NAFEZA 申报，出口商在 CargoX 上传。",
    ),
    published,
    updated: published,
    faqs: [
      {
        q: L(
          "What is an ACID number?",
          "ACID 编号是什么？",
        ),
        a: L(
          "ACID means Advance Cargo Information Declaration. Egyptian customs issues one 19-digit number for each shipment. It is not a general import licence. A new shipment needs a new number, and the validity is limited.",
          "ACID 是 Advance Cargo Information Declaration，预先货物信息申报。埃及海关按票签发一个 19 位编号。它不是通用进口许可。新的一票要新的编号，有效期有限。",
        ),
      },
      {
        q: L(
          "When does the importer have to file the ACID?",
          "进口商要在什么时候申报 ACID？",
        ),
        a: L(
          "The importer files on NAFEZA at least 48 hours before the vessel sails, and may file up to 3 months ahead, from the proforma invoice. Sea cargo into Egypt has required an ACID since October 2021. Air cargo has required it since January 2026.",
          "进口商在 NAFEZA 上至少于开船前 48 小时申报，最长可以提前 3 个月，依据是形式发票。海运进入埃及的货物自 2021 年 10 月起就要 ACID。空运自 2026 年 1 月起要。",
        ),
      },
      {
        q: L(
          "Where is the 19-digit number printed?",
          "这 19 位编号印在哪里？",
        ),
        a: L(
          "After customs approves the filing, NAFEZA sends the 19-digit ACID to the importer and the exporter. It is printed, not handwritten, on the commercial invoice, the packing list, the bill of lading and the certificate of origin. The exporter uploads the final documents on CargoX before the vessel sails.",
          "海关批准后，NAFEZA 把 19 位 ACID 发给进口商和出口商。它要机打在商业发票、装箱单、提单和原产地证上，不能手写。出口商在开船前通过 CargoX 上传最终单据。",
        ),
      },
      {
        q: L(
          "Is the ACID only for Sokhna?",
          "ACID 只用于苏赫纳吗？",
        ),
        a: L(
          "No. An ACID applies to all sea cargo into Egypt, not only to Sokhna. If the documents for a Sokhna shipment do not carry the ACID, Sokhna cannot clear it.",
          "不是。ACID 适用于所有海运进入埃及的货物，不只是苏赫纳。运往苏赫纳的单证上没有 ACID，苏赫纳就清不了关。",
        ),
      },
    ],
    sections: [
      {
        heading: L("A process note, not clearance advice", "这是流程说明，不是清关意见"),
        blocks: [
          P(
            "This is a general process note for the ACID on a sea shipment into Egypt, including a shipment that will clear at Sokhna. It is not legal advice, and it is not customs advice. What has to be declared follows the HS code and the rules in force when the file is made. Check the HS code, and treat the clearance partner's confirmation as the result that counts. Nothing on this page promises an outcome for a named product.",
            "这篇只写海运进入埃及、包括在苏赫纳清关的这一票，ACID 的通用流程。它不是法律意见，也不是清关意见。要申报什么，取决于 HS 编码和办理当时的现行法规。先核对 HS 编码，再以清关伙伴的确认为准。本页不对任何具体产品承诺结果。",
          ),
          P(
            "ACID means Advance Cargo Information Declaration. Egyptian customs issues one 19-digit number for each shipment. The number is not a general import licence. A new shipment needs a new number, and the validity of a number is limited. This note does not add a length to that validity, because no length is stated in the sources used here. Sea cargo into Egypt has required an ACID since October 2021. Air cargo has required one since January 2026. Sokhna is a sea port, so the sea rule is the one this shipment is under. The air date is part of the same declaration, and it does not limit the sea rule to Sokhna.",
            "ACID 即 Advance Cargo Information Declaration，预先货物信息申报。埃及海关为每一票货发一个 19 位编号。这个编号不是通用进口许可。新的一票要新的编号，编号的有效期有限。这里的材料没有写有效期是多少天，本篇就不补一个天数。海运进入埃及的货物自 2021 年 10 月起必须有 ACID。空运自 2026 年 1 月起必须有。苏赫纳是海港，这一票适用的是海运这条。空运的日期属于同一项申报，并不把海运规则收成只有苏赫纳。",
          ),
          P(
            "If the documents do not carry the ACID, Sokhna cannot clear the cargo. The same number applies to all sea cargo into Egypt, not only to cargo that discharges at Sokhna. Choosing another Egyptian port does not retire the declaration. The three steps below are the ones already written for this subject: the importer files on NAFEZA, the exporter is verified on CargoX and linked to that shipment, and the 19-digit number is printed on the papers before the vessel sails.",
            "单证上没有 ACID，苏赫纳就清不了关。同一个编号规则适用于所有海运进入埃及的货物，不只是在苏赫纳卸的货。改挂埃及的另一个港，不会取消这项申报。下面三步就是这个题目已经写过的三步：进口商在 NAFEZA 申报，出口商在 CargoX 完成核验并关联到这一票，19 位编号在开船前印上单证。",
          ),
        ],
      },
      {
        heading: L("Step 1: the importer files on NAFEZA", "第 1 步：进口商在 NAFEZA 申报"),
        blocks: [
          P(
            "The Egyptian importer files the shipment on NAFEZA, the national single window. The filing is made from the proforma invoice. It enters the parties, the HS code, the value and the origin. Those four are the content of the declaration. A proforma that still uses a working description, a provisional value or an origin that the final invoice will not use, is the wrong base for the number.",
            "埃及进口商在 NAFEZA，也就是国家单一窗口，申报这一票。申报依据形式发票。录入的是各方、HS 编码、货值和原产地。这四项就是申报的内容。形式发票如果还是工作用的品名、临时货值，或最终发票不会采用的原产地，就不该拿来生成编号。",
          ),
          P(
            "File at least 48 hours before the vessel sails. The same filing may be made up to 3 months before sailing. That window is about departure, not about the day the ship reaches Sokhna. Earlier than 3 months is outside the window stated here. Later than 48 hours before sailing misses the minimum stated here. Count the 48 hours from sailing, and do not borrow a different 48-hour rule from another country's arrival declaration.",
            "至少在开船前 48 小时申报。同一次申报最长可以提前到开船前 3 个月。这个窗口说的是开船，不是船到苏赫纳的那一天。早于 3 个月，超出这里写明的窗口。晚于开船前 48 小时，就错过这里写明的下限。48 小时从开船算，不要借另一个国家到港申报的 48 小时。",
          ),
          P(
            "The importer is the party who files this step and who receives the number. A shipper in China can prepare the proforma invoice so the parties, the HS code, the value and the origin are stable. The shipper does not replace the Egyptian importer on NAFEZA. If the importer has not filed, there is no ACID for the exporter to print, however complete the export documents look.",
            "这一步由进口商申报，编号也是发给进口商的。中国的发货人可以把形式发票准备好，让各方、HS 编码、货值和原产地稳定下来。发货人不能在 NAFEZA 上代替埃及进口商。进口商还没有申报，出口商就没有 ACID 可印，哪怕出口单证看起来已经齐了。",
          ),
        ],
      },
      {
        heading: L("Step 2: the exporter on CargoX", "第 2 步：出口商在 CargoX"),
        blocks: [
          P(
            "The exporter, the supplier in China, opens a company account on CargoX. CargoX is the partner platform on the exporter's side of NAFEZA. The account has to be verified, and it has to be linked with the importer on this same shipment. Registration of the account is free. Verification is charged once, as a small fee. This note does not name that fee. No amount is stated in the sources used here.",
            "出口商，也就是中国的供应商，在 CargoX 开设公司账户。CargoX 是 NAFEZA 在出口商一侧的合作平台。账户必须经过核验，并且要就这一票与进口商关联。注册账户是免费的。核验收一次小额费用。本篇不写这个费用的金额。这里用的材料没有写金额。",
          ),
          P(
            "The Egypt page says the same gate in its own words. The exporter's company must be verified on CargoX before the Advance Cargo Information is filed. The filing the exporter makes there is the bill of lading, the packing list, the commercial invoice as a PDF and as a structured Excel file, and the certificate of origin. A company that has not passed verification cannot use that filing, even when the documents themselves are already drafted.",
            "埃及页用自己的说法写了同一道门：出口公司必须先在 CargoX 完成认证，再提交预先货物信息。出口商在那里提交的是提单、装箱单、商业发票（PDF 和规定格式的 Excel）以及原产地证。公司还没有通过核验，就不能做这项提交，哪怕单证草稿已经写好了。",
          ),
          P(
            "Open the verified account before the first shipment, not on the day the number arrives. The link is to the importer and to this shipment, not to a standing approval for every future cargo. The next shipment is a new ACID and a new link. Verification of the company is the one-time step. The shipment link is not.",
            "第一次出运之前就办好经过核验的账户，不要等到编号下来的那一天。关联的是这个进口商和这一票，不是对以后每一票的长期许可。下一票是一个新的 ACID，也是一次新的关联。公司核验是收一次的那一步。货与货之间的关联不是。",
          ),
        ],
      },
      {
        heading: L("Step 3: print the 19-digit ACID", "第 3 步：印上 19 位 ACID"),
        blocks: [
          P(
            "When customs approves the filing, NAFEZA sends the 19-digit ACID to the importer and to the exporter. Print it. The printing is typed, not handwritten. It goes on the commercial invoice, the packing list, the bill of lading and the certificate of origin. A number that lives only in an email, or that is written by hand in a margin, is not the number on the documents.",
            "海关批准申报后，NAFEZA 把 19 位 ACID 发给进口商，也发给出口商。把它印上去。用机打，不用手写。印在商业发票、装箱单、提单和原产地证上。编号如果只留在一封邮件里，或是手写在页边，就不算印在单证上。",
          ),
          P(
            "The exporter uploads the final documents through CargoX before the vessel sails. Final means the documents that carry the typed ACID, not an earlier draft that still has a blank where the number will go. Uploading a set that does not match the parties, the HS code, the value and the origin entered on NAFEZA leaves the declaration and the documents as two different shipments.",
            "出口商在开船前通过 CargoX 上传最终单据。最终，指的是已经机打上 ACID 的那套单证，不是编号还空着的早期草稿。上传的一套如果和 NAFEZA 里录入的各方、HS 编码、货值、原产地对不上，申报和单证就成了两票不同的货。",
          ),
          P(
            "The Egypt page adds what the timing is worth at the far end. Filing the Advance Cargo Information well before arrival lets the importer use the faster release lane. A filing made hours before arrival does not. That sentence is about arrival, and it sits next to the rule already stated: the importer's declaration itself is at least 48 hours before sailing, and at most 3 months before sailing. This page does not collapse those into one threshold. Do the NAFEZA filing inside its own window, and do not leave the CargoX upload until a few hours before the ship reaches Sokhna.",
            "埃及页写了时间在目的港这边有什么用。预先货物信息申报得足够早，进口商才能走更快的放行通道。到港前几小时才提交，就享受不到。这句话说的是到港，它旁边还有已经写明的规则：进口商自己的申报至少在开船前 48 小时，最长提前 3 个月。本页不把这两句收成同一个门槛。NAFEZA 的申报落在它自己的窗口里，CargoX 的上传也不要留到船抵苏赫纳前的几小时。",
          ),
        ],
      },
      {
        heading: L("One number, one shipment", "一个编号，一票货"),
        blocks: [
          P(
            "An ACID is issued per shipment. It is not a licence the importer holds and reuses. The next booking, even for the same product and the same buyer, needs its own 19-digit number. The validity of each number is limited. When a number is no longer the valid number for that shipment, printing it on a new set of documents does not revive it. Request the new number, then print that one.",
            "ACID 按票发放。它不是进口商持有、可以反复使用的许可。下一票订舱，哪怕产品和买方都相同，也要自己的 19 位编号。每个编号的有效期有限。一个编号不再是这一票的有效编号时，把它印到一套新单证上也不会让它恢复。重新取得编号，再印那一个。",
          ),
          P(
            "Keep the typed number identical on the commercial invoice, the packing list, the bill of lading and the certificate of origin. One transposed digit is a different number. The Egypt page says the ACID must appear on all shipping documents, which is the same requirement from the other side: the number NAFEZA sent is the number the documents show, on each of them, not on a covering message alone.",
            "商业发票、装箱单、提单和原产地证上的机打编号必须相同。错一位就是另一个编号。埃及页写 ACID 必须出现在所有货运单证上。这是同一项要求的另一面：NAFEZA 发出来的编号，就是每一份单证上显示的编号，而不是只写在一封说明邮件里。",
          ),
        ],
      },
      {
        heading: L("Before the vessel sails", "开船之前"),
        blocks: [
          P(
            "A workable order is the three steps, closed before sailing. The Egyptian importer files on NAFEZA from a proforma invoice that already has the parties, the HS code, the value and the origin, at least 48 hours before sailing and no earlier than 3 months. The Chinese exporter has a verified CargoX account, linked to that importer for this shipment, with registration free and verification charged once as a small fee. After approval, both sides hold the same 19-digit ACID. It is typed on the commercial invoice, the packing list, the bill of lading and the certificate of origin. The exporter uploads those final documents on CargoX before the vessel sails. The Egypt page is where the PDF-and-Excel invoice and the faster release lane are stated.",
            "比较顺的做法，是开船前把三步做完。埃及进口商凭已经写明各方、HS 编码、货值和原产地的形式发票，在 NAFEZA 申报，至少提前到开船前 48 小时，最早不早于 3 个月。中国出口商有经过核验的 CargoX 账户，就这一票与该进口商关联；注册免费，核验收一次小额费用。批准之后，双方拿到同一个 19 位 ACID。把它机打在商业发票、装箱单、提单和原产地证上。出口商在开船前通过 CargoX 上传这些最终单据。发票要 PDF 和规定格式的 Excel，以及更快的放行通道，写在埃及页上。",
          ),
          P(
            "Check the HS code with the clearance partner before the file is treated as ready. The number does not decide whether the product may be imported. It identifies this shipment's advance declaration. This page does not confirm an ACID for any named product. Without the number on the documents, Sokhna cannot clear the cargo, and the same gap blocks any other sea arrival in Egypt.",
            "把档案当成就绪之前，和清关伙伴核对 HS 编码。这个编号不决定产品能不能进口。它标识的是这一票的预先申报。本页不确认任何具体产品的 ACID。单证上没有这个编号，苏赫纳清不了关；埃及其他海运到港同样过不了这个缺口。",
          ),
          LINKS([
            ["/shipping-from-china-to-egypt/", "Egypt: ACID on the country page", "埃及：国家页上的 ACID"],
          ]),
        ],
      },
    ],
  },
];
