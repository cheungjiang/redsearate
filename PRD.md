# RedSeaRate Product Requirements

Status: Sections 5.1 and 9 approved for implementation on 2026-10-31. Other unresolved live-data requirements remain open.
Date: 2026-10-30
Scope: Homepage and navigation restructuring.

This document records the restructuring requirements supplied in this conversation. It does not reproduce the missing original PRD. Section 4 defines the requested platform structure. Section 7 contains proposed Phase 1 acceptance checks, not recovered or previously approved criteria.

`[PLACEHOLDER: ...]` identifies a decision that still needs confirmation. Proposed behavior is labeled explicitly. Neither a placeholder nor a proposal authorizes inventing data or expanding implementation scope.

## 1. Product purpose

RedSeaRate helps visitors examine China-to-Red-Sea freight rates, find available shipping space and cargo loads, and contact the team for a quote.

The homepage should introduce the platform through rate information and recent posts while retaining the current editorial maritime visual style.

## 2. Current application

- The application lives in this repository root and uses Next.js, React and TypeScript.
- The current public homepages are `/` in English and `/zh` in Simplified Chinese.
- The current design uses self-hosted fonts, a ship photograph, a warm light background, dark text and coral accents. Preserve the existing palette and fonts.
- Visitors can estimate FCL or LCL shipments and prepare inquiries for WeChat or WhatsApp.
- The private SQLite price pool distinguishes bookable offers, market quotes and internal prices. These are price types, not A/B/C grades.
- Destination records include Jeddah (`SAJED`), Sokhna (`EGSOK`), Aqaba (`JOAQJ`), Djibouti (`DJJIB`) and Port Sudan (`SDPZU`), in the approved section 9.1 order.
- The existing equipment identifier is `40HC`. The requested index label is `40HQ`; their display and storage mapping needs confirmation.
- Current public market references require at least five eligible samples after outlier filtering, within a 28-day window and with unexpired validity. These existing rules are context, not an approved methodology for the new index.

## 3. Scope and constraints

### Confirmed scope

1. Restructure navigation and the homepage as specified in section 4.
2. Add a five-port index snapshot, a rates table preview and a two-column latest-posts section.
3. Use the brand name `RedSeaRate` consistently across user-visible branding.
4. Replace the footer operator attribution with a neutral placeholder until the operator wording is confirmed.
5. Preserve the current color palette, font families and typography direction.
6. Provide before/after screenshots and report Phase 1 acceptance results.

### Preservation requirements

- Retain English and Simplified Chinese support.
- Keep the estimator, FCL/LCL calculations and existing contact channels working.
- Keep private prices, sources, notes and recorder identities out of public responses and rendered pages.
- Do not fabricate rates, changes, sample counts, validity dates, timestamps or posts.
- Do not modify production data, secrets or operational configuration as part of visual restructuring.

### Not authorized by this draft

Full membership, account registration, post submission, moderation, agent verification, payments, a new database architecture, deployment and publishing are not approved deliverables. Adding navigation labels does not by itself authorize building these systems.

## 4. Platform structure

### 4.1 Top navigation

Display links in this order:

1. Rates
2. Space Board
3. Loads
4. Agents
5. Brief
6. Guides

Include a `Join` button and the quote button. Retain language switching.

- Use `RedSeaRate` as the header brand.
- Preserve the current navigation's visual language and fonts.
- Keep all six destinations and both actions accessible on mobile.
- Navigation targets must work; do not ship dead links or pretend an unavailable service is live.
- `[PLACEHOLDER: Confirm URLs or homepage anchors for all six navigation items.]`
- `[PLACEHOLDER: Confirm whether Agents and Brief need homepage sections, dedicated pages or another destination in Phase 1.]`
- `[PLACEHOLDER: Confirm Join destination, action and Phase 1 behavior. Registration is not assumed.]`
- `[PLACEHOLDER: Confirm exact English and Chinese labels, including Join and the quote button.]`

### 4.2 Homepage order

The required content order is:

1. Header and navigation.
2. Existing hero, retaining its visual style and typography.
3. Index snapshot strip, directly under the hero.
4. Rates table preview.
5. Latest posts, with latest spaces and latest loads in two columns on desktop.
6. Retained supporting content and footer, subject to the placement decision below.

The index strip must be the first content section after the hero. Do not insert the current overlapping estimator between the hero and the index.

