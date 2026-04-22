# Tools Impressions Audit Playbook

**Purpose:** Repeatable process for auditing and improving organic impressions on SellonTube tool pages.
**First run:** 2026-04-22. Results in `tools-audit-findings-2026-04-22.md`.
**Re-run cadence:** Quarterly, or when a tool page has been live 90+ days with under 100 impressions.

---

## When to Run This Audit

- A tool page has been live 90+ days and shows fewer than 100 GSC impressions
- A new tool page has been live 30+ days and shows zero impressions (indexation problem)
- Quarterly health check on all tool pages
- After a major algorithm update (check all tool pages for ranking drops)

---

## Phase 1: Discovery and Diagnosis

### Step 1: Pull Live GSC Data

Use the service account (`scripts/credentials.json`, property `sc-domain:sellontube.com`) to query the Search Analytics API. 90-day window. Pull all queries and pages for each tool URL.

```
Dimensions: query, page
Filters: page contains /tools/[tool-slug]
Date range: last 90 days
```

Record per page: total impressions, total clicks, avg position, top 5 queries with positions.

### Step 2: Per-Page Diagnosis (Parallel)

For each tool page, evaluate these 9 sections:

| Section | What to Check |
|---------|--------------|
| A. GSC Snapshot | Impressions, clicks, avg pos, top queries, on-target vs off-target query ratio |
| B. Page Structure | Title (length, keyword presence), meta (length, keyword bolding), H1 (keyword match), above-tool intro (word count, keyword density), below-tool content (word count, sections), schema (BreadcrumbList + WebApplication + FAQPage) |
| C. Internal Links | Count inbound links (blog posts, other tools, hub, footer). Identify missing links from high-authority blog posts that discuss the tool's topic |
| D. SERP Analysis | Top 5 competitors: domain rating, content type, feature differentiation. Identify beatable competitors (DR < 50) |
| E. Opportunity Keywords | Primary keyword (volume, KD), secondary keywords, semantic variants. Cross-reference with `sot_master.csv` for validated data |
| F. Cannibalization | Check for query overlap with other tool pages and blog posts. Run `site:sellontube.com "[keyword]"` to verify |
| G. Verdict | One of: keyword-alignment failure, internal link starvation, not indexed, ceiling-capped, content expansion needed, reposition, subdomain dilution |
| H. Projected Lift | Show math: keyword volume x estimated CTR at target position = projected impressions |
| I. Trade-offs | Any intent or conversion trade-offs requiring user judgment |

### Step 3: Cross-Page Synthesis

After all per-page diagnoses are complete:

1. **Cannibalization matrix**: Check every tool page against every other tool page and all blog posts for query overlap
2. **Keyword ownership map**: Assign each keyword cluster to exactly one page
3. **Cross-page patterns**: Identify issues that affect 3+ pages (internal link starvation, missing "AI" keyword, H1 misalignment, schema gaps, indexation problems)
4. **Priority ranking**: Sort pages by (projected lift x feasibility / effort)

### Step 4: Self-Audit Checklist

Before presenting findings, verify:

- [ ] All diagnosis cards present (one per page)
- [ ] Every card has all 9 sections populated
- [ ] No placeholder text
- [ ] Every opportunity keyword has 2+ volume verification signals
- [ ] Every verdict is one of the allowed types
- [ ] Every projected lift has explicit math
- [ ] Every "winnable" claim has SERP evidence
- [ ] Cannibalization matrix cross-checks all tools + blog posts
- [ ] Internal link audit names specific blog posts, not vague categories
- [ ] No fabricated GSC numbers
- [ ] Intent trade-offs collated
- [ ] Ceiling-capped verdicts name what would unlock the page

---

## Phase 2: Per-Page Edits

### Editable Surfaces

| Surface | Edit? | Notes |
|---------|-------|-------|
| Title tag | Yes | Under 60 chars. Lead with primary keyword. Include "AI" if tool uses Gemini. End with "| SellOnTube" |
| Meta description | Yes | Under 160 chars. Lead with primary keyword for SERP bolding. Specific features, not vague benefits |
| H1 | Yes | Must contain primary keyword. Pattern: "[Tool Name] for Business Channels" |
| Badge pills | Yes | Swap generic labels for keyword-reinforcing labels (e.g., "SEO-optimized" -> "AI-powered") |
| Above-tool intro | Yes | 1-2 sentences. Must contain primary keyword or close variant. Mention key differentiator |
| Below-tool content sections | Yes | Add semantic keyword variants, cross-links to blog posts, new FAQ entries |
| JSON-LD schema | Yes | WebApplication description should lead with primary keyword. FAQPage entries must match visible FAQ |
| Breadcrumb name | Yes | Should match the tool's primary identity (may differ from URL slug) |
| Internal links (outbound) | Yes | Cross-link to related blog posts and tools |
| React tool components | No | Functional code is out of scope for SEO audit |
| Email capture flow | No | Conversion mechanics are out of scope |
| URL slugs | No | Changing URLs requires redirects and reindexing |

