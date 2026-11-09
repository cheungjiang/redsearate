import type { Metadata } from "next";
import CountryPage from "../../country-page";
import LanePage from "../../lane-page";
import LaneRedirect from "../../lane-redirect";
import { countries } from "../../../lib/countries";
import { laneDescription, lanePath, laneTitle } from "../../../lib/lanes";
import { getLanePlan } from "../../../lib/lanes.server";
import { countryDescription, pageMetadata } from "../../../lib/seo";
import { countryData } from "../../../lib/site-data";

type Props = { params: Promise<{ country: string }> };

export const dynamicParams = false;

export async function generateStaticParams() {
  const plan = await getLanePlan();
  return [
    ...countries.map((country) => ({ country: country.slug })),
    ...plan.active.map((lane) => ({ country: lane.slug })),
    ...plan.retired.map((lane) => ({ country: lane.slug })),
  ];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const slug = (await params).country;
  const plan = await getLanePlan();
  const lane = plan.active.find((item) => item.slug === slug);
  if (lane) {
    return pageMetadata({
      lang: "en",
      path: lanePath(lane.slug, "en"),
      alternates: { en: lanePath(lane.slug, "en"), zh: lanePath(lane.slug, "zh") },
      title: laneTitle(lane, "en"),
      description: laneDescription(lane, "en"),
    });
  }
  const retired = plan.retired.find((item) => item.slug === slug);
  if (retired) {
    const country = countries.find((item) => item.destination === retired.destination)!;
    return {
      title: { absolute: "Page moved | RedSeaRate" },
      robots: { index: false, follow: true },
      alternates: { canonical: lanePath(country.slug, "en") },
    };
  }
  const { country, stats } = countryData(slug);
  return pageMetadata({
    lang: "en",
    path: `/${country.slug}/`,
    alternates: { en: `/${country.slug}/`, zh: `/zh/${country.slug}/` },
    title: `${country.title.en} | RedSeaRate`,
    description: countryDescription(country, stats, "en"),
    type: "article",
  });
}

export default async function Page({ params }: Props) {
  const slug = (await params).country;
  const plan = await getLanePlan();
  const lane = plan.active.find((item) => item.slug === slug);
  if (lane) return <LanePage lang="en" lane={lane} today={plan.today} />;
  const retired = plan.retired.find((item) => item.slug === slug);
  if (retired) return <LaneRedirect lang="en" lane={retired} />;
  const { country, stats, today } = countryData(slug);
  const laneSlugs = Object.fromEntries(
    plan.active.filter((item) => item.destination === country.destination).map((item) => [item.origin, item.slug]),
  );
  return <CountryPage lang="en" country={country} stats={stats} today={today} laneSlugs={laneSlugs} />;
}
