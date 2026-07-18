# LinkedIn Brand-Presence Engine — Step 1 (Spine) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship the hands-off LinkedIn posting spine — `firstComment` links, a mechanical validation gate, the two evidence banks, the updated queue schema, and agent 09 rewritten to follow the writing guideline — so a batch of thesis-first posts can be generated and scheduled to the SellonTube company page via Zernio.

**Architecture:** Extend the existing `scripts/linkedin-agent/linkedin-schedule.js` (ESM, zero-dependency Node) additively: `buildPayload` gains `firstComment`; a new pure `validatePost()` is the last-line assert; the schedule loop skips+reports failing posts. Two JSON data files hold real, verified facts the generator may cite. Agent 09 becomes a thin runner pointing at `docs/social-media/linkedin/linkedin-writing-guideline.md`.

**Tech Stack:** Node.js ESM (`import`/`export`), built-in `assert` for tests (existing pattern in `linkedin-schedule.test.js`), Zernio REST API, no new npm dependencies in Step 1.

## Global Constraints

- **No new dependencies in Step 1.** `sharp`/`@resvg` (takeaway cards) and the authority-lesson post type are **deferred to Step 1.5** — out of scope here.
- **ESM only** — `import`/`export`, matching the existing file.
- **No em dashes (`—`) or en dashes (`–`)** anywhere in generated post copy (site style rule).
- **Zernio payload shape:** top-level `content`, `timezone: 'Asia/Kolkata'`, `platforms: [{platform:'linkedin', accountId}]`, plus `scheduledFor` (9 AM IST = `T03:30:00Z`) OR `publishNow`, optional `firstComment` (string), optional `mediaItems: [{url, type:'image'}]`.
- **No fabricated facts.** Every entry in the evidence banks must be a real, verified stat/video with a real source URL. If it can't be verified, it does not go in the bank. Cited wording stays faithful to the source.
- **Character range for a post body:** 900–1,700.
- **`linkLocation` values:** `"comment"` (SellonTube link → first comment), `"body"` (authority-lesson video URL in body — Step 1.5, so not produced yet but the validator must handle it), or `null` (no link).
- **Never delegate `scheduledDate`/publish timing to a subagent** — the main thread sets dates (Zernio `scheduledFor`, not Astro, so no 404 risk, but keep date logic in the tested helper).
- Canonical writing rules live in `docs/social-media/linkedin/linkedin-writing-guideline.md`; agent 09 follows it verbatim.

---

### Task 1: `firstComment` support in `buildPayload` + reconcile stale tests

**Files:**
- Modify: `scripts/linkedin-agent/linkedin-schedule.js` (the `buildPayload` function, ~lines 40-55)
- Modify: `scripts/linkedin-agent/linkedin-schedule.test.js` (align image assertions with real `mediaItems` shape; add `firstComment` tests)

**Interfaces:**
- Consumes: existing `buildScheduledFor(dateStr) -> string`.
- Produces: `buildPayload(post, accountId, zernioImageUrl?) -> payload` where `payload.firstComment` is set iff `post.firstComment` is a non-empty string; `payload.mediaItems` is set iff `zernioImageUrl` is truthy.

- [ ] **Step 1: Fix the stale image test + add firstComment failing tests.** Replace the three `mediaUrls` tests (they assert a shape the code never produces) with `mediaItems` tests that pass `zernioImageUrl`, and add `firstComment` tests. In `linkedin-schedule.test.js`, replace the block from `test('buildPayload: includes mediaUrls when imageUrl is present'...)` through the end of the `buildPayload` tests with:

```js
test('buildPayload: includes mediaItems when zernioImageUrl is passed', () => {
  const payload = buildPayload(basePost, 'acc_test123', 'https://zernio.com/media/abc.png');
  assert.deepStrictEqual(payload.mediaItems, [{ url: 'https://zernio.com/media/abc.png', type: 'image' }]);
});

test('buildPayload: omits mediaItems when no zernioImageUrl', () => {
  const payload = buildPayload(basePost, 'acc_test123');
  assert.strictEqual(payload.mediaItems, undefined);
});

test('buildPayload: includes firstComment when post.firstComment is set', () => {
  const post = { ...basePost, firstComment: 'Full method: https://sellontube.com/x?utm_source=linkedin' };
  const payload = buildPayload(post, 'acc_test123');
  assert.strictEqual(payload.firstComment, post.firstComment);
});

test('buildPayload: omits firstComment when post.firstComment is null', () => {
  const post = { ...basePost, firstComment: null };
  const payload = buildPayload(post, 'acc_test123');
  assert.strictEqual(payload.firstComment, undefined);
});

test('buildPayload: omits firstComment when post.firstComment is empty string', () => {
  const post = { ...basePost, firstComment: '' };
  const payload = buildPayload(post, 'acc_test123');
  assert.strictEqual(payload.firstComment, undefined);
});
```

