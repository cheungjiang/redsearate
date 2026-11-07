import type { Metadata } from "next";
import RatesPage from "../../rates-page";
import { homeData } from "../../../lib/site-data";
import { indexSentences, pageMetadata, ratesJsonLd } from "../../../lib/seo";
import { JsonLd } from "../../json-ld";

export const metadata: Metadata = pageMetadata({
  lang: "zh",
  path: "/zh/rates/",
  alternates: { en: "/rates/", zh: "/zh/rates/" },
  title: "中国到红海海运运价：吉达、苏赫纳、亚喀巴、吉布提 40HQ 行情 | RedSeaRate",
  description:
    "查看中国至吉达、苏赫纳、亚喀巴、吉布提和苏丹港的 40HQ 海运市场中位数，以及按起运港分列的港到港参考运价，随收集的报价持续更新。",
});

export default async function Page() {
  const { snapshot, index, simulation } = await homeData();
  return (
    <>
      <JsonLd data={ratesJsonLd(index, snapshot.today, "zh")} />
      <RatesPage lang="zh" snapshot={snapshot} index={index} summary={indexSentences(index, snapshot.today, "zh")} simulation={simulation} />
    </>
  );
}
