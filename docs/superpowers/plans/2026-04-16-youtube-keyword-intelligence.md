# YouTube Keyword Intelligence Tool — Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add keyword rank tracking with GA4 funnel attribution to the existing YouTube dashboard, so B2B founders can see which YouTube keywords drive signups to their business.

**Architecture:** Tab-based navigation (Analytics + Keywords). Keyword rank checks via YouTube `search.list` API, GA4 attribution via raw `fetch` to GA4 Data/Admin APIs. All user config stored in localStorage (v1). SSE streaming for real-time rank check updates.

**Tech Stack:** Next.js 14 (App Router), NextAuth v4, YouTube Data API v3, YouTube Analytics API v2, GA4 Data API, GA4 Admin API, Tailwind CSS, localStorage.

**Spec:** `docs/superpowers/specs/2026-04-16-youtube-keyword-intelligence-design.md`

---

## Chunk 1: Foundation — Auth, Layout, Sidebar, Impressions/CTR

### Task 1: Add GA4 OAuth Scope and Expose User ID

**Files:**
- Modify: `dashboard/src/lib/auth.ts`

- [ ] **Step 1: Update OAuth scope string**

In `dashboard/src/lib/auth.ts`, line 40-41, update the scope string to add the GA4 analytics scope:

```typescript
scope:
  "openid email profile https://www.googleapis.com/auth/youtube.readonly https://www.googleapis.com/auth/yt-analytics.readonly https://www.googleapis.com/auth/analytics.readonly",
```

- [ ] **Step 2: Expose `sub` and `accessToken` in session callback**

In the `jwt` callback (line 49-67), add `sub` to the first sign-in return:

```typescript
async jwt({ token, account }) {
  if (account) {
    return {
      ...token,
      accessToken: account.access_token,
      refreshToken: account.refresh_token,
      expiresAt: account.expires_at,
      userId: token.sub,
    };
  }

  if (typeof token.expiresAt === "number" && Date.now() / 1000 < token.expiresAt - 60) {
    return token;
  }

  return await refreshAccessToken(token);
},
```

Update the `session` callback (line 68-72) to expose `userId`:

```typescript
async session({ session, token }) {
  (session as any).accessToken = token.accessToken;
  (session as any).error = token.error;
  (session as any).userId = token.userId || token.sub;
  return session;
},
```

- [ ] **Step 3: Test locally**

Run: `cd dashboard && npx next dev`
Visit `http://localhost:3000`. Sign out and sign back in (new scope will trigger re-consent). Verify the consent screen now mentions Google Analytics access. Confirm the dashboard still loads analytics data.

- [ ] **Step 4: Commit**

```bash
git add dashboard/src/lib/auth.ts
git commit -m "feat(dashboard): add GA4 OAuth scope and expose userId in session"
```

---

### Task 2: Extract Shared Dashboard Layout

**Files:**
- Create: `dashboard/src/app/dashboard/layout.tsx`
- Modify: `dashboard/src/app/dashboard/page.tsx`
- Modify: `dashboard/src/components/Sidebar.tsx`

- [ ] **Step 1: Update Sidebar to use `usePathname()` for active state**

Replace the entire content of `dashboard/src/components/Sidebar.tsx`:

```tsx
"use client";

import { signOut, useSession } from "next-auth/react";
import { usePathname } from "next/navigation";

function getInitial(name?: string | null): string {
  if (!name) return "?";
  return name.charAt(0).toUpperCase();
}

const NAV_ITEMS = [
  {
    href: "/dashboard",
    label: "Analytics",
    icon: (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25a2.25 2.25 0 0 1-2.25-2.25v-2.25Z" />
      </svg>
    ),
    exact: true,
  },
  {
    href: "/dashboard/keywords",
    label: "Keywords",
    icon: (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
      </svg>
    ),
    exact: false,
  },
];

interface SidebarProps {
  onFeedbackClick?: () => void;
}

export default function Sidebar({ onFeedbackClick }: SidebarProps) {
  const { data: session } = useSession();
  const pathname = usePathname();

  function isActive(href: string, exact: boolean) {
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  }

  return (
    <aside className="w-60 bg-gradient-to-b from-gray-900 to-gray-950 text-gray-300 flex flex-col min-h-screen">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-gray-800">
        <span className="flex items-center gap-2 text-lg font-semibold text-white">
          <span className="flex items-center justify-center h-6 w-6 rounded bg-red-600 text-[10px] font-bold text-white leading-none">
            YT
          </span>
          SellOnTube
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {NAV_ITEMS.map((item) => {
          const active = isActive(item.href, item.exact);
          return (
            <a
              key={item.href}
              href={item.href}
              className={`relative flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                active
                  ? "text-white bg-gray-800/70"
                  : "text-gray-400 hover:text-white hover:bg-gray-800/50"
              }`}
            >
              {active && (
                <span
                  className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-[3px] rounded-r-full bg-blue-500"
                  aria-hidden="true"
                />
              )}
              {item.icon}
              {item.label}
            </a>
          );
        })}

        <button
          onClick={onFeedbackClick}
          className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-gray-400 hover:text-white hover:bg-gray-800/50 transition-colors w-full"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-.189m-1.5.189a6.01 6.01 0 0 1-1.5-.189m3.75 7.478a12.06 12.06 0 0 1-4.5 0m3.75 2.383a14.406 14.406 0 0 1-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 1 0-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
          </svg>
          Feature Request
        </button>
      </nav>

      {/* User section */}
      <div className="px-3 py-4 border-t border-gray-800 space-y-3">
        {session?.user && (
          <div className="flex items-center gap-3 px-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-xs font-semibold text-white shrink-0">
              {getInitial(session.user.name)}
            </span>
            <div className="min-w-0">
              <p className="text-sm font-medium text-white truncate">
                {session.user.name}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {session.user.email}
              </p>
            </div>
          </div>
        )}
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="flex items-center justify-center gap-1.5 w-full rounded-md px-3 py-1.5 text-xs text-gray-500 hover:text-gray-300 hover:bg-gray-800/50 transition-colors"
        >
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" />
          </svg>
          Sign out
        </button>
      </div>
    </aside>
  );
}
```

- [ ] **Step 2: Create shared dashboard layout**

Create `dashboard/src/app/dashboard/layout.tsx`:

