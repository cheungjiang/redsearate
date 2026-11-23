import type { Metadata } from "next";
import MethodologyPage from "../../methodology-page";
import { getMethodology } from "../../../lib/content-store";
import { pageMetadata } from "../../../lib/seo";

export function generateMetadata(): Metadata {
  const content = getMethodology();
  return pageMetadata({
    lang: "en",
    path: "/methodology/",
    alternates: { en: "/methodology/", zh: "/zh/methodology/" },
    title: `${content.title.en} | RedSeaRate`,
    description: content.description.en,
    type: "article",
  });
}

export default function Page() {
  return <MethodologyPage lang="en" content={getMethodology()} />;
}
