# SellonTube — Mistakes & Lessons (compound log)

Append a dated entry whenever a mistake is caught or a non-obvious lesson is learned.
Read this file at the start of work so past mistakes don't repeat.

## Entry template
```
### YYYY-MM-DD — <short title>
- **What happened:** …
- **Root cause:** …
- **Lesson:** …
- **Prevention rule:** …
- **Category:** data | render | content | process | aeo
```

> Pattern tracker: when 3+ entries share a category, promote a hard rule into `CLAUDE.md`.

---

### 2026-06-29 — AEO knowledge was fragmented across 5 docs; consolidated into one SSOT
- **What happened:** AI-citation/AEO rules (answer blocks, definition blocks, entity consistency, freshness, robots list, schema priority) were duplicated across `ai-seo-guide.md`, `content-depth-framework.md`, `seo-rules.md`, `content-playbook.md`, and `blog-production-standard.md`. Schema priority had drifted (FAQPage demotion not reflected everywhere). No single doc told the model "how to make content citable," and no agent enforced citability before publish.
- **Root cause:** rules were added where each doc needed them rather than referenced from one home, so every doc grew its own copy and they fell out of sync.
- **Lesson:** for any cross-cutting rule set, pick one canonical home and make every other doc a pointer. Duplication is not redundancy, it is future drift.
- **Prevention rule:** `ai-seo-guide.md` is the single canonical home for AEO. Citability rules = Section 16, citation-ready language = Section 17, media policy = Section 18, proven evidence = Section 19. `comparison-content-playbook.md` owns comparison/listicle page structure. `content-depth-framework.md` owns word-count/depth only. Never restate an AEO rule in a satellite doc; point to the canonical section. Agent 05 now hard-fails posts that miss the Section 16 gate.
- **Category:** aeo

### 2026-06-29 — Adopted an external "LLM seeding" checklist, but it assumed an affiliate model
- **What happened:** A proven external checklist (friend getting strong LLM citations) was strong on comparison-page architecture but written for a SaaS-affiliate review site (G2/Capterra ratings on every tool, mandatory video on every post, a frontmatter spec that did not match our Astro schema).
- **Root cause:** good tactics, wrong-context defaults. Copying it verbatim would have broken builds (frontmatter), hurt LCP (mandatory video on strategy posts), and produced dishonest ratings (own tools have no third-party listing).
- **Lesson:** harvest tactics, not defaults. Map every "always do X" to our model (own tools vs competitor tools), our build (Astro frontmatter), and our ethos (no padding, perf budget) before adopting.
- **Prevention rule:** third-party ratings only where a real listing exists, never fabricated; own tools use first-party proof + disclosure. Media is required but must be relevant and perf-safe (lazy-load, YouTube facade, reserved dimensions), never padding. Frontmatter follows our Astro post schema, not any external template.
- **Category:** aeo

### 2026-06-30 — Started SEO edits on the stale `ahrefs` branch (94 commits behind `main`)
- **What happened:** User said "open ahrefs branch," so the fix branch for SEO title/meta work was cut off `ahrefs`. Computed title lengths came back already-short and several flagged pages "didn't exist," which looked like the work was already done. In fact `ahrefs` was 94 commits behind `main`; the live site = `main`, where every Ahrefs finding reproduced exactly and all "missing" files existed. Re-cut the branch off `main` and redid the analysis.
- **Root cause:** conflated "the branch the user named for reading research files" with "the branch the live content lives on." Did not check divergence before editing.
- **Lesson:** the branch holding research/data is not necessarily the branch to edit code on. A 5-day-stale Ahrefs/GSC export only matches reality on the branch that was live when it was crawled.
- **Prevention rule:** before any SEO/content edit, run `git rev-list --left-right --count origin/main...HEAD`; if behind, rebuild the work branch off `origin/main`. Cross-check a couple of "flagged" findings against the live branch before trusting stale audit data.
- **Category:** process

