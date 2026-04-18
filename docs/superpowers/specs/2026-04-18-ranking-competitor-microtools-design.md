# YouTube Ranking Checker & Competitor Analysis Microtools — Design Spec

**Date:** 2026-04-18
**Status:** Approved
**Location:** `src/pages/tools/` (Astro static site) + `netlify/functions/`

## Problem

SellonTube's tool suite covers video creation (titles, descriptions, tags, scripts) and channel optimization (SEO tool, channel audit), but has no tools for the validation step: "Am I ranking?" and "Can I beat what's already there?" These are the two questions B2B founders ask before investing time creating a video.

## Target Keywords

| Tool | Primary Keyword | Volume | KD |
|------|----------------|-------:|---:|
| Ranking Checker | youtube ranking checker | 260 | 1 |
| Ranking Checker | youtube video rank checker | 210 | 6 |
| Ranking Checker | youtube keyword rank checker | 170 | 23 |
| Competitor Analysis | youtube competitor analysis | 90 | 3 |
| Competitor Analysis | youtube competition analysis | 90 | 0 |

## Tool 1: YouTube Ranking Checker

**Slug:** `/tools/youtube-ranking-checker`

**Input:** Keyword + YouTube channel URL/handle

**Output:**
- User's rank position (1-20) or "Not found in top 20"
- Top 10 search results: position, title (linked), channel name, view count, age
- User's video highlighted with blue accent if found in results

**API flow:** Client → Netlify function `youtube-rank-check.ts` → YouTube `search.list` (keyword, maxResults=20) → YouTube `channels.list` (resolve handle to channel ID if needed) → YouTube `videos.list` (batch stats for top 10) → find user's channel in results → return JSON

## Tool 2: YouTube Competitor Analysis

**Slug:** `/tools/youtube-competitor-analysis`

**Input:** Keyword only (no channel needed)

**Output:**
- Top 5 competing videos: position, title (linked), channel, views, age, beatable signal (Easy/New/Stale/Solid/Strong)
- Opportunity score: "3/5 beatable" with colored signal bars
- Verdict: "High opportunity" (4-5 beatable) / "Moderate" (2-3) / "Low — strong competition" (0-1)
- Signal explanation: why each video got its label

**API flow:** Client → same Netlify function → same YouTube API calls → client applies beatable heuristic

**Beatable heuristic (same as dashboard):**
- views < 5K → Easy (green)
- views < 10K AND age > 12mo → Easy (green)
- views < 10K AND age < 12mo → New (amber)
- views 10K-50K AND age > 18mo → Stale (amber)
- views 10K-50K AND age < 18mo → Solid (red)
- views > 50K AND age < 12mo → Strong (red)
- fallback → Solid (red)

## Shared Netlify Function

**File:** `netlify/functions/youtube-rank-check.ts`

**Input (POST body):**
```json
{
  "keyword": "best crm for agencies",
  "channelInput": "@sellontube",  // optional — only for ranking checker
  "maxResults": 20                // 20 for rank checker, 5 for competitor analysis
}
```

**Output:**
```json
{
  "keyword": "best crm for agencies",
  "channelId": "UC...",           // null if no channelInput
  "rank": 3,                      // null if not found or no channel
  "results": [
    {
      "position": 1,
      "videoId": "abc123",
      "title": "Best CRM for Agencies",
      "channelTitle": "HubSpot",
      "channelId": "UC...",
      "viewCount": 142000,
      "publishedAt": "2024-01-15T...",
      "isOwnVideo": false
    }
  ]
}
```

**API key:** `YOUTUBE_API_KEY` env var in Netlify. Uses server-side key (no OAuth, no login).

**Quota:** Each call uses ~2 quota units (1 search.list + 1 videos.list). YouTube Data API daily quota: 10,000 units. At 3 free checks per user, this supports ~1,600 unique users/day before hitting quota.

## Rate Limiting

Same pattern as Channel Audit:
- 3 free checks without signup
- After 3: email gate (localStorage counter + email input)
- After email: unlimited checks
- GA4 event: `tool_email_gate_shown` with tool name

## Page Pattern

Both pages follow the established tool pattern:
- Hero section with badges
- Input form
- Loading state
- Email gate (after 3 uses)
- Results section
- FAQ (6 questions, visible on page for FAQPage schema)
- CTA to dashboard ("Track all your keywords →")
- Schema: BreadcrumbList + WebApplication + FAQPage

## File Changes

### New Files

| File | Purpose |
|------|---------|
| `netlify/functions/youtube-rank-check.ts` | Shared API: keyword search + channel resolve + video stats |
| `src/pages/tools/youtube-ranking-checker.astro` | Ranking checker tool page |
| `src/pages/tools/youtube-competitor-analysis.astro` | Competitor analysis tool page |

### Modified Files

| File | Change |
|------|--------|
| `src/pages/tools/index.astro` | Add both tools to the tools array (Research stage position) |
| `src/navigation.ts` | Add both tools to Free Tools linkGroup |

## Tool Listing Position

Insert both tools after "Autocomplete Keywords" (position 3-4 in the array) to match the workflow stages:

1. YouTube SEO Tool (Optimize)
2. Autocomplete Keywords (Research)
3. **YouTube Ranking Checker** (Validate) ← NEW
4. **YouTube Competitor Analysis** (Validate) ← NEW
5. Tag Generator (Create)
6. ... rest unchanged
