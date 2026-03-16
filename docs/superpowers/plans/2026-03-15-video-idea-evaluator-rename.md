# Video Idea Evaluator Rename Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rename the YouTube Topic Evaluator tool to "Video Idea Evaluator", update its URL from `/tools/youtube-topic-evaluator` to `/tools/youtube-video-ideas-evaluator`, add 301 redirects from both old URLs, and update all 8 reference files across the codebase.

**Architecture:** Pure rename/refactor — no new functionality. `git mv` the Astro page file, update metadata and on-page copy to target "youtube video ideas" keyword cluster (500 SV, KD 0), update all inbound links and nav entries, add redirects in `netlify.toml`. Sitemap is auto-generated on build.

**Tech Stack:** Astro 5 (static), Tailwind CSS, Netlify (redirects via `netlify.toml`)

---

## Chunk 1: File Rename + Metadata + Copy

### Task 1: Rename the Astro page file

**Files:**
- Rename: `src/pages/tools/youtube-topic-evaluator.astro` → `src/pages/tools/youtube-video-ideas-evaluator.astro`

- [ ] **Step 1: Rename file with git mv**

```bash
cd "c:/Users/D E L L/Downloads/Claude Coded/SellonTube"
git mv src/pages/tools/youtube-topic-evaluator.astro src/pages/tools/youtube-video-ideas-evaluator.astro
```

Expected: no output, file renamed in git tracking.

- [ ] **Step 2: Verify rename tracked**

```bash
git status
```

Expected: `renamed: src/pages/tools/youtube-topic-evaluator.astro -> src/pages/tools/youtube-video-ideas-evaluator.astro`

---

### Task 2: Update metadata in the renamed file

**Files:**
- Modify: `src/pages/tools/youtube-video-ideas-evaluator.astro` lines 5-9

- [ ] **Step 1: Update title and description**

In `src/pages/tools/youtube-video-ideas-evaluator.astro`, replace lines 5–9:

```astro
const metadata = {
  title: 'YouTube Topic Evaluator: Free Buyer Intent Checker',
  description:
    'Paste a YouTube topic and see if it attracts buyers or just viewers. Free for B2B founders. Get a buyer intent score plus 3-5 better topic alternatives.',
};
```

With:

```astro
const metadata = {
  title: 'YouTube Video Idea Evaluator | Free Buyer Intent Checker',
  description:
    'Enter any YouTube video idea and find out if it targets buyers or browsers. Free buyer intent scoring for B2B founders. Get a score plus 3–5 better video ideas.',
};
```

---

### Task 3: Update H1 tagline and subheading

**Files:**
- Modify: `src/pages/tools/youtube-video-ideas-evaluator.astro` lines 22-27

- [ ] **Step 1: Update H1 question**

Replace lines 22-24:

```astro
      <h1 class="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white leading-tight mb-4">
        Will this YouTube topic attract<br class="hidden sm:block" /> buyers or just viewers?
      </h1>
```

With:

```astro
      <h1 class="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white leading-tight mb-4">
        Will this YouTube video idea attract<br class="hidden sm:block" /> buyers or just viewers?
      </h1>
```

- [ ] **Step 2: Update subheading paragraph**

Replace lines 25-27:

```astro
      <p class="text-gray-500 dark:text-slate-400 text-base sm:text-lg max-w-xl mx-auto">
        Paste a topic, your target customer, and what you sell. Get a buyer intent score plus higher-converting alternatives.
      </p>
```

With:

```astro
      <p class="text-gray-500 dark:text-slate-400 text-base sm:text-lg max-w-xl mx-auto">
        Paste a YouTube video idea, your target customer, and what you sell. Get a buyer intent score plus higher-converting video ideas.
      </p>
```

---

### Task 4: Update remaining in-file text references

**Files:**
- Modify: `src/pages/tools/youtube-video-ideas-evaluator.astro` (body copy + email source tag)

- [ ] **Step 1: Find all remaining "topic" references in the file that refer to the tool name**

```bash
grep -n "Topic Evaluator\|youtube-topic-evaluator\|topic evaluator" src/pages/tools/youtube-video-ideas-evaluator.astro
```

- [ ] **Step 2: Update email source tag (approx line 910)**

Find the line containing `youtube-topic-evaluator` in the email submission section and replace with `youtube-video-ideas-evaluator`. It will look like:

```js
// Before:
source: 'youtube-topic-evaluator'
// After:
source: 'youtube-video-ideas-evaluator'
```

- [ ] **Step 3: Scan for any remaining "YouTube Topic Evaluator" tool-name references in body copy**

```bash
grep -n "YouTube Topic Evaluator\|Topic Evaluator" src/pages/tools/youtube-video-ideas-evaluator.astro
```

Replace each instance of "YouTube Topic Evaluator" → "YouTube Video Idea Evaluator" and "Topic Evaluator" → "Video Idea Evaluator". Do NOT change occurrences that are mid-sentence and refer to the concept of evaluating a topic (e.g. "Evaluate a topic free" button text is fine as-is or update to "Evaluate a video idea free" for consistency).

