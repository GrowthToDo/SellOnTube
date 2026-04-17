# Competitor Intelligence Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add per-keyword competitor analysis to the keyword table — show top 5 competitors with beatable heuristics and a spark bar opportunity score.

**Architecture:** Extend existing `checkKeywordRank()` to return competitor data from the same search.list call, add one batched `videos.list` call per keyword for view counts. Pure client-side heuristic functions compute opportunity signals. New UI components (OpportunityBar, CompetitorPanel) integrate into the existing KeywordTable via expand/collapse.

**Tech Stack:** Next.js 14, YouTube Data API v3 (`search.list` + `videos.list`), Tailwind CSS, localStorage.

**Spec:** `docs/superpowers/specs/2026-04-17-competitor-intelligence-design.md`

**UX standard:** All UI must be visually distinctive and premium. No generic Tailwind patterns. Follow SellonTube brand schema (brand-500 #3b82f6 primary, gray-950 dark surfaces, green/amber/red from KpiCard palette). See `feedback_dashboard_ux_quality.md` in memory.

---

## Chunk 1: Data Layer — Types, Heuristics, API Changes

### Task 1: Create opportunity heuristic module

**Files:**
- Create: `dashboard/src/lib/opportunity.ts`

- [ ] **Step 1: Create the CompetitorVideo interface and signal types**

Create `dashboard/src/lib/opportunity.ts`:

```typescript
export interface CompetitorVideo {
  position: number;
  videoId: string;
  title: string;
  channelTitle: string;
  viewCount: number;
  publishedAt: string;
  isOwnVideo: boolean;
}

export type SignalColor = "green" | "amber" | "red";

export interface VideoSignal {
  color: SignalColor;
  label: string;
}

export interface KeywordOpportunity {
  score: number;
  total: number;
  color: SignalColor;
  signals: VideoSignal[];
}
```

- [ ] **Step 2: Implement getVideoSignal()**

Add to `dashboard/src/lib/opportunity.ts`:

```typescript
export function getVideoSignal(viewCount: number, publishedAt: string): VideoSignal {
  const ageMs = Date.now() - new Date(publishedAt).getTime();
  const ageMonths = ageMs / (1000 * 60 * 60 * 24 * 30.44);

  if (viewCount < 5000) {
    return { color: "green", label: "Easy" };
  }
  if (viewCount < 10000 && ageMonths > 12) {
    return { color: "green", label: "Easy" };
  }
  if (viewCount < 10000 && ageMonths <= 12) {
    return { color: "amber", label: "New" };
  }
  if (viewCount >= 10000 && viewCount <= 50000 && ageMonths > 18) {
    return { color: "amber", label: "Stale" };
  }
  if (viewCount >= 10000 && viewCount <= 50000 && ageMonths <= 18) {
    return { color: "red", label: "Solid" };
  }
  if (viewCount > 50000 && ageMonths < 12) {
    return { color: "red", label: "Strong" };
  }
  // > 50K views AND >= 12 months old
  return { color: "red", label: "Solid" };
}
```

- [ ] **Step 3: Implement getKeywordOpportunity()**

Add to `dashboard/src/lib/opportunity.ts`:

```typescript
export function getKeywordOpportunity(competitors: CompetitorVideo[]): KeywordOpportunity {
  const signals = competitors
    .filter((c) => !c.isOwnVideo)
    .map((c) => getVideoSignal(c.viewCount, c.publishedAt));

  const beatable = signals.filter((s) => s.color === "green" || s.color === "amber").length;
  const total = signals.length;

  let color: SignalColor = "red";
  if (beatable >= 4) color = "green";
  else if (beatable >= 2) color = "amber";

  return { score: beatable, total, color, signals };
}
```

- [ ] **Step 4: Implement formatAge() helper**

Add to `dashboard/src/lib/opportunity.ts`:

```typescript
export function formatAge(publishedAt: string): string {
  const ageMs = Date.now() - new Date(publishedAt).getTime();
  const totalMonths = Math.floor(ageMs / (1000 * 60 * 60 * 24 * 30.44));
  const years = Math.floor(totalMonths / 12);
  const months = totalMonths % 12;

  if (years === 0) return `${months}mo`;
  if (months === 0) return `${years}y`;
  return `${years}y ${months}mo`;
}

export function formatViewCount(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(1) + "K";
  return n.toLocaleString();
}
```

- [ ] **Step 5: Commit**

```bash
git add dashboard/src/lib/opportunity.ts
git commit -m "feat: add opportunity heuristic module with beatable signals"
```

---

### Task 2: Extend checkKeywordRank() to return competitors

**Files:**
- Modify: `dashboard/src/lib/youtube.ts:430-472`

- [ ] **Step 1: Add getVideoStats() function**

Add this function before `checkKeywordRank()` in `dashboard/src/lib/youtube.ts` (around line 429):

```typescript
async function getVideoStats(
  accessToken: string,
  videoIds: string[]
): Promise<Record<string, number>> {
  if (videoIds.length === 0) return {};

  const res = await fetch(
    `https://www.googleapis.com/youtube/v3/videos?part=statistics&id=${videoIds.join(",")}`,
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );

  if (!res.ok) return {};

  const data = await res.json();
  const views: Record<string, number> = {};

  for (const item of data.items || []) {
    views[item.id] = parseInt(item.statistics?.viewCount || "0", 10);
  }

  return views;
}
```

> **Note:** We only fetch `part=statistics` (not `snippet`) because `publishedAt` is already available from the `search.list` response. This halves the response payload size.

```typescript
```

- [ ] **Step 2: Rewrite checkKeywordRank() to include competitors**

First, add the import at the top of `dashboard/src/lib/youtube.ts`:

```typescript
import type { CompetitorVideo } from "./opportunity";
```

Then replace the entire `checkKeywordRank()` function (lines 430-472) with:

```typescript
export async function checkKeywordRank(
  accessToken: string,
  keyword: string,
  channelId: string
): Promise<{
  keyword: string;
  rank: number | null;
  videoId: string | null;
  videoTitle: string | null;
  competitors: CompetitorVideo[];
}> {
  const params = new URLSearchParams({
    part: "snippet",
    q: keyword,
    type: "video",
    maxResults: "20",
  });

  const res = await fetch(
    `https://www.googleapis.com/youtube/v3/search?${params}`,
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`Search API error: ${res.status} - ${error}`);
  }

  const data = await res.json();
  const items: any[] = data.items || [];

  // Find user's rank
  let rank: number | null = null;
  let userVideoId: string | null = null;
  let userVideoTitle: string | null = null;

  for (let i = 0; i < items.length; i++) {
    if (items[i].snippet?.channelId === channelId) {
      rank = i + 1;
      userVideoId = items[i].id?.videoId || null;
      userVideoTitle = items[i].snippet?.title || null;
      break;
    }
  }

  // Get top 5 for competitor display
  const top5 = items.slice(0, 5);
  const videoIds = top5.map((item: any) => item.id?.videoId).filter(Boolean);

  // Batch fetch view counts (publishedAt comes from search.list snippet)
  const viewCounts = await getVideoStats(accessToken, videoIds);

  const competitors: CompetitorVideo[] = top5.map((item: any, i: number) => {
    const vid = item.id?.videoId || "";
    return {
      position: i + 1,
      videoId: vid,
      title: item.snippet?.title || "",
      channelTitle: item.snippet?.channelTitle || "",
      viewCount: viewCounts[vid] || 0,
      publishedAt: item.snippet?.publishedAt || "",
      isOwnVideo: item.snippet?.channelId === channelId,
    };
  });

  return { keyword, rank, videoId: userVideoId, videoTitle: userVideoTitle, competitors };
}
```

- [ ] **Step 3: Verify route.ts needs no changes**

> **Important:** `dashboard/src/app/api/keywords/check/route.ts` line 52 uses `const data = JSON.stringify({ ...result, index: i, total: keywords.length })`. The spread operator already forwards all fields from `checkKeywordRank()`'s return value, including the new `competitors` array. No changes needed to the SSE route.

- [ ] **Step 4: Commit**

```bash
git add dashboard/src/lib/youtube.ts
git commit -m "feat: extend checkKeywordRank to return top 5 competitors with stats"
```

---

### Task 3: Extend storage types for competitor data

**Files:**
- Modify: `dashboard/src/lib/storage.ts:1-8`

- [ ] **Step 1: Import CompetitorVideo and extend RankEntry**

At the top of `dashboard/src/lib/storage.ts`, add the import and extend the interface:

```typescript
import type { CompetitorVideo } from "./opportunity";
```

Then update the `RankEntry` interface from:

```typescript
export interface RankEntry {
  rank: number | null;
  videoId: string | null;
  videoTitle: string | null;
  checkedAt: string;
}
```

To:

```typescript
export interface RankEntry {
  rank: number | null;
  videoId: string | null;
  videoTitle: string | null;
  checkedAt: string;
  competitors?: CompetitorVideo[];
}
```

This is optional (`?`) for backward compatibility. Existing localStorage entries from v1 have no `competitors` field. The display layer already uses `latest?.competitors || []` as a fallback. No schema version bump or migration needed — old data loads fine, new data includes competitors.

- [ ] **Step 2: Commit**

```bash
git add dashboard/src/lib/storage.ts
git commit -m "feat: extend RankEntry with competitor snapshot data"
```

---

## Chunk 2: UI Components — OpportunityBar and CompetitorPanel

### Task 4: Create OpportunityBar component

**Files:**
- Create: `dashboard/src/components/OpportunityBar.tsx`

- [ ] **Step 1: Create the spark bar component**

Create `dashboard/src/components/OpportunityBar.tsx`:

```tsx
"use client";

