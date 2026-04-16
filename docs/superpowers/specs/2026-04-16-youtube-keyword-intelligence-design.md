# YouTube Keyword Intelligence Tool — Design Spec

**Date:** 2026-04-16
**Status:** Approved
**Location:** `dashboard/` (Next.js 14 app)

## Problem

B2B founders use YouTube to acquire customers, not to chase views. No existing tool connects YouTube keyword rankings to actual business outcomes (site traffic, signups). Founders cobble together 4-6 tools (VidIQ, YouTube Studio, GA4, spreadsheets) and still can't answer: "Which YouTube keywords bring signups to my business?"

## Target User

B2B founder or marketer with 10-100 YouTube videos, using the channel to drive leads/signups/demos for their SaaS, consulting, or service business.

## Solution

Add two features to the existing SellonTube YouTube Dashboard:

1. **Keyword Rank Tracker with Full Funnel Attribution** — Track YouTube keyword rankings and connect them to GA4 site sessions and signups via UTM links.
2. **Impressions + CTR** — Add two missing KPI cards to the existing analytics page.

## One-Sentence Pitch

"See which YouTube keywords bring signups to your business, not just views to your channel."

---

## Scope: What's In v1

1. Keyword Rank Tracker (add keywords, check ranks on demand)
2. GA4 Integration (connect property, pick conversion event, enter site URL)
3. Full funnel per keyword (rank > YT views > site sessions > signups via UTM matching)
4. UTM link generator (built into keyword table, one-click copy)
5. Keyword suggestions (surface search terms from YouTube Analytics that user isn't tracking)
6. ROI value ("What's a signup worth?" > show dollar value of YouTube-driven signups)
7. Impressions + CTR (two new KPI cards on analytics page)

## Scope: What's NOT in v1

- Weekly email digest (needs mail service + background jobs)
- Competitor rank display (easy add later, free data from search calls)
- AI-powered video idea generation (v2 feature, integrate with existing Gemini-based tools)
- Paywall/pricing tiers (ship free, add tiers after usage data)

---

## Architecture

### Navigation

Sidebar gets a second nav item:
- **Analytics** (`/dashboard`) — existing page, unchanged except new KPI cards
- **Keywords** (`/dashboard/keywords`) — new page

Active state determined by current route. Same layout pattern (sidebar left, content right).

### Data Persistence

**localStorage** for v1. Keyed by user's Google account ID (`sub` claim from JWT, exposed via session callback). Falls back to email if `sub` is unavailable.

**Retention policy:** Keep last 90 days of rank history per keyword. Prune older entries on every write.

```
key: "sot_keywords_{userId}"
value: {
  schemaVersion: 1,
  keywords: ["best crm for agencies", "hubspot vs salesforce"],
  history: {
    "best crm for agencies": [
      { rank: 3, videoId: "abc123", videoTitle: "...", checkedAt: "2026-04-16T10:30:00Z" },
      { rank: 5, videoId: "abc123", videoTitle: "...", checkedAt: "2026-04-15T09:00:00Z" }
    ]
  }
}

key: "sot_ga4_{userId}"
value: {
  schemaVersion: 1,
  ga4PropertyId: "properties/123456",
  conversionEvent: "sign_up",
  siteUrl: "https://myapp.com",
  signupValue: 50
}
```

### OAuth Scopes

Single Google consent screen with three scopes:
- `youtube.readonly` (existing)
- `yt-analytics.readonly` (existing)
- `https://www.googleapis.com/auth/analytics.readonly` (new, for GA4)

**Re-consent handling:** Adding the GA4 scope forces re-consent for existing users. The GA4 API routes must detect a 403 (missing scope) and return `{ error: "scope_missing" }`. The frontend catches this and triggers `signIn("google")` to re-authenticate with the new scope. New users get all three scopes on first login.

### Google Cloud Console Prerequisites

The following APIs must be enabled in the Google Cloud project:
- YouTube Data API v3 (existing)
- YouTube Analytics API (existing)
- **Google Analytics Data API** (new — required for `runReport`)
- **Google Analytics Admin API** (new — required for listing properties)

---

## Feature 1: Keyword Rank Tracker

### User Flow

1. User navigates to `/dashboard/keywords`
2. First visit: sees empty state "Add keywords you want to rank for"
3. Types keyword in input, clicks "Add" (max 50 keywords)
4. Clicks "Check All Rankings" button
5. Backend checks each keyword via YouTube `search.list`, returns rank position
6. Table updates row by row as results come in
7. Results stored in localStorage with timestamp

### Rankings Table

| Keyword | Your Video | Rank | Change | YT Views | Sessions | Signups | UTM Link |
|---------|-----------|------|--------|----------|----------|---------|----------|
| best crm for agencies | HubSpot vs Salesforce | #3 | ↑2 | 340 | 28 | 4 | Copy |
| hubspot vs salesforce | Honest Review | #7 | — | 120 | -- | -- | Copy |
| youtube for saas | *(not ranked)* | -- | NEW | -- | -- | -- | -- |

- **Rank**: Position 1-20 in YouTube search results. "Not ranked" if not in top 20.
- **Change**: Green up arrow / red down arrow / dash / "NEW" badge (compared to previous check in localStorage).
- **YT Views**: From YouTube Analytics search terms data, matched to tracked keyword.
- **Sessions / Signups**: From GA4, filtered by UTM campaign matching the keyword. Shows "--" if no GA4 data yet.
- **UTM Link**: One-click copy button. Only shown for keywords where user has a ranking video.
- **Delete**: X button on hover to remove a keyword.

### Rank Check — Technical

1. Frontend calls `POST /api/keywords/check` with keyword list
2. Backend gets user's channel ID from `channels.list?mine=true` — **cached for the duration of the request** (1 API call total, not per keyword)
3. For each keyword **sequentially with 200ms delay** (prevents YouTube API rate limiting):
   - Calls `search.list` with `q`: the keyword, `type`: video, `maxResults`: 20
   - Cost: 100 quota units per call
4. Scans positions 1-20 for any video matching user's channel ID
5. Returns: `{ keyword, rank: number | null, videoId, videoTitle }`
6. Frontend receives results via streaming (Server-Sent Events) or polls — table updates row by row

**Quota budget:** 10,000 units/day. 50 keywords = 5,000 units + ~50 units overhead (channel, video lookups). User can check twice daily. Existing analytics calls consume minimal additional quota (~15 units).

### Keyword Suggestions

Below the main table, a "Suggested Keywords" section:
- Keywords page makes its own call to fetch search terms via `/api/analytics?range=28d` (independent from the Analytics page — no shared state)
- Filters out terms the user is already tracking
- Shows top 10 untracked terms with their view counts
- Each has an "Add to tracked" button

---

## Feature 2: GA4 Integration

### Setup Flow (Single Screen)

Shown on first visit to Keywords page (or if GA4 not configured).

Three fields on one screen:
1. **GA4 Property** — Dropdown populated from GA4 Admin API (`/api/ga4/properties`)
2. **Conversion Event Name** — Text input, default "sign_up". User types their event name.
3. **Website URL** — Text input (e.g. `https://myapp.com`)
4. **Signup Value** — Number input (e.g. `50`). "What's one signup worth in dollars?"

"Save & Continue" button. Stored in localStorage.

### GA4 Data Fetching

API route `/api/ga4/report` calls GA4 Data API `runReport`:
- **Dimensions:** `sessionCampaignName`, `sessionSource`, `sessionMedium`
- **Metrics:** `sessions`, `keyEvents` (GA4 renamed `conversions` to `keyEvents` in March 2024 — use `keyEvents`)
- **Filter:** `sessionSource == "youtube"` AND `sessionMedium == "video"`
- **Date range:** Matches dashboard range selector (7d/28d/90d/365d)

Results are matched back to keywords via the UTM campaign parameter (keyword slug).

### UTM Link Generation

For each keyword with a ranking video, generate:
```
{siteUrl}?utm_source=youtube&utm_medium=video&utm_campaign={keyword-slug}&utm_content={video-id}
```

**Slugification:** Keyword is lowercased, spaces replaced with hyphens, non-alphanumeric characters (except hyphens) removed. Example: `"Best CRM for Agencies!"` becomes `best-crm-for-agencies`. This slug is used for both the UTM `campaign` param and for matching GA4 `sessionCampaignName` back to keywords.

User copies this link and places it in their video description. GA4 picks it up automatically.

### ROI Scorecard

Top of Keywords page, 4 KPI cards:
- **Total YT Views** — Sum of views from tracked keywords
- **Site Sessions from YouTube** — From GA4, source=youtube
- **Signups from YouTube** — From GA4, conversions where source=youtube
- **Revenue Value** — Signups x signup value (e.g. "6 signups x $50 = $300")

---

## Feature 3: Impressions + CTR on Analytics Page

### API Change

Update `getAnalytics()` in `youtube.ts`:
- Add `impressions,impressionClickThroughRate` to metrics param
- Return: `impressions: number, ctr: number`

### UI Change

Add 2 KPI cards to existing grid (6 cards becomes 8). Update grid to `lg:grid-cols-4` for a 4x2 layout on desktop:
- **Impressions** — formatted number, subtitle "Thumbnail shown in feeds", indigo accent
- **CTR** — percentage, subtitle "Impressions to views", teal accent

---

## File Changes

### New Files
- `src/app/dashboard/layout.tsx` — Shared layout for `/dashboard/*` routes (sidebar + content area). Extracts sidebar rendering from `page.tsx` so both Analytics and Keywords pages share it.
- `src/app/dashboard/keywords/page.tsx` — Keywords page
- `src/app/api/keywords/check/route.ts` — Rank check API (sequential search with 200ms delay, SSE streaming)
- `src/app/api/ga4/properties/route.ts` — List GA4 properties
- `src/app/api/ga4/report/route.ts` — Pull GA4 sessions + key events
- `src/lib/ga4.ts` — GA4 Data API helpers (raw `fetch` calls, matching existing codebase pattern — no `googleapis` SDK)
- `src/components/KeywordTable.tsx` — Rankings table
- `src/components/GA4Setup.tsx` — Setup flow (single screen, 4 fields)
- `src/components/UTMCopy.tsx` — Copy-to-clipboard UTM link button
- `src/components/KeywordSuggestions.tsx` — Suggested keywords from search terms
- `src/components/ROIScorecard.tsx` — 4 KPI cards for YouTube > business funnel

### Modified Files
- `src/lib/auth.ts` — Add `analytics.readonly` scope, expose `sub` (Google user ID) in session callback
- `src/lib/youtube.ts` — Add impressions/CTR to `getAnalytics()`, add `getChannelId()`, add `checkKeywordRank()`
- `src/app/api/analytics/route.ts` — Pass through impressions/CTR fields
- `src/app/dashboard/page.tsx` — Remove sidebar rendering (moved to layout.tsx), add Impressions + CTR KPI cards
- `src/components/Sidebar.tsx` — Add Keywords nav item with route-based active state via `usePathname()`
- `package.json` — No new SDK packages (use raw `fetch` for GA4 APIs, matching existing pattern)

### Unchanged
- All existing analytics components (charts, tables)
- Netlify config, middleware

---

## Intelligences Delivered

| # | Intelligence | Business Decision |
|---|-------------|-------------------|
| 1 | "Am I being found for the right keywords?" | Optimize video titles/tags for keywords that matter, stop targeting ones that don't convert |
| 2 | "Which keywords bring people to my website?" | Double down on keywords that drive sessions + signups, not just views |
| 3 | "Is YouTube worth my time?" | ROI scorecard: signups x value = dollar amount. Prove or kill the channel. |
| 4 | "What video should I make next?" | Keyword suggestions from real search data — topics people already search for |
| 5 | "Which videos need tracking links?" | Spot ranking videos with no UTM links — plug the measurement gap |
| 6 | "Are my rankings improving or declining?" | Early warning when a keyword drops — update the video or make a new one |

---

## Planned v2 Features (Not in This Build)

- AI-powered video idea generation (integrate existing Gemini-based tools with user's keyword/search data)
- Competitor rank display (show who ranks above you — data is free from search calls)
- Weekly email digest (push notifications for rank changes + signup metrics)
- Pricing tiers (Free: 5 keywords no GA4 / Pro: 50 keywords + GA4 + AI ideas at ~$29/mo)
- Database migration (localStorage to Supabase/Turso for cross-device persistence)