### 2026-06-30 — Ahrefs "title too long" list was the wrong roadmap; GSC reframed the whole plan
- **What happened:** Plan started as "fix 23 long titles + 7 long metas." Pulling live GSC (API + user export) showed the title-length pages barely overlap the pages that earn impressions. Real picture: ~77k impr/90d but 0.27% CTR; ~63% of impressions stuck on page 3-5 for the "youtube rank checker/tracker" cluster (already well-optimized on-page, so ceiling = domain authority), plus genuine page-1 pages converting ~0% CTR. Demoted the title project; reprioritized to CTR rescue on the autocomplete listicle, script-post cannibalization, off-page authority, and an honest "rank tracker" content section on the tool page (did NOT falsely relabel the checker as a tracker).
- **Root cause:** an Ahrefs health flag (vanity, pixel-width truncation) was treated as a growth roadmap without grounding in GSC impression/CTR/position data first.
- **Lesson:** Ahrefs audit flags = hygiene, not strategy. Always intersect with GSC (which pages earn impressions, at what position, for what queries) before deciding what to optimize. A title only matters if the page already earns impressions at a position where CTR is addressable.
- **Prevention rule:** for any "improve SEO" task, pull live GSC per-URL (clicks/impr/CTR/position + top queries) and the live SERP landscape BEFORE writing any title/meta. Optimize by impression volume and position band, not by audit-tool flags. Never claim a tool feature it lacks (e.g. "Tracker") to chase a query; capture the query with honest content instead.
- **Category:** process

### 2026-07-17 — REPEAT OFFENCE: scoped an entire internal-linking project without pulling GSC first
- **What happened:** A full 7-task internal-linking project (audit tooling, template bug fix, ~280 links across 84 files, 4 review rounds) was scoped, planned, and executed end to end before anyone looked at GSC. GSC was only pulled at the very end, when the user asked for a critical evaluation. It showed the effort was aimed at almost exactly the wrong places: `/tools/*` carries **61% of impressions** and `/blog/*` **37%**, while the two pSEO clusters that received the template fix and the largest share of new links (`/youtube-for/*` + `/youtube-vs/*`) carry **0.56% combined**. Task 3's "fix" rescued 15 youtube-vs pages whose combined demand is ~180 impressions/90d, 5 of them at literally zero. Meanwhile `/tools/youtube-ranking-checker` (**53,938 impr = 46% of the entire site, stuck at position 32.8**) got no dedicated attention, and ~13k page-1 impressions were leaking to near-zero clicks on five blog posts (a CTR problem internal links cannot fix).
- **Root cause:** the 2026-06-30 prevention rule below was written scoped to "before writing any title/meta," so it was not read as applying to an internal-linking project. The project was scoped by a *hygiene* metric (link-graph health: orphans, dead-ends, click-depth) that felt objective and measurable, and that metric never asks "do these pages have demand?". Nobody challenged the premise because the premise came with a satisfying audit script attached.
- **Lesson:** a clean, quantified hygiene metric is seductive and will happily lead a whole project away from the money. The question "where are the impressions actually concentrated?" must be answered **before** scoping, not after shipping. Also: a prevention rule written narrowly ("before writing any title/meta") will be read narrowly. Rules must be scoped to the decision class, not the artifact type.
- **Prevention rule:** **before scoping ANY SEO project of any kind** (internal linking, technical fixes, content, AEO, refactors), pull live GSC per-URL first and write down where impressions/clicks actually concentrate. Then explicitly state which of those pages the proposed work will move, and by what mechanism. **If the answer is "pages with negligible impressions," or "the mechanism cannot move this page's constraint," say so and re-scope before writing any code.** Internal links move pages *within* the top ~20; they do not drag a position-32 page onto page 1 (that is authority/content/backlinks), and they do nothing for CTR on pages that already rank (that is titles/meta).
- **Category:** process

