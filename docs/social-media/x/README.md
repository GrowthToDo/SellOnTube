# X (Twitter) streams

`@SellOnTube` is written to by **two independent streams**. They must never share a slot.

| Stream | Vendor | Slot | Source material | Quota | Cycle resets |
|---|---|---|---|---|---|
| LinkedIn repurpose | upload-post | 13:30 UTC | `scripts/linkedin-agent/queue.json` | 10/mo | day 20 |
| Blog repurpose | Zernio | 20:00 UTC | `scripts/x-agent/x-queue.json` | 20/mo | day 22 |

Both streams post link-free copy. upload-post strips URLs from X on the free tier; the Zernio stream omits them by choice, because X suppresses reach on posts carrying outbound links.

The two slots are 6.5 hours apart. That gap is load-bearing, not cosmetic: both vendors publish to the same account, so a shared instant is a visible double-post to real followers.

## Running the Zernio stream

```bash
npm run x:schedule   # validate + schedule everything in x-queue.json
npm run x:verify     # reconcile against Zernio's actual server state
npm run x:test       # unit tests
```

**Always run `x:verify` after `x:schedule`.**

A 200 response at schedule time does not mean a post will publish. On 2026-07-20 a LinkedIn account was deactivated vendor-side one minute after its first scheduled publish fired. The scheduler had already recorded all 10 posts as `scheduled` on the strength of their HTTP 200s, so ten days of posts died silently with nothing to surface it. `verify-x-scheduled.js` is the check that closes that gap: it compares local intent against what Zernio actually holds and exits non-zero on any discrepancy.

## Quota behaviour

Zernio charges an upload when a post is **scheduled**, not when it publishes, and refunds it on delete. `x-schedule.js` preflights `/api/v1/usage` and defers any overflow to the next cycle rather than half-shipping a batch.

With 20 slots against roughly 22 weekdays, two weekdays per cycle go uncovered. The scheduler names them in its output rather than dropping them silently.

## Content rules

Source material is **published** blog posts only, one tweet per post, best idea only. Check `draft:` in the source frontmatter before drafting: a `draft: true` post is not live and must not anchor a repurpose.

Every post is validated by `validate-x-post.js` before scheduling. It hard-fails on: over 280 characters, any URL, any em or en dash, the project's banned-phrase list, a missing `sourceSlug`, a weekend `scheduledDate`, and a hook already used in recent history.

## Files

| Path | Responsibility |
|---|---|
| `scripts/lib/zernio.js` | Shared Zernio API client (paginated `listPosts`) |
| `scripts/x-agent/validate-x-post.js` | Pure validator, no I/O |
| `scripts/x-agent/x-schedule.js` | Reads queue, preflights quota, schedules, records history |
| `scripts/x-agent/verify-x-scheduled.js` | Reconciles intent against server state |
| `scripts/x-agent/x-queue.json` | The calendar |
| `scripts/x-agent/x-history.json` | What was scheduled, newest first |