- `[PLACEHOLDER: Confirm where the existing estimator moves, or whether it becomes part of the Rates destination.]`
- `[PLACEHOLDER: Confirm placement or removal of the existing trend panel, brand statement, guides, CTA and FAQ without disrupting the required order.]`

### 4.3 Index snapshot strip

Show five core destination ports. For each port display:

- Port name.
- `40HQ` median freight rate.
- Week-over-week change.
- Sample size.

The index must distinguish missing data from a zero price, zero change or zero samples.

Known destination records are listed in section 2. They are candidates for the five-port set, not a confirmed final list.

- `[PLACEHOLDER: Confirm the final five ports, their order and port codes, including the missing fifth port.]`
- `[PLACEHOLDER: Confirm that public 40HQ maps to existing 40HC records, or define the intended equipment distinction.]`
- `[PLACEHOLDER: Define index currency, unit and included or excluded charges.]`
- `[PLACEHOLDER: Define origin scope: one origin, selected origin or an aggregation across origins.]`
- `[PLACEHOLDER: Define eligible price types, aggregation period, outlier handling and minimum sample threshold.]`
- `[PLACEHOLDER: Define whether sample size counts raw or retained samples, quotes or distinct contributors.]`
- `[PLACEHOLDER: Define week boundaries, timezone, comparison period and whether change is a percentage or currency amount.]`
- `[PLACEHOLDER: Define behavior for an incomplete week, a missing prior week and a zero prior median.]`
- `[PLACEHOLDER: Define freshness, refresh cadence and insufficient-data copy.]`

Proposed safeguard: calculate comparisons only between matching origin, destination, equipment, currency and charge scopes. Show an explicit unavailable state when a comparable prior period does not exist. This proposal requires approval.

### 4.4 Rates table preview

Place the rates preview after the index and before latest posts.

Confirmed required information:

- Freight rate information.
- A/B/C grade badges.
- Validity.
- Update time.

Proposed identifying columns: origin, destination, equipment and USD rate or range. These make rows distinguishable, but the final column set needs approval.

- `[PLACEHOLDER: Confirm columns, labels, ordering, default sorting and preview row limit.]`
- Approved A/B/C meanings and assignment rules are in section 5.1. Do not map offer/market/internal to A/B/C by assumption.
- `[PLACEHOLDER: Define behavior for ungraded records and expired records.]`
- `[PLACEHOLDER: Confirm whether this table publishes offers, aggregate market references or both, and how each is distinguished.]`
- `[PLACEHOLDER: Define the source and timezone of update time: submission, modification or verification time.]`
- `[PLACEHOLDER: Confirm date/time formatting and rate-table actions, including any full-list destination.]`

Proposed safeguards: show grades as text as well as visual badges; retain the current palette; never use render time as a record's update time. Existing records have a creation timestamp, which is not evidence of later verification. These proposals require approval.

### 4.5 Latest posts

Below the rates preview, show:

- Left column: latest spaces.
- Right column: latest loads.

Use the current type hierarchy, spacing language and palette rather than introducing a new visual theme.

- `[PLACEHOLDER: Confirm the source of space and load posts. No approved post source has been supplied.]`
- `[PLACEHOLDER: Confirm minimum fields for each post type.]`
- `[PLACEHOLDER: Define latest ordering, timestamps, expiry and eligibility for public display.]`
- `[PLACEHOLDER: Confirm preview counts, detail destinations and contact actions.]`
- `[PLACEHOLDER: Define public contact fields, publishing permissions and moderation requirements.]`
- `[PLACEHOLDER: Confirm empty-state text and behavior before posts are available.]`

Proposed responsive behavior: stack spaces above loads on narrow screens. Proposed empty state: show a truthful no-posts message instead of sample listings. Neither proposal authorizes a publishing backend.

### 4.6 Brand and footer

- Use exactly `RedSeaRate` for user-visible brand references, including the header, footer, document titles, social metadata and inquiry attribution.
- Retain the domain `redsearate.com`; brand capitalization does not require changing URLs, package identifiers or environment-variable names.
- Remove the current named operator attribution from the public footer.
- `[PLACEHOLDER: Neutral footer operator text, English and Simplified Chinese, pending confirmation.]`
- `[PLACEHOLDER: Final approved operator wording and any required legal attribution.]`

