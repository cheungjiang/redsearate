import type { Metadata } from "next";
import PrivacyPage from "../../privacy-page";
import { pageMetadata } from "../../../lib/seo";

export const metadata: Metadata = pageMetadata({
  lang: "en",
  path: "/privacy/",
  alternates: { en: "/privacy/", zh: "/zh/privacy/" },
  title: "Privacy & Newsletter Data | RedSeaRate",
  description: "How RedSeaRate's optional newsletter uses your email, how Substack handles signup, and how to unsubscribe or request deletion.",
});

export default function Page() {
  return <PrivacyPage lang="en" />;
}
