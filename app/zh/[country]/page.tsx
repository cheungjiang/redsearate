import type { Metadata } from "next";
import CountryPage from "../../country-page";
import { countries } from "../../../lib/countries";
import { countryDescription, pageMetadata } from "../../../lib/seo";
import { countryData } from "../../../lib/site-data";

type Props = { params: Promise<{ country: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return countries.map((c) => ({ country: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { country, stats } = countryData((await params).country);
  return pageMetadata({
    lang: "zh",
    path: `/zh/${country.slug}/`,
    alternates: { en: `/${country.slug}/`, zh: `/zh/${country.slug}/` },
    title: `${country.title.zh} | RedSeaRate`,
    description: countryDescription(country, stats, "zh"),
    type: "article",
  });
}

export default async function Page({ params }: Props) {
  const { country, stats, today } = countryData((await params).country);
  return <CountryPage lang="zh" country={country} stats={stats} today={today} />;
}