### 2026-07-17 — Audited a link graph from source greps; several conclusions were flat wrong
- **What happened:** The first orphan/dead-end audit was done by grepping source files. It reported the homepage as a dead end with zero outbound links, plus a list of orphaned blog/pSEO pages. Rebuilding the audit to crawl the real built `dist/` HTML contradicted several of those findings: the homepage is NOT a dead end (a `BlogLatestPosts` component renders real links at build time), and several "orphans" were already linked once hub pages and the algorithmic related-posts block were counted. A planned homepage fix turned out to be unnecessary.
- **Root cause:** on a static-site generator, a large share of internal links are produced at build time by components, template loops, and scoring algorithms (related-posts). None of that exists as a literal `href` string in source, so a source grep is structurally blind to it.
- **Lesson:** source is what you wrote; `dist/` is what Google sees. For any question about rendered output (links, canonicals, schema, headings, what actually ships), source-level analysis produces confident, wrong answers.
- **Prevention rule:** for any link-graph / crawl / rendered-output question, run `npm run build` and analyse `dist/` HTML. `scripts/audit_internal_links.py` already does this correctly (it also excludes `header`/`footer`/`nav` chrome so boilerplate links do not mask real orphans). Never trust a source-grep audit of rendered output, including one produced by a subagent.
- **Category:** data

### 2026-07-17 — A verification script failed silently and corrupted three rounds of "verified" results
- **What happened:** The anchor-diversity verification script called `git show cc23310:<path>` to get each file's pre-change state. On Windows, `glob.glob()` returns backslash paths, which `git show` rejects in a pathspec. The subprocess returned a non-zero exit and empty stdout, the script did not check the return code, and empty output was silently treated as "this file had no pre-existing links." Every "pre-existing anchor count" was therefore undercounted across rounds 1-3, and each round's confident "0 violations remaining" conclusion was built on it. Only found in round 3.
- **Root cause:** the script trusted `subprocess.run(...).stdout` without checking `returncode`. A checker that cannot fail loudly cannot be trusted at all, and this one manufactured false confidence three times in a row.
- **Lesson:** a silent failure inside a verification tool is worse than having no tool. It converts "unknown" into "verified clean" and burns review rounds chasing conclusions built on empty data. Cross-platform path handling is a live hazard on this machine (Windows + Git Bash + Python `glob`).
- **Prevention rule:** in any verification/audit script: (1) check `returncode` on every subprocess call and raise or print loudly on failure, never return empty silently; (2) normalise `glob`/`pathlib` output with `.replace('\\', '/')` before passing to any `git` pathspec; (3) before trusting a checker's "all clean" result, deliberately break the thing it checks and confirm the checker actually fails (mutation-test the checker itself).
- **Category:** process

### 2026-07-17 — Validated new links against a documentation file instead of the live corpus
- **What happened:** The anchor-diversity rule ("no exact-match anchor pointing at one target from more than ~3 source pages") was checked by comparing new link proposals against `docs/templates/internal-linking-map.md`, a hand-maintained doc with ~20 rows. The real corpus is 50+ published posts plus every `relatedLinks` entry. Round 1 found 18 violations, round 2 found 47 more against the real corpus, rounds 3 and 4 found further stragglers. Four review rounds were spent on a rule that a correctly-scoped first check would have largely settled at once.
- **Root cause:** validated against an artifact that *describes* the state rather than the state itself. The living map had drifted far behind reality, as living docs always do.
- **Lesson:** documentation is a lossy cache of the truth, never the truth. Any correctness check must query ground truth (the files, the build output, the API), and may use docs only as a hint.
- **Prevention rule:** when enforcing any site-wide constraint (anchor diversity, canonical uniqueness, schema presence, internal-link rules), compute the current state from the actual corpus (all published files + built HTML) at check time. Treat `internal-linking-map.md` and similar docs as a convenience index, never as the validation source.
- **Category:** process

