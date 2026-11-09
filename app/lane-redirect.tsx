import { countries } from "../lib/countries";
import { lanePath, type LaneKey } from "../lib/lanes";
import SubpageShell from "./subpage-shell";

// GitHub Pages serves the exported files and does not apply Next.js redirects,
// so a removed lane stays as this page: noindex, canonical, and an immediate
// refresh to the country page. The URL is left out of the sitemap.
export default function LaneRedirect({ lang, lane }: { lang: "en" | "zh"; lane: LaneKey }) {
  const zh = lang === "zh";
  const country = countries.find((item) => item.destination === lane.destination)!;
  const href = lanePath(country.slug, lang);
  const name = zh ? country.name.zh : country.name.en;
  return (
    <SubpageShell lang={lang} className="guide-page" languageHref={lanePath(country.slug, zh ? "en" : "zh")}>
      <meta httpEquiv="refresh" content={`0; url=${href}`} />
      <article className="guide-article wrap">
        <h1>{zh ? "这条航线页已撤下" : "This lane page has been removed"}</h1>
        <p>
          <a href={href}>{zh ? `查看${name}运价` : `View ${name} rates`}</a>
        </p>
      </article>
    </SubpageShell>
  );
}
