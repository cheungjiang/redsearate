import type { Metadata } from "next";
import RatesPage from "../../rates-page";
import { homeData } from "../../../lib/site-data";
import { indexSentences, pageMetadata, ratesJsonLd } from "../../../lib/seo";
import { JsonLd } from "../../json-ld";

export const metadata: Metadata = pageMetadata({
  lang: "en",
  path: "/rates/",
  alternates: { en: "/rates/", zh: "/zh/rates/" },
  title: "China to Red Sea Freight Rates: Jeddah, Sokhna, Aqaba, Djibouti, Port Sudan | RedSeaRate",
  description:
    "Current 40HQ ocean freight market medians from China to Jeddah, Sokhna, Aqaba, Djibouti and Port Sudan, built from collected quotes, plus port-to-port references by origin.",
});

export default async function Page() {
  const { snapshot, index, daily, simulation, jebelAli } = await homeData();
  return (
    <>
      <JsonLd data={ratesJsonLd(index, snapshot.today, "en")} />
      <RatesPage lang="en" snapshot={snapshot} index={index} daily={daily} summary={indexSentences(index, snapshot.today, "en")} simulation={simulation} jebelAli={jebelAli} />
    </>
  );
}
