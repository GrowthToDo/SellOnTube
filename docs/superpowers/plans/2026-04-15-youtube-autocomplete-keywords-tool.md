# YouTube Autocomplete Keywords Tool Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a free YouTube Autocomplete Keyword Explorer at `/tools/youtube-autocomplete-keywords` that scrapes YouTube's suggest API, categorizes keywords by intent, and captures leads via email-gated CSV download.

**Architecture:** Astro page (frontend) + Netlify Functions (backend). Two-tier scrape: Quick (A-Z, instant) and Exhaustive (email-gated, A-Z + 0-9 + modifiers). Intent categorization via regex on the frontend. Lead capture via Google Apps Script webhook. No database, no auth.

**Tech Stack:** Astro 5, Tailwind CSS, Netlify Functions (TypeScript), YouTube Suggest API (free, no key)

---

## File Structure

```
# Modified files
src/pages/tools/index.astro                    — Add tool card to listing
src/navigation.ts                              — Add to footer linkGroup
netlify/functions/lib/youtube-suggest.ts        — Add geography + exhaustive mode support
netlify/functions/youtube-suggest.ts            — Add geography param, exhaustive mode

# New files
src/pages/tools/youtube-autocomplete-keywords.astro  — Full tool page (frontend + client JS)
```

---

## Intent Categories

SellonTube uses a richer intent model than generic SEO tools. The tool will categorize keywords into 6 intent buckets aligned with SellonTube's content strategy:

| Category | Color | Regex Pattern | Rationale |
|----------|-------|---------------|-----------|
| **How-To / Tutorial** | Blue | `/how to\|tutorial\|guide\|step by\|diy\|tips for\|ways to\|learn\|for beginners/i` | Informational intent. Top-of-funnel educational content. |
| **Buyer / Commercial** | Green | `/buy\|price\|cost\|shop\|order\|near me\|amazon\|cheap\|deal\|discount\|best\|top \d+\|worth it\|affordable\|premium\|free\|download\|subscription\|plan\|pricing/i` | Commercial/transactional intent. Bottom-of-funnel. Highest value for B2B. |
| **Comparison / Review** | Amber | `/review\| vs \|versus\|comparison\|compared\|unboxing\|alternative\|or \|difference between\|which is better/i` | Evaluation-stage intent. Buyers narrowing options. |
| **Question / Research** | Purple | `/^(what\|how\|why\|where\|who\|when\|which\|can\|does\|is\|should\|will)\b/i` | Informational questions. Mid-funnel research. Catches queries not matched by How-To. |
| **Trending / Cultural** | Rose | `/2024\|2025\|2026\|trending\|viral\|new\|latest\|update\|just released\|reaction\|challenge/i` | Time-sensitive content. Good for views, low for evergreen acquisition. |
| **Other** | Gray | (default) | Unclassified. Navigational or ambiguous intent. |

**Priority order:** Patterns are tested top-to-bottom. First match wins. "How-To" is checked before "Question" so "how to buy..." lands in How-To, not Question. "Buyer" is checked before "Comparison" so "best vs" lands in Buyer.

**Actual check order:** Buyer > Comparison > How-To > Trending > Question > Other

This ensures high-value commercial keywords are never misclassified into lower-value buckets.

---

## Geography Support

The YouTube suggest endpoint accepts `gl` (country) and `hl` (language) parameters. Map dropdown values to ISO codes:

| Dropdown Label | gl | hl |
|---|---|---|
| Global | (omit) | en |
| United States | us | en |
| United Kingdom | gb | en |
| India | in | en |
| Australia | au | en |
| Canada | ca | en |
| Germany | de | de |
| France | fr | fr |
| Brazil | br | pt |
| Japan | jp | ja |
| South Korea | kr | ko |
| Indonesia | id | id |
| Philippines | ph | en |
| Thailand | th | th |
| Singapore | sg | en |
| Malaysia | my | en |
| UAE | ae | en |
| South Africa | za | en |
| Mexico | mx | es |
| Nigeria | ng | en |

---

## Chunk 1: Backend Modifications

### Task 1: Update youtube-suggest lib to support geography and exhaustive mode

