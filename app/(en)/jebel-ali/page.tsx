import type { Metadata } from "next";
import JebelAliPage from "../../jebel-ali-page";
import { JEBEL_ALI_SLUG, jebelAliDescription, jebelAliTitle } from "../../../lib/jebel-ali";
import { pageMetadata } from "../../../lib/seo";
import { shanghaiDate } from "../../../lib/rates";

export function generateMetadata(): Metadata {
  const today = shanghaiDate();
  return pageMetadata({
    lang: "en",
    path: `/${JEBEL_ALI_SLUG}/`,
    alternates: { en: `/${JEBEL_ALI_SLUG}/`, zh: `/zh/${JEBEL_ALI_SLUG}/` },
    title: jebelAliTitle("en"),
    description: jebelAliDescription(today, "en"),
    type: "article",
  });
}

export default function Page() {
  return <JebelAliPage lang="en" today={shanghaiDate()} />;
}
