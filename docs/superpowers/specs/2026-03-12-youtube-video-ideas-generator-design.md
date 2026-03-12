# YouTube Video Ideas Generator — Design Spec
**Date:** 2026-03-12
**Branch:** `youtube-video-ideas-generator`
**URL:** `https://sellontube.com/tools/youtube-video-ideas-generator`

---

## Purpose

A free microtool that generates 5 buyer-intent YouTube video ideas for B2B businesses. Optimises for commercial intent (BoFu topics), not views. Target users: SaaS founders, Shopify app developers, B2B marketers, agency owners, consultants.

---

## Approach

**Approach A — Mirror existing pattern.** Two new files, two modifications. Self-contained Astro page with inline JS. Email gate via existing Google Apps Script webhook. No new shared components.

---

## Files

| Action | File |
|--------|------|
| Create | `netlify/functions/generate-video-ideas.ts` |
| Create | `src/pages/tools/youtube-video-ideas-generator.astro` |
| Modify | `src/pages/tools/index.astro` — add tool card |
| Modify | `src/config.yaml` — add nav link under Free Tools |

---

## Backend: `generate-video-ideas.ts`

**Route:** `POST /api/generate-video-ideas` (registered via `export const config`, no `netlify.toml` change)

**Input:** `{ product: string, url?: string, targetCustomer: string, problemSolved: string }`

**Output:** `{ ideas: string[] }` — exactly 5 ideas

**Model:** `gemini-flash-latest` (auto-updating alias — never pin versioned models per CLAUDE.md)

**Gemini request structure:**
- `system_instruction: { parts: [{ text: SYSTEM_PROMPT }] }` — separate from contents (proper Gemini API pattern)
- `contents: [{ parts: [{ text: USER_PROMPT }] }]`
- `generationConfig: { responseMimeType: 'application/json', temperature: 0.8, maxOutputTokens: 2048 }`

**`url` field:** Optional context — included in prompt if present, not fetched. No format validation server-side. Frontend validates format.

**Input length caps:** 500 chars for text fields, 2000 for URL (prompt injection protection).

**Error handling:**
| Scenario | Status | Body |
|----------|--------|------|
| Missing required fields | 400 | `{ error: string }` |
| Field exceeds max length | 400 | `{ error: string }` |
| Missing API key | 500 | `{ error: string }` |
| Gemini 429 quota | 429 | `{ error: 'quota_exceeded' }` |
| Gemini upstream failure | 503 | `{ error: string, geminiStatus: number, detail: string }` |
| JSON parse / logic error | 500 | `{ error: string, detail: string }` |

**CORS:** `Access-Control-Allow-Origin: https://sellontube.com` (restrictive, matching generate-alternatives.ts)

**Rule:** Never return HTTP 502 — Cloudflare intercepts it and replaces the response body. Use 503 for all upstream failures.

---

## Frontend: `youtube-video-ideas-generator.astro`

### Page Zones (top to bottom)

```
Zone A — Hero (static)
Zone B — Tool (4 step panels)
Zone C — CallToAction widget (always rendered)
Zone D — How It Works (3-step grid)
Zone E — Methodology prose
```

### Step Panels (Zone B)

One panel visible at a time via `showStep(id)` — `classList.toggle('hidden')` on named panels array.

**`#step-input`** — 4 fields + submit button + counter label
**`#step-loading`** — spinner + "Generating your ideas..."
**`#step-email-gate`** — email unlock modal
**`#step-results`** — 5 idea cards + inline CTA + reset button

### Form Fields

| Field | Type | Placeholder | Validation |
|-------|------|-------------|------------|
| Your product or service | text | e.g. Shopify upsell app, LLC formation service | Required, min 3 chars |
| Link to your product page | url | https://yourwebsite.com/product | Required, must start with http:// or https:// |
| Your target customer | text | e.g. Shopify store owners, SaaS founders | Required, min 3 chars |
| Problem your product solves | textarea (3 rows) | e.g. Low average order value... | Required, min 10 chars |