**Files:**
- Modify: `netlify/functions/lib/youtube-suggest.ts`

The existing lib has `getSuggestions(query)` and `getExpandedSuggestions(query)`. We need to:
1. Add `gl` and `hl` parameters to `getSuggestions`
2. Add exhaustive mode to `getExpandedSuggestions` (A-Z + 0-9 + modifiers)
3. Add 300ms self-throttle delay between batches

- [ ] **Step 1: Update `getSuggestions` to accept geography options**

```typescript
interface SuggestOptions {
  gl?: string;  // country code
  hl?: string;  // language code
}

export async function getSuggestions(query: string, opts: SuggestOptions = {}): Promise<string[]> {
  if (!query.trim()) return [];

  const params = new URLSearchParams({
    client: 'youtube',
    ds: 'yt',
    q: query.trim(),
    hl: opts.hl || 'en',
  });
  if (opts.gl) params.set('gl', opts.gl);

  const url = `${SUGGEST_URL}?${params.toString()}`;
  // ... rest stays the same
}
```

- [ ] **Step 2: Update `getExpandedSuggestions` with exhaustive mode and throttle**

```typescript
interface ExpandOptions extends SuggestOptions {
  exhaustive?: boolean;
}

export async function getExpandedSuggestions(query: string, opts: ExpandOptions = {}): Promise<string[]> {
  const seed = query.trim().toLowerCase();
  if (!seed) return [];

  const alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('');
  const digits = '0123456789'.split('');
  const modifiers = ['how to', 'best', 'vs', 'review', 'tutorial', 'for beginners', 'price', 'free', 'top', 'why'];

  let queries = [seed, ...alphabet.map(l => `${seed} ${l}`)];

  if (opts.exhaustive) {
    queries.push(
      ...digits.map(d => `${seed} ${d}`),
      ...modifiers.map(m => `${m} ${seed}`),
      ...modifiers.map(m => `${seed} ${m}`)
    );
  }

  const allSuggestions: string[] = [];
  const batchSize = 5;

  for (let i = 0; i < queries.length; i += batchSize) {
    const batch = queries.slice(i, i + batchSize);
    const results = await Promise.all(batch.map(q => getSuggestions(q, opts)));
    for (const suggestions of results) {
      allSuggestions.push(...suggestions);
    }
    // 300ms throttle between batches
    if (i + batchSize < queries.length) {
      await new Promise(r => setTimeout(r, 300));
    }
  }

  // Deduplicate and sort
  const seen = new Set<string>();
  const unique: string[] = [];
  for (const s of allSuggestions) {
    const normalized = s.toLowerCase().trim();
    if (normalized && !seen.has(normalized)) {
      seen.add(normalized);
      unique.push(normalized);
    }
  }
  unique.sort();
  return unique;
}
```

- [ ] **Step 3: Commit backend lib changes**

```bash
git add netlify/functions/lib/youtube-suggest.ts
git commit -m "feat(backend): add geography and exhaustive mode to youtube-suggest lib"
```

---

### Task 2: Update the Netlify Function endpoint

**Files:**
- Modify: `netlify/functions/youtube-suggest.ts`

- [ ] **Step 1: Add geography and exhaustive params**

Add `gl`, `hl`, and `exhaustive` query params. Pass them through to the lib functions.

```typescript
const gl = url.searchParams.get('gl') || undefined;
const hl = url.searchParams.get('hl') || 'en';
const expand = url.searchParams.get('expand') === 'true';
const exhaustive = url.searchParams.get('exhaustive') === 'true';

const opts = { gl, hl };

const suggestions = expand
  ? await getExpandedSuggestions(query, { ...opts, exhaustive })
  : await getSuggestions(query, opts);
```

- [ ] **Step 2: Update CORS to allow localhost for dev**

The current CORS is locked to `https://sellontube.com`. Add `http://localhost:4321` for local Astro dev:

```typescript
const origin = request.headers.get('Origin') || '';
const allowedOrigins = ['https://sellontube.com', 'http://localhost:4321'];
const corsOrigin = allowedOrigins.includes(origin) ? origin : 'https://sellontube.com';

const headers = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': corsOrigin,
  // ...
};
```

