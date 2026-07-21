# Email 1b: Welcome (backfill variant)
Day: 0 (enrollment via scripts/backfill_nurture.py, cohort=backfill)
Audience: backfill cohort only (contacts captured before the sequence existed)
Subject: about that YouTube tool you used
Status: RETIRED 2026-07-20 before ever sending. Email 01 was made cohort-neutral
("earlier today" removed), so backfill contacts enter the same workflow and get 01.
Kept for reference only.
---
Hey there,

You used our {toolLabel} on sellontube.com a while back. Then you heard nothing from us. That's on me. I'm Gautham, I build those tools with two friends, and I'm only now getting my act together on email.

So, a late hello. We study how B2B companies get customers from YouTube. Not views, customers. Everything we learn, we publish. The tools stay free.

Over the next couple of weeks I'll send you a few short emails with the things that have actually worked. First one: the story of a 370-view video that produced 3 paying customers. I'll send it in a few days.

If this isn't useful, unsubscribe below and you won't hear from me again.

Gautham
SellonTube

PS: what are you trying to get out of YouTube for your business? Reply and tell me. I read every one.

---
Paste notes:
- {toolLabel}: backfill script now sends it (mapped from toolName slug); fallback "YouTube tool".
- BACKFILL LIST = CONFIRMED CONTACTS ONLY (double opt-in). Unconfirmed old contacts are excluded.
- Trigger-first opening (before identity) is deliberate for cold readers; mirrors email 7's logic.
- Paragraphs 2-4 identical to email 01 by design: one story to maintain, same email-2 tease.
- Easy-out line phrased differently from email 6's to avoid exact-phrase repeat for this cohort.
