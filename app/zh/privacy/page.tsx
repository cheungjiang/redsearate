import type { Metadata } from "next";
import PrivacyPage from "../../privacy-page";
import { pageMetadata } from "../../../lib/seo";

export const metadata: Metadata = pageMetadata({
  lang: "zh",
  path: "/zh/privacy/",
  alternates: { en: "/privacy/", zh: "/zh/privacy/" },
  title: "隐私与邮件订阅资料说明 | RedSeaRate",
  description: "了解红海运价周报的邮箱用途、Substack 境外订阅与投递、退订方式，以及查看、更正或删除个人资料的联系途径。",
});

export default function Page() {
  return <PrivacyPage lang="zh" />;
}