Each field has a `<p id="[field]-error" class="hidden mt-1.5 text-xs text-rose-400">` for inline errors. No `alert()` calls anywhere.

### Idea Cards (in `#step-results`)

Each card: `rounded-xl border border-slate-700 bg-slate-800 p-4`

Layout: numbered badge (1–5) + idea title text + copy button

Copy button: `navigator.clipboard.writeText(idea)` → text swaps to "Copied!" for 1500ms → reverts.

Below all 5 cards: inline CTA card linking to `https://cal.com/gautham-8bdvdx/30min`.

### Email Gate

**Trigger:** `localStorage.getItem('sot_video_ideas_count') >= 3` AND `localStorage.getItem('sot_video_ideas_email_submitted') !== 'true'`

**localStorage keys:**
- `sot_video_ideas_count` — integer string, incremented after each successful generation
- `sot_video_ideas_email_submitted` — `'true'` after email submitted

**Email validation:**
- Must contain `@` and a `.` after `@`
- Must NOT use personal domains: `gmail.com, yahoo.com, hotmail.com, outlook.com, icloud.com, aol.com, protonmail.com, mail.com, ymail.com, live.com`

**Email submission:** POST to existing Google Apps Script webhook (same URL as topic evaluator), `mode: 'no-cors'`, `source: 'youtube-video-ideas-generator'`. On resolve (always): set `sot_video_ideas_email_submitted = 'true'`, close gate, proceed with generation.

### GA4 Events

All via `window.dataLayer.push()` — required for Partytown setup.

| Event | Trigger |
|-------|---------|
| `tool_generate_click` | User clicks Generate button (after validation passes) |
| `tool_generate_success` | 5 ideas rendered successfully |
| `tool_generate_error` | API call fails |
| `tool_email_gate_shown` | Email gate panel shown |
| `tool_email_submitted` | Email successfully submitted |
| `tool_cta_click` | User clicks booking CTA |
| `idea_copied` | User clicks copy on any idea card |

### Accessibility

- `aria-invalid="true"` on inputs when error is shown
- `aria-describedby` linking input to its error `<p>`
- `role="status" aria-live="polite"` on `#step-results` container
- `tabindex="-1"` on results heading; `.focus()` called when results appear
- `<label for="...">` on all fields

### Tailwind Patterns (from existing tools)

- Input: `w-full text-base font-medium px-4 py-3 rounded-xl border border-slate-700 bg-slate-800 text-white placeholder-slate-500 focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-colors`
- Primary button: `w-full inline-flex items-center justify-center rounded-xl px-6 py-3.5 text-base font-bold bg-emerald-500 text-slate-950 hover:bg-emerald-400 transition-colors`
- Card: `rounded-2xl border border-slate-700 bg-slate-900 p-6 sm:p-8`
- Inner card: `rounded-xl border border-slate-700 bg-slate-800 p-4`
- Spinner: `w-10 h-10 border-[3px] border-emerald-500 border-t-transparent rounded-full animate-spin`

---

## SEO Metadata

| Element | Value |
|---------|-------|
| `<title>` | YouTube Video Ideas Generator for Business \| SellonTube |
| Meta description | Generate buyer-intent YouTube video ideas for your product or service. Free tool by SellonTube. Get 5 high-intent ideas in seconds. |
| Canonical | `https://sellontube.com/tools/youtube-video-ideas-generator` |
| Primary keyword | youtube video ideas generator |

---

## Decisions & Rationale

- **Apps Script over Sheets API** — Already working in production; zero additional setup; same outcome.
- **`gemini-flash-latest` over `gemini-2.5-flash`** — CLAUDE.md rule: never pin versioned models; they get deprecated and return 404.
- **`maxOutputTokens: 2048` over spec's 1000** — CLAUDE.md rule: 2.5-series uses thinking tokens; 1000 causes truncated JSON.
- **`system_instruction` separately** — Correct Gemini API pattern; cleaner than embedding in user message.
- **Inline errors over `alert()`** — Improves UX on mobile, no main thread blocking, accessible.
- **`url` optional on backend** — Can't be fetched server-side; still provides useful context; frontend enforces required + format.
