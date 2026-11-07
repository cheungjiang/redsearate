# Red Sea Rate

Responsive English (`/`) and Simplified Chinese (`/zh`) freight-estimation and lead-capture website. Next.js App Router, React, TypeScript, hand-built responsive CSS. No paid APIs required.

## Run

```sh
npm ci
npm run dev
```

Production: `npm run build` writes a static site to `out/`. Checks: `npm test` and `npm run typecheck`.

## How prices work

Prices live in the Notion database "RedSeaRate 报价库". Every row reaches the site without manual review unless its 审核状态 is 拒绝; rejected rows never leave Notion. `npm run fetch-prices` (`scripts/fetch-notion.ts`) queries the rows that are not rejected and writes `.data/public-prices.json`, which the build reads. Each row maps to a tier:

| 报价类型          | Tier     | What the public site shows                                                                                                          |
| ----------------- | -------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| 你们可提供的报价  | offer    | Shown directly as a range, with valid-until date                                                                                    |
| AI收集的市场价    | market   | Only the median, once a lane has 5 or more current prices from the last 28 days; outliers more than 50% from the median are dropped |
| 内部底价          | internal | Never fetched                                                                                                                       |

A row is skipped unless its currency is USD and its unit is USD/柜 (USD/W/M for LCL). Shekou counts as Shenzhen. Only Shanghai, Ningbo, Shenzhen and Qingdao have estimator lanes; quotes from other origins count only towards the port index. `40HQ` is stored as the site's `40HC`. 报价日期 dates the price for the 28-day window and the weekly trend (blank: the row's creation date). 有效期 sets the valid-until date, using the end of a range; a blank 有效期 means 7 days after the quote date. The fetch log lists skipped rows by reason. This mapping lives in `lib/notion-prices.ts`.

The index snapshot shows, for each destination port, the median of 40HQ market quotes dated in the last 28 days from all China origins, once 5 or more remain after outliers are dropped. Week on week compares with the same 28-day median as of 7 days earlier. Offers are not included. This lives in `liveIndex` in `lib/platform.ts`.

Prices are port-to-port USD, per container for FCL and per W/M for LCL. Expired prices drop out and lanes without data show "请询价". The weekly trend chart plots weekly market medians and stays empty until real data exists. Source links, notes, carriers and single quotes are never fetched, so they cannot appear on the site. The aggregation lives in `lib/rates.ts` and is covered by `lib/rates.test.ts`.

Visitors inquire through WeChat (copy a prefilled message) or WhatsApp (opens a prefilled chat with one of the team's numbers, assigned at random). The site stores no visitor data.

## Deployment

`.github/workflows/deploy.yml` tests, fetches prices from Notion, builds and publishes `out/` to GitHub Pages on every push to `main`, every hour, and on manual runs (Actions → Deploy to GitHub Pages → Run workflow). Pages are prerendered, so a Notion change, including marking a row 拒绝, appears after the next run. The hourly run also retires expired prices.

- Repository secret `NOTION_TOKEN`: an internal Notion integration token with read access to "RedSeaRate 报价库". Without it the workflow fails and the last deployed site stays up.
- `NOTION_DATA_SOURCE_ID` (default: the 报价库 data source) and `PUBLIC_PRICES` (default `.data/public-prices.json`) are optional overrides.
- `public/CNAME` sets the custom domain `redsearate.com`. DNS: apex A records `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`, and `www` CNAME `cheungjiang.github.io`.

## Configuration

Build-time environment variables: `SITE_WECHAT` (default `uarmside`) and `SITE_WHATSAPP` (comma-separated international numbers; defaults to the team's four. Each visitor is assigned one at random and keeps it on later visits).

### Simulated data

`SHOW_SIMULATED_DATA` is a build-time flag controlling the demonstration index,
sparklines and the four TEST DATA rows on the homepage and `/rates` (`/zh/rates`
in Simplified Chinese).

- Unset in development (`npm run dev`): enabled.
- Unset in a production build (`npm run build`, including the deploy workflow): disabled.
- Exactly `true`: enabled, with simulation and non-bookable warnings on every sample row.
- Exactly `false`, an empty value or any unrecognized value: disabled.

For a local static preview with fixtures:

```sh
SHOW_SIMULATED_DATA=true npm run build
python3 -m http.server 3100 --directory out
```

The deploy workflow leaves the flag unset. The decision is made when the pages
are built, not through a `NEXT_PUBLIC` variable, URL parameter or local storage.
Disabled fixtures are not written to HTML or client props; the browser cannot
re-enable them. The index falls back to "尚未发布" and the real rates table uses
approved public references or "请询价". Existing records without evidence remain
ungraded, and missing carrier or timestamp fields stay unavailable.

Fixtures are fixed UI examples, including all carriers, grade assignments, dates,
timestamps and sample counts. They never enter the Notion price data, estimator, inquiry
text or booking actions. A/B/C describes evidence status (verified record,
source-attributed record, indicative record), not guaranteed price or space.

## Before public launch

Approve real prices in Notion, set the WhatsApp number, add company and legal details, and decide whether China mainland visitors need a mainland host or CDN. Guide content is first-version copy; compliance topics need review by someone with hands-on experience.

SEO: prerendered localized pages with prices in the HTML, correct HTML language, per-language metadata, canonical and hreflang, Open Graph, robots and sitemap. Latin fonts are self-hosted under their bundled SIL Open Font Licenses; Chinese uses system fonts. No external requests.