- [ ] **Step 2: Run tests, verify the firstComment tests fail.**

Run: `node scripts/linkedin-agent/linkedin-schedule.test.js`
Expected: the 3 `firstComment` tests FAIL (`payload.firstComment` is undefined when set); `mediaItems` tests PASS (code already sets `mediaItems`).

- [ ] **Step 3: Add the `firstComment` line to `buildPayload`.** In `linkedin-schedule.js`, inside `buildPayload`, immediately before `return payload;`, add:

```js
  if (post.firstComment) {
    payload.firstComment = post.firstComment;
  }
```

- [ ] **Step 4: Run tests, verify all pass.**

Run: `node scripts/linkedin-agent/linkedin-schedule.test.js`
Expected: all PASS, `0 failed`.

- [ ] **Step 5: Commit.**

```bash
git add scripts/linkedin-agent/linkedin-schedule.js scripts/linkedin-agent/linkedin-schedule.test.js
git commit -m "feat(linkedin): add firstComment to Zernio payload, fix stale mediaItems tests"
```

---

### Task 2: `validatePost()` mechanical assert (pure, tested)

**Files:**
- Create: `scripts/linkedin-agent/validate-post.js`
- Test: `scripts/linkedin-agent/validate-post.test.js`

**Interfaces:**
- Produces: `validatePost(post, recentHooks = []) -> { ok: boolean, reasons: string[] }`. `post` has `{ linkedinPost, linkLocation, firstComment, hashtags }`. `recentHooks` is an array of first-line strings from history for dedup. `ok` is true only when `reasons` is empty.

- [ ] **Step 1: Write the failing tests.** Create `scripts/linkedin-agent/validate-post.test.js`:

```js
import assert from 'assert';
import { validatePost } from './validate-post.js';

let passed = 0, failed = 0;
function test(name, fn) {
  try { fn(); console.log(`  PASS  ${name}`); passed++; }
  catch (e) { console.error(`  FAIL  ${name}`); console.error(`         ${e.message}`); failed++; }
}

const good = {
  linkedinPost: 'A'.repeat(1000),
  linkLocation: null,
  firstComment: null,
  hashtags: ['#YouTubeSEO'],
};

test('passes a clean no-link post', () => {
  const r = validatePost(good);
  assert.strictEqual(r.ok, true, r.reasons.join('; '));
});

test('fails when too short', () => {
  const r = validatePost({ ...good, linkedinPost: 'short' });
  assert.strictEqual(r.ok, false);
  assert.ok(r.reasons.some(x => x.includes('length')));
});

test('fails when too long', () => {
  const r = validatePost({ ...good, linkedinPost: 'A'.repeat(1800) });
  assert.strictEqual(r.ok, false);
  assert.ok(r.reasons.some(x => x.includes('length')));
});

test('fails on em dash', () => {
  const r = validatePost({ ...good, linkedinPost: 'A'.repeat(999) + '—' });
  assert.strictEqual(r.ok, false);
  assert.ok(r.reasons.some(x => x.includes('dash')));
});

test('fails on banned phrase', () => {
  const r = validatePost({ ...good, linkedinPost: 'In today’s digital landscape ' + 'A'.repeat(980) });
  assert.strictEqual(r.ok, false);
  assert.ok(r.reasons.some(x => x.includes('banned')));
});

test('comment link: needs firstComment and no URL in body', () => {
  const bad = { ...good, linkLocation: 'comment', firstComment: null };
  assert.strictEqual(validatePost(bad).ok, false);
  const bodyUrl = { ...good, linkLocation: 'comment', firstComment: 'x', linkedinPost: 'see https://x.com ' + 'A'.repeat(980) };
  assert.strictEqual(validatePost(bodyUrl).ok, false);
  const ok = { ...good, linkLocation: 'comment', firstComment: 'Full: https://sellontube.com/x' };
  assert.strictEqual(validatePost(ok).ok, true, validatePost(ok).reasons.join('; '));
});

test('null link: no URL in body and no firstComment', () => {
  const urlInBody = { ...good, linkedinPost: 'go https://x.com ' + 'A'.repeat(985) };
  assert.strictEqual(validatePost(urlInBody).ok, false);
  const hasComment = { ...good, firstComment: 'https://x.com' };
  assert.strictEqual(validatePost(hasComment).ok, false);
});

test('body link (authority-lesson): URL in body, no firstComment', () => {
  const ok = { ...good, linkLocation: 'body', firstComment: null, linkedinPost: 'watch https://youtube.com/watch?v=x ' + 'A'.repeat(960) };
  assert.strictEqual(validatePost(ok).ok, true, validatePost(ok).reasons.join('; '));
  const noUrl = { ...good, linkLocation: 'body' };
  assert.strictEqual(validatePost(noUrl).ok, false);
});

test('fails on more than 3 hashtags', () => {
  const r = validatePost({ ...good, hashtags: ['#a', '#b', '#c', '#d'] });
  assert.strictEqual(r.ok, false);
  assert.ok(r.reasons.some(x => x.includes('hashtag')));
});

test('fails on duplicate hook vs recent history', () => {
  const post = { ...good, linkedinPost: 'Your subscriber count is useless.\n' + 'A'.repeat(980) };
  const r = validatePost(post, ['Your subscriber count is useless.']);
  assert.strictEqual(r.ok, false);
  assert.ok(r.reasons.some(x => x.includes('dedup') || x.includes('hook')));
});

console.log(`\n${passed} passed, ${failed} failed`);
if (failed > 0) process.exit(1);
```

