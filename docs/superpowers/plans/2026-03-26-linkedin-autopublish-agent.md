# LinkedIn Autopublish Agent Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a weekly LinkedIn scheduling system — Claude writes 5 posts, a Node.js script sends them to Zernio API with 9 AM IST scheduled times, Zernio publishes automatically each weekday.

**Architecture:** Three files in `scripts/linkedin-agent/`: a scheduling script (`linkedin-schedule.js`), a rolling history log (`linkedin-history.json`), and a weekly queue template (`queue.json`). Plus a weekly agent prompt Claude follows each session. No new dependencies — uses Node 18+ built-in `fetch` and ES module syntax matching the project's `"type": "module"` setting.

**Tech Stack:** Node.js 18+ (built-in fetch), ES modules, Zernio REST API, `.env` file for local credentials.

**Spec:** `docs/superpowers/specs/2026-03-26-linkedin-autopublish-agent-design.md`

---

## Chunk 1: Foundation Files

### Task 1: Create directory + empty history file

**Files:**
- Create: `scripts/linkedin-agent/linkedin-history.json`

- [ ] **Step 1: Create the directory and empty history file**

```bash
mkdir -p scripts/linkedin-agent
```

Then create `scripts/linkedin-agent/linkedin-history.json`:

```json
{
  "posts": []
}
```

- [ ] **Step 2: Verify the file exists and is valid JSON**

```bash
node -e "import('./scripts/linkedin-agent/linkedin-history.json', { assert: { type: 'json' } }).then(m => console.log('valid:', JSON.stringify(m.default)))"
```

Expected output: `valid: {"posts":[]}`

- [ ] **Step 3: Commit**

```bash
git add scripts/linkedin-agent/linkedin-history.json
git commit -m "feat: add empty linkedin post history log"
```

---

### Task 2: Create queue.json template

**Files:**
- Create: `scripts/linkedin-agent/queue.json`

This is the file Claude populates each week. The template shows the exact shape required.

- [ ] **Step 1: Create `scripts/linkedin-agent/queue.json` with one example post**

```json
[
  {
    "scheduledDate": "2026-03-31",
    "dayOfWeek": "Monday",
    "weekdayTheme": "Strategy",
    "sourceTitle": "The YouTube Acquisition Engine",
    "sourceUrl": "https://sellontube.com/blog/the-youtube-acquisition-engine",
    "imageUrl": "https://sellontube.com/images/og/youtube-acquisition-engine.jpg",
    "postAngle": "YouTube as a compounding acquisition asset, not a content calendar task",
    "linkedinPost": "Replace this with the full LinkedIn post text. Must include the source URL naturally in the body. Target 900-1700 characters. No em dashes.\n\nhttps://sellontube.com/blog/the-youtube-acquisition-engine",
    "hashtags": ["#YouTubeSEO", "#B2BMarketing"]
  }
]
```

- [ ] **Step 2: Verify it parses correctly**

```bash
node -e "import('./scripts/linkedin-agent/queue.json', { assert: { type: 'json' } }).then(m => console.log('posts:', m.default.length))"
```

Expected: `posts: 1`

- [ ] **Step 3: Commit**

```bash
git add scripts/linkedin-agent/queue.json
git commit -m "feat: add linkedin queue template with example post shape"
```

---

## Chunk 2: Scheduling Script

### Task 3: Write tests for the scheduling script

**Files:**
- Create: `scripts/linkedin-agent/linkedin-schedule.test.js`

This tests the two pure functions in the script: `buildScheduledFor` (converts a date to 9 AM IST UTC string) and `buildPayload` (constructs the Zernio API body).

- [ ] **Step 1: Create the test file**