Do not substitute an invented company name, ownership claim or legal entity. Do not publish the internal `[PLACEHOLDER: ...]` markers as finished website copy.

## 5. Data and publication boundaries

Private price records must remain private. The new public sections may consume only approved public summaries or explicitly publishable records.

Keep separate:

- Price type: existing offer, market or internal classification.
- Grade: the approved evidence classification in section 5.1; real records still need explicit grading evidence.
- Price period: the interval used to compute a median and change.
- Validity: how long a quote remains valid.
- Update time: a timestamp with a defined source.

An empty public section is acceptable while data is unavailable. A successful render is not proof that index mathematics, grade assignment or post eligibility is correct.

`[PLACEHOLDER: Approve public data contracts and any necessary storage changes after the index, grade and post rules are resolved.]`

### 5.1 A/B/C grade definitions

Status: Approved for the homepage-fix implementation on 2026-10-31. These definitions were drafted in this conversation, not recovered from the missing original PRD.

Grades describe the evidence behind a rate record, not carrier quality, guaranteed space, a bookable price or an official freight index.

- **A: Verified record.** An authorized reviewer has checked a traceable source document against the route, equipment, currency, charge scope, carrier and validity period. A verification timestamp and evidence reference are retained privately.
- **B: Source-attributed record.** The source is traceable and the required identifying fields are complete, but an authorized reviewer has not completed the checks required for A.
- **C: Indicative record.** The information is incomplete or its supporting evidence has not been verified. It is a planning reference, not a confirmed offer.

Public legend:

- `A: Verified record`
- `B: Source-attributed record`
- `C: Indicative record`

Simplified Chinese legend:

- `A：已核验记录`
- `B：来源可追溯`
- `C：指示性参考`

Assignment and publication rules:

- Assign grades explicitly. Do not infer them from price, sample size, the publisher's identity or the existing offer/market/internal classification.
- Existing records without grading evidence remain `Ungraded`; do not backfill A, B or C automatically.
- A grade does not bypass the existing market aggregation threshold, privacy restrictions, validity rules or the prohibition on publishing internal prices.
- Expired prices remain expired regardless of grade. Downgrading a record does not make an expired price current.
- Keep source documents, private contact details, reviewer identities and internal notes out of public payloads.
- The sample rows in section 9 may demonstrate all three badge variants, but their grades are fictional UI fixtures. Mark them `TEST DATA` and `模拟数据 · 不可订舱`; they do not represent completed verification.
- Approval of these definitions does not authorize adding a grading workflow or migrating production records in this homepage-fix task.

## 6. Visual and interaction requirements

- Preserve existing font families, local font assets, palette and overall editorial maritime style.
- Adapt layout and hierarchy to the additional platform content without redesigning the brand.
- Keep navigation and primary actions usable with keyboard and touch.
- Give tables semantic headings; do not communicate grade or change direction through color alone.
- Prevent whole-page horizontal overflow. If a wide table needs horizontal scrolling, keep it within its own accessible container.
- Respect reduced-motion preferences.
- Keep essential public content server-rendered where the current application supports it.

The accessibility and rendering details above are proposed Phase 1 quality requirements. Their exact acceptance thresholds remain subject to section 7 approval.

## 7. Phase 1 acceptance checks

### 7.1 Status and reporting

This checklist is proposed from the supplied requirements. The original Phase 1 criteria were unavailable.

`[PLACEHOLDER: Approve or replace this checklist, including any missing original Phase 1 requirements and thresholds.]`

For each check, report `PASS`, `FAIL`, `BLOCKED` or `NOT RUN`, with evidence. A check dependent on an unresolved decision must remain `BLOCKED`; it must not be counted as passed.

### 7.2 Structure and branding

- P1-01: Navigation presents Rates / Space Board / Loads / Agents / Brief / Guides in order, plus Join, the quote action and language switching.
- P1-02: Every navigation destination and action matches its approved behavior on desktop and mobile. Blocked until section 4.1 destinations and Join behavior are confirmed.
- P1-03: The index strip immediately follows the hero, followed by rates preview and latest posts.
- P1-04: The snapshot contains exactly the five approved ports and shows a 40HQ median, week-over-week change and sample size for each, or the approved unavailable state. Blocked until port and index rules are approved.
- P1-05: The rates preview includes approved A/B/C grades, validity and update time. Blocked until grading, timestamp and table rules are approved.
- P1-06: Latest spaces and latest loads appear in separate desktop columns with the approved mobile arrangement, real post data or approved empty states. Data eligibility and field checks remain blocked until post rules are approved.
- P1-07: User-visible branding reads exactly `RedSeaRate` in both languages, including metadata and inquiry attribution.
- P1-08: The footer no longer exposes the previous operator attribution and uses approved neutral copy. Exact-copy acceptance remains blocked until placeholder wording is approved.
- P1-09: Existing palette values and font families are unchanged; the editorial visual direction is retained.

