# Bing API for Faster Indexing → More AI Citations — Plan of Action (2026-06-24)

> Question: can we connect to the Bing API to increase AI citations? Short answer: **yes, and it's the right complement to the extractability work — but it drives *indexing/discovery*, not citations directly.** Plan + honest scope below. No code written yet.

## What's already in place (audited)
- **IndexNow auto-ping exists:** `netlify/functions/deploy-succeeded-background.ts` runs after every Netlify deploy, reads the sitemap, and submits all URLs to `api.indexnow.org` (which fans out to Bing, Yandex, etc.). Key: `96a261587bfb9306b6dfd7dc03eb05e3` (file in `public/`).
- **A Bing Webmaster API key already exists** (`BING_WEBMASTER_API_KEY` in `.env`).
- Two verification `.txt` files in `public/` (IndexNow key + a second token).
- BUT project notes say **IndexNow is "broken behind Cloudflare."**

## The mechanism (why this matters for citations)
Bing's index is the **grounding/retrieval layer for Microsoft Copilot + Bing AI** (the surfaces the AI Performance report counts). A page can only be cited if Bing has it indexed. So:

**citation = (in Bing's index) × (ranks well for the grounding query) × (answer-shaped / extractable)**

We just did the extractability third. Fast, complete Bing indexing is the first third. The Bing API attacks discovery: it gets our 23 retrofitted pages (and every future one) re-crawled and freshly indexed quickly, so the improved content becomes citation-eligible sooner. **It does not manufacture citations** — it removes the discovery bottleneck.

## Why the Bing Webmaster API (not just IndexNow)
IndexNow verifies ownership by fetching `https://sellontube.com/<key>.txt`. If Cloudflare challenges/blocks that verifier request, IndexNow silently rejects the submissions — the likely cause of "broken behind Cloudflare." The **Bing Webmaster Content Submission API authenticates by API key** (the site is already verified in BWT), so it does **not** depend on a key-file fetch → it bypasses the Cloudflare problem entirely. That's why it's the robust channel.

## Plan of action

### Phase 1 — Diagnose (confirm before building)
1. Check recent Netlify deploy logs for the IndexNow function's response status (200 vs error).
2. Test whether Cloudflare blocks the key-file: fetch `https://sellontube.com/96a261587bfb9306b6dfd7dc03eb05e3.txt` with a non-browser user agent (simulating the IndexNow verifier). If challenged/blocked → confirmed root cause.
3. Confirm the `BING_WEBMASTER_API_KEY` is valid + the domain is verified in Bing Webmaster Tools (the AI Performance data we already pulled proves it is).

### Phase 2 — Add the Bing Webmaster URL Submission API (the fix)
- Extend `deploy-succeeded-background.ts` (or a sibling function) to also POST to the Bing Webmaster API:
  `https://ssl.bing.com/webmaster/api.svc/json/SubmitUrlbatch?apikey=<BING_WEBMASTER_API_KEY>`
  body `{ siteUrl: "https://sellontube.com", urlList: [...] }`.
- Authenticated by key → no key-file verification → no Cloudflare dependency.
- Keep IndexNow too (belt-and-suspenders) once/if its verification is fixed.

### Phase 3 — Submit smart, not everything
- On deploy, submit only **new/changed URLs** (diff current sitemap vs a stored last-submitted manifest), not all ~300 every time. Avoids quota waste and spammy re-submission signals.
- One-time backfill now: submit the **23 retrofitted URLs + the 3 newly revived posts** so Bing re-crawls the improved content.
- Bing's URL submission daily quota is generous for verified sites (typically thousands/day), so volume isn't a real constraint here — but changed-only submission is still the clean pattern.

### Phase 4 — Fix IndexNow verification (optional, parallel)
- In Cloudflare, allow unauthenticated access to `/<key>.txt` (page rule / WAF skip) so the IndexNow verifier can read it. Restores the multi-engine fan-out (Yandex, Naver, etc.) as a bonus channel.

### Phase 5 — Measure
- Re-check Bing **AI Performance** in ~30 days, use **Compare** vs the current baseline (6 citations, 1 page). Watch Total Citations + Avg Cited Pages + Citation Share trend on the retrofitted pages.

## Honest scope / pushback
- **This is necessary, not sufficient.** It accelerates indexing; citations still require rank + the extractable content we built. Expect a lift over weeks, not instantly.
- **No citation analytics via API.** AI Performance / grounding queries are UI-only; the API only *pushes* URLs. Citation data stays a manual CSV export.
- **Don't over-submit.** Changed-only submission; bulk-resubmitting the whole site every deploy is wasteful and a mild spam signal.
- **Effort is small** — one Netlify function edit + a stored manifest. Low risk, high leverage given the key already exists.

## Recommendation
Worth doing. It's the correct discovery complement to the extractability sprint and fixes the real (Cloudflare) reason discovery has been unreliable. Sequence: Phase 1 diagnose → Phase 2 add Bing API submission → Phase 3 backfill the 26 improved URLs → Phase 5 measure in 30 days. Phase 4 (IndexNow fix) is a nice-to-have.