```js
// scripts/linkedin-agent/linkedin-schedule.test.js
// Run: node scripts/linkedin-agent/linkedin-schedule.test.js
import assert from 'assert';
import { buildScheduledFor, buildPayload } from './linkedin-schedule.js';

let passed = 0;
let failed = 0;

function test(name, fn) {
  try {
    fn();
    console.log(`  PASS  ${name}`);
    passed++;
  } catch (e) {
    console.error(`  FAIL  ${name}`);
    console.error(`         ${e.message}`);
    failed++;
  }
}

// --- buildScheduledFor ---

test('buildScheduledFor: formats date as 9 AM IST (03:30 UTC)', () => {
  const result = buildScheduledFor('2026-03-30');
  assert.strictEqual(result, '2026-03-30T03:30:00Z');
});

test('buildScheduledFor: works for any weekday date', () => {
  const result = buildScheduledFor('2026-04-07');
  assert.strictEqual(result, '2026-04-07T03:30:00Z');
});

// --- buildPayload ---

const basePost = {
  scheduledDate: '2026-03-30',
  dayOfWeek: 'Monday',
  weekdayTheme: 'Strategy',
  sourceTitle: 'The YouTube Acquisition Engine',
  sourceUrl: 'https://sellontube.com/blog/test',
  imageUrl: 'https://sellontube.com/og/test.jpg',
  postAngle: 'test angle',
  linkedinPost: 'Test post body. https://sellontube.com/blog/test',
  hashtags: ['#YouTubeSEO'],
};

test('buildPayload: includes content, scheduledFor, timezone, platforms', () => {
  const payload = buildPayload(basePost, 'acc_test123');
  assert.strictEqual(payload.content, basePost.linkedinPost);
  assert.strictEqual(payload.scheduledFor, '2026-03-30T03:30:00Z');
  assert.strictEqual(payload.timezone, 'Asia/Kolkata');
  assert.deepStrictEqual(payload.platforms, [{ platform: 'linkedin', accountId: 'acc_test123' }]);
});

test('buildPayload: includes mediaUrls when imageUrl is present', () => {
  const payload = buildPayload(basePost, 'acc_test123');
  assert.deepStrictEqual(payload.mediaUrls, [basePost.imageUrl]);
});

test('buildPayload: omits mediaUrls when imageUrl is null', () => {
  const post = { ...basePost, imageUrl: null };
  const payload = buildPayload(post, 'acc_test123');
  assert.strictEqual(payload.mediaUrls, undefined);
});

test('buildPayload: omits mediaUrls when imageUrl is empty string', () => {
  const post = { ...basePost, imageUrl: '' };
  const payload = buildPayload(post, 'acc_test123');
  assert.strictEqual(payload.mediaUrls, undefined);
});

// --- summary ---
console.log(`\n${passed} passed, ${failed} failed`);
if (failed > 0) process.exit(1);
```

- [ ] **Step 2: Run the test to confirm it fails (functions not yet exported)**

```bash
node scripts/linkedin-agent/linkedin-schedule.test.js
```

Expected: error like `Cannot find module` or `buildScheduledFor is not a function`

---

### Task 4: Implement `linkedin-schedule.js`

**Files:**
- Create: `scripts/linkedin-agent/linkedin-schedule.js`

- [ ] **Step 1: Create the script**

