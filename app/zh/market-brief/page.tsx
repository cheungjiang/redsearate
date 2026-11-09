import type { Metadata } from "next";
import MarketBriefIndex from "../../market-brief-index";
import { briefIndexDescription, briefIndexTitle } from "../../../lib/market-brief";
import { readMarketBriefs } from "../../../lib/market-brief.server";
import { pageMetadata } from "../../../lib/seo";

export function generateMetadata(): Metadata {
  return pageMetadata({
    lang: "zh",
    path: "/zh/market-brief/",
    alternates: { en: "/market-brief/", zh: "/zh/market-brief/" },
    title: briefIndexTitle("zh"),
    description: briefIndexDescription("zh"),
    type: "article",
  });
}

export default function Page() {
  return <MarketBriefIndex lang="zh" briefs={readMarketBriefs()} />;
}