import { useState, useRef } from "react";
import type { CompetitorVideo } from "@/lib/opportunity";
import { getKeywordOpportunity } from "@/lib/opportunity";

const SIGNAL_COLORS = {
  green: "bg-emerald-400",
  amber: "bg-amber-400",
  red: "bg-red-400",
  neutral: "bg-gray-300",
};

interface OpportunityBarProps {
  competitors: CompetitorVideo[];
}

export default function OpportunityBar({ competitors }: OpportunityBarProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  if (competitors.length === 0) {
    return (
      <div className="flex items-center gap-[2px]">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="w-[3px] h-4 rounded-[1px] bg-gray-200" />
        ))}
      </div>
    );
  }

  const opportunity = getKeywordOpportunity(competitors);

  const TOOLTIP_COLORS = {
    green: "text-emerald-400",
    amber: "text-amber-400",
    red: "text-red-400",
  };

  return (
    <div
      ref={ref}
      className="relative inline-flex items-center gap-[2px] cursor-default"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      {opportunity.signals.map((signal, i) => (
        <div
          key={i}
          className={`w-[3px] h-4 rounded-[1px] transition-all duration-200 ${SIGNAL_COLORS[signal.color]}`}
          style={{ opacity: showTooltip ? 1 : 0.8 }}
        />
      ))}
      {/* Pad to 5 bars if less than 5 competitors */}
      {Array.from({ length: Math.max(0, 5 - opportunity.signals.length) }).map((_, i) => (
        <div key={`pad-${i}`} className="w-[3px] h-4 rounded-[1px] bg-gray-200" />
      ))}

      {showTooltip && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2.5 py-1.5 bg-gray-900 rounded-md shadow-lg whitespace-nowrap z-50">
          <span className={`text-xs font-semibold ${TOOLTIP_COLORS[opportunity.color]}`}>
            {opportunity.score}/{opportunity.total}
          </span>
          <span className="text-xs text-gray-400 ml-1">beatable</span>
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900" />
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add dashboard/src/components/OpportunityBar.tsx
git commit -m "feat: add OpportunityBar spark bar component"
```

---

### Task 5: Create CompetitorPanel component

**Files:**
- Create: `dashboard/src/components/CompetitorPanel.tsx`

- [ ] **Step 1: Create the competitor panel**

Create `dashboard/src/components/CompetitorPanel.tsx`:

```tsx
"use client";

import type { CompetitorVideo } from "@/lib/opportunity";
import { getVideoSignal, formatAge, formatViewCount } from "@/lib/opportunity";

const DOT_COLORS = {
  green: "bg-emerald-400",
  amber: "bg-amber-400",
  red: "bg-red-400",
};

const LABEL_COLORS = {
  green: "text-emerald-400",
  amber: "text-amber-400",
  red: "text-red-400",
};

interface CompetitorPanelProps {
  competitors: CompetitorVideo[];
  isRanked: boolean;
}

export default function CompetitorPanel({ competitors, isRanked }: CompetitorPanelProps) {
  return (
    <div className="bg-gray-950 rounded-lg mx-3 mb-3 p-1 shadow-inner overflow-hidden">
      <div className="divide-y divide-gray-800/50">
        {competitors.map((comp) => {
          const signal = getVideoSignal(comp.viewCount, comp.publishedAt);

          return (
            <div
              key={comp.videoId}
              className={`flex items-center gap-3 px-3 py-2.5 group/comp transition-colors hover:bg-gray-900/50 ${
                comp.isOwnVideo ? "border-l-2 border-brand-500" : ""
              }`}
            >
              {/* Position */}
              <span className="flex-none w-6 h-6 rounded-full bg-gray-800 flex items-center justify-center text-[11px] font-mono font-medium text-gray-400">
                {comp.position}
              </span>

              {/* Title + Channel */}
              <div className="flex-1 min-w-0">
                <a
                  href={`https://youtube.com/watch?v=${comp.videoId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-gray-200 hover:text-white hover:underline decoration-gray-600 underline-offset-2 truncate block transition-colors"
                >
                  {comp.title}
                </a>
                <span className="text-[11px] text-gray-600">
                  {comp.isOwnVideo ? (
                    <span className="text-brand-500 font-medium">Your video</span>
                  ) : (
                    comp.channelTitle
                  )}
                </span>
              </div>

              {/* Stats cluster */}
              <div className="flex-none flex items-center gap-3 text-[12px] font-mono text-gray-500">
                <span className="w-16 text-right tabular-nums">{formatViewCount(comp.viewCount)}</span>
                <span className="text-gray-700">·</span>
                <span className="w-14 text-right tabular-nums">{formatAge(comp.publishedAt)}</span>
                <span className="text-gray-700">·</span>
                <span className="flex items-center gap-1.5 w-16">
                  <span className={`w-1.5 h-1.5 rounded-full ${DOT_COLORS[signal.color]}`} />
                  <span className={`text-[11px] font-medium ${LABEL_COLORS[signal.color]}`}>
                    {signal.label}
                  </span>
                </span>
              </div>
            </div>
          );
        })}

        {/* Not ranked ghost row */}
        {!isRanked && (
          <div className="flex items-center gap-3 px-3 py-2.5">
            <span className="flex-none w-6 h-6 rounded-full bg-gray-800/50 flex items-center justify-center text-[11px] font-mono text-gray-600">
              —
            </span>
            <span className="text-sm text-gray-600 italic">
              Your channel is not in the top 20 for this keyword
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add dashboard/src/components/CompetitorPanel.tsx
git commit -m "feat: add CompetitorPanel dark-card component"
```

---

## Chunk 3: Integration — Wire Everything Together

### Task 6: Update KeywordTable with expand/collapse and competitor display

**Files:**
- Modify: `dashboard/src/components/KeywordTable.tsx`

- [ ] **Step 1: Update KeywordRow interface and imports**

Replace the entire `dashboard/src/components/KeywordTable.tsx` with:

```tsx
"use client";

import { useState } from "react";
import UTMCopy from "./UTMCopy";
import OpportunityBar from "./OpportunityBar";
import CompetitorPanel from "./CompetitorPanel";
import type { CompetitorVideo } from "@/lib/opportunity";

interface KeywordRow {
  keyword: string;
  rank: number | null;
  videoId: string | null;
  videoTitle: string | null;
  change: number | null;
  ytViews: number | null;
  sessions: number | null;
  signups: number | null;
  utmLink: string | null;
  competitors: CompetitorVideo[];
}

interface KeywordTableProps {
  rows: KeywordRow[];
  onDelete: (keyword: string) => void;
  checking: boolean;
  checkProgress: { current: number; total: number } | null;
}

function ChangeIndicator({ change }: { change: number | null }) {
  if (change === null) {
    return <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-600">NEW</span>;
  }
  if (change > 0) {
    return <span className="text-green-600 text-sm font-medium">&#8593;{change}</span>;
  }
  if (change < 0) {
    return <span className="text-red-500 text-sm font-medium">&#8595;{Math.abs(change)}</span>;
  }
  return <span className="text-gray-400 text-sm">&mdash;</span>;
}

export default function KeywordTable({ rows, onDelete, checking, checkProgress }: KeywordTableProps) {
  const [expandedKeyword, setExpandedKeyword] = useState<string | null>(null);

  if (rows.length === 0) {
    return null;
  }

  function toggleExpand(keyword: string) {
    setExpandedKeyword((prev) => (prev === keyword ? null : keyword));
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-gray-900">Keyword Rankings</h2>
        {checking && checkProgress && (
          <span className="text-xs text-blue-600 font-medium">
            Checking {checkProgress.current} of {checkProgress.total}...
          </span>
        )}
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/50">
              <th className="w-8 px-2 py-3"></th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Keyword</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Your Video</th>
              <th className="text-center px-3 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Rank</th>
              <th className="text-center px-3 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Change</th>
              <th className="text-center px-2 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Opp.</th>
              <th className="text-right px-3 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">YT Views</th>
              <th className="text-right px-3 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Sessions</th>
              <th className="text-right px-3 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Signups</th>
              <th className="text-center px-3 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">UTM</th>
              <th className="px-3 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              const isExpanded = expandedKeyword === row.keyword;
              const hasCompetitors = row.competitors.length > 0;

              return (
                <tr key={row.keyword} className="group contents">
                  {/* Main row */}
                  <td
                    colSpan={11}
                    className="p-0"
                  >
                    <div
                      className={`flex items-center cursor-pointer transition-colors duration-150 ${
                        isExpanded ? "bg-gray-50" : "hover:bg-gray-50/50"
                      } ${hasCompetitors ? "cursor-pointer" : ""}`}
                      onClick={() => hasCompetitors && toggleExpand(row.keyword)}
                    >
                      {/* Chevron */}
                      <div className="w-8 flex-none flex items-center justify-center px-2 py-3">
                        {hasCompetitors ? (
                          <svg
                            className={`h-3.5 w-3.5 text-gray-400 transition-transform duration-150 ${isExpanded ? "rotate-90" : ""}`}
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={2}
                            stroke="currentColor"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                          </svg>
                        ) : (
                          <span className="w-3.5" />
                        )}
                      </div>

                      {/* Keyword */}
                      <div className="flex-1 min-w-[140px] px-4 py-3 font-medium text-gray-900 truncate">
                        {row.keyword}
                      </div>

                      {/* Your Video */}
                      <div className="flex-1 min-w-[160px] max-w-[200px] px-4 py-3 text-gray-600 truncate">
                        {row.videoId ? (
                          <a
                            href={`https://youtube.com/watch?v=${row.videoId}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {row.videoTitle || row.videoId}
                          </a>
                        ) : (
                          <span className="text-gray-400 italic">Not ranked</span>
                        )}
                      </div>

                      {/* Rank */}
                      <div className="flex-none w-16 px-3 py-3 text-center">
                        {row.rank ? (
                          <span className="inline-flex items-center justify-center h-7 w-7 rounded-full bg-blue-50 text-blue-700 text-sm font-semibold">
                            {row.rank}
                          </span>
                        ) : (
                          <span className="text-gray-400">&mdash;</span>
                        )}
                      </div>

                      {/* Change */}
                      <div className="flex-none w-16 px-3 py-3 text-center">
                        <ChangeIndicator change={row.change} />
                      </div>

                      {/* Opportunity */}
                      <div className="flex-none w-14 px-2 py-3 flex items-center justify-center">
                        <OpportunityBar competitors={row.competitors} />
                      </div>

                      {/* YT Views */}
                      <div className="flex-none w-20 px-3 py-3 text-right text-gray-600">
                        {row.ytViews !== null ? row.ytViews.toLocaleString() : <span className="text-gray-400">&mdash;</span>}
                      </div>

                      {/* Sessions */}
                      <div className="flex-none w-20 px-3 py-3 text-right text-gray-600">
                        {row.sessions !== null ? row.sessions.toLocaleString() : <span className="text-gray-400">&mdash;</span>}
                      </div>

                      {/* Signups */}
                      <div className="flex-none w-20 px-3 py-3 text-right text-gray-600">
                        {row.signups !== null ? row.signups.toLocaleString() : <span className="text-gray-400">&mdash;</span>}
                      </div>

                      {/* UTM */}
                      <div className="flex-none w-16 px-3 py-3 text-center" onClick={(e) => e.stopPropagation()}>
                        {row.utmLink ? <UTMCopy url={row.utmLink} /> : <span className="text-gray-400">&mdash;</span>}
                      </div>

                      {/* Delete */}
                      <div className="flex-none w-10 px-3 py-3" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => onDelete(row.keyword)}
                          className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition-all"
                          title="Remove keyword"
                        >
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    </div>

                    {/* Competitor Panel */}
                    <div
                      className={`overflow-hidden transition-all duration-150 ease-out ${
                        isExpanded ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
                      }`}
                    >
                      {isExpanded && (
                        <CompetitorPanel
                          competitors={row.competitors}
                          isRanked={row.rank !== null}
                        />
                      )}
                    </div>

                    {/* Row separator */}
                    <div className="border-b border-gray-100" />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export type { KeywordRow };
```

- [ ] **Step 2: Commit**

```bash
git add dashboard/src/components/KeywordTable.tsx
git commit -m "feat: add expand/collapse competitor panel and opportunity bar to keyword table"
```

---

### Task 7: Update Keywords page to pass competitor data through

**Files:**
- Modify: `dashboard/src/app/dashboard/keywords/page.tsx`

- [ ] **Step 1: Update imports and RankResult interface**

In `dashboard/src/app/dashboard/keywords/page.tsx`, add the import at the top:

```typescript
import type { CompetitorVideo } from "@/lib/opportunity";
```

Then update the `RankResult` interface (around line 19) from:

```typescript
interface RankResult {
  keyword: string;
  rank: number | null;
  videoId: string | null;
  videoTitle: string | null;
}
```

To:

```typescript
interface RankResult {
  keyword: string;
  rank: number | null;
  videoId: string | null;
  videoTitle: string | null;
  competitors: CompetitorVideo[];
}
```

- [ ] **Step 2: Update the RankEntry creation in checkAllRanks()**

In the `checkAllRanks()` function, update the entry creation (around line 162) from:

```typescript
const entry: RankEntry = {
  rank: result.rank,
  videoId: result.videoId,
  videoTitle: result.videoTitle,
  checkedAt: new Date().toISOString(),
};
```

To:

```typescript
const entry: RankEntry = {
  rank: result.rank,
  videoId: result.videoId,
  videoTitle: result.videoTitle,
  checkedAt: new Date().toISOString(),
  competitors: result.competitors || [],
};
```

- [ ] **Step 3: Update buildRows() to include competitors**

In the `buildRows()` function, update the return object to include competitors. Find the return statement (around line 211) and add the `competitors` field:

```typescript
return {
  keyword: kw,
  rank: latest?.rank || null,
  videoId: latest?.videoId || null,
  videoTitle: latest?.videoTitle || null,
  change,
  ytViews: matchedTerm?.views ?? null,
  sessions: ga4Campaign?.sessions ?? null,
  signups: ga4Campaign?.keyEvents ?? null,
  utmLink,
  competitors: latest?.competitors || [],
};
```

- [ ] **Step 4: Commit**

```bash
git add dashboard/src/app/dashboard/keywords/page.tsx
git commit -m "feat: wire competitor data through keywords page to table"
```

---

### Task 8: Test and verify

- [ ] **Step 1: Start dev server**

```bash
cd dashboard && npx next dev
```

- [ ] **Step 2: Verify build compiles**

Visit `http://localhost:3000/dashboard/keywords`. Verify:
- Page loads without errors
- Existing keyword data still displays correctly
- If keywords exist, they show gray placeholder spark bars (no competitor data yet from old history)

- [ ] **Step 3: Test rank check with competitors**

Click "Check All Rankings". Verify:
- SSE stream works as before
- After check completes, spark bars appear with colors
- Hover over spark bar shows "X/5 beatable" tooltip
- Click a keyword row — competitor panel slides open with dark background
- Competitor strips show: position number, title (links to YouTube), channel name, view count, age, signal dot + label
- User's own video (if ranked) has blue left border and "Your video" label
- Click same row again to collapse
- Expanding a different row auto-collapses the previous one

- [ ] **Step 4: Commit final verified state**

```bash
git add -A
git commit -m "feat(dashboard): add competitor intelligence to keyword rankings"
```