### 7.3 Data correctness and privacy

- P1-10: Controlled tests verify median, sample size and week-over-week calculations against the approved methodology. Include insufficient samples, absent prior periods, period boundaries and expired records. Blocked until the methodology is approved.
- P1-11: Record validity and update times come from the approved sources rather than the current render time.
- P1-12: Internal prices, individual market quotes and private source, note and recorder fields are absent from public HTML, client payloads and public data endpoints.
- P1-13: Missing data is not represented as a fabricated quote, flat change, grade or post.

Use isolated test data to exercise non-empty states without writing fixtures into the production price pool.

### 7.4 Existing behavior and responsive checks

- P1-14: Existing FCL quantity calculations and LCL W/M calculations still pass their regression tests.
- P1-15: Selected origin, destination and equipment remain consistent across rates, estimator results and inquiry text.
- P1-16: Quote and booking inquiries still work, including clipboard feedback and correctly formed WhatsApp links. Do not send messages during verification.
- P1-17: Mobile menu, keyboard focus, form labels and dialog dismissal remain usable.
- P1-18: Both locales render without page-level horizontal overflow or clipped primary controls at the proposed widths of 320, 375, 768 and 1440 pixels.
- P1-19: Reduced-motion behavior remains functional.

`[PLACEHOLDER: Confirm browser/device coverage, viewport widths, accessibility standard and any measurable performance targets.]`

### 7.5 Engineering checks

Run the current project scripts from the repository root:

- `npm test`
- `npm run typecheck`
- `npm run build`

P1-20: Record each command's exit status and relevant warnings. Add regression tests for newly approved aggregation or publication rules.

The current package scripts do not define a lint command. Do not claim a lint pass unless a lint check is explicitly added and run.

`[PLACEHOLDER: Confirm whether Phase 1 also requires linting, automated browser tests, CI or other release checks.]`

### 7.6 Before/after evidence

P1-21: Capture the current homepage before restructuring and the implemented homepage afterward, using matching language, viewport, zoom and scroll position.

Proposed evidence set:

- English desktop at 1440 pixels.
- Simplified Chinese desktop at 1440 pixels.
- English mobile at 375 pixels.
- Simplified Chinese mobile at 375 pixels.
- Full-page captures for section order and first-viewport captures for style comparison.

Record the capture date, preview URL, viewport and whether data is live or an isolated fixture. Use the same dataset and reference time where practical; disclose differences when not possible.

`[PLACEHOLDER: Confirm screenshot sizes and delivery location.]`

Before screenshots must show the actual pre-change implementation. Do not reconstruct them afterward from memory or present the reference design image as the before state.

## 8. Decisions required before final acceptance

1. Live index methodology; the five-port set and order are specified in section 9.1.
2. 40HQ/40HC mapping and the full index methodology.
3. Real-data grading evidence and operational workflow; section 5.1 defines the approved badge meanings.
4. Table columns, validity behavior and update-time source.
5. Space/load data sources, fields, expiry and public eligibility.
6. Navigation targets and Join behavior.
7. Estimator placement and treatment of existing supporting sections.
8. Neutral footer copy, final operator wording and localized labels.
9. Phase 1 acceptance criteria, thresholds and screenshot requirements.

The document can guide a scope discussion now. Unresolved rules must be confirmed before an implementation is described as fully accepted.

## 9. Homepage fixes and simulated-data safeguard

Status: Approved for implementation by the user's 2026-10-31 instruction. Live index methodology and real grading workflows remain outside this task.

Explicit requirements in this section supersede matching placeholders in earlier sections. Other unresolved decisions remain unresolved.

### 9.1 Five core ports

Use this display order:

