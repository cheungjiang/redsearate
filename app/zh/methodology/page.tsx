import type { Metadata } from "next";
import MethodologyPage from "../../methodology-page";
import { getMethodology } from "../../../lib/content-store";
import { pageMetadata } from "../../../lib/seo";

export function generateMetadata(): Metadata {
  const content = getMethodology();
  return pageMetadata({
    lang: "zh",
    path: "/zh/methodology/",
    alternates: { en: "/methodology/", zh: "/zh/methodology/" },
    title: `${content.title.zh} | RedSeaRate`,
    description: content.description.zh,
    type: "article",
  });
}

export default function Page() {
  return <MethodologyPage lang="zh" content={getMethodology()} />;
}
