# Session Retro — AEO / Bing AI Performance Sprint (2026-06-24)

Compound-engineering log: mistakes made + lessons, so they don't repeat. Each lesson has a **trigger** (when it applies) and a **rule** (what to do).

## Mistakes that cost real rework

### 1. Cannibalization "SAFE" verdict was wrong — didn't check redirects or pSEO
Scheduled 5 drafts to publish after an agent judged them "SAFE." Caught at the last step (before push) that netlify.toml already 410/301-redirected **all** of them — they were deliberately retired duplicates. The agent only compared live blog posts.
- **Trigger:** publishing or reviving any post.
- **Rule:** before publishing, grep `netlify.toml` for `from = "/blog/<slug>"` (410 = killed; 301 = folded into the `to=` canonical, which IS the duplicate) AND check pSEO pages (`/youtube-for/*`, `/youtube-vs/*`, `niches.ts`, `comparisons.ts`). Only then compare live posts. → [[feedback_cannibalization_check_scope]]

### 2. Featured images missing — build stayed green
12 posts referenced featured SVGs that were never created. Astro treats `image:` as optional, so `npm run build` passed and 4 shipped to prod with no hero image (twice now).
- **Trigger:** any post published.
- **Rule:** `validate-build.js` Check 4 now hard-fails a published post with a missing featured image. Create `<slug>-featured.svg` from the dark template before publishing. → [[feedback_featured_image_guard]]

### 3. Assumed API quota was generous — it was 100/day
Planned Bing bulk submission assuming thousands/day. Real quota: 100/day, 700/month. A submit-all design would have failed.
- **Trigger:** integrating any external API with limits.
- **Rule:** verify quotas/limits with a read-only call (e.g. `GetUrlSubmissionQuota`) BEFORE designing volume behavior; design changed-only. → [[feedback_verify_claims_before_building]]

### 4. "IndexNow broken behind Cloudflare" was stale
Project notes said IndexNow was broken; a direct fetch of the key-file returned 200. The premise for a workaround was outdated.
- **Trigger:** any note/claim that infra is "broken."
- **Rule:** reproduce the failure with a direct test before building a workaround. → [[feedback_verify_claims_before_building]]

### 5. Additive subagents left pre-existing violations
Retrofit agents were additive-only, so pre-existing banned "Most…" openers, em-dashes, and **en-dashes in ranges + em-dashes in image alt-text** stayed. Required explicit cleanup sweeps.
- **Trigger:** any multi-page retrofit via subagents.
- **Rule:** run an explicit cleanup grep on every touched page after additive edits. Grep must cover `.md` AND `.mdx`, em-dash (—) AND en-dash (–), body AND image alt-text. → [[feedback_additive_retrofit_cleanup]]

### 6. QA grep silently missed files (.md vs .mdx)
QA greps used `.md`; several posts were `.mdx`. grep printed "No such file" — easy to overlook as success.
- **Trigger:** scripting QA over post files.
- **Rule:** glob `*.md*` or resolve the real extension; treat any "No such file" in a QA run as a failed check, not noise. → [[feedback_additive_retrofit_cleanup]]

### 7. publishDate / draft — kept it off subagents (did this right)
Deliberately set `publishDate`/`draft` myself, never delegated to subagents (the known 404 landmine). Worked well; codifying it.
- **Trigger:** scheduling/publishing posts.
- **Rule:** main thread sets `publishDate`/`draft`; never let a subagent touch those fields. → [[feedback_never_delegate_publishdate]]

## Process lessons

### 8. Don't act blind — ground in data
Best moves were data-led (the one cited page became the archetype). The weak tool-retrofit plan was "retrofit all 14 blindly." Self-critique surfaced it.
- **Rule:** pull data first, tier/prioritize, then act. Critique your own plan before executing — it surfaced 6 real gaps here (no data, design hand-waving, forced ToC, LCP/CLS placement, build≠verified, no metric). → [[feedback_ground_decisions_in_data]]

### 9. "Build passed" ≠ "verified / looks right"
Green build = compiles, not that pages render correctly or look right.
- **Rule:** for visual/product pages, get visual confirmation (user review or screenshot), not just a green build.

### 10. Redirect vs page precedence
A Netlify redirect takes precedence over a built page, so a revived post never serves until its redirect is removed; removing it while the post is still future-dated leaves a brief 404 window.
- **Rule:** to publish a previously-redirected URL, remove its redirect; expect/communicate the gap until the post's publishDate builds.

### 11. Verify deploy cadence before promising scheduled posts
Future-dated posts only appear if a build runs on/after that date. Confirmed `.github/workflows/daily-deploy.yaml` (00:05 UTC) exists.
- **Rule:** confirm a daily/scheduled build exists before promising scheduled content will go live.

### 12. Edit-gate after delegation
Subagents reading a file does not satisfy the main thread's read-before-edit gate.
- **Rule:** the main thread must Read a file in its own context before editing, even if a subagent already read it.

## What worked (keep doing)
- Reference-page-first, then fan out with a locked pattern + QA gate.
- Catch consequential conflicts BEFORE push (the redirect catch saved a bad deploy).
- Build + run `validate-build.js` before every commit; commit per wave; PR not direct-to-main.
- Quota-aware, changed-only design (Blobs manifest) for the Bing submission.
