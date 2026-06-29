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
