# Competitor Intelligence — Design Spec

**Date:** 2026-04-17
**Status:** Approved
**Location:** `dashboard/` (Next.js 14 app)
**Depends on:** YouTube Keyword Intelligence Tool v1 (committed 2026-04-16)

## Problem

A B2B founder tracks 20 keywords in the Keyword Intelligence Tool. They see their rank for each keyword. But they can't answer: "Is position #3 beatable? Should I invest time making a video for this keyword, or is the competition too strong?" They'd have to manually search each keyword on YouTube, open each competing video, and assess view counts and publish dates. Nobody does that for 20 keywords.

## Target User

Same as v1: B2B founder or marketer with a YouTube channel used for customer acquisition. They need to prioritize which keywords to create videos for based on competitive opportunity, not just search volume.

## Solution

Extend the existing keyword table with integrated competitor intelligence. For each tracked keyword, show the top 5 YouTube search results with view counts, age, and a beatable signal. Roll up into a per-keyword opportunity score so the user can scan their entire keyword list and instantly prioritize.

## One-Sentence Pitch

"See exactly who you're competing against for each keyword — and which ones you can win."

---

## Scope: What's In

1. Top 5 competitor videos per keyword (title, channel, views, age, beatable signal)
2. Per-video heuristic signal: green (Easy) / amber (New or Stale) / red (Strong or Solid)
3. Per-keyword opportunity score: "3/5 beatable" badge in main table
4. Spark bar visualization (5 tiny colored bars) for at-a-glance scanning
5. Expandable competitor panel integrated into keyword table rows
6. Competitor data stored in localStorage history alongside rank data
7. User's own video highlighted when ranked

## Scope: What's Out (v3+)

- Channel-level competitor tracking (track a competitor channel across all keywords)
- Historical competitor trend (how competition changed over time — data is stored but not visualized)
- AI-generated recommendations (heuristics only in this build)
- Separate competitor tab/page

---

## Data Flow

### API Changes

**`checkKeywordRank()` in youtube.ts — extended return:**

The function already fetches 20 results via `search.list`. Currently it only checks for the user's channel match. Change:

1. Capture the top 5 results from the response (regardless of whether user is ranked)
2. Extract: `videoId`, `title`, `channelTitle`, `publishedAt` from `snippet`
3. Call `videos.list?part=statistics&id={5 comma-separated IDs}` to get view counts (1 quota unit, batched)
4. Return the existing rank data PLUS a `competitors` array

```typescript
interface CompetitorVideo {
  position: number;       // 1-5
  videoId: string;
  title: string;
  channelTitle: string;
  viewCount: number;
  publishedAt: string;    // ISO date
  isOwnVideo: boolean;    // true if this is the user's channel
}
```

Return type becomes:
```typescript
{
  keyword: string;
  rank: number | null;
  videoId: string | null;
  videoTitle: string | null;
  competitors: CompetitorVideo[];
}
```

**SSE stream payload** — Each streamed chunk now includes the `competitors` array. No change to stream protocol.

**Quota impact:** +1 `videos.list` call per keyword (1 unit each). For 50 keywords: +50 units. Current cost is ~5,050 units per full check (50 × 100 for search + 1 for channels). New total: ~5,100. Well within the 10,000 daily quota.

### Storage Changes

**`RankEntry` in storage.ts — extended:**

```typescript
export interface RankEntry {
  rank: number | null;
  videoId: string | null;
  videoTitle: string | null;
  checkedAt: string;
  competitors: CompetitorVideo[];  // NEW
}
```

This stores competitor snapshots in history. Enables future v3 feature: "competition for this keyword got harder/easier over the last 3 months." Not visualized in this build but data is captured.

---

## Beatable Heuristic

### Per-Video Signal

Pure function: `getVideoSignal(viewCount: number, publishedAt: string) => { color, label }`

| Color | Label | Condition |
|-------|-------|-----------|
| green | Easy | views < 5K (any age) |
| green | Easy | views < 10K AND age > 12 months |
| amber | New | views < 10K AND age < 12 months |
| amber | Stale | views 10K-50K AND age > 18 months |
| red | Solid | views 10K-50K AND age < 18 months |
| red | Strong | views > 50K AND age < 12 months |

Labels tell the user *why* — "Stale" is more actionable than a yellow dot.

### Keyword-Level Opportunity Score

Pure function: `getKeywordOpportunity(competitors: CompetitorVideo[]) => { score, total, color }`

- Count green + amber signals among the 5 competitors
- Score: `{count}/5 beatable`
- Badge color:
  - 4-5 beatable → green
  - 2-3 beatable → amber
  - 0-1 beatable → red

### Edge Cases