- [ ] **Step 4: Update any How It Works section copy to include "youtube video ideas" naturally**

Find the How It Works section and ensure "video idea" appears at least once more in the explanatory copy (without stuffing). Example: if a step says "Enter your topic" → update to "Enter your video idea".

- [ ] **Step 5: Commit Task 1–4**

```bash
git add src/pages/tools/youtube-video-ideas-evaluator.astro
git commit -m "feat: rename Topic Evaluator to Video Idea Evaluator — file + metadata + copy"
```

---

## Chunk 2: Redirects + Navigation + Reference Files

### Task 5: Update netlify.toml redirects

**Files:**
- Modify: `netlify.toml` lines 20-23

- [ ] **Step 1: Update existing short-URL redirect**

Replace lines 20–23:

```toml
[[redirects]]
  from = "/youtube-topic-evaluator"
  to = "/tools/youtube-topic-evaluator"
  status = 301
```

With:

```toml
[[redirects]]
  from = "/youtube-topic-evaluator"
  to = "/tools/youtube-video-ideas-evaluator"
  status = 301
```

- [ ] **Step 2: Add new redirect for the old full path**

Insert a new redirect block immediately after the block you just edited (after line 23):

```toml
[[redirects]]
  from = "/tools/youtube-topic-evaluator"
  to = "/tools/youtube-video-ideas-evaluator"
  status = 301
```

- [ ] **Step 3: Verify no duplicate or conflicting redirects**

```bash
grep -n "topic-evaluator\|video-idea" netlify.toml
```

Expected output — 3 lines:
```
21:  from = "/youtube-topic-evaluator"
22:  to = "/tools/youtube-video-ideas-evaluator"
25:  from = "/tools/youtube-topic-evaluator"
26:  to = "/tools/youtube-video-ideas-evaluator"
```

- [ ] **Step 4: Commit**

```bash
git add netlify.toml
git commit -m "feat: add 301 redirects from old topic-evaluator URLs to new video-ideas-evaluator URL"
```

---

### Task 6: Update footer navigation

**Files:**
- Modify: `src/navigation.ts` line 32

- [ ] **Step 1: Update footer link text and href**

Replace line 32:

```ts
        { text: 'Topic Evaluator', href: getPermalink('/tools/youtube-topic-evaluator') },
```

With:

```ts
        { text: 'Video Idea Evaluator', href: getPermalink('/tools/youtube-video-ideas-evaluator') },
```

- [ ] **Step 2: Verify**

```bash
grep -n "topic-evaluator\|Topic Evaluator" src/navigation.ts
```

Expected: no results.

- [ ] **Step 3: Commit**

```bash
git add src/navigation.ts
git commit -m "feat: update footer nav link to Video Idea Evaluator"
```

---

### Task 7: Update tools hub page

**Files:**
- Modify: `src/pages/tools/index.astro` lines 13-20

- [ ] **Step 1: Update tool card entry**

Replace lines 13–20:

```astro
  {
    name: 'YouTube Topic Evaluator',
    slug: '/tools/youtube-topic-evaluator',
    tagline: 'Does this topic attract buyers or just viewers?',
    description:
      'Paste a topic, your target customer, and your business type. Get a buyer intent score across 5 dimensions plus 3–5 higher-converting alternatives.',
    badge: 'Buyer Intent',
    badgeColor: 'emerald',
  },
```

With:

```astro
  {
    name: 'YouTube Video Idea Evaluator',
    slug: '/tools/youtube-video-ideas-evaluator',
    tagline: 'Does this video idea attract buyers or just viewers?',
    description:
      'Paste a YouTube video idea, your target customer, and your business type. Get a buyer intent score across 5 dimensions plus 3–5 higher-converting video ideas.',
    badge: 'Buyer Intent',
    badgeColor: 'emerald',
  },
```

- [ ] **Step 2: Verify**

```bash
grep -n "topic-evaluator\|Topic Evaluator" src/pages/tools/index.astro
```

Expected: no results.

- [ ] **Step 3: Commit**

```bash
git add src/pages/tools/index.astro
git commit -m "feat: update tools hub card to Video Idea Evaluator"
```

---

### Task 8: Update YouTube Video Ideas hub page

**Files:**
- Modify: `src/pages/youtube-video-ideas/index.astro` lines 103, 107, 110, 218, 221

- [ ] **Step 1: Update Reference 1 — CTA block (around line 97-115)**

Make these replacements:

**Line 103** — update tool name in prose:
```html
<!-- Before -->
Paste any video idea into the YouTube Topic Evaluator and get an instant buyer-intent score...
<!-- After -->
Paste any video idea into the YouTube Video Idea Evaluator and get an instant buyer-intent score...
```

**Line 107** — update href:
```html
<!-- Before -->
href="/tools/youtube-topic-evaluator"
<!-- After -->
href="/tools/youtube-video-ideas-evaluator"
```

**Line 110** — update button text (optional but consistent):
```html
<!-- Before -->
Evaluate a topic free
<!-- After -->
Evaluate a video idea free
```

