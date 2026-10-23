import Home from "../site";
import type { Metadata } from "next";
import { homeData } from "../../lib/site-data";
export const metadata: Metadata = {
  title: "红海运价 Red Sea Rate | 中国至红海海运估价与订舱询价",
  description:
    "查询中国起运至吉达、苏赫纳、亚喀巴及苏丹港的海运报价、市场参考价、航程与运输指南。在线估算整柜和拼箱运费，通过微信或 WhatsApp 询价。",
  alternates: {
    canonical: "/zh",
    languages: { en: "/", "zh-CN": "/zh", "x-default": "/" },
  },
};
export default async function Page() {
  return <Home lang="zh" {...await homeData()} />;
}