- [ ] **Step 2: Run to verify it fails.**

Run: `node scripts/linkedin-agent/validate-post.test.js`
Expected: FAIL with "Cannot find module './validate-post.js'" (or all tests error).

- [ ] **Step 3: Write the implementation.** Create `scripts/linkedin-agent/validate-post.js`:

```js
// scripts/linkedin-agent/validate-post.js
// Pure last-line assert for a generated LinkedIn post. Returns {ok, reasons}.
// This is the mechanical safety net behind hands-off publishing; the real
// quality work happens in generation (see docs/social-media/linkedin/).

const BANNED = [
  'in today’s', "in today's", 'game-chang', 'unlock the power',
  'here are 5', 'here are five', 'dive into', 'leverage', 'delve',
  'take your channel to the next level', 'the future is',
];
const URL_RE = /https?:\/\//i;
const DASH_RE = /[—–]/; // em dash, en dash

export function validatePost(post, recentHooks = []) {
  const reasons = [];
  const body = post.linkedinPost || '';
  const len = body.length;

  if (len < 900 || len > 1700) {
    reasons.push(`length ${len} outside 900-1700`);
  }
  if (DASH_RE.test(body)) {
    reasons.push('contains em/en dash');
  }
  const lower = body.toLowerCase();
  for (const phrase of BANNED) {
    if (lower.includes(phrase)) { reasons.push(`banned phrase: "${phrase}"`); }
  }

  const hashtags = post.hashtags || [];
  if (hashtags.length > 3) {
    reasons.push(`hashtag count ${hashtags.length} > 3`);
  }

  const hasBodyUrl = URL_RE.test(body);
  const hasComment = Boolean(post.firstComment);
  switch (post.linkLocation) {
    case 'comment':
      if (!hasComment) reasons.push('linkLocation=comment but firstComment missing');
      if (hasBodyUrl) reasons.push('linkLocation=comment but body contains a URL');
      break;
    case 'body':
      if (!hasBodyUrl) reasons.push('linkLocation=body but body has no URL');
      if (hasComment) reasons.push('linkLocation=body but firstComment is set');
      break;
    case null:
    case undefined:
      if (hasBodyUrl) reasons.push('no-link post but body contains a URL');
      if (hasComment) reasons.push('no-link post but firstComment is set');
      break;
    default:
      reasons.push(`unknown linkLocation: ${post.linkLocation}`);
  }

  const hook = body.split('\n')[0].trim();
  if (hook && recentHooks.some((h) => h.trim() === hook)) {
    reasons.push('dedup: hook already used in recent history');
  }

  return { ok: reasons.length === 0, reasons };
}
```

