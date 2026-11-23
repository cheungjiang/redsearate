import type { Metadata } from "next";
import Home from "../site";
import { getGuides, getHomeFaqs } from "../../lib/content-store";
import { homeData } from "../../lib/site-data";
import { homeJsonLd, pageMetadata } from "../../lib/seo";
import { JsonLd } from "../json-ld";

export const metadata: Metadata = pageMetadata({
  lang: "en",
  path: "/",
  alternates: { en: "/", zh: "/zh/" },
  title: "China–Red Sea Ocean Freight Rates & Estimates | RedSeaRate",
  description:
    "Ocean freight from China to Jeddah, Sokhna, Aqaba, Djibouti and Port Sudan: live 40HQ market index, FCL and LCL estimates, transit times and booking inquiries.",
});

export default async function Page() {
  const data = await homeData();
  const faqs = getHomeFaqs();
  return (
    <>
      <JsonLd data={homeJsonLd("en", data.contact.whatsapp, faqs)} />
      <Home lang="en" {...data} guides={getGuides()} faqs={faqs} />
    </>
  );
}