```js
// scripts/linkedin-agent/linkedin-schedule.js
// Reads queue.json, schedules each post via Zernio API at 9 AM IST,
// appends successful posts to linkedin-history.json.
//
// Run:  node scripts/linkedin-agent/linkedin-schedule.js
// Env:  ZERNIO_API_KEY, ZERNIO_ACCOUNT_ID (from .env or environment)

import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Load .env manually (no dotenv dependency — keep it simple)
function loadEnv() {
  try {
    const envPath = join(__dirname, '../../.env');
    const lines = readFileSync(envPath, 'utf8').split('\n');
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const eq = trimmed.indexOf('=');
      if (eq === -1) continue;
      const key = trimmed.slice(0, eq).trim();
      const val = trimmed.slice(eq + 1).trim().replace(/^["']|["']$/g, '');
      if (!process.env[key]) process.env[key] = val;
    }
  } catch {
    // .env not present — rely on environment variables directly
  }
}

// Pure: convert YYYY-MM-DD to 9 AM IST = 03:30 UTC
export function buildScheduledFor(dateStr) {
  return `${dateStr}T03:30:00Z`;
}

// Pure: build Zernio API payload from a queue post object
export function buildPayload(post, accountId) {
  const payload = {
    content: post.linkedinPost,
    scheduledFor: buildScheduledFor(post.scheduledDate),
    timezone: 'Asia/Kolkata',
    platforms: [{ platform: 'linkedin', accountId }],
  };
  if (post.imageUrl) {
    payload.mediaUrls = [post.imageUrl];
  }
  return payload;
}

// Sleep helper for retry
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// POST to Zernio with one retry on network failure
async function postToZernio(payload, apiKey) {
  const url = 'https://zernio.com/api/v1/posts';
  const options = {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  };

  let res;
  try {
    res = await fetch(url, options);
  } catch (networkErr) {
    console.warn(`  [warn] Network error, retrying in 3s... (${networkErr.message})`);
    await sleep(3000);
    try {
      res = await fetch(url, options);
    } catch (retryErr) {
      throw new Error(`Network failure after retry: ${retryErr.message}`);
    }
  }

  const body = await res.text();
  if (!res.ok) {
    throw new Error(`HTTP ${res.status}: ${body.slice(0, 200)}`);
  }
  return JSON.parse(body);
}

// Append a post record to linkedin-history.json (keeps last 30)
function saveToHistory(post) {
  const historyPath = join(__dirname, 'linkedin-history.json');
  let history = { posts: [] };
  try {
    history = JSON.parse(readFileSync(historyPath, 'utf8'));
  } catch {
    // start fresh if file is missing or corrupt
  }

  history.posts.unshift({
    date: post.scheduledDate,
    dayOfWeek: post.dayOfWeek,
    weekdayTheme: post.weekdayTheme,
    sourceTitle: post.sourceTitle,
    sourceUrl: post.sourceUrl,
    postAngle: post.postAngle,
    hook: post.linkedinPost.split('\n')[0].slice(0, 120),
    hashtags: post.hashtags ?? [],
    imageUrl: post.imageUrl ?? null,
    status: 'scheduled',
  });

  // Keep only last 30
  history.posts = history.posts.slice(0, 30);
  writeFileSync(historyPath, JSON.stringify(history, null, 2));
}

// Main
async function main() {
  loadEnv();

  const apiKey = process.env.ZERNIO_API_KEY;
  const accountId = process.env.ZERNIO_ACCOUNT_ID;

  if (!apiKey) {
    console.error('[linkedin-schedule] ERROR: ZERNIO_API_KEY is not set.');
    console.error('  Add it to your .env file: ZERNIO_API_KEY=sk_...');
    process.exit(1);
  }
  if (!accountId) {
    console.error('[linkedin-schedule] ERROR: ZERNIO_ACCOUNT_ID is not set.');
    console.error('  Add it to your .env file: ZERNIO_ACCOUNT_ID=acc_...');
    process.exit(1);
  }

  // Load queue
  const queuePath = join(__dirname, 'queue.json');
  let queue;
  try {
    queue = JSON.parse(readFileSync(queuePath, 'utf8'));
  } catch (e) {
    console.error(`[linkedin-schedule] ERROR: Could not read queue.json — ${e.message}`);
    process.exit(1);
  }

  if (!Array.isArray(queue) || queue.length === 0) {
    console.error('[linkedin-schedule] ERROR: queue.json is empty. Generate posts first.');
    process.exit(1);
  }

  console.log(`[linkedin-schedule] Scheduling ${queue.length} post(s) to LinkedIn via Zernio...\n`);

  let successCount = 0;
  let failCount = 0;

  for (const post of queue) {
    const label = `${post.scheduledDate} (${post.dayOfWeek}) — ${post.sourceTitle}`;
    const payload = buildPayload(post, accountId);

    try {
      await postToZernio(payload, apiKey);
      saveToHistory(post);
      console.log(`  SCHEDULED  ${label}`);
      console.log(`             Publish: ${payload.scheduledFor} | Image: ${post.imageUrl ? 'yes' : 'none'}\n`);
      successCount++;
    } catch (err) {
      console.error(`  FAILED     ${label}`);
      console.error(`             ${err.message}\n`);
      failCount++;
    }
  }

  console.log(`Done. ${successCount} scheduled, ${failCount} failed.`);
  if (failCount > 0) process.exit(1);
}

main();
```

- [ ] **Step 2: Run the tests — they should pass now**

```bash
node scripts/linkedin-agent/linkedin-schedule.test.js
```

Expected output:
```
  PASS  buildScheduledFor: formats date as 9 AM IST (03:30 UTC)
  PASS  buildScheduledFor: works for any weekday date
  PASS  buildPayload: includes content, scheduledFor, timezone, platforms
  PASS  buildPayload: includes mediaUrls when imageUrl is present
  PASS  buildPayload: omits mediaUrls when imageUrl is null
  PASS  buildPayload: omits mediaUrls when imageUrl is empty string

6 passed, 0 failed
```

- [ ] **Step 3: Commit**

```bash
git add scripts/linkedin-agent/linkedin-schedule.js scripts/linkedin-agent/linkedin-schedule.test.js
git commit -m "feat: add linkedin scheduling script with Zernio API integration"
```

---

## Chunk 3: Weekly Agent Prompt

### Task 5: Create the weekly agent prompt

**Files:**
- Create: `agents/09-linkedin-writer.md`

This is the file Claude follows each week when the user says "generate this week's LinkedIn posts." It gives Claude the exact process, quality rules, and output format to produce a valid `queue.json`.

