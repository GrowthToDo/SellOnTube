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
