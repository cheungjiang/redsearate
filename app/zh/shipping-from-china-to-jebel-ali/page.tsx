import type { Metadata } from "next";
import JebelAliPage from "../../jebel-ali-page";
import { JEBEL_ALI_SLUG, jebelAliDescription } from "../../../lib/jebel-ali";
import { pageMetadata } from "../../../lib/seo";
import { shanghaiDate } from "../../../lib/rates";

export function generateMetadata(): Metadata {
  const today = shanghaiDate();
  return pageMetadata({
    lang: "zh",
    path: `/zh/${JEBEL_ALI_SLUG}/`,
    alternates: { en: `/${JEBEL_ALI_SLUG}/`, zh: `/zh/${JEBEL_ALI_SLUG}/` },
    title: "中国到杰贝阿里海运：按 ETD 列出的 40HQ 运价 | RedSeaRate",
    description: jebelAliDescription(today, "zh"),
    type: "article",
  });
}

export default function Page() {
  return <JebelAliPage lang="zh" today={shanghaiDate()} />;
}
