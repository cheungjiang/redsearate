import type { Metadata } from "next";
import Home from "../site";
import { homeData } from "../../lib/site-data";
import { homeJsonLd, pageMetadata } from "../../lib/seo";
import { JsonLd } from "../json-ld";

export const metadata: Metadata = pageMetadata({
  lang: "zh",
  path: "/zh/",
  alternates: { en: "/", zh: "/zh/" },
  title: "红海运价 RedSeaRate | 中国至红海海运运价查询、估价与订舱询价",
  description:
    "查询中国起运至吉达、苏赫纳、亚喀巴、吉布提及苏丹港的 40HQ 市场运价指数、整柜和拼箱估价、航程与运输指南，通过微信或 WhatsApp 询价。",
});

export default async function Page() {
  return (
    <>
      <JsonLd data={homeJsonLd("zh")} />
      <Home lang="zh" {...await homeData()} />
    </>
  );
}
