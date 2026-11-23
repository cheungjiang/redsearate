import type { Metadata } from "next";
import MarketBriefPage from "../../../market-brief-page";
import { getBriefNote } from "../../../../lib/content-store";
import { briefDescription, briefTitle } from "../../../../lib/market-brief";
import { readMarketBriefs } from "../../../../lib/market-brief.server";
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
    lang: "en",
    path: `/market-brief/${date}/`,
    alternates: { en: `/market-brief/${date}/`, zh: `/zh/market-brief/${date}/` },
    title: briefTitle(date, "en"),
    description: briefDescription(brief, "en"),
    type: "article",
  });
}

export default async function Page({ params }: Props) {
  const date = (await params).date;
  const briefs = readMarketBriefs();
  const index = briefs.findIndex((item) => item.date === date);
  const brief = briefs[index];
  const note = getBriefNote(date);
  const withNote = note.en || note.zh
    ? { ...brief, note: { en: note.en ?? note.zh!, zh: note.zh ?? note.en! } }
    : brief;
  return (
    <MarketBriefPage
      lang="en"
      brief={withNote}
      previous={briefs[index + 1]?.date ?? null}
      next={briefs[index - 1]?.date ?? null}
    />
  );
}