- [ ] **Step 1: Create `agents/09-linkedin-writer.md`**

````markdown
# Agent 09 — LinkedIn Weekly Writer

## Trigger
User says: "generate this week's LinkedIn posts" (or similar)

## Your Job
Write 5 LinkedIn posts for the coming Mon–Fri. Populate `scripts/linkedin-agent/queue.json` with the result. The user runs `node scripts/linkedin-agent/linkedin-schedule.js` to schedule them in Zernio.

---

## Step 1 — Read history

Read `scripts/linkedin-agent/linkedin-history.json`. Note:
- Which source pages were used recently
- Which angles, hooks, or themes appeared in the last 30 posts
- These must NOT be repeated this week

---

## Step 2 — Identify next Mon–Fri dates

Calculate the dates for the coming Monday through Friday. Use these as `scheduledDate` values.

---

## Step 3 — Select 5 source pages

Pick one source page per day. Priority order:
1. Blog posts: `src/data/post/*.md` or `*.mdx`
2. Tool pages: `src/pages/tools/*.astro`
3. pSEO pages: `src/data/niches.ts` or `src/data/comparisons.ts`

**Match each day's theme:**

| Day | Theme | Best source types |
|-----|-------|-------------------|
| Monday | Strategy | Long-form blog posts about YouTube strategy |
| Tuesday | SEO / Discoverability | Blog posts about YouTube SEO, search intent |
| Wednesday | Lead Generation | Blog posts about YouTube for leads, ROI calculator page |
| Thursday | Content / Messaging | Blog posts about scripting, content planning |
| Friday | Mistakes / Contrarian | "Why most..." style posts, anti-patterns |

For each candidate page:
- Read the file content
- Extract: title, meta description, og:image URL, core insight
- Find the `imageUrl`: check frontmatter for `image`, `ogImage`, or `heroImage`. Fall back to `https://sellontube.com/og/<slug>.jpg` pattern.
- Choose the strongest LinkedIn angle — NOT a summary of the article, but a specific insight that stands alone

---

## Step 4 — Write 5 posts

For each post, follow ALL of these rules:

### The primary goal
Every post must make the reader want to click the link and visit the page or try the tool.

This means: **tease, don't tell.** Give enough to be genuinely useful and credible, but leave the payoff — the framework, the full breakdown, the tool result — on the page. The reader should finish the post thinking "I need to read the rest of this" or "I want to try that."

The click is the conversion. Not likes. Not comments. The click.

### Content rules
- Length: 900–1,700 characters (count carefully)
- Open with a strong, specific hook — a surprising fact, a direct claim, or a challenge
- No "In today's digital landscape", "Here are 5 tips", "Most YouTube...", "Game-changing", "Unlock the power of"
- No em dashes (use commas, colons, or full stops instead)
- Include the source URL naturally — as a pull toward more, not a footnote
- Tone: sharp, business-aware, practical — not motivational, not guru-ish
- Write for B2B founders, SaaS operators, marketing heads — people evaluating YouTube for leads
- 0–3 hashtags max, only if they add relevance

### Click-through writing techniques
Use at least one of these per post:

1. **Incomplete revelation** — Introduce a framework or finding, name its parts, then say "the full breakdown is here: [link]"
2. **Curiosity gap** — State something counterintuitive, give partial explanation, let the page close the loop
3. **Tool tease** — If the source is a tool, show what the tool surfaces (a stat, a score, a result) and tell them to run their own: "See what yours looks like: [link]"
4. **Named concept** — Coin or reference a specific term from the article ("The Acquisition Engine model", "the compounding stack") that sounds useful enough to investigate
5. **Partial list** — Give 2 of 4 reasons/steps, then "the other two are the ones most businesses miss. Full list: [link]"

### Structure that works well
- Hook (1–2 lines — makes them stop scrolling)
- Problem or insight (2–3 short paragraphs — earns credibility)
- Tease: the payoff is on the page, not here (creates the click)
- CTA line that sounds like a natural next step, not a sales push
- Source URL on its own line at the end

### What to avoid
- Giving away the entire insight — if everything is in the post, there's no reason to click
- Lazy angles already in history ("YouTube is a long game", "content without strategy fails")
- Motivational filler
- Listicles ("5 reasons why...")
- Summarising the article instead of extracting the sharpest tease

---

## Step 5 — Output queue.json

Write the following to `scripts/linkedin-agent/queue.json`:

