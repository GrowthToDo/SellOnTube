# X (Twitter) streams

`@SellOnTube` is written to by **two independent streams**. They must never share a slot.

| Stream | Vendor for the X post | Slot | Source material | Cycle resets |
|---|---|---|---|---|
| LinkedIn repurpose (parked) | upload-post | 13:30 UTC | `scripts/linkedin-agent/queue.json` | day 20 |
| Blog repurpose | Zernio | 20:00 UTC | `scripts/x-agent/x-queue.json` | day 22 |

Both streams post link-free copy. upload-post strips URLs from X on the free tier; the Zernio stream omits them by choice, because X suppresses reach on posts carrying outbound links.

The two slots are 6.5 hours apart. That gap is load-bearing, not cosmetic: both vendors publish to the same account, so a shared instant is a visible double-post to real followers.

### The two streams share one Zernio budget

Read this before un-parking the LinkedIn stream. The quotas are **not** separate per stream:

- **Zernio: 20 uploads per cycle, shared.** The blog stream spends it on X. The LinkedIn stream's LinkedIn leg POSTs to the same `zernio.com/api/v1/posts` with the same `ZERNIO_API_KEY`, so every LinkedIn post it schedules comes out of the *same* 20. Un-park LinkedIn while assuming a separate budget and it will quietly starve the X batch: `x-schedule.js` will find a smaller `remaining` and defer the overflow.
- **upload-post: 10 per cycle, separate.** Only the LinkedIn stream's X cross-post leg draws on this one.

## Environment

Both live in `.env` at the repo root (gitignored, never committed):

| Var | Used by | What it is |
|---|---|---|
| `ZERNIO_API_KEY` | `x-schedule.js`, `verify-x-scheduled.js` | Zernio API bearer token. Both scripts exit 1 if it is missing. |
| `ZERNIO_X_ACCOUNT_ID` | `x-schedule.js`, `verify-x-scheduled.js` | The connected `@SellOnTube` X account on Zernio. `x-schedule.js` will not run without it. `x:verify` uses it to check that one account's health; leave it blank and every twitter account on the key is checked instead. If it is set but Zernio does not list it, that is reported as a problem rather than passing quietly. |

## Running the Zernio stream

```bash
npm run x:schedule   # validate + schedule everything in x-queue.json
npm run x:verify     # reconcile against Zernio's actual server state
npm run x:test       # unit tests
```

### What `x:schedule` does

1. **Rejects the whole batch on a duplicate `scheduledDate`.** Two queue entries on one date resolve to the identical 20:00 UTC instant, which is a double-post to real followers. A malformed queue is never partially shipped: the run exits 1 and schedules nothing.
2. **Skips dates already in `x-history.json` as `scheduled`.** Re-running after a partial failure, or next cycle when quota refills, must not re-send work that already went out. If a queued date is taken but the queued `sourceSlug` differs from the history row, that is reported as a loud `MISMATCH` (the new content will never ship on that date) instead of a bland `ALREADY`.
3. **Preflights quota** and defers overflow, naming each deferred entry.
4. **Validates, then schedules, then records.** An invalid post costs no quota and never steals a slot from a later valid one.

### What `x:verify` checks

**Always run `x:verify` after `x:schedule`.**

A 200 response at schedule time does not mean a post will publish. On 2026-07-20 a LinkedIn account was deactivated vendor-side one minute after its first scheduled publish fired. The scheduler had already recorded all 10 posts as `scheduled` on the strength of their HTTP 200s, so ten days of posts died silently with nothing to surface it. `verify-x-scheduled.js` closes that gap by comparing what we actually told Zernio against what Zernio actually holds. It exits non-zero on any discrepancy:

- **Account health.** The bound X account being inactive on Zernio, or missing entirely from Zernio's account list, is a problem. This is the check that would have caught the 2026-07-20 incident.
- **Missing.** A row recorded as `scheduled` locally that Zernio does not hold.
- **Duplicate.** More than one Zernio post on a single scheduled date. Reachable in practice: a POST can commit vendor-side and still throw locally (response timeout, malformed JSON), leaving no history row and inviting an operator to re-run that date.
- **Orphan.** A future Zernio post with no matching `scheduled` history row. Already-published posts and past instants are expected residue of previous batches and are not reported.
- **Wrong slot, bad status, unparseable date.** Anything not sitting at 20:00 UTC in a healthy state.

It reconciles against `x-history.json` (what was really handed to the vendor), **not** `x-queue.json` (intent). Reconciling against the queue made it report false `not found` for quota-deferred entries and false `orphan` for everything already published, so it went permanently red after the first batch. A check that cries wolf stops being read, which is precisely how the LinkedIn stream died unnoticed for ten days. Queue entries with no history row are printed as informational, never as problems.

## Quota behaviour

Zernio charges an upload when a post is **scheduled**, not when it publishes, and refunds it on delete. `x-schedule.js` preflights `/api/v1/usage` and defers any overflow to the next cycle rather than half-shipping a batch.

With 20 Zernio slots against roughly 22 weekdays, a full cycle cannot cover every weekday. Nothing picks which weekdays go uncovered: the queue is authored by hand, and whatever exceeds the remaining allowance is deferred and named in the scheduler's output.

## Content rules

Source material is **published** blog posts only, one tweet per post, best idea only. Check `draft:` in the source frontmatter before drafting: a `draft: true` post is not live and must not anchor a repurpose.

Every post is validated by `validate-x-post.js` before scheduling. It hard-fails on: over 280 characters, any URL, any em or en dash, the project's banned-phrase list, a missing `sourceSlug`, a weekend `scheduledDate`, and a hook already used in recent history.

## Files

| Path | Responsibility |
|---|---|
| `scripts/lib/zernio.js` | Shared Zernio API client (paginated `listPosts`; `normalizeAccounts` throws on an unrecognised `/accounts` shape rather than degrading to an empty list) |
| `scripts/x-agent/validate-x-post.js` | Pure validator, no I/O |
| `scripts/x-agent/x-schedule.js` | Reads queue, rejects duplicate dates, skips already-scheduled, preflights quota, schedules, records history |
| `scripts/x-agent/verify-x-scheduled.js` | Reconciles history against server state. `reconcile()` is pure: no I/O, no clock reads |
| `scripts/x-agent/x-queue.json` | The calendar |
| `scripts/x-agent/x-history.json` | What was scheduled, newest first |