1. Jeddah, `SAJED`.
2. Sokhna, `EGSOK`.
3. Aqaba, `JOAQJ`.
4. Djibouti, `DJJIB`.
5. Port Sudan, `SDPZU`.

Replace the unconfirmed fifth slot with Djibouti, labeled `吉布提` in Simplified Chinese. Each port has the same median, week-over-week change, sample count and sparkline treatment when simulation is enabled. This resolves the port-list placeholder in section 4.3 for this task; it does not approve a live index methodology.

Keep simulated 40HQ data separate from the real 40HC records. Adding Djibouti does not authorize relabeling or rewriting historical price records.

### 9.2 Homepage supply and demand

The homepage must render latest spaces and latest loads directly after the rates preview. Retain the two-column desktop layout and stacked mobile layout.

When there are no approved posts, use honest empty states:

- Spaces: `暂无已发布舱位，发布来源确认后展示。`
- Loads: `暂无已发布货盘，发布来源确认后展示。`

Retain equivalent English empty states. Do not create sample posts, inferred availability, fake publishers or cargo listings to fill either section.

### 9.3 Rates preview and rates page

Both the homepage preview and `/rates` must render an actual semantic table, not just the estimator. Preserve a usable path back to the homepage and retain localized navigation.

Each displayed sample row includes:

- Origin and destination.
- Container type.
- Price with currency and unit.
- Carrier.
- Grade badge and the section 5.1 legend.
- Valid-from and valid-until dates.
- Last-updated timestamp.

Show three or four fixed sample rows when simulation is enabled, covering A, B and C. Use fictional carrier labels such as `TEST Carrier 01`, not a real carrier name presented as the source of a fictional quote.

Label the sample table and every sample row `TEST DATA` and `模拟数据 · 不可订舱`, with an equivalent English warning. Dates, timestamps, prices, carriers and grades are all illustrative. Never use the current render time as a sample record's last-updated time.

Sample rows must not enter the real database, estimator, booking requests, inquiry text or real rate aggregation. They must not expose a book-now action. Existing legitimate public prices, if shown, must remain visibly distinct from fixtures.

The real-data path must continue to show `请询价` or unavailable fields where approved information is missing. Unknown carrier, grade and timestamps must not be invented.

### 9.4 Single simulation flag

Use one server-side environment flag: `SHOW_SIMULATED_DATA`.

- Explicit `true` enables the clearly labeled demonstration.
- Explicit `false` disables simulated index values, sparklines and sample rate rows.
- An unset flag defaults to enabled for development and disabled for production runtime.
- An unrecognized value, including an explicitly empty value, disables simulation.
- A local preview running through `next start` is a production-mode runtime; explicitly set `SHOW_SIMULATED_DATA=true` when that local preview needs fixtures.
- Production deployment must leave the flag unset or set it to `false`. Enabling simulation never removes the simulation warnings or makes fixtures real.

When disabled, the index shows `尚未发布` and unavailable metrics. The rates table shows legitimate public information or `请询价`; it contains no sample rows, fixture prices, fixture carriers or fixture timestamps.

Enforce the flag before sending data to the browser. Do not serialize disabled fixtures into public HTML, RSC/client props or API responses, and do not rely on CSS hiding or a browser-only toggle. A query parameter, local storage value or client toggle must not be able to override the server's disabled state.

Document the defaults, accepted values and local-preview commands in `README.md`. Do not modify production secrets or deployment configuration as part of this task.

### 9.5 Preservation, evidence and commit

- Preserve the existing palette, font families, visual direction and all copy outside the requested changes.
- Capture the full homepage and `/rates` before editing. If `/rates` does not exist, capture and identify the actual 404 state.
- Capture matching after screenshots, including desktop and 390-pixel mobile views. Record locale, viewport, date, preview URL and simulation flag state.
- Verify no page-level horizontal overflow at 390 pixels. Keep any wide-table scroll inside its own accessible container.
- Re-run section 7 checks, including both flag states, five ports, table rows, badge labels, boards, privacy, estimator behavior and inquiry isolation.
- Check production-default and explicit-false responses for the absence of fixture data. Test the default through a production build/runtime, not only the development server.
- Report unresolved real-data methodology or publication decisions as blocked, not passed because fixtures render.
- Commit the approved implementation in one commit titled `homepage-fixes-ports-boards-badges`, with the required co-author attribution. Do not push, deploy or create a PR without a usable destination and the applicable authorization.
