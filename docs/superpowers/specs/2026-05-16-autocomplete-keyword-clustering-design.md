# Autocomplete Keyword Clustering — Design Spec

**Date:** 2026-05-16
**Status:** Approved
**Tool:** YouTube Autocomplete Keywords (`/tools/youtube-autocomplete-keywords`)

## Problem

The exhaustive scrape returns 30-100+ raw keywords sorted by intent. Users see a big list but still have to manually figure out: which keywords are duplicates, which group into a single video, and what video to actually make. The gap between "keyword list" and "start creating videos" is too wide.

Specific quality issues:
- Near-duplicates inflate count (create/make/do/use variations = 5 keywords for 1 video)
- Low-value generics with no intent signal (seed + random noun)
- Reversed-intent keywords mixed in (talks ABOUT AI vs using AI)

## Solution

Add a Gemini post-processing step after the exhaustive scrape (email-gated only). One Gemini call deduplicates, removes generics, and clusters keywords into 8-12 video topic bundles. Output changes from flat keyword list to actionable video topics.

Quick scrape remains unchanged (raw keyword list, no Gemini, no email needed).

## Architecture

### New file: `netlify/functions/cluster-keywords.ts`

**Route:** `POST /api/cluster-keywords`

**Input:**
```json
{
  "keywords": ["ai presentations vs humans", "best ai presentations", ...],
  "seed": "ai presentations",
  "geography": "United States"
}
```

**Validation:**
- `keywords` must be a non-empty array, max 300 items
- `seed` must be a non-empty string, max 200 chars
- `geography` is optional string

**Gemini config:**
- Model: `gemini-flash-latest`
- Temperature: 0.5
- maxOutputTokens: 2048
- responseMimeType: `application/json`
- Timeout: 20000ms
- API key: `GEMINI_API_KEY` with `GOOGLE_API_KEY` fallback

**System instruction:**
```
You are a YouTube content strategist. You receive a list of YouTube autocomplete keywords for a seed topic. Your job is to turn this raw list into actionable video topics.

RULES:
1. Merge near-duplicates (create/make/do/use variations — keep the best phrasing)
2. Remove low-value generics (seed + random noun with no intent signal, e.g. "ai presentations maker")
3. Flag reversed-intent keywords (e.g. "presentations about ai" = giving a talk about AI, not using AI for presentations) — put these in a separate group
4. Group remaining keywords into 8-12 video topic clusters
5. Each cluster needs:
   - A primary keyword (the best phrasing for a video title)
   - 1-5 variation keywords (what else this video would rank for)
   - Intent category: comparison, mistakes, results, howto, research
   - Business value: high, medium, low
   - A one-sentence video angle (what the video should actually cover)
6. Sort clusters by business value (high first)
7. Every keyword from the input must appear in exactly one place: a cluster's primary, a cluster's variations, the removed list, or the reversedIntent list

Return valid JSON matching this exact structure:
{
  "clusters": [
    {
      "primary": "best ai presentation tools 2025",
      "variations": ["best ai presentations", "ai presentation tools compared"],
      "intent": "comparison",
      "value": "high",
      "angle": "Compare the top 5 AI presentation tools with live demos"
    }
  ],
  "removed": ["ai presentations maker", "ai for presentations"],
  "reversedIntent": ["presentations about ai", "presentations on ai"]
}
```

**User prompt:**
```
SEED KEYWORD: {seed}
GEOGRAPHY: {geography}

KEYWORDS ({count} total):
{keywords, one per line}

Organize these into 8-12 video topic clusters. Merge duplicates, remove generics, flag reversed intent.
```

**Output schema:**
```typescript
interface ClusterResponse {
  clusters: Array<{
    primary: string;
    variations: string[];
    intent: 'comparison' | 'mistakes' | 'results' | 'howto' | 'research';
    value: 'high' | 'medium' | 'low';
    angle: string;
  }>;
  removed: string[];
  reversedIntent: string[];
}
```

