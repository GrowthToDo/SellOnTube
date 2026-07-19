# Email 7: Sunset for non-openers
Day: ~40 (weekday send)
Audience: ONLY contacts with `hasOpened` not true (property set by loops-webhook.ts on any
open/click; Loops has NO native "has not opened" filter — do not look for one)
Subject: last email from me
Status: APPROVED by user 2026-07-19
---
Hey there,

You used one of our free YouTube tools a while back. I'm Gautham, one of the people who build them, and I've sent a few emails since. It looks like they're not what you need right now. No hard feelings, inboxes are brutal.

So, last one. If you'd like one short note a month on B2B YouTube: real numbers, two minutes. Click here and you're in: {{stay_subscribed_url}}

Or just reply with anything. Even one word.

Do nothing, and this is where I quietly stop.

Either way, the tools at sellontube.com/tools stay free.

Gautham
SellonTube

---
Paste notes:
- {{stay_subscribed_url}}: Loops has no native stay-subscribed button. The CLICK is the signal.
  Point the link at the tools page or preference center; define the monthly-campaign audience
  as "engaged OR clicked in email 7". If hyperlinking text instead of a raw URL, anchor text
  = "Keep the monthly note" (never "click here" as anchor).
- Tools URL deliberately NOT hyperlinked (worst-deliverability segment; minimize links).
- A REPLY does not automatically keep them: Gautham sees it and acts manually.
- Do-nothing contacts exit the workflow; stop mailing non-openers (the hygiene this email exists for).