```tsx
"use client";

import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import FeedbackModal from "@/components/FeedbackModal";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [feedbackOpen, setFeedbackOpen] = useState(false);

  return (
    <div className="flex min-h-screen">
      <Sidebar onFeedbackClick={() => setFeedbackOpen(true)} />
      <main className="flex-1 overflow-y-auto">{children}</main>
      <FeedbackModal isOpen={feedbackOpen} onClose={() => setFeedbackOpen(false)} />
    </div>
  );
}
```

- [ ] **Step 3: Update Analytics page to remove sidebar/feedback rendering**

In `dashboard/src/app/dashboard/page.tsx`:

Remove these imports:
- `Sidebar` import (line 6)
- `FeedbackModal` import (line 15)

Remove `feedbackOpen` state (line 83).

Update the loading state return (lines 122-134) to remove `<Sidebar>` and outer `<div className="flex min-h-screen">` wrapper:

```tsx
if (status === "loading" || (status === "authenticated" && loading && !data)) {
  return (
    <div className="flex-1 flex items-center justify-center">
      <div className="space-y-3 text-center">
        <div className="h-8 w-8 mx-auto border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin" />
        <p className="text-sm text-gray-500">Loading your analytics...</p>
      </div>
    </div>
  );
}
```

Update the error state return (lines 136-154) similarly — remove `<Sidebar>` and outer wrapper.

Update the main return (lines 156-258) — remove the outer `<div className="flex min-h-screen">`, `<Sidebar />`, and `<FeedbackModal>`. The content starts directly with the header:

```tsx
return (
  <>
    {/* Header with range picker */}
    <div className="px-8 py-5 border-b border-gray-200 bg-white flex items-center justify-between">
      {/* ... existing header content unchanged ... */}
    </div>

    <div className="px-8 py-6 space-y-6">
      {/* ... existing KPI cards, charts, tables unchanged ... */}
    </div>
  </>
);
```

- [ ] **Step 4: Test locally**

