# SellonTube Site Map (start here to find anything)

One repo, one Astro + Netlify build, four "sites". Each section lists the URL, source, governing docs, scripts and where research lives.
Counts checked 2026-11-15 (61 blog posts, 16 tools). Re-count before quoting; do not edit by hand.
Full doc index: `DOCS.md`. Rules: `CLAUDE.md`. Lessons: `mistakes-lessons.md`.

## Where things live (rules of the layout)

| Folder | Holds | Move it? |
|---|---|---|
| `src/pages`, `src/components`, `src/data`, `src/utils`, `src/lib` | Site code | No. Astro fixes these paths. |
| `netlify/functions`, `netlify.toml`, `public/` | Server code, redirects, static files | No. |
| Root `*.md` (style-guide, seo-rules, growth-strategy, ai-seo-guide, ...) | Cross-site standards | No. 150+ refs from hooks, agents, memory, scripts. |
| `docs/` | SOPs, templates, brand, email, per-subsite docs | Yes, by subfolder. |
| `research/` | Data, exports, studies. `research/assets/` = loose images, PDFs, docx. | Yes. |
| `agents/` | 11 content/SEO agents. Read `agents/README.md` first. | No. |
| `scripts/` | Tooling, grouped below | No. |
| `seo/` | `site-kit/` (SEO config detail), `briefs/`, `reports/` | No. |
| `archive/` | Retired docs and commands | Read-only. |

## 1. Main marketing site

- **URLs:** `/`, `/pricing`, `/product-pricing`, `/about`, `/how-it-works`, `/changelog`, `/next-steps`, `/privacy-policy`, `/terms-of-service`
- **Source:** `src/pages/*.astro`, `src/navigation.ts`, `src/config.yaml`, `src/layouts/`, `src/components/widgets/`
- **Redirects and 410s:** `netlify.toml` (always ask before editing)
- **Docs:** `docs/brand-voice.md`, `docs/icp.md`, `style-guide.md`, `growth-strategy.md`
- **Build gate:** `scripts/validate-build.js` runs in the Netlify build command.

## 2. Blog (`/blog`)

- **Source:** `src/pages/[...blog]/`, posts in `src/data/post/` (61), `src/utils/blog.ts` (IST date filter), `src/data/authors.ts`, `src/components/blog/`
- **Docs:** `blog-production-standard.md`, `content-playbook.md`, `content-depth-framework.md`, `docs/sops/blog-publishing-sop.md`, `docs/sops/content-refresh-sop.md`, `docs/sops/ctr-optimization-sop.md`, `docs/templates/`
- **Agents:** `03-content-planner`, `04-blog-writer`, `05-content-qa`
- **Scripts:** `scripts/new-post.mjs`, `get-feature-image.mjs`, `generate-image-sitemap.mjs`, `audit_internal_links.py`
- **Keyword SSOT:** `research/keywords/sot_master.csv`
- **Reports:** `seo/reports/`

## 3. Tools (`/tools`, 16 tools)

- **Pages:** `src/pages/tools/*.astro` (index + 16). Tool list order: `src/pages/tools/index.astro` and `src/navigation.ts` Free Tools group.
- **Functions:** `netlify/functions/` (generate-*, youtube-*, get-transcript, channel-audit, ...), helpers in `netlify/functions/lib/`
- **Lead capture:** `capture-email.ts`, `loops-webhook.ts`, `cal-booking.ts`; widgets `FloatingEmailCapture`, `StickyEmailCapture`
- **Docs:** `agents/08-microtool-builder.md` (new-tool definition of done), `docs/email/` (Loops, nurture 01-07)
- **Scripts:** `scripts/health-check-tools.mjs`, `check-tool-error-tracking.mjs`, `bing-submit.mjs`, `indexnow-ping.js`
- **Tests:** `npm run test:functions`

## 4. Programmatic SEO

- **URLs:** `/youtube-for/`, `/youtube-vs/`, `/youtube-video-ideas/` (each with `[slug]` children; `youtube-for/shopify.astro` is a static override)
- **Data:** `src/data/niches.ts`, `src/data/comparisons.ts`, `src/data/topics.ts`
- **Docs:** `seo/site-kit/pseo.md`, `docs/sops/pseo-publishing-sop.md`, `agents/06-pseo-manager.md`
- **Rule:** children go live on `publishDate` (IST). Never change it without asking.

