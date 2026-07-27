# Zernio X Blog-Repurpose Stream Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship a second, independent X content stream that repurposes evergreen flagship blog posts into link-free tweets, scheduled through Zernio's free tier at 20:00 UTC on weekdays.

**Architecture:** A new `scripts/x-agent/` module owns its own calendar (`x-queue.json`), validator, scheduler, and history, mirroring the existing `scripts/linkedin-agent/` layout so the two streams stay structurally separate and cannot collide. Zernio HTTP concerns are extracted once into `scripts/lib/zernio.js` and consumed by the new scheduler. A dedicated verifier reconciles our local queue against Zernio's actual server state, which is the safeguard whose absence hid a 10-day LinkedIn outage.

**Tech Stack:** Node 20+ ESM, `node --test` (already used by `linkedin-schedule.test.js`), Zernio REST API v1, no new dependencies.

## Global Constraints

- **Never post links.** X posts in this stream carry no URLs at all. The validator hard-fails any `https?://`.
- **Hard limit 280 characters.** Fail loud, never truncate silently.
- **No em dashes or en dashes** (`—`, `–`) anywhere in copy. Project-wide rule.
- **Banned phrases** are reused verbatim from `scripts/linkedin-agent/validate-post.js`: `in today's`, `game-chang`, `unlock the power`, `here are 5`, `here are five`, `dive into`, `leverage`, `delve`, `take your channel to the next level`, `the future is`.
- **Post time is exactly `20:00:00Z`.** The existing upload-post stream owns `13:30:00Z`. These must never coincide.
- **Weekdays only.** Saturday and Sunday `scheduledDate` values are a validation failure.
- **Zernio free-tier cap is 20 uploads per billing cycle, anchor day 22.** Quota is consumed at schedule time, not publish time, and is refunded on delete.
- **Zernio twitter accountId is `6a59c1f93d50078defbf90b3`.** Read it from `ZERNIO_X_ACCOUNT_ID` in `.env`, never hardcode in source.
- **`scripts/linkedin-agent/linkedin-schedule.js` is not modified by this plan.** That stream is parked pending a vendor decision. It keeps its private Zernio helpers; migrating it to the shared client is deliberate future work, noted in Task 1.
- **Never commit unless the user explicitly asks.** Steps below include commit commands; run them only on instruction.

---

### Task 1: Shared Zernio client

**Files:**
- Create: `scripts/lib/zernio.js`
- Test: `scripts/lib/zernio.test.js`

**Interfaces:**
- Consumes: nothing from earlier tasks.
- Produces: `loadEnv(): void`, `getUsage(apiKey): Promise<{limit:number, used:number, remaining:number, anchorDay:number}>`, `postToZernio(payload, apiKey): Promise<object>`, `listPosts(apiKey): Promise<Array>`, `deletePost(id, apiKey): Promise<boolean>`.

- [ ] **Step 1: Write the failing test**

```javascript
// scripts/lib/zernio.test.js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseUsage } from './zernio.js';

test('parseUsage extracts limit, used and remaining', () => {
  const raw = {
    planName: 'Free',
    billingAnchorDay: 22,
    limits: { uploads: 20, profiles: 2 },
    usage: { uploads: 3, profiles: 1 },
  };
  assert.deepEqual(parseUsage(raw), {
    limit: 20, used: 3, remaining: 17, anchorDay: 22,
  });
});

test('parseUsage clamps remaining at zero when over quota', () => {
  const raw = { billingAnchorDay: 22, limits: { uploads: 20 }, usage: { uploads: 25 } };
  assert.equal(parseUsage(raw).remaining, 0);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test scripts/lib/zernio.test.js`
Expected: FAIL with `Cannot find module` for `./zernio.js`.

- [ ] **Step 3: Write minimal implementation**

```javascript
// scripts/lib/zernio.js
// Shared Zernio API client. The LinkedIn agent still carries its own private
// copies of these helpers; migrate it here when that stream is un-parked.
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const BASE = 'https://zernio.com/api/v1';

export function loadEnv() {
  try {
    const lines = readFileSync(join(__dirname, '../../.env'), 'utf8').split('\n');
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
    // .env absent: rely on real environment variables
  }
}

// Pure: shape Zernio's /usage response into what callers actually need.
export function parseUsage(raw) {
  const limit = raw?.limits?.uploads ?? 0;
  const used = raw?.usage?.uploads ?? 0;
  return {
    limit,
    used,
    remaining: Math.max(0, limit - used),
    anchorDay: raw?.billingAnchorDay ?? null,
  };
}

async function request(path, apiKey, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${apiKey}`,
      ...(options.body ? { 'Content-Type': 'application/json' } : {}),
      ...(options.headers || {}),
    },
  });
  const body = await res.text();
  if (!res.ok) throw new Error(`HTTP ${res.status} on ${path}: ${body.slice(0, 200)}`);
  return body ? JSON.parse(body) : {};
}

