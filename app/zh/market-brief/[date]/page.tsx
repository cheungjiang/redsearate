import type { Metadata } from "next";
import MarketBriefPage from "../../../market-brief-page";
import { briefDescription, briefTitle, readMarketBriefs } from "../../../../lib/market-brief";
import { pageMetadata } from "../../../../lib/seo";

type Props = { params: Promise<{ date: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return readMarketBriefs().map((brief) => ({ date: brief.date }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const date = (await params).date;
  const brief = readMarketBriefs().find((item) => item.date === date)!;
  return pageMetadata({
    lang: "zh",
    path: `/zh/market-brief/${date}/`,
    alternates: { en: `/market-brief/${date}/`, zh: `/zh/market-brief/${date}/` },
    title: briefTitle(date, "zh"),
    description: briefDescription(brief, "zh"),
    type: "article",
  });
}

export default async function Page({ params }: Props) {
  const date = (await params).date;
  const briefs = readMarketBriefs();
  const index = briefs.findIndex((item) => item.date === date);
  const brief = briefs[index];
  return (
    <MarketBriefPage
      lang="zh"
      brief={brief}
      previous={briefs[index + 1]?.date ?? null}
      next={briefs[index - 1]?.date ?? null}
    />
  );
}
