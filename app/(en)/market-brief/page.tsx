import type { Metadata } from "next";
import MarketBriefIndex from "../../market-brief-index";
import { briefIndexDescription, briefIndexTitle, readMarketBriefs } from "../../../lib/market-brief";
import { pageMetadata } from "../../../lib/seo";

export function generateMetadata(): Metadata {
  return pageMetadata({
    lang: "en",
    path: "/market-brief/",
    alternates: { en: "/market-brief/", zh: "/zh/market-brief/" },
    title: briefIndexTitle("en"),
    description: briefIndexDescription("en"),
    type: "article",
  });
}

export default function Page() {
  return <MarketBriefIndex lang="en" briefs={readMarketBriefs()} />;
}