export async function getUsage(apiKey) {
  return parseUsage(await request('/usage', apiKey));
}

export async function postToZernio(payload, apiKey) {
  return request('/posts', apiKey, { method: 'POST', body: JSON.stringify(payload) });
}

export async function listPosts(apiKey) {
  const all = [];
  for (let page = 1; page <= 20; page++) {
    const d = await request(`/posts?page=${page}&limit=50`, apiKey);
    const posts = d.posts || [];
    all.push(...posts);
    if (posts.length < 50) break;
  }
  return all;
}

export async function deletePost(id, apiKey) {
  await request(`/posts/${id}`, apiKey, { method: 'DELETE' });
  return true;
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test scripts/lib/zernio.test.js`
Expected: PASS, 2 tests.

- [ ] **Step 5: Commit**

```bash
git add scripts/lib/zernio.js scripts/lib/zernio.test.js
git commit -m "feat(social): add shared Zernio API client with paginated listPosts"
```

Note on `listPosts`: the existing default page size is 10. Paginating here is deliberate — an unpaginated delete sweep on 2026-07-21 only hit the right posts because the API happened to sort descending.

---

### Task 2: X post validator

**Files:**
- Create: `scripts/x-agent/validate-x-post.js`
- Test: `scripts/x-agent/validate-x-post.test.js`

**Interfaces:**
- Consumes: nothing.
- Produces: `validateXPost(post, recentHooks?): {ok: boolean, reasons: string[]}` where `post` is `{scheduledDate: string, xPost: string, sourceSlug: string, sourceTitle: string}`.

- [ ] **Step 1: Write the failing test**

```javascript
// scripts/x-agent/validate-x-post.test.js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { validateXPost } from './validate-x-post.js';

const good = {
  scheduledDate: '2026-07-23',
  xPost: 'Four videos a month sounds modest.\n\nYear one it looks like nothing.\nYear two it is the only channel still compounding.',
  sourceSlug: 'compounding-effect-four-videos-a-month',
  sourceTitle: 'The compounding effect of four videos a month',
};

test('passes a clean post', () => {
  assert.deepEqual(validateXPost(good), { ok: true, reasons: [] });
});

test('fails when over 280 characters', () => {
  const r = validateXPost({ ...good, xPost: 'a'.repeat(281) });
  assert.equal(r.ok, false);
  assert.ok(r.reasons.some((x) => x.includes('281')));
});

test('fails on any URL', () => {
  const r = validateXPost({ ...good, xPost: 'See https://sellontube.com for more.' });
  assert.ok(r.reasons.includes('contains a URL'));
});

test('fails on em dash', () => {
  const r = validateXPost({ ...good, xPost: 'Views are vanity — pipeline is not.' });
  assert.ok(r.reasons.includes('contains em/en dash'));
});

test('fails on banned phrase', () => {
  const r = validateXPost({ ...good, xPost: 'Time to leverage your channel.' });
  assert.ok(r.reasons.some((x) => x.includes('leverage')));
});

test('fails on weekend date', () => {
  const r = validateXPost({ ...good, scheduledDate: '2026-07-25' });
  assert.ok(r.reasons.some((x) => x.includes('weekend')));
});

test('fails on empty body', () => {
  const r = validateXPost({ ...good, xPost: '   ' });
  assert.ok(r.reasons.includes('empty xPost'));
});

test('fails on missing source attribution', () => {
  const r = validateXPost({ ...good, sourceSlug: '' });
  assert.ok(r.reasons.includes('missing sourceSlug'));
});

test('dedups against recent hooks', () => {
  const hook = good.xPost.split('\n')[0];
  const r = validateXPost(good, [hook]);
  assert.ok(r.reasons.includes('dedup: hook already used in recent history'));
});
```

`2026-07-25` is a Saturday and `2026-07-23` is a Thursday. Verify with `date -d 2026-07-25 +%A` before trusting these fixtures.

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test scripts/x-agent/validate-x-post.test.js`
Expected: FAIL with `Cannot find module` for `./validate-x-post.js`.

- [ ] **Step 3: Write minimal implementation**

```javascript
// scripts/x-agent/validate-x-post.js
// Pure mechanical assert for a repurposed X post. Returns {ok, reasons}.
// This stream is deliberately link-free: X suppresses reach on outbound links,
// and the whole point of the blog-repurpose stream is reach, not referral.

const BANNED = [
  'in today’s', "in today's", 'game-chang', 'unlock the power',
  'here are 5', 'here are five', 'dive into', 'leverage', 'delve',
  'take your channel to the next level', 'the future is',
];
const URL_RE = /https?:\/\//i;
const DASH_RE = /[—–]/;
const X_LIMIT = 280;

export function validateXPost(post, recentHooks = []) {
  const reasons = [];
  const body = (post.xPost || '').trim();

  if (!body) {
    reasons.push('empty xPost');
  } else if (body.length > X_LIMIT) {
    reasons.push(`length ${body.length} exceeds ${X_LIMIT}`);
  }

  if (URL_RE.test(body)) reasons.push('contains a URL');
  if (DASH_RE.test(body)) reasons.push('contains em/en dash');

  const lower = body.toLowerCase();
  for (const phrase of BANNED) {
    if (lower.includes(phrase)) reasons.push(`banned phrase: "${phrase}"`);
  }

  if (!post.sourceSlug) reasons.push('missing sourceSlug');

  // Weekday guard. Parse as UTC so the check never drifts with local timezone.
  const d = new Date(`${post.scheduledDate}T00:00:00Z`);
  if (Number.isNaN(d.getTime())) {
    reasons.push(`unparseable scheduledDate: ${post.scheduledDate}`);
  } else {
    const day = d.getUTCDay();
    if (day === 0 || day === 6) reasons.push(`scheduledDate falls on a weekend: ${post.scheduledDate}`);
  }

  const hook = body.split('\n')[0].trim();
  if (hook && recentHooks.some((h) => h.trim() === hook)) {
    reasons.push('dedup: hook already used in recent history');
  }

  return { ok: reasons.length === 0, reasons };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test scripts/x-agent/validate-x-post.test.js`
Expected: PASS, 9 tests.

- [ ] **Step 5: Commit**

```bash
git add scripts/x-agent/validate-x-post.js scripts/x-agent/validate-x-post.test.js
git commit -m "feat(social): add link-free X post validator for blog repurpose stream"
```

---

### Task 3: X scheduler

**Files:**
- Create: `scripts/x-agent/x-schedule.js`
- Create: `scripts/x-agent/x-queue.json` (starts as `[]`)
- Create: `scripts/x-agent/x-history.json` (starts as `{"posts": []}`)
- Test: `scripts/x-agent/x-schedule.test.js`

**Interfaces:**
- Consumes: `validateXPost` from Task 2; `loadEnv`, `getUsage`, `postToZernio` from Task 1.
- Produces: `buildScheduledForX(dateStr): string`, `buildXPayload(post, accountId): object`.

- [ ] **Step 1: Write the failing test**

```javascript
// scripts/x-agent/x-schedule.test.js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildScheduledForX, buildXPayload } from './x-schedule.js';

test('buildScheduledForX pins the slot to 20:00 UTC', () => {
  assert.equal(buildScheduledForX('2026-07-23'), '2026-07-23T20:00:00Z');
});

test('buildScheduledForX never collides with the upload-post 13:30 slot', () => {
  assert.ok(!buildScheduledForX('2026-07-23').includes('13:30'));
});

test('buildXPayload targets twitter with the given account', () => {
  const p = buildXPayload(
    { scheduledDate: '2026-07-23', xPost: 'Boring beats clever.' },
    'acct_123',
  );
  assert.deepEqual(p, {
    content: 'Boring beats clever.',
    timezone: 'Asia/Kolkata',
    platforms: [{ platform: 'twitter', accountId: 'acct_123' }],
    scheduledFor: '2026-07-23T20:00:00Z',
  });
});

test('buildXPayload trims the body and never appends hashtags', () => {
  const p = buildXPayload({ scheduledDate: '2026-07-23', xPost: '  Hook.  ' }, 'a');
  assert.equal(p.content, 'Hook.');
  assert.ok(!p.content.includes('#'));
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test scripts/x-agent/x-schedule.test.js`
Expected: FAIL with `Cannot find module` for `./x-schedule.js`.

- [ ] **Step 3: Write minimal implementation**

```javascript
// scripts/x-agent/x-schedule.js
// Reads x-queue.json and schedules each link-free post to X via Zernio.
// Separate stream from scripts/linkedin-agent/: different source material
// (published blog posts), different slot (20:00 UTC), different vendor path.
//
// Run:  node scripts/x-agent/x-schedule.js
// Env:  ZERNIO_API_KEY, ZERNIO_X_ACCOUNT_ID

import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath, pathToFileURL } from 'url';
import { dirname, join, resolve } from 'path';
import { loadEnv, getUsage, postToZernio } from '../lib/zernio.js';
import { validateXPost } from './validate-x-post.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

// The upload-post stream owns 13:30 UTC. This stream owns 20:00 UTC
// (4pm US-Eastern, 1pm Pacific). The gap is deliberate and load-bearing:
// two vendors posting the same account at the same instant is a double-post.
const POST_TIME_UTC = '20:00:00';

export function buildScheduledForX(dateStr) {
  return `${dateStr}T${POST_TIME_UTC}Z`;
}

export function buildXPayload(post, accountId) {
  return {
    content: (post.xPost || '').trim(),
    timezone: 'Asia/Kolkata',
    platforms: [{ platform: 'twitter', accountId }],
    scheduledFor: buildScheduledForX(post.scheduledDate),
  };
}

function saveToHistory(post, zernioId) {
  const p = join(__dirname, 'x-history.json');
  let history = { posts: [] };
  try {
    history = JSON.parse(readFileSync(p, 'utf8'));
  } catch {
    // start fresh if missing or corrupt
  }
  history.posts.unshift({
    date: post.scheduledDate,
    sourceSlug: post.sourceSlug,
    sourceTitle: post.sourceTitle ?? null,
    hook: (post.xPost || '').split('\n')[0].slice(0, 120),
    chars: (post.xPost || '').trim().length,
    zernioId,
    status: 'scheduled',
  });
  history.posts = history.posts.slice(0, 60);
  writeFileSync(p, JSON.stringify(history, null, 2) + '\n');
}

async function main() {
  loadEnv();

  const apiKey = process.env.ZERNIO_API_KEY;
  const accountId = process.env.ZERNIO_X_ACCOUNT_ID;
  if (!apiKey) {
    console.error('[x-schedule] ERROR: ZERNIO_API_KEY is not set.');
    process.exit(1);
  }
  if (!accountId) {
    console.error('[x-schedule] ERROR: ZERNIO_X_ACCOUNT_ID is not set.');
    console.error('  Add it to .env: ZERNIO_X_ACCOUNT_ID=6a59c1f93d50078defbf90b3');
    process.exit(1);
  }

  let queue;
  try {
    queue = JSON.parse(readFileSync(join(__dirname, 'x-queue.json'), 'utf8'));
  } catch (e) {
    console.error(`[x-schedule] ERROR: could not read x-queue.json - ${e.message}`);
    process.exit(1);
  }
  if (!Array.isArray(queue) || queue.length === 0) {
    console.error('[x-schedule] ERROR: x-queue.json is empty.');
    process.exit(1);
  }

  // Quota preflight. Zernio charges an upload at SCHEDULE time, so a queue
  // longer than the remaining allowance must be truncated on purpose and
  // reported, never silently half-shipped.
  const usage = await getUsage(apiKey);
  console.log(`[x-schedule] Zernio quota: ${usage.used}/${usage.limit} used, ${usage.remaining} remaining (anchor day ${usage.anchorDay})`);
  if (usage.remaining === 0) {
    console.error('[x-schedule] ERROR: no Zernio uploads remaining this cycle. Nothing scheduled.');
    process.exit(1);
  }

  let recentHooks = [];
  try {
    const h = JSON.parse(readFileSync(join(__dirname, 'x-history.json'), 'utf8'));
    recentHooks = (h.posts || []).map((p) => (p.hook || '').trim()).filter(Boolean);
  } catch {
    // no history yet
  }

  const willAttempt = queue.slice(0, usage.remaining);
  const deferred = queue.slice(usage.remaining);
  if (deferred.length) {
    console.warn(`[x-schedule] QUOTA: ${deferred.length} post(s) deferred to next cycle:`);
    for (const p of deferred) console.warn(`             ${p.scheduledDate}  ${p.sourceSlug}`);
    console.warn('');
  }

  let ok = 0;
  let fail = 0;
  for (const post of willAttempt) {
    const label = `${post.scheduledDate}  ${post.sourceSlug}`;
    const check = validateXPost(post, recentHooks);
    if (!check.ok) {
      console.error(`  SKIPPED    ${label}`);
      console.error(`             ${check.reasons.join('; ')}\n`);
      fail++;
      continue;
    }
    try {
      const res = await postToZernio(buildXPayload(post, accountId), apiKey);
      saveToHistory(post, res?._id ?? res?.post?._id ?? null);
      recentHooks.push((post.xPost || '').split('\n')[0].trim());
      console.log(`  SCHEDULED  ${label}`);
      console.log(`             ${buildScheduledForX(post.scheduledDate)} | ${post.xPost.trim().length}/280 chars\n`);
      ok++;
    } catch (err) {
      console.error(`  FAILED     ${label}`);
      console.error(`             ${err.message}\n`);
      fail++;
    }
  }

  console.log(`Done. ${ok} scheduled, ${fail} failed, ${deferred.length} deferred.`);
  console.log('Next: run `npm run x:verify` to confirm Zernio actually holds them.');
  if (fail > 0) process.exit(1);
}

const invokedPath = process.argv[1] ? pathToFileURL(resolve(process.argv[1])).href : null;
if (invokedPath && import.meta.url === invokedPath) {
  main();
}
```

- [ ] **Step 4: Create the empty data files**

```bash
printf '[]\n' > scripts/x-agent/x-queue.json
printf '{\n  "posts": []\n}\n' > scripts/x-agent/x-history.json
```

- [ ] **Step 5: Run test to verify it passes**

Run: `node --test scripts/x-agent/x-schedule.test.js`
Expected: PASS, 4 tests.

- [ ] **Step 6: Add the account id to .env**

Append to `.env` (this file is gitignored, do not commit it):

```
ZERNIO_X_ACCOUNT_ID=6a59c1f93d50078defbf90b3
```

- [ ] **Step 7: Commit**

```bash
git add scripts/x-agent/x-schedule.js scripts/x-agent/x-schedule.test.js scripts/x-agent/x-queue.json scripts/x-agent/x-history.json
git commit -m "feat(social): add Zernio X scheduler with quota preflight and 20:00 UTC slot"
```

---

### Task 4: Post-schedule verifier

This is the task that closes the actual defect behind the 2026-07-21 incident: the LinkedIn scheduler treated an HTTP 200 at schedule time as proof of publication and never reconciled against server state, so a disconnected account went unnoticed for 10 days.

**Files:**
- Create: `scripts/x-agent/verify-x-scheduled.js`
- Test: `scripts/x-agent/verify-x-scheduled.test.js`

**Interfaces:**
- Consumes: `loadEnv`, `listPosts` from Task 1.
- Produces: `reconcile(queue, serverPosts, accounts): {problems: string[], matched: number}`.

- [ ] **Step 1: Write the failing test**

```javascript
// scripts/x-agent/verify-x-scheduled.test.js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { reconcile } from './verify-x-scheduled.js';

const queue = [{ scheduledDate: '2026-07-23', sourceSlug: 'a', xPost: 'Hook one.' }];
const activeAccounts = [{ platform: 'twitter', displayName: 'Sell On YouTube', isActive: true }];

function serverPost(overrides = {}) {
  return {
    _id: 'p1',
    scheduledFor: '2026-07-23T20:00:00.000Z',
    status: 'scheduled',
    platforms: [{ platform: 'twitter', status: 'pending', accountId: { isActive: true } }],
    ...overrides,
  };
}

test('clean state produces no problems', () => {
  const r = reconcile(queue, [serverPost()], activeAccounts);
  assert.deepEqual(r.problems, []);
  assert.equal(r.matched, 1);
});

test('flags a queued date missing from the server', () => {
  const r = reconcile(queue, [], activeAccounts);
  assert.ok(r.problems.some((p) => p.includes('2026-07-23') && p.includes('not found')));
});

test('flags an inactive twitter account', () => {
  const dead = [{ platform: 'twitter', displayName: 'Sell On YouTube', isActive: false }];
  const r = reconcile(queue, [serverPost()], dead);
  assert.ok(r.problems.some((p) => p.includes('inactive')));
});

test('flags a failed or cancelled platform entry', () => {
  const bad = serverPost({
    platforms: [{ platform: 'twitter', status: 'cancelled', accountId: { isActive: true } }],
  });
  const r = reconcile(queue, [bad], activeAccounts);
  assert.ok(r.problems.some((p) => p.includes('cancelled')));
});

test('flags a slot that is not 20:00 UTC', () => {
  const wrong = serverPost({ scheduledFor: '2026-07-23T13:30:00.000Z' });
  const r = reconcile(queue, [wrong], activeAccounts);
  assert.ok(r.problems.some((p) => p.includes('13:30')));
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test scripts/x-agent/verify-x-scheduled.test.js`
Expected: FAIL with `Cannot find module` for `./verify-x-scheduled.js`.

- [ ] **Step 3: Write minimal implementation**

```javascript
// scripts/x-agent/verify-x-scheduled.js
// Reconciles x-queue.json against what Zernio actually holds. A scheduler that
// only checks the HTTP status of its own POST cannot detect a vendor-side
// account disconnect; this can, and exits non-zero so CI or a human sees it.
//
// Run:  node scripts/x-agent/verify-x-scheduled.js

import { readFileSync } from 'fs';
import { fileURLToPath, pathToFileURL } from 'url';
import { dirname, join, resolve } from 'path';
import { loadEnv, listPosts } from '../lib/zernio.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const EXPECTED_SLOT = 'T20:00';
const BAD_STATUSES = new Set(['failed', 'cancelled', 'error']);

// Pure: compare our intent against server truth. Returns every discrepancy.
export function reconcile(queue, serverPosts, accounts) {
  const problems = [];

  for (const a of accounts) {
    if (a.platform === 'twitter' && !a.isActive) {
      problems.push(`account "${a.displayName}" (twitter) is inactive on Zernio; posts will not publish`);
    }
  }

  const twitterPosts = serverPosts.filter((p) =>
    (p.platforms || []).some((pl) => pl.platform === 'twitter'),
  );

  let matched = 0;
  for (const q of queue) {
    const hit = twitterPosts.find((p) => (p.scheduledFor || '').startsWith(q.scheduledDate));
    if (!hit) {
      problems.push(`${q.scheduledDate} (${q.sourceSlug}): not found on Zernio`);
      continue;
    }
    matched++;
    if (!(hit.scheduledFor || '').includes(EXPECTED_SLOT)) {
      problems.push(`${q.scheduledDate}: wrong slot, server says ${hit.scheduledFor}`);
    }
    if (BAD_STATUSES.has(hit.status)) {
      problems.push(`${q.scheduledDate}: post status is ${hit.status}`);
    }
    for (const pl of hit.platforms || []) {
      if (pl.platform !== 'twitter') continue;
      if (BAD_STATUSES.has(pl.status)) {
        problems.push(`${q.scheduledDate}: twitter status is ${pl.status}`);
      }
      if (pl.accountId && pl.accountId.isActive === false) {
        problems.push(`${q.scheduledDate}: bound to an inactive account`);
      }
    }
  }

  return { problems, matched };
}

async function main() {
  loadEnv();
  const apiKey = process.env.ZERNIO_API_KEY;
  if (!apiKey) {
    console.error('[verify-x] ERROR: ZERNIO_API_KEY is not set.');
    process.exit(1);
  }

  const queue = JSON.parse(readFileSync(join(__dirname, 'x-queue.json'), 'utf8'));
  const serverPosts = await listPosts(apiKey);
  const res = await fetch('https://zernio.com/api/v1/accounts', {
    headers: { Authorization: `Bearer ${apiKey}` },
  });
  if (!res.ok) {
    console.error(`[verify-x] ERROR: accounts lookup failed with HTTP ${res.status}`);
    process.exit(1);
  }
  const { accounts } = await res.json();

  const { problems, matched } = reconcile(queue, serverPosts, accounts);
  console.log(`[verify-x] ${matched}/${queue.length} queued posts confirmed on Zernio.`);
  if (problems.length) {
    console.error(`[verify-x] ${problems.length} PROBLEM(S):`);
    for (const p of problems) console.error(`  - ${p}`);
    process.exit(1);
  }
  console.log('[verify-x] All clear.');
}

const invokedPath = process.argv[1] ? pathToFileURL(resolve(process.argv[1])).href : null;
if (invokedPath && import.meta.url === invokedPath) {
  main();
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test scripts/x-agent/verify-x-scheduled.test.js`
Expected: PASS, 5 tests.

- [ ] **Step 5: Mutation-test the verifier before trusting it**

A checker that cannot fail is worse than no checker. Prove it fails:

```bash
node -e "
import('./scripts/x-agent/verify-x-scheduled.js').then(m => {
  const q = [{ scheduledDate: '2026-07-23', sourceSlug: 'a' }];
  const dead = [{ platform: 'twitter', displayName: 'X', isActive: false }];
  const r = m.reconcile(q, [], dead);
  console.log('problems found:', r.problems.length);
  if (r.problems.length < 2) { console.error('MUTATION TEST FAILED: verifier is blind'); process.exit(1); }
  console.log('OK, verifier detects both the dead account and the missing post');
});
"
```

Expected: `problems found: 2` and the OK line.

- [ ] **Step 6: Commit**

```bash
git add scripts/x-agent/verify-x-scheduled.js scripts/x-agent/verify-x-scheduled.test.js
git commit -m "feat(social): add Zernio X reconciliation check to catch vendor-side failures"
```

---

### Task 5: npm scripts and stream documentation

**Files:**
- Modify: `package.json` (the `scripts` block)
- Create: `docs/social-media/x/README.md`

**Interfaces:**
- Consumes: the entry points from Tasks 3 and 4.
- Produces: `npm run x:schedule`, `npm run x:verify`, `npm run x:test`.

- [ ] **Step 1: Add the npm scripts**

In `package.json`, inside `"scripts"`, after the existing `"linkedin"` line:

```json
    "x:schedule": "node scripts/x-agent/x-schedule.js",
    "x:verify": "node scripts/x-agent/verify-x-scheduled.js",
    "x:test": "node --test scripts/x-agent/*.test.js scripts/lib/*.test.js",
```

- [ ] **Step 2: Verify the scripts resolve**

Run: `npm run x:test`
Expected: PASS, 18 tests total across the four test files.

- [ ] **Step 3: Write the stream README**

```markdown
<!-- docs/social-media/x/README.md -->
# X (Twitter) streams

@SellOnTube is written to by **two independent streams**. They must never share a slot.

| Stream | Vendor | Slot | Source material | Quota | Cycle resets |
|---|---|---|---|---|---|
| LinkedIn repurpose | upload-post | 13:30 UTC | `scripts/linkedin-agent/queue.json` | 10/mo | day 20 |
| Blog repurpose | Zernio | 20:00 UTC | `scripts/x-agent/x-queue.json` | 20/mo | day 22 |

Both streams post link-free copy. upload-post strips URLs on the free tier; the
Zernio stream omits them by choice, because X suppresses reach on outbound links.

## Running the Zernio stream

    npm run x:schedule   # validate + schedule everything in x-queue.json
    npm run x:verify     # reconcile against Zernio's actual server state
    npm run x:test       # unit tests

Always run `x:verify` after `x:schedule`. A 200 response at schedule time does
not mean a post will publish: on 2026-07-20 a LinkedIn account was deactivated
vendor-side one minute after its first scheduled publish, and ten days of posts
silently died because nothing reconciled intent against server state.

## Quota behaviour

Zernio charges an upload when a post is **scheduled**, not when it publishes,
and refunds it on delete. `x-schedule.js` preflights `/api/v1/usage` and defers
any overflow to the next cycle rather than half-shipping a batch.

With 20 slots against roughly 22 weekdays, two weekdays per cycle go uncovered.
The scheduler names them in its output.
```

- [ ] **Step 4: Commit**

```bash
git add package.json docs/social-media/x/README.md
git commit -m "chore(social): wire X stream npm scripts and document the two-stream split"
```

---

### Task 6: Content batch 1

Code is done at this point. This task produces the first 20 posts and is a **human review gate**, not an autonomous step.

**Files:**
- Modify: `scripts/x-agent/x-queue.json`

**Interfaces:**
- Consumes: the queue schema from Task 3 and the validator from Task 2.
- Produces: a populated `x-queue.json` of at most 20 entries.

Queue entry schema:

```json
{
  "scheduledDate": "2026-07-23",
  "sourceSlug": "compounding-effect-four-videos-a-month",
  "sourceTitle": "The compounding effect of four videos a month",
  "angle": "The result nobody waits around for",
  "xPost": "Four videos a month sounds modest.\n\nYear one it looks like nothing.\nYear two it is the only channel still compounding."
}
```

- [ ] **Step 1: Confirm the flagship source list with the user**

Proposed batch 1, evergreen flagship first, 20 posts:

`youtube-vs-blog-shopify-app-case-study`, `the-youtube-acquisition-engine`,
`how-to-find-youtube-autocomplete-keywords`, `compounding-effect-four-videos-a-month`,
`youtube-break-even-math`, `why-most-youtube-strategies-fail`, `when-youtube-doesnt-work`,
`youtube-views-but-no-leads`, `is-youtube-worth-it-for-business`,
`youtube-b2b-buyer-journey-data`, `high-intent-topic-research-framework`,
`search-intent-youtube-seo-power`, `youtube-vs-paid-ads-b2b`,
`youtube-marketing-attribution`, `youtube-roi-for-saas`, `youtube-sales-funnel`,
`youtube-script-writing-guide`, `is-vidiq-worth-it-for-business`,
`ai-tools-for-youtube`, `best-youtube-rank-checker-tools-for-business`

Do not proceed until the user confirms or amends this list.

- [ ] **Step 2: Read each source post before writing its tweet**

For each slug, read `src/data/post/<slug>.md` or `.mdx` in full. Extract the single
strongest separable idea: a counterintuitive claim, a specific number, or a reframe.
One tweet per post, best idea only. Do not summarise the article.

Voice reference: the existing `xPost` fields in `scripts/linkedin-agent/queue.json`.
Short declarative lines, line breaks between beats, no hashtags, no links, no emoji.

- [ ] **Step 3: Assign weekday dates**

First slot is the next weekday the user approves. Dates must be strictly future,
weekdays only, one post per date, ascending. Confirm each date's weekday:

```bash
for d in 2026-07-23 2026-07-24 2026-07-27; do echo "$d $(date -d $d +%A)"; done
```

- [ ] **Step 4: Validate the whole batch before showing it**

```bash
node -e "
import('./scripts/x-agent/validate-x-post.js').then(m => {
  const q = require('./scripts/x-agent/x-queue.json');
  const seen = [];
  let bad = 0;
  for (const p of q) {
    const r = m.validateXPost(p, seen);
    if (!r.ok) { bad++; console.log(p.scheduledDate, '->', r.reasons.join('; ')); }
    seen.push((p.xPost || '').split('\n')[0].trim());
  }
  console.log(bad === 0 ? 'ALL ' + q.length + ' VALID' : bad + ' INVALID');
  if (bad) process.exit(1);
});
"
```

Expected: `ALL 20 VALID`.

- [ ] **Step 5: Show the batch to the user for review**

Present all 20 with date, source slug, character count, and body. Do not schedule
anything until the user approves. Expect revision rounds on copy.

- [ ] **Step 6: Schedule, then verify**

```bash
npm run x:schedule
npm run x:verify
```

Expected: 20 scheduled, then `[verify-x] 20/20 queued posts confirmed on Zernio.` and `All clear.`

If `x:verify` reports problems, stop and investigate before touching anything else.

- [ ] **Step 7: Commit**

```bash
git add scripts/x-agent/x-queue.json scripts/x-agent/x-history.json
git commit -m "content(social): add X blog-repurpose batch 1"
```

---

## Open items deliberately out of scope

- **LinkedIn remains dark.** No vendor chosen. `scripts/linkedin-agent/` is untouched.
- **`linkedin-schedule.js` aborts X cross-posting when its Zernio call throws** (`linkedin-schedule.js:372-406`). Harmless while that stream is parked, but it must be fixed before that script is ever run again.
- **Corpus exhaustion.** One tweet per blog post burns roughly 60 posts in three months. Decide by October whether to re-mine at a different angle, drop cadence, or widen the source set.
- **Jul 30 has no X post** on either vendor. upload-post quota is exhausted until Aug 20. Coverable by this stream once batch 1 is live, if the user wants it backfilled.