- [ ] **Step 2: Update Reference 2 — bottom CTA (around line 217-221)**

**Line 218** — update href:
```html
<!-- Before -->
href="/tools/youtube-topic-evaluator"
<!-- After -->
href="/tools/youtube-video-ideas-evaluator"
```

**Line 221** — update link text:
```html
<!-- Before -->
Or evaluate a topic first (free)
<!-- After -->
Or evaluate a video idea first (free)
```

- [ ] **Step 3: Verify**

```bash
grep -n "topic-evaluator\|Topic Evaluator" src/pages/youtube-video-ideas/index.astro
```

Expected: no results.

- [ ] **Step 4: Commit**

```bash
git add src/pages/youtube-video-ideas/index.astro
git commit -m "feat: update video ideas hub links to new evaluator URL"
```

---

### Task 9: Update YouTube Video Ideas individual page template

**Files:**
- Modify: `src/pages/youtube-video-ideas/[slug].astro` lines 170, 174, 177

- [ ] **Step 1: Update tool name in prose**

**Line 170** — update tool name:
```html
<!-- Before -->
...Use the YouTube Topic Evaluator to score a specific idea against your target customer.
<!-- After -->
...Use the YouTube Video Idea Evaluator to score a specific idea against your target customer.
```

**Line 174** — update href:
```html
<!-- Before -->
href="/tools/youtube-topic-evaluator"
<!-- After -->
href="/tools/youtube-video-ideas-evaluator"
```

**Line 177** — update button text:
```html
<!-- Before -->
Evaluate a topic free
<!-- After -->
Evaluate a video idea free
```

- [ ] **Step 2: Verify**

```bash
grep -n "topic-evaluator\|Topic Evaluator" "src/pages/youtube-video-ideas/[slug].astro"
```

Expected: no results.

- [ ] **Step 3: Commit**

```bash
git add "src/pages/youtube-video-ideas/[slug].astro"
git commit -m "feat: update video ideas slug page links to new evaluator URL"
```

---

### Task 10: Update YouTube For pSEO template

**Files:**
- Modify: `src/pages/youtube-for/[slug].astro` lines 443-444, 453, 458, 461

- [ ] **Step 1: Update section heading (line 443-445)**

```html
<!-- Before -->
Evaluate Your YouTube Topics Before You Record
<!-- After -->
Evaluate Your YouTube Video Ideas Before You Record
```

- [ ] **Step 2: Update tool name in callout box (line 453)**

```html
<!-- Before -->
<p class="font-semibold text-gray-900 dark:text-white mb-2">SellOnTube YouTube Topic Evaluator</p>
<!-- After -->
<p class="font-semibold text-gray-900 dark:text-white mb-2">SellOnTube YouTube Video Idea Evaluator</p>
```

- [ ] **Step 3: Update href (line 458)**

```html
<!-- Before -->
href="/tools/youtube-topic-evaluator"
<!-- After -->
href="/tools/youtube-video-ideas-evaluator"
```

- [ ] **Step 4: Update button text (line 461)**

```html
<!-- Before -->
Evaluate a topic free
<!-- After -->
Evaluate a video idea free
```

- [ ] **Step 5: Verify**

```bash
grep -n "topic-evaluator\|Topic Evaluator\|YouTube Topics" "src/pages/youtube-for/[slug].astro"
```

Expected: no results (the phrase "YouTube Topics" in the section heading is now gone).

- [ ] **Step 6: Commit**

```bash
git add "src/pages/youtube-for/[slug].astro"
git commit -m "feat: update youtube-for pSEO template links and heading to Video Idea Evaluator"
```

---

## Chunk 3: Verification

### Task 11: Full codebase sweep — confirm no orphaned references

- [ ] **Step 1: Search entire codebase for old slug**

```bash
grep -rn "youtube-topic-evaluator" --include="*.astro" --include="*.ts" --include="*.tsx" --include="*.js" --include="*.toml" --include="*.md" .
```

Expected: zero results (only the plan/spec docs may contain it — those are acceptable).

- [ ] **Step 2: Search for old tool name in source files**

```bash
grep -rn "Topic Evaluator" --include="*.astro" --include="*.ts" --include="*.tsx" --include="*.js" .
```

Expected: zero results.

- [ ] **Step 3: Verify new file exists**

```bash
ls src/pages/tools/youtube-video-ideas-evaluator.astro
```

Expected: file listed.

- [ ] **Step 4: Build the site**

```bash
npm run build
```

Expected: build succeeds with no errors. The new URL `/tools/youtube-video-ideas-evaluator` will appear in `dist/sitemap-0.xml`.

- [ ] **Step 5: Verify new URL in sitemap**

```bash
grep "video-ideas-evaluator\|topic-evaluator" dist/sitemap-0.xml
```

Expected: `video-ideas-evaluator` present, `topic-evaluator` absent.

- [ ] **Step 6: Final commit if any cleanup needed**

If step 1 or 2 surfaced missed references, fix them and commit:

```bash
git add <files>
git commit -m "fix: clean up remaining topic-evaluator references"
```