- User ranked #1: Show positions 2-5 as competitors. User can see threats behind them.
- User ranked in top 5: Their video appears in the competitor panel with a blue highlight. Still counted in opportunity score but excluded from "beatable" count (you don't beat yourself).
- Not ranked: Show top 5 results. All 5 count toward opportunity.
- Keyword not yet checked: Opportunity column shows neutral gray placeholder.

---

## UX Design

### Brand Alignment

Follow SellonTube dashboard brand schema:
- **Primary:** brand-500 (#3b82f6) for interactive elements, highlights
- **Dark surfaces:** gray-950 for contrast panels (sidebar already uses this)
- **Accent colors:** green (#10b981), amber (#f59e0b), red (#f43f5e) from existing KpiCard palette
- **Typography:** Same system as existing dashboard — text-sm for body, font-semibold for emphasis, tracking-tight for numbers
- **Transitions:** 150-200ms ease-out. No jarring state changes.

### Design Principles (applies to entire product)

- No generic Tailwind UI patterns. Every component should have at least one distinctive design choice.
- Information density over whitespace. B2B founders want data, not decoration.
- Visual hierarchy through contrast and weight, not borders and boxes.
- Micro-interactions that feel intentional: hover states, expand animations, tooltip reveals.

### Opportunity Spark Bar (new component: OpportunityBar)

Replaces a text badge in the keyword table. Five tiny vertical bars (each 3px wide, 16px tall, 2px gap), colored per competitor signal. Visually distinctive — not something you'd see in a generic dashboard template.

- Hover: tooltip shows "3/5 beatable" text
- Neutral state (unchecked): five gray-300 bars
- Compact enough to fit in a narrow table column

### Keyword Table Row Changes

- New column between "Change" and "YT Views": the spark bar
- Entire row is clickable to expand/collapse. Cursor changes to pointer. Subtle background shift on hover (gray-50).
- Small chevron icon at far left of row, rotates 90deg on expand (150ms transition)

### Competitor Panel (expanded state)

Opens below the keyword row with 150ms ease-out slide animation.

**Container:** Dark card (bg-gray-950, rounded-lg) inside the white table. Creates visual separation — the competitors feel spotlighted against the data table. Subtle inner shadow for depth. Full-width spanning all table columns.

**Each competitor strip (horizontal layout):**

```
[#1]  "Best CRM for Small Agencies - Full Review"      HubSpot   ·  142K views  ·  2y 1mo  ·  🔴 Strong
       hubspot                                                                                        
[#2]  "I Tested 7 CRMs for My Agency (Honest Review)"  SaaSDave  ·  3.2K views  ·  1y 8mo  ·  🟢 Easy
       saasdave                                                                                       
[#3]  "Top CRM Tools for Service Businesses 2024"       TechList  ·  800 views   ·  2y 3mo  ·  🟢 Easy
       techlist                                                                                       
```

- **Position number:** Monospace, inside a small circle (w-6 h-6), muted color on gray-800
- **Title:** text-sm font-medium text-gray-100. Truncated with ellipsis. Links to YouTube (opens in new tab). Underline on hover.
- **Channel name:** text-xs text-gray-500, below title
- **Stats cluster (right side):** View count (formatted: 3.2K, 142K) · age (2y 1mo format) · signal dot + label. Monospace for numbers. Muted gray-400 for dots/separators.
- **Signal dot + label:** Colored dot (w-2 h-2 rounded-full) next to label text in matching color. "Easy" in green-400, "Stale" in amber-400, "Strong" in red-400.

**User's own video:** When the user's video appears in top 5, the strip gets a left-border glow in brand-500 (#3b82f6), and a subtle "Your video" micro-label replaces the channel name.

**Not ranked ghost row:** If user is not in the top 5, a final row at the bottom: "Your channel is not in the top 20 for this keyword" in text-gray-600 italic. Serves as motivation, not shame.

### Collapse Behavior

- Click the expanded row again to collapse
- Only one keyword can be expanded at a time (expanding another auto-collapses the current)
- State is ephemeral — not persisted. Refreshing the page collapses all.

---

## File Changes

### Modified Files

| File | Change |
|------|--------|
| `dashboard/src/lib/youtube.ts` | Extend `checkKeywordRank()` to return competitors. Add `getVideoStats()` for batched `videos.list`. Add `CompetitorVideo` interface. |
| `dashboard/src/app/api/keywords/check/route.ts` | SSE payload includes `competitors` array. No structural changes. |
| `dashboard/src/lib/storage.ts` | Extend `RankEntry` with `competitors` field. |
| `dashboard/src/components/KeywordTable.tsx` | Add spark bar column, click-to-expand, chevron rotation. Import CompetitorPanel. |
| `dashboard/src/app/dashboard/keywords/page.tsx` | Update `RankResult` interface, pass competitors through to table rows, store in history. |

### New Files

| File | Purpose |
|------|---------|
| `dashboard/src/components/CompetitorPanel.tsx` | Dark-card expanded view showing 5 competitor strips with signal dots. |
| `dashboard/src/components/OpportunityBar.tsx` | Spark bar component (5 colored mini-bars) + hover tooltip. |
| `dashboard/src/lib/opportunity.ts` | Pure functions: `getVideoSignal()`, `getKeywordOpportunity()`. No UI, no side effects. |

---

## Prerequisites

- YouTube Data API v3 `videos.list` endpoint — already available under the existing OAuth scope (`youtube.readonly`). No new scopes needed.
- No new environment variables.
- No new API routes.