- [ ] **Step 4: Run to verify pass.**

Run: `node scripts/linkedin-agent/validate-post.test.js`
Expected: all PASS, `0 failed`.

- [ ] **Step 5: Mutation-test the checker (per project rule: break it, confirm it fails).** Temporarily change `len < 900` to `len < 0` in `validate-post.js`, re-run the test, confirm the "too short" test now FAILS (proving the check is live), then revert.

Run: `node scripts/linkedin-agent/validate-post.test.js`
Expected after mutation: the "fails when too short" test FAILS. After revert: all PASS.

- [ ] **Step 6: Commit.**

```bash
git add scripts/linkedin-agent/validate-post.js scripts/linkedin-agent/validate-post.test.js
git commit -m "feat(linkedin): add validatePost mechanical assert with tests"
```

---

### Task 3: Wire `validatePost` into the schedule flow (skip + report)

**Files:**
- Modify: `scripts/linkedin-agent/linkedin-schedule.js` (imports; the `main()` per-post loop; `saveToHistory`)

**Interfaces:**
- Consumes: `validatePost(post, recentHooks)` from Task 2; existing `saveToHistory(post)`.
- Produces: schedule flow that validates each queued post before any Zernio call; a failing post is skipped and reported, the rest publish.

- [ ] **Step 1: Import validatePost and load recent hooks.** At the top of `linkedin-schedule.js`, add after the existing imports:

```js
import { validatePost } from './validate-post.js';
```

Inside `main()`, after the queue is loaded and before the `for (const post of queue)` loop, build the recent-hooks list from history:

```js
  let recentHooks = [];
  try {
    const hist = JSON.parse(readFileSync(join(__dirname, 'linkedin-history.json'), 'utf8'));
    recentHooks = (hist.posts || []).map((p) => (p.hook || '').trim()).filter(Boolean);
  } catch { /* no history yet */ }
```

- [ ] **Step 2: Validate at the top of the per-post loop.** As the first statements inside `for (const post of queue) {`, before the image upload, add:

```js
    const check = validatePost(post, recentHooks);
    if (!check.ok) {
      console.error(`  SKIPPED    ${label}`);
      console.error(`             failed validation: ${check.reasons.join('; ')}\n`);
      failCount++;
      continue;
    }
```

(`label` is already defined at the top of the loop body in the existing code.)

- [ ] **Step 3: Record archetype + linkLocation in history.** In `saveToHistory`, in the object pushed to `history.posts.unshift({...})`, add these fields alongside the existing ones:

```js
    archetype: post.archetype ?? null,
    linkLocation: post.linkLocation ?? null,
    thesis: post.thesis ?? null,
```

- [ ] **Step 4: Manual smoke test with a crafted queue.** Temporarily create a 2-post `queue.json` (one valid no-link post ≥900 chars, one invalid post with an em dash), run the scheduler in a dry way by setting a fake env so the Zernio call is not reached for the invalid one. Since a real POST needs live creds, instead assert the validation branch by running:

```bash
node -e "import('./scripts/linkedin-agent/validate-post.js').then(({validatePost})=>{console.log(validatePost({linkedinPost:'A'.repeat(50),linkLocation:null,hashtags:[]}))})"
```

Expected: prints `{ ok: false, reasons: [ 'length 50 outside 900-1700' ] }`.

- [ ] **Step 5: Commit.**

```bash
git add scripts/linkedin-agent/linkedin-schedule.js
git commit -m "feat(linkedin): validate each post before scheduling; skip+report failures"
```

---

### Task 4: queue.json schema update (thesis + linkLocation)

**Files:**
- Modify: `scripts/linkedin-agent/queue.json` (replace the stale single-post example with the new schema shape, empty-ready for generation)

**Interfaces:**
- Produces: the canonical `queue.json` shape every generated post follows: `{ scheduledDate, dayOfWeek, archetype, thesis, linkLocation, sourceTitle, sourceUrl, imageUrl, firstComment, postAngle, linkedinPost, hashtags }`.

- [ ] **Step 1: Replace queue.json with a schema-accurate empty array plus a commented example.** Since JSON has no comments, write a two-entry array showing one no-link and one comment-link post as the reference shape (this file is regenerated each batch; keeping a reference shape is fine):