### 2026-07-17 — Mechanical text replacement broke prose grammar, and each fix pass created a new defect
- **What happened:** Fixing over-used anchor text by scripted string replacement produced sentences like "pairing them with the **the** tag generator tool", "Try our **our** title-generator tool", and "covered in our roundup of the **our roundup of** autocomplete keyword tools" — 13 instances shipped into blog prose. The subsequent grammar fix then replaced two anchors wholesale with phrases that collided with existing corpus anchors, one of which re-breached a cap that round 1 had already closed. Three passes to converge.
- **Root cause:** (1) anchor text was swapped without reading the word immediately before the link, so leading articles/possessives duplicated; (2) each fix pass optimised only for its own narrow goal and re-ran only the check for the thing it just fixed, not the full suite.
- **Lesson:** prose is context-dependent; a string replacement that is correct in isolation is frequently wrong in the sentence. And a fix is not done when the thing you fixed passes; it is done when *everything* still passes.
- **Prevention rule:** any scripted edit into prose must read and validate the resulting full sentence, not just the replaced token. After every fix pass, re-run the **complete** verification suite (all constraints, whole corpus), never just the check for the defect you addressed. For anchor rewrites specifically: confirm the new phrase is unique corpus-wide (case-insensitive) AND that the host sentence still reads naturally.
- **Category:** content

### 2026-07-17 — Built an SEO metric that is blind to page authority
- **What happened:** `scripts/audit_internal_links.py` builds an unweighted link graph: every inbound link counts as exactly 1. A link from `/tools/youtube-ranking-checker` (53,938 impressions, 46% of the site) scores identically to a link from a youtube-vs page with 0 impressions. The whole project then optimised what that tool measured: orphan count, dead-ends, click-depth. Those numbers all improved, mostly on pages with negligible demand.
- **Root cause:** the metric was designed around graph topology (what is easy to compute from HTML) rather than around equity flow (what actually matters), and no step ever joined the link graph to GSC impression data.
- **Lesson:** you get what you measure. A link-count metric will always steer effort toward whatever is cheapest to link, which is usually the pages nobody searches for. "0 orphans" is a hygiene statement, not a growth statement.
- **Prevention rule:** any future internal-link work must weight the graph by the linking page's real authority (GSC impressions/clicks per source URL, joinable via `scripts/mcp_seo_server.py` or a GSC pull). Report equity flow toward money pages, not link tallies. Treat `audit_internal_links.py` as a topology linter (fine for finding true orphans/dead-ends) and never as evidence that SEO improved.
- **Category:** data

### 2026-07-17 — Adversarial reviewers produced real bugs AND confident false claims
- **What happened:** Red-team subagents caught genuinely important issues (the wrong-corpus anchor check, the equity-blind audit, the strategic misdirection). They also asserted several "shipped defects" that did not survive verification: garbled anchors like `' + 'Generate Script →' + '` (actually an artifact of the *report generator's* regex mis-parsing a pre-existing JS button label, not a real link), a bare "SellonTube" anchor and a raw-URL anchor (present in no file), and "youtube-marketing-not-working is orphaned, the audit is broken" (it has 14 inbound links in the built HTML via related-posts and pagination; the agent's source-grep was incomplete and the audit was right).
- **Root cause:** subagents grepping source hit the same source-vs-built blindness as the original audit, and read auto-generated report artifacts as if they were site content. Their confident tone did not correlate with correctness.
- **Lesson:** a review finding is a hypothesis, not a fact — including a harsh one, and including one that flatters your sense of rigour. Relaying an unverified "critical bug" to the user is its own failure. Equally, dismissing reviewers because some claims are wrong would have missed the real findings.
- **Prevention rule:** verify every load-bearing review claim against the actual file/build before acting on it or reporting it to the user. Check the specific file:line, not the reviewer's paraphrase. When a finding cites an auto-generated report, confirm the underlying source rather than the report.
- **Category:** process