Run: `cd dashboard && npx next dev`
Visit `http://localhost:3000/dashboard`. Verify:
- Sidebar renders with both "Analytics" and "Keywords" nav items
- Analytics has blue active indicator
- Clicking "Keywords" navigates to `/dashboard/keywords` (will be 404 for now, that's expected)
- Feedback modal still works
- All analytics data loads correctly

- [ ] **Step 5: Commit**

```bash
git add dashboard/src/components/Sidebar.tsx dashboard/src/app/dashboard/layout.tsx dashboard/src/app/dashboard/page.tsx
git commit -m "feat(dashboard): extract shared layout, add Keywords nav item to sidebar"
```

---

### Task 3: Add Impressions + CTR to Analytics

**Files:**
- Modify: `dashboard/src/lib/youtube.ts` (lines 47-86)
- Modify: `dashboard/src/app/dashboard/page.tsx`
- Modify: `dashboard/src/components/KpiCard.tsx`

- [ ] **Step 1: Add indigo and teal accent colors to KpiCard**

In `dashboard/src/components/KpiCard.tsx`, add to `ACCENT_COLORS` (line 1-8):

```typescript
const ACCENT_COLORS: Record<string, string> = {
  blue: "#3b82f6",
  green: "#10b981",
  amber: "#f59e0b",
  rose: "#f43f5e",
  violet: "#8b5cf6",
  gray: "#6b7280",
  indigo: "#6366f1",
  teal: "#14b8a6",
};
```

- [ ] **Step 2: Update `getAnalytics()` to include impressions and CTR**

In `dashboard/src/lib/youtube.ts`, update the `getAnalytics` function:

Update the return type (lines 51-57) to include new fields:

```typescript
): Promise<{
  views: number;
  watchTimeMinutes: number;
  likes: number;
  subscribersGained: number;
  averageViewDuration: number;
  impressions: number;
  ctr: number;
}> {
```

Update the metrics param (lines 62-63):

```typescript
metrics:
  "views,estimatedMinutesWatched,likes,subscribersGained,averageViewDuration,impressions,impressionClickThroughRate",
```

Update the row default and return (lines 77-85):

```typescript
const row = data.rows?.[0] || [0, 0, 0, 0, 0, 0, 0];

return {
  views: row[0] || 0,
  watchTimeMinutes: Math.round(row[1] || 0),
  likes: row[2] || 0,
  subscribersGained: row[3] || 0,
  averageViewDuration: Math.round(row[4] || 0),
  impressions: row[5] || 0,
  ctr: Math.round((row[6] || 0) * 100) / 100,
};
```

- [ ] **Step 3: Update `fetchDashboardData` return type and mapping**

In `dashboard/src/lib/youtube.ts`, update the `AnalyticsData` interface (line 7) to add:

```typescript
impressions: number;
ctr: number;
```

Update the return in `fetchDashboardData` (lines 393-407) to include:

```typescript
impressions: analytics.impressions,
ctr: analytics.ctr,
```

- [ ] **Step 4: Update the dashboard page to show new KPI cards**

In `dashboard/src/app/dashboard/page.tsx`:

Add `impressions` and `ctr` to the `DashboardData` interface.

Update the KPI grid from `lg:grid-cols-6` to `lg:grid-cols-4`:

```tsx
<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
```

Add 2 new KPI cards after the existing 6:

```tsx
<KpiCard
  label="Impressions"
  value={formatNumber(data?.impressions || 0)}
  subtitle="Thumbnail shown in feeds"
  accent="indigo"
/>
<KpiCard
  label="CTR"
  value={`${data?.ctr || 0}%`}
  subtitle="Impressions → views"
  accent="teal"
/>
```

- [ ] **Step 5: Test locally**

Run: `cd dashboard && npx next dev`
Visit `http://localhost:3000/dashboard`. Verify:
- 8 KPI cards in a 4x2 grid on desktop
- Impressions shows a number with "Thumbnail shown in feeds" subtitle
- CTR shows a percentage with "Impressions → views" subtitle
- Existing 6 KPI cards still show correct data

- [ ] **Step 6: Commit**

```bash
git add dashboard/src/lib/youtube.ts dashboard/src/app/dashboard/page.tsx dashboard/src/components/KpiCard.tsx
git commit -m "feat(dashboard): add Impressions and CTR KPI cards to analytics page"
```

---

## Chunk 2: YouTube Rank Check API + Keyword Table UI

### Task 4: Add `getChannelId()` and `checkKeywordRank()` to youtube.ts

**Files:**
- Modify: `dashboard/src/lib/youtube.ts`

- [ ] **Step 1: Add `getChannelId()` function**

Append to `dashboard/src/lib/youtube.ts`:

```typescript
export async function getChannelId(accessToken: string): Promise<string> {
  const res = await fetch(
    "https://www.googleapis.com/youtube/v3/channels?part=id&mine=true",
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`Channel ID API error: ${res.status} - ${error}`);
  }

  const data = await res.json();
  const channelId = data.items?.[0]?.id;
  if (!channelId) throw new Error("No channel found for this account");
  return channelId;
}
```

- [ ] **Step 2: Add `checkKeywordRank()` function**

Append to `dashboard/src/lib/youtube.ts`:

```typescript
export async function checkKeywordRank(
  accessToken: string,
  keyword: string,
  channelId: string
): Promise<{ keyword: string; rank: number | null; videoId: string | null; videoTitle: string | null }> {
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

  for (let i = 0; i < items.length; i++) {
    if (items[i].snippet?.channelId === channelId) {
      return {
        keyword,
        rank: i + 1,
        videoId: items[i].id?.videoId || null,
        videoTitle: items[i].snippet?.title || null,
      };
    }
  }

  return { keyword, rank: null, videoId: null, videoTitle: null };
}
```

- [ ] **Step 3: Commit**

```bash
git add dashboard/src/lib/youtube.ts
git commit -m "feat(dashboard): add getChannelId and checkKeywordRank YouTube API functions"
```

---

### Task 5: Create Rank Check API Route with SSE Streaming

**Files:**
- Create: `dashboard/src/app/api/keywords/check/route.ts`

- [ ] **Step 1: Create the API route**

Create `dashboard/src/app/api/keywords/check/route.ts`:

```typescript
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getChannelId, checkKeywordRank } from "@/lib/youtube";

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !(session as any).accessToken) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  const accessToken = (session as any).accessToken;
  const body = await request.json();
  const keywords: string[] = body.keywords || [];

  if (keywords.length === 0) {
    return new Response(JSON.stringify({ error: "No keywords provided" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  if (keywords.length > 50) {
    return new Response(JSON.stringify({ error: "Maximum 50 keywords allowed" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  // Get channel ID once (cached for this request)
  let channelId: string;
  try {
    channelId = await getChannelId(accessToken);
  } catch (err: any) {
    return new Response(JSON.stringify({ error: "Failed to get channel ID", detail: err.message }), {
      status: 503,
      headers: { "Content-Type": "application/json" },
    });
  }

  // Stream results via SSE
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      for (let i = 0; i < keywords.length; i++) {
        try {
          const result = await checkKeywordRank(accessToken, keywords[i], channelId);
          const data = JSON.stringify({ ...result, index: i, total: keywords.length });
          controller.enqueue(encoder.encode(`data: ${data}\n\n`));
        } catch (err: any) {
          const errorData = JSON.stringify({
            keyword: keywords[i],
            error: err.message,
            index: i,
            total: keywords.length,
          });
          controller.enqueue(encoder.encode(`data: ${errorData}\n\n`));
        }

        // 200ms delay between calls to avoid rate limiting
        if (i < keywords.length - 1) {
          await sleep(200);
        }
      }
      controller.enqueue(encoder.encode("data: [DONE]\n\n"));
      controller.close();
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
```

- [ ] **Step 2: Test the endpoint manually**

Run: `cd dashboard && npx next dev`

In a separate terminal, test with curl (replace cookie with your session cookie):
```bash
curl -X POST http://localhost:3000/api/keywords/check \
  -H "Content-Type: application/json" \
  -d '{"keywords":["youtube seo tools"]}'
```

Expected: SSE stream with `data: {"keyword":"youtube seo tools","rank":...}` followed by `data: [DONE]`

- [ ] **Step 3: Commit**

```bash
git add dashboard/src/app/api/keywords/check/route.ts
git commit -m "feat(dashboard): add keyword rank check API with SSE streaming"
```

---

### Task 6: Create localStorage Helper Module

**Files:**
- Create: `dashboard/src/lib/storage.ts`

- [ ] **Step 1: Create the storage helper**

Create `dashboard/src/lib/storage.ts`:

```typescript
const NINETY_DAYS_MS = 90 * 24 * 60 * 60 * 1000;

export interface RankEntry {
  rank: number | null;
  videoId: string | null;
  videoTitle: string | null;
  checkedAt: string;
}

export interface KeywordsData {
  schemaVersion: number;
  keywords: string[];
  history: Record<string, RankEntry[]>;
}

export interface GA4Config {
  schemaVersion: number;
  ga4PropertyId: string;
  conversionEvent: string;
  siteUrl: string;
  signupValue: number;
}

function getStorageKey(prefix: string, userId: string): string {
  return `sot_${prefix}_${userId}`;
}

function pruneHistory(entries: RankEntry[]): RankEntry[] {
  const cutoff = new Date(Date.now() - NINETY_DAYS_MS).toISOString();
  return entries.filter((e) => e.checkedAt >= cutoff);
}

export function loadKeywords(userId: string): KeywordsData {
  const key = getStorageKey("keywords", userId);
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return { schemaVersion: 1, keywords: [], history: {} };
    const data = JSON.parse(raw);
    if (data.schemaVersion !== 1) return { schemaVersion: 1, keywords: [], history: {} };
    return data;
  } catch {
    return { schemaVersion: 1, keywords: [], history: {} };
  }
}

export function saveKeywords(userId: string, data: KeywordsData): void {
  // Prune history before saving
  const pruned: KeywordsData = {
    ...data,
    history: Object.fromEntries(
      Object.entries(data.history).map(([kw, entries]) => [kw, pruneHistory(entries)])
    ),
  };
  const key = getStorageKey("keywords", userId);
  localStorage.setItem(key, JSON.stringify(pruned));
}

export function loadGA4Config(userId: string): GA4Config | null {
  const key = getStorageKey("ga4", userId);
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const data = JSON.parse(raw);
    if (data.schemaVersion !== 1) return null;
    return data;
  } catch {
    return null;
  }
}

export function saveGA4Config(userId: string, config: GA4Config): void {
  const key = getStorageKey("ga4", userId);
  localStorage.setItem(key, JSON.stringify(config));
}

export function slugifyKeyword(keyword: string): string {
  return keyword
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export function generateUTMLink(
  siteUrl: string,
  keyword: string,
  videoId: string
): string {
  const base = siteUrl.replace(/\/+$/, "");
  const campaign = slugifyKeyword(keyword);
  return `${base}?utm_source=youtube&utm_medium=video&utm_campaign=${campaign}&utm_content=${videoId}`;
}
```

- [ ] **Step 2: Commit**

```bash
git add dashboard/src/lib/storage.ts
git commit -m "feat(dashboard): add localStorage helpers for keywords and GA4 config"
```

---

### Task 7: Create UTMCopy Component

**Files:**
- Create: `dashboard/src/components/UTMCopy.tsx`

- [ ] **Step 1: Create the component**

Create `dashboard/src/components/UTMCopy.tsx`:

```tsx
"use client";

import { useState } from "react";

interface UTMCopyProps {
  url: string;
}

export default function UTMCopy({ url }: UTMCopyProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <button
      onClick={handleCopy}
      className="inline-flex items-center gap-1 rounded px-2 py-1 text-xs font-medium text-blue-600 hover:bg-blue-50 transition-colors"
      title={url}
    >
      {copied ? (
        <>
          <svg className="h-3.5 w-3.5 text-green-500" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
          </svg>
          Copied
        </>
      ) : (
        <>
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0 0 13.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 0 1-.75.75H9.75a.75.75 0 0 1-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 0 1-2.25 2.25H6.75A2.25 2.25 0 0 1 4.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 0 1 1.927-.184" />
          </svg>
          Copy
        </>
      )}
    </button>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add dashboard/src/components/UTMCopy.tsx
git commit -m "feat(dashboard): add UTM link copy-to-clipboard component"
```

---

### Task 8: Create KeywordTable Component

**Files:**
- Create: `dashboard/src/components/KeywordTable.tsx`

- [ ] **Step 1: Create the component**

Create `dashboard/src/components/KeywordTable.tsx`:

```tsx
"use client";

import { RankEntry } from "@/lib/storage";
import UTMCopy from "./UTMCopy";

interface KeywordRow {
  keyword: string;
  rank: number | null;
  videoId: string | null;
  videoTitle: string | null;
  change: number | null; // positive = improved, negative = dropped, null = first check
  ytViews: number | null;
  sessions: number | null;
  signups: number | null;
  utmLink: string | null;
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
  if (rows.length === 0) {
    return null;
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
              <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Keyword</th>
              <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Your Video</th>
              <th className="text-center px-3 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Rank</th>
              <th className="text-center px-3 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Change</th>
              <th className="text-right px-3 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">YT Views</th>
              <th className="text-right px-3 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Sessions</th>
              <th className="text-right px-3 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Signups</th>
              <th className="text-center px-3 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">UTM</th>
              <th className="px-3 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {rows.map((row) => (
              <tr key={row.keyword} className="hover:bg-gray-50/50 group">
                <td className="px-5 py-3 font-medium text-gray-900">{row.keyword}</td>
                <td className="px-5 py-3 text-gray-600 max-w-[200px] truncate">
                  {row.videoId ? (
                    <a
                      href={`https://youtube.com/watch?v=${row.videoId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {row.videoTitle || row.videoId}
                    </a>
                  ) : (
                    <span className="text-gray-400 italic">Not ranked</span>
                  )}
                </td>
                <td className="px-3 py-3 text-center">
                  {row.rank ? (
                    <span className="inline-flex items-center justify-center h-7 w-7 rounded-full bg-blue-50 text-blue-700 text-sm font-semibold">
                      {row.rank}
                    </span>
                  ) : (
                    <span className="text-gray-400">&mdash;</span>
                  )}
                </td>
                <td className="px-3 py-3 text-center">
                  <ChangeIndicator change={row.change} />
                </td>
                <td className="px-3 py-3 text-right text-gray-600">
                  {row.ytViews !== null ? row.ytViews.toLocaleString() : <span className="text-gray-400">&mdash;</span>}
                </td>
                <td className="px-3 py-3 text-right text-gray-600">
                  {row.sessions !== null ? row.sessions.toLocaleString() : <span className="text-gray-400">&mdash;</span>}
                </td>
                <td className="px-3 py-3 text-right text-gray-600">
                  {row.signups !== null ? row.signups.toLocaleString() : <span className="text-gray-400">&mdash;</span>}
                </td>
                <td className="px-3 py-3 text-center">
                  {row.utmLink ? <UTMCopy url={row.utmLink} /> : <span className="text-gray-400">&mdash;</span>}
                </td>
                <td className="px-3 py-3">
                  <button
                    onClick={() => onDelete(row.keyword)}
                    className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition-all"
                    title="Remove keyword"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                    </svg>
                  </button>
                </td>
              </tr>
            ))}
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
git commit -m "feat(dashboard): add KeywordTable component with rank, change, and UTM columns"
```

---

### Task 9: Create ROI Scorecard Component

**Files:**
- Create: `dashboard/src/components/ROIScorecard.tsx`

- [ ] **Step 1: Create the component**

Create `dashboard/src/components/ROIScorecard.tsx`:

```tsx
"use client";