```json
[
  {
    "scheduledDate": "2026-07-20",
    "dayOfWeek": "Monday",
    "archetype": "framework",
    "thesis": "After this post, a marketer can sort their videos into get-found vs get-chosen and fix the missing half.",
    "linkLocation": null,
    "sourceTitle": null,
    "sourceUrl": null,
    "imageUrl": null,
    "firstComment": null,
    "postAngle": "Every video does one of two jobs: get found or get chosen.",
    "linkedinPost": "REPLACED_AT_GENERATION",
    "hashtags": ["#YouTubeMarketing"]
  },
  {
    "scheduledDate": "2026-07-21",
    "dayOfWeek": "Tuesday",
    "archetype": "tactical-how-to",
    "thesis": "After this post, a marketer can reverse-engineer a competitor's best videos to find proven buyer-intent topics.",
    "linkLocation": "comment",
    "sourceTitle": "YouTube Competitor Analysis",
    "sourceUrl": "https://sellontube.com/tools/youtube-competitor-analysis",
    "imageUrl": "https://sellontube.com/og/competitor.jpg",
    "firstComment": "https://sellontube.com/tools/youtube-competitor-analysis?utm_source=linkedin&utm_medium=social&utm_campaign=brand-presence",
    "postAngle": "Your competitor already tested your next 20 topics.",
    "linkedinPost": "REPLACED_AT_GENERATION",
    "hashtags": ["#B2BMarketing"]
  }
]
```

- [ ] **Step 2: Validate the JSON parses.**

Run: `node -e "console.log(JSON.parse(require('fs').readFileSync('scripts/linkedin-agent/queue.json','utf8')).length)"`
Expected: `2`.

- [ ] **Step 3: Commit.**

```bash
git add scripts/linkedin-agent/queue.json
git commit -m "chore(linkedin): update queue.json to thesis+linkLocation schema"
```

---

### Task 5: Evidence banks (real, verified facts only)

**Files:**
- Create: `scripts/linkedin-agent/authority-evidence-bank.json`
- Create: `scripts/linkedin-agent/curated-video-bank.json`

**Interfaces:**
- Produces: `authority-evidence-bank.json` = array of `{ stat, source, url, context }` (≥30 entries). `curated-video-bank.json` = array of `{ channel, title, url, lesson, b2b_application, linkedin_profile, is_person }` (≥6 entries).

**CRITICAL:** every entry must be a real, verifiable fact/video. Research each with the `/browse` skill, confirm the number and source, and record the real URL. If a fact can't be verified, drop it. No fabrication. Cited wording stays faithful to the source.

- [ ] **Step 1: Research and record ≥30 authority stats.** Using `/browse`, gather real, sourced stats relevant to YouTube-for-B2B-acquisition (e.g. Think with Google on video + purchase decisions; Gartner on B2B buyers self-researching; Ahrefs on search intent vs volume; Wyzowl video marketing report; YouTube as the 2nd-largest search engine). For each, verify the exact figure on the source page and capture the URL. Write `authority-evidence-bank.json`:

```json
[
  { "stat": "<exact figure as the source states it>", "source": "<publisher>", "url": "<real source URL>", "context": "<when this fact applies>" }
]
```

- [ ] **Step 2: Verify the bank JSON parses and has ≥30 entries.**

Run: `node -e "const a=JSON.parse(require('fs').readFileSync('scripts/linkedin-agent/authority-evidence-bank.json','utf8')); console.log(a.length); a.forEach(e=>{if(!e.stat||!e.source||!e.url)throw new Error('incomplete entry')})"`
Expected: a number `>= 30`, no error.

- [ ] **Step 3: Research and record ≥6 curated videos.** Using `/browse`, find real videos from complementary + authoritative voices teaching YouTube-for-business growth (Ahrefs, StarterStory/Pat Walls, Ayman Arab, similar). For each, capture the real video URL, the one real lesson it teaches, and the author's LinkedIn profile (person-first). Write `curated-video-bank.json`:

```json
[
  { "channel": "Ahrefs", "title": "<real title>", "url": "<real video URL>", "lesson": "<the one real lesson>", "b2b_application": "<how a B2B team applies it>", "linkedin_profile": "<real LinkedIn URL>", "is_person": false }
]
```

- [ ] **Step 4: Verify the video bank JSON parses and has ≥6 entries.**

