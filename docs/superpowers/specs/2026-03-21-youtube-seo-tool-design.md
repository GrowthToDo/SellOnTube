# Design: YouTube SEO Tool

**Date:** 2026-03-21
**Route:** `/tools/youtube-seo-tool`
**Branch:** `tool/youtube-seo-checker`
**Status:** Approved — ready for implementation

---

## Purpose

A free diagnostic tool that tells a B2B founder exactly why their YouTube video isn't being discovered by buyers — and gives them the rewritten metadata to fix it immediately. Scored on 5 BoFu-aligned dimensions, all framed around customer acquisition not views.

**Target keyword:** "youtube seo tools" (4,400 vol/month, KD 23 — highest-volume winnable keyword on the site)
**Companion blog post:** "Best YouTube SEO Tools for Business Channels" — launches same week
**Product Hunt launch:** Mar 30, 2026

---

## Files

| File | Purpose |
|---|---|
| `src/pages/tools/youtube-seo-tool.astro` | Page, UI, client-side JS |
| `netlify/functions/youtube-seo-tool.ts` | Backend: DataFetch API + website scrape + Gemini |

No new dependencies. No new npm packages.

---

## Environment Variables

| Variable | Status | Used for |
|---|---|---|
| `LF_YOUTUBE_KEY` | Already in Netlify | DataFetch API — video metadata |
| `GEMINI_API_KEY` | Already in Netlify | Gemini analysis |
| `GOOGLE_API_KEY` | Fallback | Gemini fallback |

**No new env vars required.**

---

## Architecture: Approach C

Website scrape attempted as enrichment, not dependency. Fails silently — analysis continues with video metadata only.

### Request Flow

```
User submits (videoUrl + websiteUrl)
        ↓
POST /api/youtube-seo-tool
        ↓
[1] Validate + extract video ID (watch?v=, youtu.be/, shorts/)
[2] GET https://api.datafetchapi.com/v1/youtube/video/{id}
    Header: X-API-KEY: LF_YOUTUBE_KEY
    Extract: title, description
[3] fetch(websiteUrl) → strip HTML → truncate 3,000 chars
    On failure: websiteText = null, continue silently
[4] Build Gemini prompt (BoFu framework + humanizer rules embedded)
[5] POST gemini-flash-latest → parse JSON
        ↓
Return scored results to frontend
```

---

## Netlify Function Spec

**Path:** `netlify/functions/youtube-seo-tool.ts`
**API route:** `/api/youtube-seo-tool`
**Method:** POST
**Input:** `{ videoUrl: string, websiteUrl: string }`

### DataFetch API call
```
GET https://api.datafetchapi.com/v1/youtube/video/{videoId}
X-API-KEY: process.env.LF_YOUTUBE_KEY
Returns: { title, description, ...other fields ignored }
```

### Website scrape
- Server-side `fetch(websiteUrl)`
- Strip HTML tags, collapse whitespace, truncate to 3,000 chars
- On any error (403, timeout, CORS, Cloudflare): set `websiteText = null`, continue
- Note in Gemini prompt if unavailable

### Gemini prompt structure
Single call to `gemini-flash-latest`. System instruction embeds:
1. BoFu scoring framework (from existing evaluator tool logic)
2. Humanizer rules (anti-AI-pattern writing instructions)
3. Self-audit instruction: generate → check against AI pattern list → rewrite → return final

**Humanizer rules baked into system instruction:**
- No AI vocabulary: emphasizing, fostering, landscape, testament, delve, utilize, leverage
- No negative parallelisms ("not just X, it's Y")
- No em dashes
- No rule-of-three lists
- No filler phrases ("in order to," "due to the fact that")
- Specific over vague — concrete examples, not generalisations
- Short, direct sentences
- Varied structure — not formulaic

### Gemini JSON response schema
```json
{
  "business_summary": "One sentence: what this business sells and who they serve",
  "recommended_keywords": ["keyword 1", "keyword 2", "keyword 3"],
  "scores": {
    "title":       { "score": 0-20, "label": "Title Relevance",    "fix": "string or null if score >= 15" },
    "description": { "score": 0-20, "label": "Description Opening", "fix": "string or null" },
    "keywords":    { "score": 0-20, "label": "Keyword Coverage",    "fix": "string or null" },
    "cta":         { "score": 0-20, "label": "CTA Quality",         "fix": "string or null" },
    "chapters":    { "score": 0-20, "label": "Chapter Labels",      "fix": "string or null" }
  },
  "total_score": 0-100,
  "headline_diagnosis": "One sentence naming the single biggest reason this video isn't found by buyers"
}
```

### Scoring criteria (passed to Gemini)

**Title Relevance (0–20):** BoFu alignment, not keyword presence.
- Check for buyer-intent signals: "best," "vs," "review," "cost," "alternatives," "fix," "setup," "how to choose"
- ToFu titles ("What is X," "Introduction to Y") score 0–5 regardless of keyword
- Problem-solving, comparison, decision-stage titles score 15–20
- Fix: rewritten title using identified buyer-intent keyword in BoFu frame