**Response validation:**
- `clusters` must be a non-empty array with 1-20 items
- Each cluster must have `primary` (non-empty string), `variations` (array), `intent` (valid enum), `value` (valid enum), `angle` (non-empty string)
- If validation fails, return 503 with detail

**Error handling:**
- Missing API key: 500 with message
- Invalid/missing input: 400
- Gemini 429: return 429 with `{ error: 'quota_exceeded' }`
- Gemini other error: return 503 (never 502) with `geminiStatus` and `detail`
- Parse failure: return 503 with raw text in `detail`

**CORS:** Allow `https://sellontube.com` and `http://localhost:4321`

## Frontend Changes

**File:** `src/pages/tools/youtube-autocomplete-keywords.astro`

### Modified exhaustive flow

Current:
```
Email submit → Exhaustive scrape → Render raw keyword accordion
```

New:
```
Email submit → Exhaustive scrape → Send keywords to /api/cluster-keywords
            → Show "Organizing into video topics..." loading
            → Success: Render clustered view
            → Failure: Silent fallback to raw keyword accordion (current behavior)
```

### Loading state update

After exhaustive scrape completes, before clustering returns:
- Spinner continues
- Text changes to: "Organizing keywords into video topics..."
- Progress stays visible

### Clustered results rendering

Each cluster as a card, sorted by value (high → medium → low):

```
┌─────────────────────────────────────────────────┐
│ 🟢 High value    Comparison & Evaluation        │
│                                                  │
│ PRIMARY: "best ai presentation tools 2025" [Copy]│
│                                                  │
│ Also ranks for:                                  │
│   · best ai presentations                       │
│   · best presentations ai                       │
│                                                  │
│ Video angle: Compare the top 5 AI presentation   │
│ tools with live demos showing speed and quality  │
└─────────────────────────────────────────────────┘
```

Card design:
- Value badge: green (high), blue (medium), slate (low)
- Intent label: same color scheme as existing intent categories
- Primary keyword in semibold with copy button
- Variations as a subtle bulleted list
- Angle in italic/muted text
- Cards use existing rounded-2xl border pattern

### Collapsed sections at bottom

**"Filtered out" (collapsed by default):** Shows `removed` keywords. Accordion toggle. Helps users see what was excluded and why.

**"Different intent" (collapsed by default):** Shows `reversedIntent` keywords with brief explanation: "These keywords target a different audience (e.g. people giving talks about AI, not people using AI for presentations)."

### Updated buttons

- "Copy All Primary Keywords" — copies primary keyword from each cluster, newline-separated
- "Download CSV" — updated columns: `keyword`, `cluster_id`, `is_primary`, `intent`, `value`, `angle`, `seed_keyword`, `geography`, `timestamp`
- "Copy All" — copies all keywords (primaries + variations) as flat list

### Fallback behavior

If `/api/cluster-keywords` returns non-200 or times out:
- No error shown to user
- Render current raw keyword accordion view (existing `renderIntentGroups` function)
- Console.warn the error for debugging

### GA4 events

| Event | Trigger | Data |
|---|---|---|
| `tool_cluster_success` | Clusters rendered | `tool: 'autocomplete-keywords'`, `cluster_count: N` |
| `tool_cluster_fallback` | Gemini failed, showing raw view | `tool: 'autocomplete-keywords'`, `reason: 'api_error'` or `'quota_exceeded'` |

## Performance

- Exhaustive scrape: ~15-20s (existing, unchanged)
- Gemini clustering: ~3-5s (added)
- Total user wait: ~18-25s
- Free tier budget: 1,500 RPD Gemini Flash. Each exhaustive scrape = 1 call.

## Files

| File | Action |
|---|---|
| `netlify/functions/cluster-keywords.ts` | Create |
| `src/pages/tools/youtube-autocomplete-keywords.astro` | Modify |

No changes to: `youtube-suggest.ts`, `navigation.ts`, `tools/index.astro`, or any other file.

## Out of scope

- Suggested video titles (future enhancement, separate Gemini call)
- Cluster editing/reordering by user
- Saving clusters to account/session
- Clustering for quick scrape (stays raw keywords only)