### 2026-07-17 — Scope exclusion by path prefix missed pages that belonged to the excluded vertical by content
- **What happened:** The user asked to exclude the Shopify vertical from internal linking. Scope was set by path prefix (`/shopify-app*`, `/shopify-store`, `/shopify-services`). Two pages at `/case-studies/luxury-jewellery-client` and `/case-studies/us-supplements-brand` matched no Shopify path, so they were pulled into scope as "core case studies" — but reading them showed Shopify-merchant branding, a Shopify services list, and links back to `/shopify-store`. They were Shopify-vertical content living under a neutral path. Caught only by reading the files while writing task specifics.
- **Root cause:** scope was defined by URL structure, which is a proxy for content, not content itself. Path structure and content ownership drift apart over time.
- **Lesson:** URL prefixes are a starting filter, not a scope definition. Any page in a grey zone must be opened and read before being classified.
- **Prevention rule:** when excluding a vertical/section, grep for its *content* markers (brand strings, footer text, outbound links to the excluded section) across the whole site, not just its path prefix. Confirm the resulting page list with the user before executing. Known current state: the two `/case-studies/*` pages above ARE Shopify-vertical and stay excluded; `/youtube-for/shopify` IS in scope (user-confirmed twice) despite its name.
- **Category:** process

### 2026-07-18 — Zernio `firstComment` failed silently (wrong payload nesting); only a live test caught it
- **What happened:** The LinkedIn link-in-comment mechanism (the whole strategy depends on it) didn't work on the first live post. `buildPayload` put `firstComment` at the payload top level; Zernio silently ignored it. The post published fine (HTTP 200, no error, API response had no `firstComment` field), but no comment appeared. Fix: for LinkedIn, `firstComment` must nest in `platforms[].platformSpecificData`. Re-tested live, comment appeared with the link.
- **Root cause:** assumed a top-level field from a docs skim; the LinkedIn-specific example nests it in `platformSpecificData`. The API accepted the payload and published without error, so nothing flagged the ignored field.
- **Lesson:** an outward-facing integration returning "success" is NOT verification. Zernio's free tier can't confirm a comment via API (inbox 403, comments 404) and logged-out LinkedIn hides comments, so the only proof was a human looking at the live post. The test caught a broken mechanism before it hit a whole week of posts.
- **Prevention rule:** for any new external-publish action, run ONE live test and verify the real-world result by eye (not just the API 200) before scheduling a batch. For Zernio LinkedIn specifically, `firstComment` goes in `platformSpecificData` (encoded in `buildPayload` + guideline §8).
- **Category:** process

### 2026-07-18 — Teardown-cluster session: publish-day lessons
- **og:image must be raster.** Featured SVGs render fine on-page but social platforms (LinkedIn/X/WhatsApp) show blank cards for SVG og:images. Rasterize with sharp (`node -e` one-liner, sharp ships with Astro) and point `image:` frontmatter at the PNG; Astro emits a JPG og:image. Check this for every future post whose featured image is SVG.
- **429 ≠ "quota resets tomorrow."** Gemini returned `quota_exceeded` that was actually a MONTHLY project spend cap (`ai.studio/spend`), not a daily quota. Read the full error body (`.error.message`) before predicting reset behavior; the status code alone misleads. Also: an invalid-input probe (404 on a bad handle) proves which upstream API answered, isolating which key is rate-limited.
- **grep -c on built/minified HTML counts LINES, not matches.** Live pages are one line; `grep -c` said 1 when 6 matches existed. Use `grep -o | wc -l` for occurrence counts on dist/live HTML.
- **Hub-and-spoke needs volume to justify it.** PRD assumed spokes on company-name long-tails with ~0 measured volume; single comprehensive post won (no 404s on launch, all equity on the KD-0 term, passage ranking covers per-company queries). Check spoke-keyword volume before committing to cluster architecture.
- **Agent fleets die together on session limits.** 4 parallel review agents all killed by one Anthropic session limit. Mechanical review checks (links, schema parse, keyword counts) are scriptable inline at near-zero cost; save agent fan-out for judgment-heavy work, and have the inline fallback ready.