import KpiCard from "./KpiCard";

interface ROIScorecardProps {
  totalYTViews: number;
  sessionsFromYouTube: number;
  signupsFromYouTube: number;
  signupValue: number;
}

function formatNumber(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(1) + "K";
  return n.toLocaleString();
}

export default function ROIScorecard({
  totalYTViews,
  sessionsFromYouTube,
  signupsFromYouTube,
  signupValue,
}: ROIScorecardProps) {
  const revenueValue = signupsFromYouTube * signupValue;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <KpiCard
        label="YT Views"
        value={formatNumber(totalYTViews)}
        subtitle="From tracked keywords"
        accent="blue"
      />
      <KpiCard
        label="Site Sessions"
        value={formatNumber(sessionsFromYouTube)}
        subtitle="From YouTube"
        accent="violet"
      />
      <KpiCard
        label="Signups"
        value={formatNumber(signupsFromYouTube)}
        subtitle="From YouTube"
        accent="green"
      />
      <KpiCard
        label="Revenue Value"
        value={`$${formatNumber(revenueValue)}`}
        subtitle={`${signupsFromYouTube} x $${signupValue}`}
        accent="amber"
      />
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add dashboard/src/components/ROIScorecard.tsx
git commit -m "feat(dashboard): add ROI scorecard component for YouTube funnel KPIs"
```

---

## Chunk 3: GA4 Integration

### Task 10: Create GA4 API Helper Library

**Files:**
- Create: `dashboard/src/lib/ga4.ts`

- [ ] **Step 1: Create the GA4 helper**

Create `dashboard/src/lib/ga4.ts`:

```typescript
export interface GA4Property {
  name: string; // "properties/123456"
  displayName: string;
}

export interface GA4ReportRow {
  campaign: string;
  sessions: number;
  keyEvents: number;
}

export interface GA4ChannelTotals {
  totalSessions: number;
  totalKeyEvents: number;
  byCampaign: Record<string, { sessions: number; keyEvents: number }>;
}

export async function listGA4Properties(
  accessToken: string
): Promise<GA4Property[]> {
  const res = await fetch(
    "https://analyticsadmin.googleapis.com/v1beta/accountSummaries",
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );

  if (res.status === 403) {
    throw new Error("scope_missing");
  }

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`GA4 Admin API error: ${res.status} - ${error}`);
  }

  const data = await res.json();
  const properties: GA4Property[] = [];

  for (const account of data.accountSummaries || []) {
    for (const prop of account.propertySummaries || []) {
      properties.push({
        name: prop.property, // "properties/123456"
        displayName: prop.displayName || prop.property,
      });
    }
  }

  return properties;
}

