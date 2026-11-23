import type { Metadata } from "next";
import FaqPage from "../../faq-page";
import { getFaqPageItems } from "../../../lib/content-store";
import { faqItems, faqRows } from "../../../lib/faq";
import { pageMetadata } from "../../../lib/seo";

export const metadata: Metadata = pageMetadata({
  lang: "zh",
  path: "/zh/faq/",
  alternates: { en: "/faq/", zh: "/zh/faq/" },
  title: "中国到红海海运常见问题：航程、运价与订舱 | RedSeaRate",
  description:
    "中国到吉达、苏赫纳、亚喀巴、吉布提和苏丹港的航程、20GP/40GP/40HQ 运价、订舱流程与单证入口。",
});

export default function Page() {
  const rows = faqRows();
  return <FaqPage lang="zh" rows={rows} items={[...faqItems("zh", rows), ...getFaqPageItems("zh")]} />;
}
