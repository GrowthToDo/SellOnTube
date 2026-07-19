# Loops Email Nurture: Setup Guide (user-side steps)

Everything the code cannot do for you. Work top to bottom; each step says why it exists.
Code side (already in repo): `capture-email.ts` fires `nurture_start` per tool signup,
`cal-booking.ts` marks call bookers, `loops-webhook.ts` marks contacts who open/click
(powers the sunset filter), `scripts/backfill_nurture.py` enrolls old contacts.
Copy: `docs/email/`. All emails user-approved 2026-07-19.

Standing rules: educational tone, Loops FREE plan only (1,000 contacts, 4,000 sends/30d).
Weekday-only: accepted as best-effort for now (Loops timers cannot pin days of week);
revisit if weekend sends underperform. List size ~<100, so quota and warm-up are non-issues.

Decisions locked 2026-07-19: FROM `Gautham <gautham@mail.sellontube.com>`, Reply-To
`sellontubemail@gmail.com`, Google Workspace mail stays completely untouched.

---

## 0. Create custom properties FIRST (blocking, 3 min)

Why: properties sent via API that were never defined in Loops are silently dropped
(the API still returns 200). Nothing downstream works without this.

Loops → Audience → property manager → add:
- [ ] `toolName` (String)
- [ ] `toolLabel` (String)
- [ ] `cohort` (String)
- [ ] `bookedCall` (Boolean)
- [ ] `hasOpened` (Boolean)

