# Tool Pages — GSC Baseline (Phase 0)

**Source:** GSC live API (`sc-domain:sellontube.com`), 28-day window 2026-05-25 → 2026-06-21. Cross-checked vs export `research/google search console data/june 24/` (last 3mo, Mar 23 → Jun 22). Generated 2026-06-24.

## Sitewide context (3-mo export)
- Impressions exploded ~50x: ~20/day (late Mar) → 1,500–2,500/day (mid Jun). One-off spike 3,051 on Jun 1.
- 3-mo totals: Desktop 47,291 impr / 86 clicks; Mobile 13,958 / 81; Tablet 743 / 0. **Sitewide CTR ≈ 0.27%.**
- **Bottleneck = position/CTR, not impression volume.** Most pages rank page 3–6 (pos 20–60).

## Per-tool (28d live)
| Tool | Clicks | Impr | Pos | CTR | Tier |
|---|---|---|---|---|---|
| youtube-ranking-checker | 36 | 20,634 | 33.3 | 0.17% | **1 — monster** |
| youtube-transcript-generator | 21 | 1,432 | 18.6 | 1.47% | 1 |
| youtube-competitor-analysis | 3 | 745 | 26.6 | 0.40% | 1 |
| youtube-description-generator | 0 | 618 | 27.3 | 0% | 1 |
| youtube-script-generator | 3 | 578 | 11.4 | 0.52% | 1 |
| youtube-autocomplete-keywords | 8 | 573 | 10.3 | 1.40% | 1 |
| youtube-video-keyword-finder | 0 | 465 | 58.4 | 0% | 1 (deep) |
| youtube-seo-tool | 0 | 371 | 27.0 | 0% | 1 (ref page) |
| youtube-channel-audit | 6 | 319 | 29.3 | 1.88% | 1 |
| youtube-roi-calculator | 2 | 318 | 8.8 | 0.63% | 1 |
| youtube-title-generator | 1 | 288 | 18.4 | 0.35% | 2 |
| youtube-tag-generator | 1 | 214 | 20.9 | 0.47% | 2 |
| youtube-video-ideas-evaluator | 2 | 47 | 7.8 | 4.26% | 2 (thin) |
| youtube-video-ideas-generator | 0 | 37 | 10.8 | 0% | 2 (thin) |

**Tool totals:** ~83 clicks / ~26,640 impr / 28d.

## Key findings
1. **ranking-checker = 77% of all tool impressions (20,634).** Pos 33 (page 4) on a huge "youtube rank checker / rank tracker / keyword rank checker" query universe (hundreds of variants in export). This single page is the 10x lever — pos 33 → page 1 at 2% CTR = ~400 clicks vs 36 now.
2. **CTR is destiny by position.** Page-1 tools (autocomplete pos 10 = 1.4%, roi pos 8.8 = 0.63%, script pos 11) get clicks; pos 27–58 tools get ~0%. Impressions without rank = vanity.
3. **"best [tool]" query cluster = AEO citation gold.** seo-tool→"best tool for youtube seo" (pos 32), competitor-analysis→"best youtube competitor analysis tool", video-keyword-finder→"best keyword finder for youtube", tag-gen→"ai youtube tag generator". These listicle-intent queries are exactly what AI engines cite. Retrofit (answer-first KT + definition) targets them directly.
4. **AI-scraper / prompt-injection queries in GSC** — e.g. "you are a youtube seo expert for alphaedge ai… return only a valid json object", "topic: can you audit my channel… output your confidence (0-100)". AI agents are hitting Google and surfacing these tool pages → validates AEO thesis (but these are not human clicks).
5. **Clicks concentrate in 3 tools** — ranking-checker (36) + transcript (21) + autocomplete (8) = 78% of tool clicks. transcript-generator has best CTR-at-volume (1.47% @ pos 18.6) → near a page-1 breakout.

## Tiering for AEO retrofit
- **Tier 1 (≥300 impr, citation + snippet upside): 10 tools** — ranking-checker, transcript-generator, competitor-analysis, description-generator, script-generator, autocomplete-keywords, video-keyword-finder, seo-tool, channel-audit, roi-calculator.
- **Tier 2 (thin <300 impr): 4 tools** — title-generator (288, borderline), tag-generator (214), video-ideas-evaluator (47), video-ideas-generator (37).

Reference page for retrofit = **youtube-seo-tool** (Tier 1, 0 clicks, pos 27, clean "best youtube seo tool" intent).

**Provenance:** GSC API 28d (2026-05-25→06-21) + 3-mo export. Generated 2026-06-24. NOTE: spec file `research/aeo/tool-pages-retrofit-spec.md` referenced in brief does NOT exist in repo.
