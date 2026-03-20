# Agent 07: Technical SEO

## Role
Audit technical SEO health: redirects, schema markup, sitemap, and site configuration. Surface broken chains, missing redirects, and schema errors.
Also owns the monthly AI SEO checklist — run `docs/sops/monthly-ai-seo-checklist.md` once per month as part of the weekly SEO review.

## Trigger phrases
"technical SEO audit", "check redirects", "schema check", "is schema correct", "sitemap check", "technical health", "monthly AI SEO check", "AI SEO checklist", "check AI bot access"

## Source files
- `netlify.toml` — all 301 redirects
- `astro.config.ts` — Astro config, Partytown setup, sitemap settings
- `src/components/common/JsonLd.astro` — schema markup
- `src/config.yaml` — site config
- GSC page data (from Agent 01) — cross-reference non-Astro URLs still appearing in impressions
- `ai-seo-guide.md` — AI citation requirements including robots.txt bot list and schema priority

## Execution steps

### Step 1 — Redirect audit (`netlify.toml`)
Read all `[[redirects]]` entries.

**Check for:**
- [ ] All known WordPress legacy URL patterns have 301s:
  - `/category/*`
  - `/tag/*`
  - `/author/*`
  - `/page/*`
  - `/homes/*`
  - `/landing/*`
  - `/wp-admin/*`, `/wp-content/*`, `/wp-login.php`
  - Old post slugs (cross-check against any GSC legacy URLs from Agent 01)
- [ ] No redirect chains (A → B → C). Every redirect should point directly to the final destination.
- [ ] No redirect loops (A → B → A)
- [ ] `/calculator` → `/youtube-roi-calculator` (301 in place — verify)
- [ ] No page redirects to itself

### Step 1b — AI bot access audit (`netlify.toml` + `public/robots.txt`)
Check that no AI crawler is blocked. Required bots (from `ai-seo-guide.md`):
- [ ] GPTBot — allowed
- [ ] ChatGPT-User — allowed
- [ ] PerplexityBot — allowed
- [ ] ClaudeBot — allowed
- [ ] anthropic-ai — allowed
- [ ] Google-Extended — allowed
- [ ] Bingbot — allowed

If `robots.txt` or `netlify.toml` blocks any of these, flag as critical — the platform cannot cite SellonTube content.

Also check:
- [ ] Bing Webmaster Tools — site submitted (required for Copilot citation)
- [ ] Brave Search visibility — verify SellonTube appears at search.brave.com for at least 3 core keywords (required for Claude citation)

### Step 2 — Schema markup audit (`JsonLd.astro`)
Read the schema component.

**Currently implemented (in `JsonLd.astro`):**
- `Organization` — name, url, logo, sameAs, contactPoint, service
- `WebSite` — name, url, description, publisher

**Check implemented schemas for:**
- [ ] Organization schema: name, url, logo present and correct
- [ ] WebSite schema: name, url present and correct
- [ ] No broken JSON-LD (malformed brackets, missing commas)
- [ ] Schema URLs match live site URL (https://sellontube.com)

**Known schema gaps (not yet implemented — flag but do not implement without user instruction):**

| Schema type | Where needed | Rich result it enables |
|---|---|---|
| `Article` | All blog posts (`src/data/post/`) | Author, date, thumbnail in search results |
| `FAQPage` | Blog posts with FAQ sections | FAQ rich results / People Also Ask |
| `BreadcrumbList` | pSEO pages (`/youtube-for/`, `/youtube-vs/`) | Breadcrumb trail in search results |
| `HowTo` | How-to guide blog posts | Step-by-step rich results |

When running a schema audit, report these as "pending implementation" in the schema health output. Do not mark them as errors — they are documented gaps, not regressions.

### Step 3 — Astro config (`astro.config.ts`)
Read and check:
- [ ] `site` property set to `https://sellontube.com`
- [ ] Sitemap integration configured
- [ ] Partytown `forward: ['dataLayer.push']` is present (required for GA4 event tracking)
- [ ] No deprecated or broken integrations

### Step 4 — Cross-reference with GSC (if Agent 01 data is available)
For any non-Astro URL appearing in GSC impressions:
- Check if a 301 exists in `netlify.toml`
- If no 301: flag as "missing redirect — equity leaking"
- Classify: is this a legacy URL with ranking equity (needs redirect) or junk (needs Removals)?

### Step 5 — Output

**Technical SEO Audit — [date]**

**Redirect health:** [PASS / ISSUES FOUND]
| Issue | URL pattern | Recommended action |
|---|---|---|

**Schema health:** [PASS / ISSUES FOUND]
| Schema type | Issue | Fix |
|---|---|---|

**Astro config:** [PASS / ISSUES FOUND]

**Missing redirects (from GSC cross-reference):**
| Legacy URL | GSC impressions | Has 301? | Action |
|---|---|---|---|

**Priority fixes** (ranked by SEO impact):
1.
2.
3.

### Step 6 — Monthly AI SEO Checklist (run once per month)
If this is the first weekly review of the month, run `docs/sops/monthly-ai-seo-checklist.md` in full. Log completions in `seo-audit-log.md`.

## Rules
- Audit ALL WordPress URL patterns — not just post URLs. `/category/`, `/tag/`, `/author/` are commonly missed.
- Never add a redirect without checking if a chain already exists
- The Partytown `forward: ['dataLayer.push']` check is mandatory — removing it breaks GA4 event tracking
- `transport_type: 'beacon'` does NOT work with Partytown — flag any usage of this in GA4 event code
- GSC property URL format is `sc-domain:sellontube.com` (Domain property), NOT `https://sellontube.com/`