Also: Loops → Events (or the trigger node's "Edit event properties") → confirm the
`nurture_start` event lists `toolName` and `toolLabel` as event properties once the first
test event arrives (step 7). If they are missing, add them there.

## 1. Audit (5 min)

- [ ] Loops → Audience: exact contact count (assumed <100).
- [ ] Netlify → Environment variables: `LOOPS_API_KEY` exists.
- [ ] Note: double opt-in only gates FORM signups. All our contacts arrive via API and
      bypass it, so the confirmation email rarely/never sends today. Keep the toggle ON
      and the copy in `docs/email/double-opt-in.md` pasted anyway (Loops may gate API
      contacts later; their docs say "not yet").

## 2. DNS: two additions, ZERO changes (do early, propagation can take hours)

Google Workspace runs your real mail on sellontube.com. DO NOT touch MX records or the
existing Google SPF record. Only ADD:

- [ ] Loops → Settings → Domain: enter `mail.sellontube.com`. Loops shows account-specific
      records (SPF TXT + MX at `envelope.mail.sellontube.com`, 3 DKIM CNAMEs under
      `mail.sellontube.com`). Add each in Cloudflare DNS exactly as shown, each set to
      **"DNS only" (grey cloud)** — proxying breaks verification.
- [ ] Add one root DMARC record (monitoring only, cannot affect Workspace mail):
      TXT at `_dmarc.sellontube.com` → `v=DMARC1; p=none; rua=mailto:sellontubemail@gmail.com`
- [ ] Wait until Loops shows the domain verified.

Sender identity in Loops: From name "Gautham from SellonTube", From address
`gautham@mail.sellontube.com`, Reply-To `sellontubemail@gmail.com`.
Known accepted gap: mail sent directly TO `gautham@sellontube.com` reaches Workspace only
if that alias exists there; check once if you care, otherwise rely on Reply-To.

## 3. Compliance settings (3 min)

- [ ] Loops → Settings: company physical postal address (CAN-SPAM; Loops prints it in the
      auto footer with the unsubscribe link).
- [ ] Paste `docs/email/double-opt-in.md` copy via Settings → Sending → Email content.

## 4. Loops webhook (5 min) — powers the sunset email

- [ ] Loops → Settings → Webhooks → New: URL `https://sellontube.com/.netlify/functions/loops-webhook`,
      events: **email.opened** and **email.clicked** only.
- [ ] Copy the `whsec_...` signing secret → Netlify env var `LOOPS_WEBHOOK_SECRET`. Redeploy.
- [ ] After first real open, check the function log shows `hasOpened set: <email>`. If it
      logs "No email in payload", tell Claude (payload shape needs one adjustment).

## 5. Build the nurture workflow (Loops → Workflows → New)

Copy: `docs/email/nurture/01…07`. Paste as plain text. Placeholders:
- `{toolLabel}` (emails 01/01b): insert via the event-properties (⚡) button; set fallback
  "YouTube tool". Available after step 7's first test event.
- `{{stay_subscribed_url}}` (email 07): any link works — the CLICK is the stay signal
  (tools page is fine). Anchor text "Keep the monthly note" if hyperlinking.

Structure:
1. Trigger: Event received `nurture_start`, fire **One time** per contact.
2. Audience filter right after trigger: `bookedCall` is not `true`, applied to
   **"All following nodes"** (exact setting; re-checked at every node, mid-sequence
   bookers exit automatically).
3. Cohort branch for the first email only: `cohort` is `live` → email 01;
   `cohort` is `backfill` → email 01b. Merge back after if the builder allows;
   otherwise duplicate 02-07 into both branches (one-time copy-paste).
4. Email 01 timer: 15 minutes after trigger. Sends any day including weekends (approved:
   the just-used-the-tool moment beats the weekday rule for this one email).
5. Emails 02-06 with timers: +3d, +4d, +5d, +6d, +7d. Timers are plain durations
   (no weekday control exists in Loops; drift accepted).
6. Email 07 (sunset): timer +14d after email 06, preceded by audience filter
   `hasOpened` is not `true` ("Next node only" is enough here: it is the last node).
   Everyone else simply exits after email 06.
   Known limitation, accepted: Apple Mail auto-opens emails in the background, so Apple
   users register as `hasOpened` even if they never read anything. Effect: some truly
   dormant Apple users never get the sunset email and stay subscribed. Fail-safe
   direction (nobody engaged gets wrongly sunset), just imperfect pruning.
7. Turn ON only after step 7 passes.

## 6. Cal.com webhook (after next deploy of this branch)

- [ ] Generate a long random secret; Netlify env `CAL_WEBHOOK_SECRET`; redeploy.
- [ ] Cal.com → Settings → Developer → Webhooks → New:
      URL `https://sellontube.com/.netlify/functions/cal-booking`, trigger Booking Created,
      same secret, scoped to the 30-min event type if possible.
- [ ] Test booking with a personal email → function log shows `bookedCall marked`, contact
      in Loops has `bookedCall = true`.

## 7. End-to-end test (before backfill, after workflow built)

- [ ] Submit a tool email gate on the live site with `yourname+test@example.com`
      (safe: Loops does not deliver to example.com, no reputation risk).
- [ ] Check: contact exists with `toolName`, `toolLabel`, `cohort=live`; `nurture_start`
      enrolled it in the workflow; event properties visible in the email editor.
- [ ] Booker-exit test: set `bookedCall = true` on the test contact, confirm it exits at
      the next node.
- [ ] First REAL send (your own inbox): Gmail → "Show original" → confirm `List-Unsubscribe`
      and `List-Unsubscribe-Post` headers exist (undocumented in Loops; verify once).
      Also confirm the unsubscribe footer + postal address render.

## 8. Backfill (after domain verified + workflow ON)

- [ ] Loops → Audience → Download CSV.
- [ ] Optional at <100 contacts: email verification (NeverBounce) — with a list this small
      you can also eyeball-prune obvious junk instead.
- [ ] Dry run: `py scripts/backfill_nurture.py contacts.csv`
- [ ] Small live batch: `py scripts/backfill_nurture.py contacts.csv --live --limit 5`,
      confirm those 5 enter the workflow.
- [ ] Rest in one go: `--live --limit 100` (quota math is trivial at this size).

## 9. Newsletter (monthly, manual campaign)

Format + issue 1: `docs/email/newsletter/`. First week of month, Tue-Thu send.

**Campaign audience (keeps two promises):**
- INCLUDE only `hasOpened` is `true`. This one filter does everything: engaged readers
  qualify, sunset do-nothings are excluded (silence promise kept), and an email-07
  stay-click sets `hasOpened` via the webhook, so stayers qualify automatically.
- Edge case, accepted: someone who merely OPENS email 07 without clicking counts as
  `hasOpened` and gets the newsletter despite "doing nothing". Tiny cohort, low harm,
  unsubscribe link in every issue.
- EXCLUDE contacts still mid-sequence. No reliable relative-date filter is documented;
  at <100 contacts, eyeball the audience before each send (contacts created in the last
  ~40 days are mid-sequence), or ask Claude for an automated property when the list grows.
- Later: exclude active clients.

## 10. Monitor (weekly, 5 min)

- Loops dashboard: sends used, clicks + replies per email (ignore raw opens; Apple inflates).
- Replies arrive at sellontubemail@gmail.com: answer same day, that is the whole play.
- DMARC reports trickle to the same Gmail (from the `rua=` tag); ignore unless asked.
- At <100 contacts, ONE spam complaint breaches Gmail's threshold. If anyone complains,
  tell Claude: we tighten targeting immediately.
- After 60 days: any email under 1% clicks gets a rewrite pass.
