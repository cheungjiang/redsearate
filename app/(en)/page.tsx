import type { Metadata } from "next";
import Home from "../site";
import { homeData } from "../../lib/site-data";
import { homeJsonLd, pageMetadata } from "../../lib/seo";
import { JsonLd } from "../json-ld";

export const metadata: Metadata = pageMetadata({
  lang: "en",
  path: "/",
  alternates: { en: "/", zh: "/zh/" },
  title: "China to Red Sea Ocean Freight Rates & Estimates | RedSeaRate",
  description:
    "Ocean freight from China to Jeddah, Sokhna, Aqaba, Djibouti and Port Sudan: live 40HQ market index, FCL and LCL estimates, transit times and booking inquiries.",
});

export default async function Page() {
  return (
    <>
      <JsonLd data={homeJsonLd("en")} />
      <Home lang="en" {...await homeData()} />
    </>
  );
}
