import type { Metadata } from "next";
import RatesPage from "../../rates-page";
import { homeData } from "../../../lib/site-data";

export const metadata: Metadata = {
  title: "Rates | RedSeaRate",
  description: "China to Red Sea port-to-port freight references, grade explanations and clearly labeled demonstration rates.",
  alternates: {
    canonical: "/rates",
    languages: { en: "/rates", "zh-CN": "/zh/rates", "x-default": "/rates" },
  },
  openGraph: { title: "Rates | RedSeaRate", url: "/rates" },
};

export default async function Page() {
  const { snapshot, simulation } = await homeData();
  return <RatesPage lang="en" snapshot={snapshot} simulation={simulation} />;
}