- [ ] **Step 3: Commit endpoint changes**

```bash
git add netlify/functions/youtube-suggest.ts
git commit -m "feat(backend): add geography, exhaustive mode, and dev CORS to youtube-suggest endpoint"
```

---

## Chunk 2: Frontend - Astro Tool Page

### Task 3: Create the tool page

**Files:**
- Create: `src/pages/tools/youtube-autocomplete-keywords.astro`

This is the largest task. The page contains:
1. Schema markup (BreadcrumbList, WebApplication, FAQPage)
2. Hero section with H1 and feature badges
3. Input form (seed keyword + geography dropdown + CTA)
4. Loading state with progress indicator
5. Quick results: collapsible intent-group accordion sections
6. Email gate section for exhaustive results
7. Exhaustive results + CSV download
8. How It Works section
9. FAQ section
10. CallToAction component (existing)

**Design system:** Match existing tool pages exactly:
- Use `Layout` from `~/layouts/PageLayout.astro`
- Use `CallToAction` from `~/components/widgets/CallToAction.astro`
- Dark mode classes: `dark:bg-slate-950`, `dark:bg-slate-900`, `dark:border-slate-700`, `dark:text-white`, `dark:text-slate-400`
- Accent color: `emerald-500` (consistent with other tools)
- Card pattern: `rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 p-6 sm:p-8`
- Button pattern: `rounded-xl px-6 py-3.5 text-base font-bold bg-emerald-500 text-white dark:text-slate-950 hover:bg-emerald-400`
- Input pattern: `rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500`

- [ ] **Step 1: Create the Astro page with frontmatter, schemas, and hero**

Schema targets:
- BreadcrumbList: Home > Tools > YouTube Autocomplete Keywords
- WebApplication: name "SellonTube YouTube Autocomplete Keyword Tool", applicationCategory "BusinessApplication"
- FAQPage: 6-8 questions about autocomplete keyword research

H1: `YouTube Autocomplete Keyword Tool`
Title tag: `Free YouTube Autocomplete Keyword Tool - Find Long-Tail YouTube Keywords | SellonTube`
Meta description: `Scrape YouTube autocomplete suggestions for any keyword. Get long-tail keywords categorized by search intent. Free, no signup required for quick results.`

Feature badges: `Long-tail keywords`, `Intent categorized`, `CSV export`

- [ ] **Step 2: Build the input form section**

```html
<!-- Input form card -->
<div id="step-input" class="rounded-2xl border ...">
  <!-- Seed keyword input -->
  <!-- Geography dropdown (20 options from plan) -->
  <!-- Generate Keywords CTA button -->
</div>
```

Geography dropdown should use the mapping table from the plan above.

- [ ] **Step 3: Build the loading state**

Show an animated progress bar that fills as batches complete. The endpoint should not stream, so use a fake progress that advances in steps:
- 0-80%: animated over ~4 seconds
- 80-95%: slow crawl
- 95-100%: on response received

```html
<div id="step-loading" class="hidden ...">
  <div class="w-10 h-10 border-[3px] border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
  <p>Scraping YouTube autocomplete suggestions...</p>
  <div class="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
    <div id="progress-bar" class="h-full bg-emerald-500 rounded-full transition-all duration-500" style="width: 0%"></div>
  </div>
  <p id="progress-text" class="text-xs">Querying A-Z variations...</p>
</div>
```

- [ ] **Step 4: Build the quick results section with intent-grouped accordions**

Results layout:
```
┌─────────────────────────────────────────┐
│ Results for "seed keyword" · 67 keywords│
│ Geography: India                        │
├─────────────────────────────────────────┤
│ [Copy All 67] [Export Quick CSV]        │
├─────────────────────────────────────────┤
│ ▼ Buyer / Commercial (12)    [Copy All] │
│   keyword one                    [Copy] │
│   keyword two                    [Copy] │
│   ...                                   │
│ ▶ How-To / Tutorial (18)     [Copy All] │
│ ▶ Comparison / Review (8)    [Copy All] │
│ ▶ Question / Research (15)   [Copy All] │
│ ▶ Trending / Cultural (4)    [Copy All] │
│ ▶ Other (10)                 [Copy All] │
├─────────────────────────────────────────┤
│ 🔒 Get 100+ Keywords (Full Scrape)     │
│ You've seen the quick list.             │
│ Enter email for the full CSV.           │
│ [email input] [Send me the full list]   │
└─────────────────────────────────────────┘
```