```json
[
  {
    "scheduledDate": "YYYY-MM-DD",
    "dayOfWeek": "Monday",
    "weekdayTheme": "Strategy",
    "sourceTitle": "Exact page title",
    "sourceUrl": "https://sellontube.com/exact-path",
    "imageUrl": "https://sellontube.com/path/to/image.jpg",
    "postAngle": "One sentence describing the angle taken",
    "linkedinPost": "Full post text ready to publish. Includes source URL naturally.",
    "hashtags": ["#Optional", "#Hashtags"]
  },
  ... (5 total, one per weekday)
]
```

After writing the file, present all 5 posts to the user for review. Do NOT run the schedule script — wait for explicit user approval.

---

## Step 6 — After approval

Once the user approves (with or without edits), remind them to run:

```bash
node scripts/linkedin-agent/linkedin-schedule.js
```

This schedules all 5 posts in Zernio at 9 AM IST each weekday. Done until next week.

---

## Quality checklist (run before presenting posts)

- [ ] All 5 posts are 900–1,700 characters
- [ ] No em dashes in any post
- [ ] Each post includes the source URL in the body
- [ ] Each post has a valid imageUrl (not null, not placeholder)
- [ ] No angle repeats from linkedin-history.json
- [ ] No banned openers used
- [ ] Weekday themes matched
- [ ] Hashtags 0–3 per post
- [ ] Each post uses at least one click-through technique (incomplete revelation, curiosity gap, tool tease, named concept, or partial list)
- [ ] The post does NOT give away the full insight — the payoff is on the page
````

- [ ] **Step 2: Verify the agent file is in the agents directory with the others**

```bash
ls agents/
```

Expected: `09-linkedin-writer.md` appears alongside `01-gsc-intelligence.md` etc.

- [ ] **Step 3: Commit**

```bash
git add agents/09-linkedin-writer.md
git commit -m "feat: add linkedin weekly writer agent prompt"
```

---

## Chunk 4: Wiring + Smoke Test

### Task 6: Add npm script shortcut + smoke test

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Add the `linkedin` script to `package.json`**

In the `"scripts"` block, add:

```json
"linkedin": "node scripts/linkedin-agent/linkedin-schedule.js"
```

So the user can run `npm run linkedin` instead of the full path.

- [ ] **Step 2: Smoke test with missing env vars (expected to fail gracefully)**

```bash
node scripts/linkedin-agent/linkedin-schedule.js
```

Expected (no .env set):
```
[linkedin-schedule] ERROR: ZERNIO_API_KEY is not set.
  Add it to your .env file: ZERNIO_API_KEY=sk_...
```

- [ ] **Step 3: Smoke test with empty queue**

Temporarily set `queue.json` to `[]`, then:

```bash
ZERNIO_API_KEY=sk_test ZERNIO_ACCOUNT_ID=acc_test node scripts/linkedin-agent/linkedin-schedule.js
```

Expected:
```
[linkedin-schedule] ERROR: queue.json is empty. Generate posts first.
```

Restore `queue.json` to the template after.

- [ ] **Step 4: Run the full test suite one final time**

```bash
node scripts/linkedin-agent/linkedin-schedule.test.js
```

Expected: `6 passed, 0 failed`

- [ ] **Step 5: Commit**

```bash
git add package.json
git commit -m "feat: add npm run linkedin shortcut for scheduling script"
```

---

## Final Checklist

- [ ] `scripts/linkedin-agent/linkedin-history.json` — exists, valid JSON, empty posts array
- [ ] `scripts/linkedin-agent/queue.json` — exists, shows correct post shape
- [ ] `scripts/linkedin-agent/linkedin-schedule.js` — reads queue, POSTs to Zernio, saves history
- [ ] `scripts/linkedin-agent/linkedin-schedule.test.js` — 6 tests, all passing
- [ ] `agents/09-linkedin-writer.md` — weekly prompt Claude follows to generate posts
- [ ] `package.json` — `npm run linkedin` shortcut added
- [ ] All tests pass: `node scripts/linkedin-agent/linkedin-schedule.test.js`
- [ ] Smoke tests pass (missing env, empty queue both handled gracefully)

---

## How to Use (after implementation)

**Setup (one time):**
Add to `.env` in project root:
```
ZERNIO_API_KEY=sk_your_key_here
ZERNIO_ACCOUNT_ID=acc_your_account_id_here
```

**Every week:**
1. Open Claude Code: *"generate this week's LinkedIn posts"*
2. Claude reads history + site content, writes 5 posts
3. Review and approve (or request edits)
4. Run: `npm run linkedin`
5. Done — Zernio publishes at 9 AM IST Mon–Fri
