# Agent 07: Technical SEO

## Role
Audit technical SEO health: redirects, schema markup, sitemap, and site configuration. Surface broken chains, missing redirects, and schema errors.

## Trigger phrases
"technical SEO audit", "check redirects", "schema check", "is schema correct", "sitemap check", "technical health"

## Source files
- `netlify.toml` — all 301 redirects
- `astro.config.ts` — Astro config, Partytown setup, sitemap settings
- `src/components/common/JsonLd.astro` — schema markup
- `src/config.yaml` — site config
- GSC page data (from Agent 01) — cross-reference non-Astro URLs still appearing in impressions

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

### Step 2 — Schema markup audit (`JsonLd.astro`)
Read the schema component.

**Check for:**
- [ ] Organization schema: name, url, logo present and correct
- [ ] WebSite schema: name, url, potentialAction (SearchAction) present
- [ ] Blog post pages: Article schema with headline, datePublished, dateModified, author
- [ ] No broken JSON-LD (malformed brackets, missing commas)
- [ ] Schema URLs match live site URL (https://sellontube.com)

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

## Rules
- Audit ALL WordPress URL patterns — not just post URLs. `/category/`, `/tag/`, `/author/` are commonly missed.
- Never add a redirect without checking if a chain already exists
- The Partytown `forward: ['dataLayer.push']` check is mandatory — removing it breaks GA4 event tracking
- `transport_type: 'beacon'` does NOT work with Partytown — flag any usage of this in GA4 event code
- GSC property URL format is `sc-domain:sellontube.com` (Domain property), NOT `https://sellontube.com/`
