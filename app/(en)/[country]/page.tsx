import type { Metadata } from "next";
import CountryPage from "../../country-page";
import LanePage from "../../lane-page";
import LaneRedirect from "../../lane-redirect";
import { countries } from "../../../lib/countries";
import { laneDescription, lanePath, laneTitle } from "../../../lib/lanes";
import { getLanePlan } from "../../../lib/lanes.server";
import { countryDescription, countrySeoTitle, pageMetadata } from "../../../lib/seo";
import { countryData } from "../../../lib/site-data";

type Props = { params: Promise<{ country: string }> };

export const dynamicParams = false;

const uniqueParams = (params: { country: string }[]) =>
  [...new Map(params.map((param) => [param.country, param])).values()];

export async function generateStaticParams() {
  const plan = await getLanePlan();
  return uniqueParams([
    ...countries.map((country) => ({ country: country.slug })),
    ...plan.active.map((lane) => ({ country: lane.slug })),
    ...plan.curated.map((lane) => ({ country: lane.slug })),
    ...plan.retired.map((lane) => ({ country: lane.slug })),
  ]);
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
  const curated = plan.curated.find((item) => item.slug === slug);
  if (curated) {
    return pageMetadata({
      lang: "en",
      path: lanePath(curated.slug, "en"),
      alternates: { en: lanePath(curated.slug, "en"), zh: lanePath(curated.slug, "zh") },
      title: laneTitle(curated, "en"),
      description: laneDescription(curated, "en"),
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
    title: countrySeoTitle(country, "en"),
    description: countryDescription(country, stats, "en"),
    type: "article",
  });
}

export default async function Page({ params }: Props) {
  const slug = (await params).country;
  const plan = await getLanePlan();
  const lane = plan.active.find((item) => item.slug === slug);
  if (lane) return <LanePage lang="en" lane={lane} today={plan.today} />;
  const curated = plan.curated.find((item) => item.slug === slug);
  if (curated) return <LanePage lang="en" lane={curated} today={plan.today} />;
  const retired = plan.retired.find((item) => item.slug === slug);
  if (retired) return <LaneRedirect lang="en" lane={retired} />;
  const { country, stats, today } = countryData(slug);
  const laneSlugs = Object.fromEntries(
    [...plan.active, ...plan.curated]
      .filter((item) => item.destination === country.destination)
      .map((item) => [item.origin, item.slug]),
  );
  const routeLinks = [...new Map(
    [...plan.active, ...plan.curated]
      .filter((item) => item.destination === country.destination)
      .map((item) => [item.slug, {
        slug: item.slug,
        en: `${item.originEn} to ${item.destEn}`,
        zh: `${item.originZh}到${item.destZh}`,
      }]),
  ).values()].sort((a, b) => a.en.localeCompare(b.en));
  return <CountryPage lang="en" country={country} stats={stats} today={today} laneSlugs={laneSlugs} routeLinks={routeLinks} />;
}
