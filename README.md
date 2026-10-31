# Red Sea Rate

Responsive English (`/`) and Simplified Chinese (`/zh`) freight-estimation and lead-capture website. Next.js App Router, React, TypeScript, hand-built responsive CSS. No paid APIs required.

## Run

```sh
npm ci
npm run dev
```

Production: `npm run build && npm start`. Checks: `npm test` and `npm run typecheck`.

## How prices work

The team records every price it hears about in the private price pool at `/pool`. Each entry is one of three tiers:

| Tier              | What it is                                     | What the public site shows                                                                                                          |
| ----------------- | ---------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| 本站报价 offer    | A price we can book and are willing to publish | Shown directly as a range, with transit and valid-until date                                                                        |
| 市场价 market     | Quotes from forwarders, carriers or customers  | Only the median, once a lane has 5 or more current prices from the last 28 days; outliers more than 50% from the median are dropped |
| 内部底价 internal | Buy rates and peer floor prices                | Never shown                                                                                                                         |

Prices are port-to-port USD, per container for FCL and per W/M for LCL. Every price has a valid-until date; expired prices drop out automatically and lanes without data show "请询价". The weekly trend chart plots weekly market medians and stays empty until real data exists. Sources, notes, recorder names and single quotes stay inside `/pool`. This logic lives in `lib/rates.ts` and is covered by `lib/rates.test.ts`.

Visitors inquire through WeChat (copy a prefilled message) or WhatsApp (opens a prefilled chat with one of the team's numbers, assigned at random). The site stores no visitor data.

## Configuration

Set these environment variables for the server:

- `POOL_ACCESS_KEY` (required to open `/pool`): one shared key for the team. Without it the pool stays closed.
- `SITE_WECHAT` (default `uarmside`), `SITE_WHATSAPP` (comma-separated international numbers; defaults to the team's three. Each visitor is assigned one at random and keeps it on later visits), `SITE_OPERATOR` (default `chinairantrucks`).
- `PRICE_DB` (default `.data/prices.db`): SQLite file. Back it up; it is the price pool.
- `PRICE_API_KEY`: key for `/api/prices` (CSV import and export for Grokbot and backups). See [docs/grokbot.md](docs/grokbot.md) for the CSV format, keep-awake ping and the daily backup to the private `KarmaKong/redsearate-prices` repository (`scripts/backup-prices.sh`).

Hosting needs a Node 22.5+ server with a persistent disk (a VPS or a container with a volume), not a static host or serverless platform, because the pool writes to SQLite.

### Simulated data

`SHOW_SIMULATED_DATA` is a server-only flag controlling the demonstration index,
sparklines and the four TEST DATA rows on the homepage and `/rates` (`/zh/rates`
in Simplified Chinese).

- Unset in development: enabled.
- Unset in production (`next start`): disabled.
- Exactly `true`: enabled, with simulation and non-bookable warnings on every sample row.
- Exactly `false`, an empty value or any unrecognized value: disabled.

For a local production-build preview with fixtures:

```sh
npm run build
SHOW_SIMULATED_DATA=true npm start -- --hostname 127.0.0.1 --port 3100
```

For production, leave the flag unset or set it to `false`:

```sh
SHOW_SIMULATED_DATA=false npm start
```

The decision is made per request on the server, not through a `NEXT_PUBLIC`
variable, URL parameter or local storage. Disabled fixtures are not sent in HTML,
client props or public browser bundles; the browser cannot re-enable them.
The index falls back to "尚未发布" and the real rates table uses approved public
references or "请询价". Existing records without evidence remain ungraded, and
missing carrier or timestamp fields stay unavailable.

Fixtures are fixed UI examples, including all carriers, grade assignments, dates,
timestamps and sample counts. They never enter the price pool, estimator, inquiry
text or booking actions. A/B/C describes evidence status (verified record,
source-attributed record, indicative record), not guaranteed price or space.

## Before public launch

Enter real prices, set the WhatsApp number, add company and legal details, back up `PRICE_DB`, and decide whether China mainland visitors need a mainland host or CDN. Guide content is first-version copy; compliance topics need review by someone with hands-on experience.

SEO: server-rendered localized pages with prices in the HTML, correct HTML language, per-language metadata, canonical and hreflang, Open Graph, robots (`/pool` disallowed) and sitemap. Latin fonts are self-hosted under their bundled SIL Open Font Licenses; Chinese uses system fonts. No external requests.
