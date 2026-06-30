# SERP Diagnosis — 2026-06-30 (Phase 0)

Goal: explain why SellOnTube earns ~77k impressions/90d but ~204 clicks (CTR 0.27%, avg pos ~29), and decide which queries are winnable before editing.

Method note: live Google SERP scraping was **CAPTCHA-blocked** (headless browser hit `/sorry/index`, "unusual traffic"). Landscape below is from `WebSearch` (real ranking competitors, but order is approximate, not exact live rank). **SERP features (AI Overview, video pack, PAA) could not be confirmed automatically** — flagged where it matters; a 60-second manual eyeball would close that gap.

## Cluster 1 — "youtube rank checker" / "youtube rank tracker" (the whale: ~40k impr, pos 30-55)

Page-1 competitors (both queries): TubeLab, TubePilot, TubeRanker, Lenos, Seomator, Wiz Studio, views4you, transcribetube, videodubber, SeRanking + the giants Semrush & SocialBlade. SellOnTube `/tools/youtube-ranking-checker` shows up but low.

Read:
- **The field is crowded with dedicated single-purpose free-tool pages**, not only DA giants. So it's winnable, but it's a dogfight and most rivals have exact-match domains/slugs (tuberanker.com, wiz.studio/rank-checker, views4you/tools/youtube-rank-tracker).
- **Keyword-coverage gap (actionable on-page):** our tool targets "rank checker / ranking" but barely "**rank tracker / rank tracking**" — yet `youtube rank tracker` (2,506 impr @ 42) + `youtube rank tracking` (1,726 @ 40) are huge adjacent pools. The page does not speak "tracker." Adding tracker terminology + a "track over time" angle is the one on-page lever left.
- **Authority is the real ceiling.** On-page is already strong (recon: deep content, full schema, 33 internal links). Climbing from pos 40 → page 1 against exact-match tool domains needs **links** → confirms Phase 2 off-page is the true unlock for this cluster.

## Cluster 2 — "how to check youtube rankings" (informational post, 2.9k impr @ 22)

Page-1 is **dominated by tool pages** (TubePilot, transcribetube, seomator, Lenos, SeRanking, TubeLab, TubeBuddy, videodubber). Only SellOnTube + TubeBuddy are how-to style.

Read: **Google treats this query as TOOL intent, not informational.** Our how-to post is fighting tool pages and losing at pos 22. Better play: point this query at the *tool* page (or strongly cross-link the post → tool), not deepen the article. Don't invest in the article expecting it to rank for this term.

## Cluster 3 — "best youtube autocomplete keyword tools" (listicle, 4.5k impr @ ~10, 0.18% CTR)

Page-1: SellOnTube listicle ranks near the top of this set, alongside keywordtool.io, vidIQ, limelightdigital, mayple, minitool. This is a true listicle SERP and **we are genuinely on page 1.**

Read: **This is the single best near-term CLICK win.** 4,487 impressions at pos ~10 with 0.18% CTR = the title/snippet is not earning the click against keywordtool.io / vidIQ. Likely also an AI Overview or video row pushing us down (unconfirmed — eyeball). Lever: rewrite title + meta for click-pull; confirm no SERP feature is the true blocker.

## Verdict → what's winnable

| Cluster | Winnable now? | Lever |
|---|---|---|
| rank checker/tracker head terms (~40k impr) | Partly. Head terms need authority (slow). | Phase 2 off-page links + add "rank tracker" coverage to the tool page (on-page, quick) |
| "how to check rankings" (informational) | Mis-targeted | Repoint intent to the tool page; don't expand the article for this term |
| autocomplete-tools listicle (4.5k @ 10) | **Yes, now** | Phase 1: title/meta CTR rewrite |
| 2 script posts @ pos 8, 0% CTR | Yes (cannibalization) | Phase 1: one canonical target each + differentiate |

## Open item
SERP-feature confirmation (AI Overview / video pack on clusters 1 & 3) not captured (CAPTCHA). Either: user eyeballs the 2 SERPs for 1 min, or we proceed assuming a video pack + AIO are present (standard for these query types in 2026) and treat CTR ceilings accordingly.