export async function getGA4Report(
  accessToken: string,
  propertyId: string,
  conversionEvent: string,
  startDate: string,
  endDate: string
): Promise<GA4ChannelTotals> {
  const body = {
    dateRanges: [{ startDate, endDate }],
    dimensions: [
      { name: "sessionCampaignName" },
      { name: "sessionSource" },
      { name: "sessionMedium" },
    ],
    metrics: [
      { name: "sessions" },
      { name: "keyEvents" },
    ],
    dimensionFilter: {
      andGroup: {
        expressions: [
          {
            filter: {
              fieldName: "sessionSource",
              stringFilter: { matchType: "EXACT", value: "youtube" },
            },
          },
          {
            filter: {
              fieldName: "sessionMedium",
              stringFilter: { matchType: "EXACT", value: "video" },
            },
          },
        ],
      },
    },
  };

  // propertyId comes as "properties/123456" — extract just the number
  const numericId = propertyId.replace("properties/", "");

  const res = await fetch(
    `https://analyticsdata.googleapis.com/v1beta/properties/${numericId}:runReport`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    }
  );

  if (res.status === 403) {
    throw new Error("scope_missing");
  }

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`GA4 Data API error: ${res.status} - ${error}`);
  }

  const data = await res.json();
  const rows = data.rows || [];

  let totalSessions = 0;
  let totalKeyEvents = 0;
  const byCampaign: Record<string, { sessions: number; keyEvents: number }> = {};

  for (const row of rows) {
    const campaign = row.dimensionValues?.[0]?.value || "(not set)";
    const sessions = parseInt(row.metricValues?.[0]?.value || "0", 10);
    const keyEvents = parseInt(row.metricValues?.[1]?.value || "0", 10);

    totalSessions += sessions;
    totalKeyEvents += keyEvents;

    if (campaign !== "(not set)") {
      byCampaign[campaign] = {
        sessions: (byCampaign[campaign]?.sessions || 0) + sessions,
        keyEvents: (byCampaign[campaign]?.keyEvents || 0) + keyEvents,
      };
    }
  }

  return { totalSessions, totalKeyEvents, byCampaign };
}
```

- [ ] **Step 2: Commit**

```bash
git add dashboard/src/lib/ga4.ts
git commit -m "feat(dashboard): add GA4 Data API and Admin API helper functions"
```

---

### Task 11: Create GA4 API Routes

**Files:**
- Create: `dashboard/src/app/api/ga4/properties/route.ts`
- Create: `dashboard/src/app/api/ga4/report/route.ts`

- [ ] **Step 1: Create properties endpoint**

Create `dashboard/src/app/api/ga4/properties/route.ts`:

```typescript
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { listGA4Properties } from "@/lib/ga4";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || !(session as any).accessToken) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const properties = await listGA4Properties((session as any).accessToken);
    return Response.json({ properties });
  } catch (err: any) {
    if (err.message === "scope_missing") {
      return Response.json({ error: "scope_missing" }, { status: 403 });
    }
    return Response.json(
      { error: "Failed to list GA4 properties", detail: err.message },
      { status: 503 }
    );
  }
}
```

- [ ] **Step 2: Create report endpoint**

Create `dashboard/src/app/api/ga4/report/route.ts`:

```typescript
import { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getGA4Report } from "@/lib/ga4";

const VALID_RANGES: Record<string, number> = {
  "7d": 7,
  "28d": 28,
  "90d": 90,
  "365d": 365,
};

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !(session as any).accessToken) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const propertyId = request.nextUrl.searchParams.get("propertyId");
  const conversionEvent = request.nextUrl.searchParams.get("conversionEvent") || "sign_up";
  const range = request.nextUrl.searchParams.get("range") || "28d";

  if (!propertyId) {
    return Response.json({ error: "propertyId is required" }, { status: 400 });
  }

  const rangeDays = VALID_RANGES[range] || 28;
  const endDate = new Date().toISOString().split("T")[0];
  const startDate = new Date(Date.now() - rangeDays * 24 * 60 * 60 * 1000)
    .toISOString()
    .split("T")[0];

  try {
    const report = await getGA4Report(
      (session as any).accessToken,
      propertyId,
      conversionEvent,
      startDate,
      endDate
    );
    return Response.json(report);
  } catch (err: any) {
    if (err.message === "scope_missing") {
      return Response.json({ error: "scope_missing" }, { status: 403 });
    }
    return Response.json(
      { error: "Failed to fetch GA4 report", detail: err.message },
      { status: 503 }
    );
  }
}
```

- [ ] **Step 3: Commit**

```bash
git add dashboard/src/app/api/ga4/properties/route.ts dashboard/src/app/api/ga4/report/route.ts
git commit -m "feat(dashboard): add GA4 properties listing and report API routes"
```

---

### Task 12: Create GA4 Setup Component

**Files:**
- Create: `dashboard/src/components/GA4Setup.tsx`

- [ ] **Step 1: Create the component**

Create `dashboard/src/components/GA4Setup.tsx`:

```tsx
"use client";

import { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import { GA4Config, saveGA4Config } from "@/lib/storage";

interface GA4Property {
  name: string;
  displayName: string;
}

interface GA4SetupProps {
  userId: string;
  onComplete: (config: GA4Config) => void;
}

export default function GA4Setup({ userId, onComplete }: GA4SetupProps) {
  const [properties, setProperties] = useState<GA4Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [scopeMissing, setScopeMissing] = useState(false);

  const [selectedProperty, setSelectedProperty] = useState("");
  const [conversionEvent, setConversionEvent] = useState("sign_up");
  const [siteUrl, setSiteUrl] = useState("");
  const [signupValue, setSignupValue] = useState(50);

  useEffect(() => {
    fetch("/api/ga4/properties")
      .then(async (res) => {
        if (res.status === 403) {
          const body = await res.json();
          if (body.error === "scope_missing") {
            setScopeMissing(true);
            return;
          }
        }
        if (!res.ok) throw new Error("Failed to load properties");
        const data = await res.json();
        setProperties(data.properties || []);
        if (data.properties?.length > 0) {
          setSelectedProperty(data.properties[0].name);
        }
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedProperty || !siteUrl) return;

    const config: GA4Config = {
      schemaVersion: 1,
      ga4PropertyId: selectedProperty,
      conversionEvent: conversionEvent || "sign_up",
      siteUrl: siteUrl.replace(/\/+$/, ""),
      signupValue: signupValue || 0,
    };

    saveGA4Config(userId, config);
    onComplete(config);
  }

  if (scopeMissing) {
    return (
      <div className="rounded-xl border border-amber-200 bg-amber-50 p-8 text-center max-w-lg mx-auto">
        <h2 className="text-lg font-semibold text-gray-900 mb-2">Connect Google Analytics</h2>
        <p className="text-sm text-gray-600 mb-4">
          To see which keywords drive signups, we need access to your Google Analytics data. 
          Click below to grant permission.
        </p>
        <button
          onClick={() => signIn("google")}
          className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
        >
          Grant Analytics Access
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="h-6 w-6 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center max-w-lg mx-auto">
        <p className="text-sm text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto">
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm p-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-1">Connect Google Analytics</h2>
        <p className="text-sm text-gray-500 mb-6">
          Link your GA4 property to see which YouTube keywords drive signups.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">GA4 Property</label>
            {properties.length === 0 ? (
              <p className="text-sm text-gray-500">No GA4 properties found in your Google account.</p>
            ) : (
              <select
                value={selectedProperty}
                onChange={(e) => setSelectedProperty(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
              >
                {properties.map((p) => (
                  <option key={p.name} value={p.name}>
                    {p.displayName}
                  </option>
                ))}
              </select>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Conversion Event Name</label>
            <input
              type="text"
              value={conversionEvent}
              onChange={(e) => setConversionEvent(e.target.value)}
              placeholder="sign_up"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
            />
            <p className="text-xs text-gray-400 mt-1">The GA4 event that represents a signup (e.g. sign_up, generate_lead)</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Your Website URL</label>
            <input
              type="url"
              value={siteUrl}
              onChange={(e) => setSiteUrl(e.target.value)}
              placeholder="https://myapp.com"
              required
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
            />
            <p className="text-xs text-gray-400 mt-1">Used to generate UTM tracking links for your video descriptions</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">What's one signup worth? ($)</label>
            <input
              type="number"
              value={signupValue}
              onChange={(e) => setSignupValue(Number(e.target.value))}
              min={0}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
            />
            <p className="text-xs text-gray-400 mt-1">Used to calculate YouTube ROI (e.g. average LTV or first purchase value)</p>
          </div>

          <button
            type="submit"
            disabled={!selectedProperty || !siteUrl}
            className="w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Save & Continue
          </button>
        </form>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add dashboard/src/components/GA4Setup.tsx
git commit -m "feat(dashboard): add GA4 setup component with property picker and config form"
```

---

## Chunk 4: Keyword Suggestions + Keywords Page Assembly

### Task 13: Create Keyword Suggestions Component

**Files:**
- Create: `dashboard/src/components/KeywordSuggestions.tsx`

- [ ] **Step 1: Create the component**

Create `dashboard/src/components/KeywordSuggestions.tsx`:

```tsx
"use client";

interface KeywordSuggestionsProps {
  searchTerms: { term: string; views: number }[];
  trackedKeywords: string[];
  onAdd: (keyword: string) => void;
}

export default function KeywordSuggestions({ searchTerms, trackedKeywords, onAdd }: KeywordSuggestionsProps) {
  const trackedSet = new Set(trackedKeywords.map((k) => k.toLowerCase()));
  const suggestions = searchTerms
    .filter((t) => !trackedSet.has(t.term.toLowerCase()))
    .slice(0, 10);

  if (suggestions.length === 0) return null;

  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-100">
        <h2 className="text-sm font-semibold text-gray-900">Suggested Keywords</h2>
        <p className="text-xs text-gray-500 mt-0.5">
          People found your channel by searching these terms. Track them?
        </p>
      </div>
      <div className="divide-y divide-gray-100">
        {suggestions.map((s) => (
          <div key={s.term} className="flex items-center justify-between px-5 py-3 hover:bg-gray-50/50">
            <div>
              <span className="text-sm text-gray-900">{s.term}</span>
              <span className="ml-2 text-xs text-gray-400">{s.views.toLocaleString()} views</span>
            </div>
            <button
              onClick={() => onAdd(s.term)}
              className="text-xs font-medium text-blue-600 hover:text-blue-700 px-3 py-1 rounded-md hover:bg-blue-50 transition-colors"
            >
              + Track
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add dashboard/src/components/KeywordSuggestions.tsx
git commit -m "feat(dashboard): add keyword suggestions component from YouTube search terms"
```

---

### Task 14: Create Keywords Page (Full Assembly)

**Files:**
- Create: `dashboard/src/app/dashboard/keywords/page.tsx`

- [ ] **Step 1: Create the keywords page**

Create `dashboard/src/app/dashboard/keywords/page.tsx`:

```tsx
"use client";

import { useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import KeywordTable, { KeywordRow } from "@/components/KeywordTable";
import KeywordSuggestions from "@/components/KeywordSuggestions";
import ROIScorecard from "@/components/ROIScorecard";
import GA4Setup from "@/components/GA4Setup";
import {
  loadKeywords,
  saveKeywords,
  loadGA4Config,
  GA4Config,
  RankEntry,
  slugifyKeyword,
  generateUTMLink,
} from "@/lib/storage";

interface RankResult {
  keyword: string;
  rank: number | null;
  videoId: string | null;
  videoTitle: string | null;
}

interface GA4ChannelTotals {
  totalSessions: number;
  totalKeyEvents: number;
  byCampaign: Record<string, { sessions: number; keyEvents: number }>;
}

export default function KeywordsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [newKeyword, setNewKeyword] = useState("");
  const [checking, setChecking] = useState(false);
  const [checkProgress, setCheckProgress] = useState<{ current: number; total: number } | null>(null);
  const [searchTerms, setSearchTerms] = useState<{ term: string; views: number }[]>([]);
  const [ga4Config, setGA4Config] = useState<GA4Config | null>(null);
  const [ga4Data, setGA4Data] = useState<GA4ChannelTotals | null>(null);
  const [showGA4Setup, setShowGA4Setup] = useState(false);

  // Keywords state from localStorage
  const [keywords, setKeywords] = useState<string[]>([]);
  const [history, setHistory] = useState<Record<string, RankEntry[]>>({});

  const userId = (session as any)?.userId || session?.user?.email || "";

  // Load keywords from localStorage on mount
  useEffect(() => {
    if (!userId) return;
    const data = loadKeywords(userId);
    setKeywords(data.keywords);
    setHistory(data.history);

    const config = loadGA4Config(userId);
    setGA4Config(config);
    if (!config) setShowGA4Setup(true);
  }, [userId]);

  // Fetch search terms for suggestions
  useEffect(() => {
    if (status !== "authenticated") return;
    fetch("/api/analytics?range=28d")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.searchTerms) setSearchTerms(data.searchTerms);
      })
      .catch(() => {});
  }, [status]);

  // Fetch GA4 data when config is available
  const fetchGA4Data = useCallback(() => {
    if (!ga4Config) return;
    const params = new URLSearchParams({
      propertyId: ga4Config.ga4PropertyId,
      conversionEvent: ga4Config.conversionEvent,
      range: "28d",
    });
    fetch(`/api/ga4/report?${params}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) setGA4Data(data);
      })
      .catch(() => {});
  }, [ga4Config]);

  useEffect(() => {
    fetchGA4Data();
  }, [fetchGA4Data]);

  // Redirect if not authenticated
  useEffect(() => {
    if (status === "unauthenticated") router.push("/");
  }, [status, router]);

  function addKeyword(kw: string) {
    const trimmed = kw.trim().toLowerCase();
    if (!trimmed || keywords.includes(trimmed) || keywords.length >= 50) return;

    const updated = [...keywords, trimmed];
    setKeywords(updated);
    saveKeywords(userId, { schemaVersion: 1, keywords: updated, history });
    setNewKeyword("");
  }

  function deleteKeyword(kw: string) {
    const updated = keywords.filter((k) => k !== kw);
    const updatedHistory = { ...history };
    delete updatedHistory[kw];
    setKeywords(updated);
    setHistory(updatedHistory);
    saveKeywords(userId, { schemaVersion: 1, keywords: updated, history: updatedHistory });
  }

  async function checkAllRanks() {
    if (checking || keywords.length === 0) return;
    setChecking(true);
    setCheckProgress({ current: 0, total: keywords.length });

    try {
      const res = await fetch("/api/keywords/check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ keywords }),
      });

      if (!res.ok) {
        setChecking(false);
        setCheckProgress(null);
        return;
      }

      const reader = res.body?.getReader();
      if (!reader) return;

      const decoder = new TextDecoder();
      let buffer = "";
      const newHistory = { ...history };

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          const match = line.match(/^data: (.+)$/);
          if (!match) continue;
          const payload = match[1].trim();
          if (payload === "[DONE]") continue;

          try {
            const result: RankResult & { index: number; total: number } = JSON.parse(payload);
            setCheckProgress({ current: result.index + 1, total: result.total });

            // Update history
            const entry: RankEntry = {
              rank: result.rank,
              videoId: result.videoId,
              videoTitle: result.videoTitle,
              checkedAt: new Date().toISOString(),
            };

            if (!newHistory[result.keyword]) {
              newHistory[result.keyword] = [];
            }
            newHistory[result.keyword] = [entry, ...newHistory[result.keyword]];
            setHistory({ ...newHistory });
          } catch {
            // Skip malformed SSE data
          }
        }
      }

      // Save to localStorage
      saveKeywords(userId, { schemaVersion: 1, keywords, history: newHistory });
    } finally {
      setChecking(false);
      setCheckProgress(null);
    }
  }

  // Build table rows
  function buildRows(): KeywordRow[] {
    return keywords.map((kw) => {
      const entries = history[kw] || [];
      const latest = entries[0] || null;
      const previous = entries[1] || null;

      let change: number | null = null;
      if (latest && previous && latest.rank !== null && previous.rank !== null) {
        change = previous.rank - latest.rank; // positive = improved
      } else if (latest && !previous) {
        change = null; // first check = "NEW"
      } else if (latest && latest.rank !== null && previous && previous.rank === null) {
        change = null; // was not ranked, now ranked = "NEW"
      }

      // Match search terms to get YT views
      const matchedTerm = searchTerms.find(
        (t) => t.term.toLowerCase() === kw.toLowerCase()
      );

      // Match GA4 data by campaign slug
      const slug = slugifyKeyword(kw);
      const ga4Campaign = ga4Data?.byCampaign?.[slug];

      // UTM link
      const utmLink =
        latest?.videoId && ga4Config?.siteUrl
          ? generateUTMLink(ga4Config.siteUrl, kw, latest.videoId)
          : null;

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
      };
    });
  }

  // Calculate scorecard totals
  const rows = buildRows();
  const totalYTViews = rows.reduce((sum, r) => sum + (r.ytViews || 0), 0);
  const sessionsFromYouTube = ga4Data?.totalSessions || 0;
  const signupsFromYouTube = ga4Data?.totalKeyEvents || 0;

  if (status === "loading") {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="h-8 w-8 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin" />
      </div>
    );
  }

  // Show GA4 setup if not configured
  if (showGA4Setup && !ga4Config) {
    return (
      <div className="px-8 py-12">
        <GA4Setup
          userId={userId}
          onComplete={(config) => {
            setGA4Config(config);
            setShowGA4Setup(false);
          }}
        />
      </div>
    );
  }

  return (
    <>
      {/* Header */}
      <div className="px-8 py-5 border-b border-gray-200 bg-white flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Keyword Rankings</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {keywords.length} keyword{keywords.length !== 1 ? "s" : ""} tracked
            {history[keywords[0]]?.[0]?.checkedAt && (
              <span className="ml-1">
                &middot; Last checked {new Date(history[keywords[0]]?.[0]?.checkedAt).toLocaleDateString()}
              </span>
            )}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {ga4Config && (
            <button
              onClick={() => setShowGA4Setup(true)}
              className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
            >
              GA4 Settings
            </button>
          )}
          <button
            onClick={checkAllRanks}
            disabled={checking || keywords.length === 0}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {checking ? "Checking..." : "Check All Rankings"}
          </button>
        </div>
      </div>

      <div className="px-8 py-6 space-y-6">
        {/* ROI Scorecard */}
        {ga4Config && (
          <ROIScorecard
            totalYTViews={totalYTViews}
            sessionsFromYouTube={sessionsFromYouTube}
            signupsFromYouTube={signupsFromYouTube}
            signupValue={ga4Config.signupValue}
          />
        )}

        {/* Add keyword input */}
        <div className="flex gap-3">
          <input
            type="text"
            value={newKeyword}
            onChange={(e) => setNewKeyword(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addKeyword(newKeyword);
              }
            }}
            placeholder="Add a keyword (e.g. best crm for agencies)"
            className="flex-1 rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
            disabled={keywords.length >= 50}
          />
          <button
            onClick={() => addKeyword(newKeyword)}
            disabled={!newKeyword.trim() || keywords.length >= 50}
            className="rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Add
          </button>
        </div>
        {keywords.length >= 50 && (
          <p className="text-xs text-amber-600">Maximum 50 keywords reached (API quota limit)</p>
        )}

        {/* Empty state */}
        {keywords.length === 0 && (
          <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50/50 py-16 text-center">
            <svg className="mx-auto h-10 w-10 text-gray-400 mb-3" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
            </svg>
            <p className="text-sm font-medium text-gray-900">Add keywords you want to rank for</p>
            <p className="text-xs text-gray-500 mt-1">
              We'll check where your videos appear in YouTube search results
            </p>
          </div>
        )}

        {/* Keyword Table */}
        <KeywordTable
          rows={rows}
          onDelete={deleteKeyword}
          checking={checking}
          checkProgress={checkProgress}
        />

        {/* Keyword Suggestions */}
        <KeywordSuggestions
          searchTerms={searchTerms}
          trackedKeywords={keywords}
          onAdd={addKeyword}
        />
      </div>
    </>
  );
}
```

- [ ] **Step 2: Test the complete Keywords page locally**

Run: `cd dashboard && npx next dev`
Visit `http://localhost:3000/dashboard/keywords`. Verify:
- GA4 setup form appears on first visit
- After GA4 setup, keyword input + empty state shows
- Can add a keyword and see it in state
- "Check All Rankings" button triggers SSE stream
- Results appear row by row in the table
- UTM copy button works
- Keyword suggestions appear below the table
- ROI scorecard shows at top (with GA4 data)
- Sidebar "Keywords" nav item is active
- Clicking "Analytics" goes back to analytics page
- Delete keyword works

- [ ] **Step 3: Commit**

```bash
git add dashboard/src/app/dashboard/keywords/page.tsx
git commit -m "feat(dashboard): add Keywords page with rank tracker, GA4 funnel, and suggestions"
```

---

## Chunk 5: Final Polish and Testing

### Task 15: Update Middleware and Test Full Flow

**Files:**
- Verify: `dashboard/src/middleware.ts` (should already protect `/dashboard/keywords` via `/dashboard/:path*` matcher)

- [ ] **Step 1: Verify middleware covers keywords route**

Read `dashboard/src/middleware.ts` and confirm the matcher `"/dashboard/:path*"` covers `/dashboard/keywords`. It should — the `:path*` wildcard matches any subpath. No change needed.

- [ ] **Step 2: Full end-to-end test**

Run: `cd dashboard && npx next dev`

Test this flow:
1. Visit `http://localhost:3000` — see landing page
2. Sign in with Google — redirected to `/dashboard`
3. Verify analytics page shows 8 KPI cards (including Impressions + CTR)
4. Click "Keywords" in sidebar — navigated to `/dashboard/keywords`
5. Complete GA4 setup (select property, enter event name, site URL, signup value)
6. Add 3 keywords
7. Click "Check All Rankings" — watch results stream in
8. Verify UTM copy button copies correct URL format
9. Verify keyword suggestions appear from search terms
10. Verify ROI scorecard shows GA4 data
11. Delete a keyword — verify it's removed
12. Navigate back to Analytics — verify it still works
13. Refresh the keywords page — verify keywords persist from localStorage

- [ ] **Step 3: Final commit**

```bash
git add -A
git commit -m "feat(dashboard): complete YouTube Keyword Intelligence v1

Adds keyword rank tracking with GA4 funnel attribution:
- Keyword rank tracker (YouTube search.list, SSE streaming)
- GA4 integration (property setup, session/signup reporting)
- UTM link generator (per-keyword, one-click copy)
- ROI scorecard (views > sessions > signups > revenue)
- Keyword suggestions (from YouTube search terms data)
- Impressions + CTR KPI cards on analytics page
- Shared dashboard layout with sidebar navigation"
```
