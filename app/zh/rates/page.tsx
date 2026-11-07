import type { Metadata } from "next";
import RatesPage from "../../rates-page";
import { homeData } from "../../../lib/site-data";

export const metadata: Metadata = {
  title: "航线运价 | RedSeaRate",
  description: "中国至红海港到港参考运价、等级说明与明确标注的模拟报价展示。",
  alternates: {
    canonical: "/zh/rates/",
    languages: { en: "/rates/", "zh-CN": "/zh/rates/", "x-default": "/rates/" },
  },
  openGraph: { title: "航线运价 | RedSeaRate", url: "/zh/rates/" },
};

export default async function Page() {
  const { snapshot, simulation } = await homeData();
  return <RatesPage lang="zh" snapshot={snapshot} simulation={simulation} />;
}
