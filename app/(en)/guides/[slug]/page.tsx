import type { Metadata } from "next";
import { notFound } from "next/navigation";
import GuidePage from "../../../../app/guide-page";
import { getGuides } from "../../../../lib/content-store";
import { guideSeoDescription, guideSeoTitle, pageMetadata } from "../../../../lib/seo";

export const dynamicParams = false;
export const generateStaticParams = () => getGuides().map(({ slug }) => ({ slug }));
const find = async (params: Promise<{ slug: string }>) => {
  const { slug } = await params;
  return getGuides().find((g) => g.slug === slug) ?? notFound();
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const guide = await find(params);
  return pageMetadata({
    lang: "en",
    path: `/guides/${guide.slug}/`,
    alternates: { en: `/guides/${guide.slug}/`, zh: `/zh/guides/${guide.slug}/` },
    title: guideSeoTitle(guide, "en"),
    description: guideSeoDescription(guide, "en"),
    type: "article",
  });
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  return <GuidePage lang="en" guide={await find(params)} />;
}
