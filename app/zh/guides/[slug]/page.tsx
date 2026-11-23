import type { Metadata } from "next";
import { notFound } from "next/navigation";
import GuidePage from "../../../../app/guide-page";
import { getGuides } from "../../../../lib/content-store";
import { guideDescription, pageMetadata } from "../../../../lib/seo";

export const dynamicParams = false;
export const generateStaticParams = () => getGuides().map(({ slug }) => ({ slug }));
const find = async (params: Promise<{ slug: string }>) => {
  const { slug } = await params;
  return getGuides().find((g) => g.slug === slug) ?? notFound();
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const guide = await find(params);
  return pageMetadata({
    lang: "zh",
    path: `/zh/guides/${guide.slug}/`,
    alternates: { en: `/guides/${guide.slug}/`, zh: `/zh/guides/${guide.slug}/` },
    title: `${guide.title.zh} | RedSeaRate`,
    description: guideDescription(guide, "zh"),
    type: "article",
  });
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  return <GuidePage lang="zh" guide={await find(params)} />;
}
