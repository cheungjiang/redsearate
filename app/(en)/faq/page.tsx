import type { Metadata } from "next";
import FaqPage from "../../faq-page";
import { faqItems, faqRows } from "../../../lib/faq";
import { pageMetadata } from "../../../lib/seo";

export const metadata: Metadata = pageMetadata({
  lang: "en",
  path: "/faq/",
  alternates: { en: "/faq/", zh: "/zh/faq/" },
  title: "Red Sea Shipping FAQ: Transit, Rates & Booking | RedSeaRate",
  description:
    "China to Jeddah, Sokhna, Aqaba, Djibouti and Port Sudan: transit times, 20GP/40GP/40HQ rates, booking steps and document links.",
});

export default function Page() {
  const rows = faqRows();
  return <FaqPage lang="en" rows={rows} items={faqItems("en", rows)} />;
}