**Description Opening (0–20):** Two-layer scoring.
- Layer A (0–10): First 150 chars — does it include the keyword + a value proposition?
- Layer B (0–10): Full description body — buyer-intent keywords appearing consistently?
- Combined into single 0–20 score
- Fix: rewritten first 150 chars with keyword + value prop

**Keyword Coverage (0–20):** Proxy for proper tagging.
- Gemini identifies 3 buyer-intent keywords the video should rank for
- Scores how many appear and how naturally in the description
- Fix: list of buyer-intent keywords to weave into description

**CTA Quality (0–20):** Two-part check.
- Part A: Is a CTA present in the first 150 chars (above YouTube fold)?
- Part B: Is it action-oriented toward a business outcome ("book a call," "download," "start free trial") — not just a bare URL drop?
- Bare URL only = 4/20. Strong above-fold CTA = 18–20/20
- Fix: rewritten CTA copy with exact placement instruction

**Chapter Labels (0–20):**
- No timestamps at all = 0/20
- Timestamps present but labelled as bland section names ("Introduction," "Part 2") = 6–10/20
- Timestamps labelled as searchable buyer-intent queries = 16–20/20
- Fix: generates 4–5 chapter label suggestions from description content

### Error handling

| Error | HTTP | User-facing message |
|---|---|---|
| Invalid YouTube URL | 400 | "That doesn't look like a valid YouTube URL. Try pasting the full link from your browser." |
| Video not found / private | 400 | "We couldn't access that video. Make sure it's public and the URL is correct." |
| Website fetch failed | — | Silent. Continue. Note in Gemini prompt. |
| Gemini quota (429) | 429 | Return `{ error: 'quota_exceeded' }` |
| Gemini API error | 503 | "Something went wrong on our end. Please try again in a moment." |
| JSON parse failure | 500 | Same as above |

**Never return HTTP 502** — Cloudflare intercepts 502 and replaces body with generic error page.

---

## Frontend Spec

**Reference:** `src/pages/tools/youtube-video-ideas-generator.astro` — mirror patterns exactly.

### Inputs (hero section)
- YouTube Video URL (required)
- Website or Product Page URL (required)
- CTA button: "Analyse My Video"

### Loading state
Spinner + "Analysing your video and business..." — never blank screen.

### Results panel (in order)

1. **Headline diagnosis** — prominent, top of results. One sentence.
2. **Total score** — large display (e.g. "64 / 100") with label:
   - 80–100: "Strong metadata — minor refinements needed"
   - 50–79: "Your video is partially optimised — buyers are missing it"
   - 0–49: "Your video is nearly invisible to buyers"
3. **Business read** — "Based on your website: [business_summary]"
4. **Recommended keywords** — 3 pill badges: [kw1] [kw2] [kw3]
5. **Per-dimension score cards** — 5 rows:
   - Dimension name + score (e.g. 12/20) + progress bar
   - If fix exists: "What to change:" + the fix inline
6. **CTA** — "Want us to build a YouTube strategy around keywords your buyers are searching?" → Book a call link

### Email gate
- localStorage key: `yt_seo_tool_uses` (integer)
- 3 free uses → on 4th: blurred results overlay with email capture form
- On email submit: POST to Google Sheets Apps Script URL (same endpoint as existing tools)
- Payload: `{ email, tool: "youtube-seo-tool", timestamp }`
- On success: unlock results, do not reset counter
- On Google Sheets failure: unlock anyway, log silently
- After email submitted once: permanent unlock (tracked via `yt_seo_tool_email` localStorage key)

### Step management
Same pattern as existing tools: `step-input` → `step-loading` → results panel with optional email gate overlay.

---

## Usage Gate localStorage Keys

| Key | Type | Purpose |
|---|---|---|
| `yt_seo_tool_uses` | integer | Count of successful analyses |
| `yt_seo_tool_email` | boolean string | Whether email has been submitted |

---

## SEO (on-page)

- `<title>`: "YouTube SEO Tool — Free Video Metadata Checker for Business Channels"
- `<meta description>`: "Paste your YouTube video URL and get a plain-English diagnosis: why buyers aren't finding it and exactly what to fix. Free. No login."
- Target keyword: "youtube seo tools" in title, description, H1, first paragraph

---

## Launch checklist (post-build)

- [ ] Test with real public YouTube URL + website URL
- [ ] Confirm JSON parses correctly
- [ ] Confirm usage counter increments in localStorage
- [ ] Confirm email gate triggers on 4th use
- [ ] Confirm email captures to Google Sheets
- [ ] Test invalid YouTube URL (error handling)
- [ ] Test private/deleted video (error handling)
- [ ] Test with website URL that returns 403 (silent fail)
- [ ] Mobile responsive check
- [ ] No console errors in production build
- [ ] Add tool to `/tools/index` page
- [ ] Submit page URL to GSC on launch day