Each accordion section:
- Colored left border matching intent category color
- Keyword count badge
- "Copy All" button per section
- Individual "Copy" button per keyword (clipboard icon)
- Expanded by default for the first section (Buyer/Commercial — highest value)

- [ ] **Step 5: Build the email gate section**

The email gate appears below quick results (not replacing them). It's a card with:
- Lock icon (SVG, emerald color)
- Value prop copy: "You've seen the quick list. The exhaustive scrape (100+ keywords, A-Z + numbers + modifiers, CSV-ready) is one step away."
- Email input field
- "Send me the full list" CTA button
- Fine print: "No spam. We only send YouTube acquisition resources."

On submit:
1. Validate email (basic regex)
2. POST to Google Apps Script webhook (fire-and-forget, don't block on failure)
3. Call `/api/youtube-suggest?q=SEED&expand=true&exhaustive=true&gl=XX&hl=XX`
4. Show loading state
5. On response: generate CSV in-browser, trigger download, show exhaustive results below the gate

- [ ] **Step 6: Build the client-side JavaScript**

All JS is inline in a `<script>` tag at the bottom (matching existing tool pattern). Key functions:

```javascript
// Intent categorization
function categorizeIntent(keyword) {
  const k = keyword.toLowerCase();
  // Buyer first (highest value)
  if (/buy|price|cost|shop|order|near me|amazon|cheap|deal|discount|best|top \d+|worth it|affordable|premium|free|download|subscription|plan|pricing/.test(k)) return 'buyer';
  // Comparison second
  if (/review| vs |versus|comparison|compared|unboxing|alternative| or |difference between|which is better/.test(k)) return 'comparison';
  // How-To third
  if (/how to|tutorial|guide|step by|diy|tips for|ways to|learn|for beginners/.test(k)) return 'howto';
  // Trending fourth
  if (/2024|2025|2026|trending|viral|new |latest|update|just released|reaction|challenge/.test(k)) return 'trending';
  // Question fifth
  if (/^(what|how|why|where|who|when|which|can|does|is|should|will)\b/.test(k)) return 'question';
  return 'other';
}

// Group keywords by intent
function groupByIntent(keywords) { ... }

// Render accordion sections
function renderResults(groups, containerId) { ... }

// CSV generation
function generateCSV(keywords, seed, geography) {
  const header = 'keyword,intent_category,seed_keyword,geography,character_length,timestamp\n';
  const rows = keywords.map(k => {
    const intent = categorizeIntent(k);
    return `"${k}","${intent}","${seed}","${geography}",${k.length},"${new Date().toISOString()}"`;
  }).join('\n');
  return header + rows;
}

// Download CSV
function downloadCSV(csvContent, filename) {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
}

// Copy to clipboard
function copyToClipboard(text) {
  navigator.clipboard.writeText(text);
}

// POST to Google Sheet webhook (fire-and-forget)
async function trackLead(email, seed, geography, keywordCount) {
  const webhookUrl = '%%GOOGLE_SHEET_WEBHOOK_URL%%'; // replaced at build or hardcoded
  try {
    await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email, seed_keyword: seed, geography, keyword_count: keywordCount,
        timestamp: new Date().toISOString()
      })
    });
  } catch (e) { /* silent — don't block user */ }
}
```

- [ ] **Step 7: Build the "How It Works" section**

3-step explanation below the tool:

1. **Enter your seed keyword** — Type a topic, product, or niche. Pick your target geography.
2. **We scrape YouTube's autocomplete** — The tool queries YouTube's suggestion API with A-Z variations of your seed keyword, collecting every phrase YouTube thinks users want to search next.
3. **Keywords sorted by intent** — Every keyword is categorized: buyer intent, how-to, comparison, question, or trending. Export as CSV for your content calendar.

Use the existing tool page card pattern. No icons — just numbered steps.

- [ ] **Step 8: Build the FAQ section**

6 questions, rendered on-page with FAQPage schema:

1. "Is this YouTube autocomplete keyword tool free?" → Yes. Quick results (A-Z scrape) are instant, no signup. The exhaustive scrape (100+ keywords) requires an email for CSV download.
2. "How is this different from other YouTube keyword tools?" → Most YouTube keyword tools show search volume estimates from panel data. This tool shows you exactly what YouTube suggests when users type, which is a direct signal of real search demand. No estimated volumes, no proxy data.
3. "Why use YouTube autocomplete for keyword research?" → YouTube autocomplete reflects what millions of users actually search for. These suggestions are driven by real query frequency, recency, and user behavior. Long-tail autocomplete phrases reveal specific user intent that volume-based tools miss entirely.
4. "What do the intent categories mean?" → Buyer/Commercial: keywords with purchase signals. How-To/Tutorial: educational queries. Comparison/Review: evaluation-stage queries. Question/Research: informational queries. Trending: time-sensitive topics. Other: navigational or ambiguous.
5. "Can I use this for YouTube SEO?" → Yes. Autocomplete keywords are the foundation of YouTube SEO. Use the buyer-intent and comparison keywords as video titles and tags. These are the exact phrases YouTube associates with your topic.
6. "How many keywords does the exhaustive scrape return?" → Typically 100-200+, depending on how popular your topic is. The exhaustive mode adds 0-9 digit variations and common modifiers (how to, best, vs, review, tutorial, for beginners, price, free, top, why) to your seed keyword.

- [ ] **Step 9: Add error states**

- Rate limited: "YouTube is rate-limiting requests right now. Try again in 60 seconds." (show on 503/empty response)
- Empty results: "No autocomplete suggestions found for this keyword. Try a broader term or different geography."
- Email validation: inline error below input field
- Network error: "Something went wrong. Check your connection and try again."

- [ ] **Step 10: Commit the tool page**

```bash
git add src/pages/tools/youtube-autocomplete-keywords.astro
git commit -m "feat: add YouTube Autocomplete Keywords tool page"
```

---

## Chunk 3: Integration & Polish

### Task 4: Add tool to index and navigation

**Files:**
- Modify: `src/pages/tools/index.astro`
- Modify: `src/navigation.ts`

- [ ] **Step 1: Add to tools array in index.astro**

Insert after the ROI Calculator entry (last position = newest tool, or position it in workflow order — after Video Ideas Generator since keyword research feeds into idea generation):

```javascript
{
  name: 'YouTube Autocomplete Keywords',
  slug: '/tools/youtube-autocomplete-keywords',
  tagline: 'What are people actually searching for on YouTube?',
  description:
    'Enter a seed keyword and scrape YouTube autocomplete suggestions across A-Z variations. Keywords are categorized by search intent: buyer, how-to, comparison, question, and trending. Export as CSV.',
  badge: 'Keywords',
  badgeColor: 'emerald',
},
```

Position: After "YouTube SEO Tool" (first position = highest value tool, keyword research is step 1 in the workflow).

Actually — place it second, after YouTube SEO Tool. The workflow is: Research keywords → Generate ideas → Create titles → Write scripts → Check SEO. This tool is step 1.

- [ ] **Step 2: Add to footer navigation in `src/navigation.ts`**

Add to the `Free Tools` linkGroup:

```javascript
{ text: 'Autocomplete Keywords', href: getPermalink('/tools/youtube-autocomplete-keywords') },
```

Place it after 'YouTube SEO Tool' in the list.

- [ ] **Step 3: Commit integration changes**

```bash
git add src/pages/tools/index.astro src/navigation.ts
git commit -m "feat: add autocomplete keywords tool to index and footer navigation"
```

---

### Task 5: Submit URLs to Bing Webmaster API

**Files:** None (curl commands only)

Per CLAUDE.md rule: every new tool page must be submitted to Bing.

- [ ] **Step 1: Submit tool page and updated tools index to Bing**

```bash
# Get Bing API key from .mcp.json or env
curl -X POST "https://ssl.bing.com/webmaster/api.ashx/json/SubmitUrlbatch?apikey=$BING_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"siteUrl":"https://sellontube.com","urlList":["https://sellontube.com/tools/youtube-autocomplete-keywords","https://sellontube.com/tools"]}'
```

- [ ] **Step 2: Remind user to submit in Google Search Console**

Remind: Submit both URLs via GSC URL Inspection → Request Indexing:
1. `https://sellontube.com/tools/youtube-autocomplete-keywords`
2. `https://sellontube.com/tools`

---

### Task 6: Google Apps Script webhook code

**Files:** None (documentation only, provide to user)

- [ ] **Step 1: Provide Google Apps Script code**

```javascript
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    sheet.appendRow([
      data.timestamp || new Date().toISOString(),
      data.email || '',
      data.seed_keyword || '',
      data.geography || '',
      data.keyword_count || 0
    ]);
    return ContentService.createTextOutput(JSON.stringify({ status: 'ok' }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ status: 'error', message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
```

Setup instructions:
1. Create a Google Sheet with headers: timestamp, email, seed_keyword, geography, keyword_count
2. Extensions → Apps Script → paste the code
3. Deploy → New deployment → Web app → Execute as "Me", Access "Anyone"
4. Copy the deployment URL → set as env var or hardcode in the tool page

- [ ] **Step 2: Decide on webhook URL handling**

Two options:
- **Option A:** Hardcode the webhook URL in the Astro page (simplest, it's a public Google Apps Script URL anyway)
- **Option B:** Use a Netlify env var and proxy through a Netlify function

Recommend Option A for MVP simplicity.

---

## Chunk 4: Local Testing

### Task 7: Test the tool end-to-end

- [ ] **Step 1: Start local dev server**

```bash
npm run dev
```

- [ ] **Step 2: Test quick scrape**

Navigate to `http://localhost:4321/tools/youtube-autocomplete-keywords`
- Enter seed: "grow brinjal", geography: India
- Click "Generate Keywords"
- Verify: suggestions load within 5-8 seconds, includes things like "how to grow brinjal at home", "grow brinjal in pot"
- Verify: keywords are grouped by intent category
- Verify: copy buttons work
- Verify: "Copy All" works

- [ ] **Step 3: Test exhaustive scrape + email gate**

- Enter email in the gate section
- Click "Send me the full list"
- Verify: CSV downloads with correct columns
- Verify: results show more keywords than quick scrape
- Verify: Google Sheet webhook was called (check sheet)

- [ ] **Step 4: Test error states**

- Empty seed keyword → validation error
- Rate limiting → graceful error message
- Empty email on gate → inline validation

- [ ] **Step 5: Test mobile responsiveness**

Open DevTools, test at 375px width:
- Form is usable
- Accordion sections work
- Copy buttons are tappable
- CSV download works

- [ ] **Step 6: Verify tool listing and footer**

- `/tools` page shows the new tool card
- Footer has the new link
- Both link to the correct URL

---

## SEO Checklist (apply during build)

- [ ] Canonical URL: `https://sellontube.com/tools/youtube-autocomplete-keywords`
- [ ] BreadcrumbList schema matches URL structure
- [ ] WebApplication schema with correct name, URL, applicationCategory
- [ ] FAQPage schema matches visible FAQ section on page
- [ ] H1 contains primary keyword variation
- [ ] Title tag under 60 chars, contains "YouTube Autocomplete Keyword Tool"
- [ ] Meta description under 155 chars, contains value prop
- [ ] No render-blocking JS above the fold (tool form is static HTML, JS enhances it)
- [ ] Page is fully crawlable without JS (form renders server-side, results are client-rendered but not SEO-critical)
- [ ] Internal links: link to YouTube SEO Tool, Video Ideas Generator, Title Generator from methodology/related-tools section
- [ ] Cross-link FROM existing tools to this one (future task, not in this plan)

---

## Out of Scope (Future)

- Search volume estimates (would need DataForSEO API integration on the backend)
- Keyword difficulty scores
- Keyword clustering/grouping beyond intent categories
- Saved searches / history
- Cross-linking FROM other tools TO this tool (separate PR)
- Tandem blog post ("YouTube Keyword Research for B2B")