## 5. `/shopify-app` subsite

- **Pages:** `src/pages/shopify-app.astro`, `src/pages/shopify-app/case-studies/`, `src/pages/shopify-app/tools/` (review scraper, store listing grader + report)
- **Code:** `src/lib/grader/`, `src/lib/reviews/`, `src/components/widgets/ShopifyAppTheme.astro`
- **Functions:** `grade-listing.ts`, `send-grader-report.ts`, `get-report.ts`, `scrape-reviews.ts`
- **Docs:** `docs/shopify-app/` (10 files; start at `shopify-app-CLAUDE.md`, it routes the rest). Moved here from `shopify-app-marketing/` on 2026-11-15.
- **Redirect:** grader report route in `netlify.toml`.

## 6. `/ai-seo` subsite (incl. `/ai-seo/dental`)

- **Pages:** `src/pages/ai-seo/index.astro`, `dental.astro`, `case-studies/[slug].astro`
- **Components:** `src/components/ai-seo/` (shell: Header, Footer, Theme, Tracking, Flow; dental: Dental*; shared: AnswerCheckForm, ProofGrid, charts)
- **Data:** `src/data/ai-seo.ts`, `src/data/ai-seo-dental.ts`
- **Dental switch:** `DENTAL_INDEXABLE` in `src/data/ai-seo-dental.ts` controls meta robots AND the sitemap filter in `astro.config.ts`. It is `false` (noindex) until the offer is validated.
- **Dental rules:** no price, no guarantee, no dental client results, no founder names or photos, every stat names its source, outreach links carry UTMs. One action only: "Book a free discovery call" (Cal); no free audit (2026-11-17). Page-only navy palette set in `dental.astro`. Header of `ai-seo-dental.ts` has the full list.
- **Dental components:** `DentalReportCard`, `DentalSystem`, `DentalSearchPanels`. The old audit form and its helper components were deleted on 2026-11-17.
- **Leads:** forms post to `netlify/functions/capture-email.ts`. Source `ai-seo-answer-check` skips Loops and gets a manual reply. The dental page has no form; its only action is the Cal link.
- **Docs:** `docs/ai-seo-subsite-brief-2026-11-06.txt`, `ai-seo-guide.md` (AEO SSOT), `docs/sops/monthly-ai-seo-checklist.md`
- **Research:** `research/ai-seo/dental/` (source PDF), `research/private/ai-seo-evidence-register.md` (git-ignored, never commit)
- **Verify after build:** `dist/` has the dental page with noindex and absent from the sitemap.
- **Open items:** see memory files `project_ai_seo_subsite_2026_11_06` and `project_ai_seo_design_review_2026_11_09`. Answer-block exception review due 2027-02-04.

## 7. Case studies (`/case-studies`)

- **Pages:** `src/pages/case-studies/` (luxury-jewellery-client, us-supplements-brand; no index page), `src/pages/shopify-store.astro`
- **Widget:** `src/components/widgets/CaseStudyShowcase.astro`
- Unclear: `src/pages/shopify-services.html` (raw HTML in pages dir). Not verified whether Astro serves it.

## Cross-cutting

- **Scripts by purpose:**
  - SEO/GSC: `gsc-sitemap-submit.js`, `fetch_seo_data.py`, `mcp_seo_server.py`
  - Indexing: `bing-submit.mjs`, `indexnow-ping.js`
  - Keyword data: `build_sot_*.py`, `refresh_keyword_volumes.py`, `update_keyword_tiers.py`
  - Social agents: `linkedin-agent/`, `x-agent/`, `lib/zernio.js`
  - Retired: `scripts/archive/`
- **Research folders:**
  - `aeo/` AEO audits and baselines
  - `analytics/` exports, GSC studies, `growth-audit/`, `crawled-not-indexed-2026-08-30/`
  - `keywords/` keyword sets
  - `search console/` GSC exports
  - `teardowns/` competitor teardowns
  - `ai-seo/` per-subsite research
  - `assets/` loose images, PDFs, docx
  - `private/` git-ignored
- **Hosting:** live is Netlify (`netlify.toml`). `Dockerfile`, `docker-compose.yml`, `nginx/`, `vendor/` and `vercel.json` look like AstroWind template leftovers (no package.json script uses them). Not deleted; deleting needs owner approval.
