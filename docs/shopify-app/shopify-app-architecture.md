# shopify-app-architecture.md — Page Map / Sitemap, URLs, Nav, Indexing (read before building or linking pages)

> Top rule: every page under `/shopify-app/*` serves the mission (installs / conversion / retention) and stays inside the boundary. No core-service nav, tools, or CTAs anywhere in this section.

## Sitemap

- `/shopify-app` — **landing page.** Holds the four positioning pillars as on-page sections (no separate pillar pages for now). Primary CTA: book a discovery call.
- `/shopify-app/tools` — **hub.** Grows over time. Each tool lives at `/shopify-app/tools/[keyword-slug]`. Lead-magnet logic in `shopify-app-tools.md`.
- `/shopify-app/case-studies` — **hub.** Each study at `/shopify-app/case-studies/[keyword-slug]`.
  - CS1 — Left Foot Software (`/shopify-app/case-studies/[keyword-slug]`).
  - CS2 — YouTube-vs-blog (Shopify app company), 12-month data. **Native page, NOT a redirect** to the core blog post. Headlined as the 3.25x channel comparison (see `shopify-app-facts.md`). Shopify-funnel CTAs only.
- `/shopify-app/resources` — **hub.** Internal original content + curated external links. Two layers per `shopify-app-resources.md`.

## URL convention

Keyword-first slugs under each hub (e.g. `/shopify-app/tools/shopify-app-store-listing-grader`). Each tool/case-study/resource page is independently indexable and targets its own bottom-of-funnel query.

## Navigation

Dedicated `/shopify-app/*` nav: Home · Tools · Case Studies · Resources · Book a call. **Must not expose the core SellOnTube YouTube nav or tools.** A Shopify-app founder should never bleed into the core funnel.

## Indexing + launch order

- **noindex thin/empty hubs** until populated; do not prominently link empty hubs from the landing page.
- Launch one page at a time. Suggested order: landing (live) → first case study (Left Foot) → first tool → resources → second case study — adjust to whatever is ready and substantiated first.
- A hub goes index-able once it has real content.

## Boundary guards (for this section specifically)

- No YouTube ROI calculator, YouTube diagnostic-call, or core-service language anywhere under `/shopify-app/*`.
- CS2 is reframed for Shopify app services; it must not read as core YouTube-acquisition marketing.

## Open items

- [DECISION NEEDED: split the four pillars into dedicated `/shopify-app/[pillar]` SEO pages later?] Deferred; revisit on per-pillar search demand.
- ~~[NEEDS INPUT: CS2 company identity]~~ RESOLVED: different company from Left Foot; anonymous (cannot be named publicly).