Run: `node -e "const a=JSON.parse(require('fs').readFileSync('scripts/linkedin-agent/curated-video-bank.json','utf8')); console.log(a.length); a.forEach(e=>{if(!e.url||!e.lesson)throw new Error('incomplete entry')})"`
Expected: a number `>= 6`, no error.

- [ ] **Step 5: Commit.**

```bash
git add scripts/linkedin-agent/authority-evidence-bank.json scripts/linkedin-agent/curated-video-bank.json
git commit -m "feat(linkedin): add authority-evidence and curated-video banks (real, verified)"
```

---

### Task 6: Rewrite agent 09 as a thin runner over the guideline

**Files:**
- Modify: `agents/09-linkedin-writer.md` (full rewrite)

**Interfaces:**
- Produces: an agent doc whose process is: read guideline + history + banks → for each post: thesis → validate thesis → choose structure → draft (voice) → hook-check → self-critique → humanizer → write to queue.json with the Task 4 schema → run `validatePost` mentally → present batch. Points to `docs/social-media/linkedin/linkedin-writing-guideline.md` as canonical; does not restate rules.

- [ ] **Step 1: Rewrite `agents/09-linkedin-writer.md`** so it: (a) states its trigger ("generate next batch of LinkedIn posts" / "refill"); (b) instructs reading `docs/social-media/linkedin/linkedin-writing-guideline.md` (canonical), `linkedin-history.json` (dedup), and both evidence banks; (c) describes the batch (2 weeks = up to 10 first run, then 4 weeks = up to 20; the 2 SellonTube-link + 2 source-named + 1 flex weekly mix; ceiling-not-quota — drop rubric failures); (d) the per-post pipeline (thesis → 4 gates → structure → draft → hook-check → self-critique → humanizer); (e) writing the Task-4 `queue.json` shape including `thesis` and `linkLocation`; (f) main-thread sets `scheduledDate` (Mon-Fri, 9 AM IST), never a subagent; (g) after writing queue.json, instruct running `node scripts/linkedin-agent/linkedin-schedule.js`; (h) refresh the evidence banks as the first refill step. Do NOT restate the writing rules — point to the guideline.

- [ ] **Step 2: Cross-check the agent doc references resolve.**

Run: `node -e "const fs=require('fs'); ['docs/social-media/linkedin/linkedin-writing-guideline.md','scripts/linkedin-agent/authority-evidence-bank.json','scripts/linkedin-agent/curated-video-bank.json','scripts/linkedin-agent/linkedin-schedule.js'].forEach(p=>{if(!fs.existsSync(p))throw new Error('missing '+p); console.log('ok '+p)})"`
Expected: `ok` for all four paths.

- [ ] **Step 3: Commit.**

```bash
git add agents/09-linkedin-writer.md
git commit -m "docs(linkedin): rewrite agent 09 as thin runner over the writing guideline"
```

---

## Self-Review

**Spec coverage (Step-1 items):** firstComment → Task 1 ✓ · mechanical assert → Task 2 ✓ · skip-not-abort flow → Task 3 ✓ · history records archetype/linkLocation/thesis → Task 3 ✓ · queue schema (thesis + linkLocation) → Task 4 ✓ · evidence banks (real facts) → Task 5 ✓ · agent 09 thin runner → Task 6 ✓. Deferred correctly: takeaway cards + authority-lesson posting (Step 1.5), X/Twitter (out of scope), cloud-cron trigger (Phase 2).

**Placeholder scan:** `REPLACED_AT_GENERATION` in Task 4 is an intentional data placeholder in a regenerated file, not a plan gap; the actual post text is produced by agent 09 at generation time (Task 6), not authored in this plan. Bank entries in Task 5 are researched at execution (real data can't be hand-authored in a plan); the schema + verification commands are concrete.

**Type consistency:** `validatePost(post, recentHooks)` signature and `{ ok, reasons }` return shape are identical in Tasks 2 and 3. `buildPayload(post, accountId, zernioImageUrl)` matches the existing signature. `linkLocation` values (`comment`/`body`/null) are consistent across Tasks 2, 3, 4. `firstComment` handling consistent across Tasks 1, 2, 3.

**Not verifiable in-plan (flag for execution):** that Zernio actually renders `firstComment` as a real comment on a LinkedIn company page, and accepts `firstComment` as a top-level field — confirm on the first live post (spec's open assumption). This is why the first batch is 2 weeks, and why publishing is validated live before scaling to 4-week batches.