### Edit Workflow

1. Read the full source file
2. Draft all edits as a diff preview (old -> new)
3. Present for user approval with rationale per edit
4. Apply on approval
5. Verify edits by re-reading the modified sections

### Quality Checks After Editing

- Title under 60 chars
- Meta under 160 chars
- H1 contains primary keyword
- No em dashes (grep for `---`)
- Schema FAQ entries match visible FAQ entries (count and content)
- No broken internal links (verify blog post slugs exist in `src/data/post/`)

---

## Phase 3: Strategy Doc Update

After all per-page edits are applied, add a section to `growth-strategy.md`:

1. Audit summary table (page, edits, primary keyword, projected lift)
2. Cross-page patterns fixed
3. Outstanding items (internal links, GSC submissions, structural decisions)
4. Projected aggregate impact with measurement windows
5. Add audit findings doc to Reference Files section

---

## Phase 4: This Playbook

Update this playbook with any new patterns, verdict types, or workflow improvements discovered during the audit.

---

## Common Patterns and Fixes

These patterns were identified in the 2026-04-22 audit and are likely to recur:

### Pattern: "AI" Keyword Gap
**Signal:** Tool uses Gemini Flash but title/meta/H1 don't mention "AI". Competitors all lead with "AI".
**Fix:** Add "AI" to title, meta, H1, above-tool intro, WebApplication schema description. Add FAQ: "Does this tool use AI?"
**Exception:** Tools that don't use AI (e.g., Competitor Analysis uses YouTube Search API heuristics). Do not add "AI" dishonestly.

### Pattern: H1 Keyword Misalignment
**Signal:** H1 uses creative/question format that omits the primary keyword. Google cannot map the page to tool-intent queries.
**Fix:** Replace with "[Tool Name] for Business Channels" pattern. Keep creative angle in the above-tool intro paragraph instead.

### Pattern: Internal Link Starvation
**Signal:** Blog posts that discuss the tool's topic extensively (tags, descriptions, scripts, etc.) link to zero or one tool page.
**Fix:** Add contextual links from the relevant blog post sections to the tool page. Use descriptive anchor text containing the tool's primary keyword.

### Pattern: Ceiling-Capped Keyword
**Signal:** DataForSEO shows under 50 vol/mo. Top SERP positions locked by DR 70+ sites. Growth strategy already killed the tool.
**Fix:** Hygiene edits only (title, H1, schema alignment). Do not invest content expansion effort. Page's value is as a conversion asset, not a traffic driver.

### Pattern: Keyword Repositioning
**Signal:** Head term is unwinnable (DR 70+ dominated) but a variant keyword shows beatable SERP and existing ranking signal.
**Fix:** Shift title, H1, meta, schema to lead with the winnable variant. Keep the head term in body content for secondary coverage.

### Pattern: Stale Copy
**Signal:** "(coming soon)" labels, outdated tool references, insider jargon ("BoFu", "GTM") that confuses utility searchers.
**Fix:** Remove stale labels, replace jargon with plain language, update cross-links to reflect current tool availability.

---

## Measurement

### When to Check

- **30 days post-edit:** First signal. Look for new queries appearing, position improvements on existing queries, indexation of previously unindexed pages.
- **90 days post-edit:** Primary measurement window. Compare aggregate impressions to baseline and projections.
- **6 months post-edit:** Full impact. Factor in internal link additions and any backlinks acquired.

### What to Compare

| Metric | Source | Baseline Date |
|--------|--------|--------------|
| Per-page impressions (90d) | GSC API | Day of audit |
| Per-page clicks (90d) | GSC API | Day of audit |
| Per-page avg position | GSC API | Day of audit |
| New queries appearing | GSC API | n/a (net new) |
| Indexation status | GSC URL Inspection | Day of audit |

### Success Criteria

- Aggregate 90-day impressions increase by 10x or more from baseline
- At least 3 of 6 pages show new on-target queries in GSC
- No page loses impressions it had before the audit (regression check)
