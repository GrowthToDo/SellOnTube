# Brief for Claude for Chrome: build the Loops nurture workflow

Paste everything below this line into Claude for Chrome with the Loops tab open.

---

You are completing a Loops.so email workflow that is already partially created. Work ONLY
inside the workflow named "Nurture sequence" at this URL (already open in a tab):
https://app.loops.so/workflows/cmrsnqrqm0pbu0jzz6orfp349

HARD RULES:
- Do NOT touch any other workflow, campaign, or settings page.
- Do NOT click "Start" / activate the workflow at any point. It must stay in Draft.
- Paste email bodies EXACTLY as given: plain text, keep every line break, do not rephrase,
  do not "improve", do not let the editor turn " - " into an em dash.
- If a described option does not exist in the UI, stop that step and report what you see
  instead of improvising.
- If the workflow name shows a typo ("Nuture sequence"), rename it to "Nurture sequence".

## Step 1: Trigger

The canvas has an "Event received" node showing "No event specified". Click it.
- Event: select `nurture_start`
- Frequency/occurrence: set to fire ONE TIME per contact (option may be labeled
  "One time" vs "Every time").
Save/close the panel.

## Step 2: Audience filter after the trigger

Add an Audience filter node directly after the trigger (before anything else):
- Condition: contact property "Booked Call" (bookedCall) IS NOT true.
- Filter application setting: "All following nodes" (NOT "Next node only").

## Step 3: Email 1

Add an Email node after the filter.
- Subject: quick hello
- Sender settings on this email (look for From/Reply-To fields, possibly under a
  sender/settings tab of the email editor):
  - From name: Gautham from SellonTube
  - From email: gautham@mail.sellontube.com
  - Reply-To: sellontubemail@gmail.com
- Body (paste as plain text; where it says [TOOL_LABEL], delete the placeholder and use
  the editor's event-properties button (lightning-bolt icon) to insert the event property
  `toolLabel`, with fallback text: YouTube tool):

Hey there,

Gautham here. I build the free YouTube tools on sellontube.com with two friends. You used our [TOOL_LABEL] earlier today, so I wanted to say hi.

We study how B2B companies get customers from YouTube. Not views, customers. Everything we learn, we publish. The tools stay free.

Over the next couple of weeks I'll send you a few short emails with the things that have actually worked. First one: the story of a 370-view video that produced 3 paying customers. I'll send it in a few days.

Gautham
SellonTube

PS: what are you trying to get out of YouTube for your business? Reply and tell me. I read every one.

## Step 4: Timer, then Email 2

Add a Timer node after Email 1: wait 3 days.
Add an Email node:
- Subject: 370 views, 3 paying customers
- Body:

Hey there,

Quick story. The one I said I'd send.

Bulk Mockup sells a Photoshop plugin for print-on-demand sellers. One of their tutorial videos got 370 views in four months. By YouTube standards, dead on arrival.

That video brought them three paying customers.

Meanwhile, a video like "What Is Content Marketing?" can pull 50,000 views from students and career switchers who will never buy anything.

The difference is who's searching. Here's how to check which side your channel is on.

Take your last three video topics. For each one, ask:

Would a potential customer type this into search when they have a problem you solve?

If not, that explains a lot.

If that test stung, this will help. Six reasons channels get views but no leads, and the fix for each: https://sellontube.com/blog/youtube-views-but-no-leads

Gautham
SellonTube

PS: next email, the smallest channel I know of that quietly carries a company's growth. A few days.

## Step 5: Timer, then Email 3

Timer: wait 4 days.
Email:
- Subject: half their paid users, one tiny channel
- Body:

Hey there,

The channel I mentioned last time.

Scalelist is a Chrome extension for B2B lead gen. Eight videos in, their channel had about 1,260 subscribers. Most founders would look at that number and quit.

Founder Youssef El Kaddioui kept going. Plain screen recordings, each one walking through a workflow his buyers already search for. His words: "YouTube started picking up after a few months... It now brings 50% of our paid users."

Half their paid users. From 1,260 subscribers.

Here's how to find topics like that for your own business. Open YouTube and start typing what your customer would search when they're stuck on the problem you solve. Sell accounting software? Type "how to reconcile" and watch what YouTube finishes. Don't press enter.

Those suggestions are real searches from real people. YouTube is handing you the list.

Write down the ones only a buyer would type. Skip the ones a student would type. That's a month of video topics, found in ten minutes.

If you want the shortcut, we built a free tool that pulls these suggestions in bulk: https://sellontube.com/tools/youtube-autocomplete-keywords

Gautham
SellonTube

PS: next email, what we actually do all day at SellonTube.

## Step 6: Timer, then Email 4

Timer: wait 5 days.
Email:
- Subject: what we actually do all day
- Body:

Hey there,

I promised to tell you what we do at SellonTube. Here it is, straight.

We run YouTube for B2B companies so it brings customers, not just views. Product walkthroughs and problem-solving tutorials your buyers already search for. We research the topics, write the scripts, produce the videos with professional voiceover, and handle the SEO and publishing. Nobody from your team goes on camera, and your side is about five hours a month. The full split of who does what is at https://sellontube.com/how-it-works

Retainers start at $2,500 a month, four-month minimum, because YouTube compounds slowly and anyone promising faster is lying to you.

The first step is a 30-minute call. No slides. We look at what your buyers actually search, whether YouTube fits how you sell, and what it costs versus what a client is worth to you. If the math doesn't work, we tell you on the call.

It's not for everyone. There's real production cost up front, months before the channel pays it back. The math works when your business is already earning and a handful of new customers would cover the whole engagement. If that's not you yet, skip the call and put the money where it returns faster: cold outreach, founder-led sales, basic Google SEO. YouTube will still be here when the math works. These emails and the tools stay free either way.

If the call sounds useful: https://cal.com/gautham-8bdvdx/30min

Prefer email? Just reply.

Gautham
Co-founder, SellonTube

PS: that's as salesy as these emails will ever get. Next one is the math that decides whether YouTube is worth it for your business at all.

## Step 7: Timer, then Email 5

Timer: wait 6 days.
Email:
- Subject: the math on "YouTube is expensive"
- Body:

Hey there,

Whether YouTube makes sense for your business comes down to one division problem.

Annual channel cost divided by what one customer is worth = customers you need to break even.

Say your channel costs $1,000 a month all-in, so $12,000 a year. If a customer brings you $8,000 over their lifetime, you need 1.5 customers a year to break even. A consulting firm with $25,000 clients breaks even on one.

Videos don't stop working when you stop paying. Ads do. A simple how-to video we made for a B2B ecommerce SaaS is still pulling installs today, months after we published it.

The catch: if you're doing it yourself, count your own time. Ten hours a month of scripting and editing at $150 an hour adds $18,000 a year to the real cost. Run the formula both ways, with and without your hours.

If the math looks ugly, that's not failure. That's the formula saving you money. Spend that budget on faster channels for now. If it looks good, the full breakdown by business type is here: https://sellontube.com/blog/youtube-break-even-math

Gautham
SellonTube

PS: one more email from me, then just one a month.

## Step 8: Timer, then Email 6

Timer: wait 7 days.
Email:
- Subject: switching to once a month
- Body:

Hey there,

This is the last of the frequent emails. From here on, you'll get one note from me a month: what's working in B2B YouTube right now, with real numbers.

Before I slow down, a few things.

If YouTube is on your roadmap this year and you want a second pair of eyes on your plan, grab 30 minutes here: https://cal.com/gautham-8bdvdx/30min. If the math doesn't work for you, I'll say so on the call.

Know another founder wondering whether YouTube is worth it for their business? Send them to https://sellontube.com/tools. Everything there is free, and the math works the same for everyone.

Monthly still too much? The unsubscribe link below works. No hard feelings.

That's it. Thanks for reading this far. Reply anytime, I read everything.

Gautham
SellonTube

PS: the first monthly note comes in a few weeks. One lesson, one number, two minutes.

## Step 9: Sunset tail

Timer: wait 14 days.
Audience filter node: contact property "Has Opened" (hasOpened) IS NOT true.
Filter application: "Next node only" is fine here.
Email:
- Subject: last email from me
- Body (the phrase "Click here and you're in" should be a hyperlink pointing to
  https://sellontube.com/tools ):

Hey there,

You used one of our free YouTube tools a while back. I'm Gautham, one of the people who build them, and I've sent a few emails since. It looks like they're not what you need right now. No hard feelings, inboxes are brutal.

So, last one. If you'd like one short note a month on B2B YouTube: real numbers, two minutes. Click here and you're in.

Or just reply with anything. Even one word.

Do nothing, and this is where I quietly stop.

Either way, the tools at sellontube.com/tools stay free.

Gautham
SellonTube

## Step 10: Final check and STOP

- Verify the chain reads: Trigger (nurture_start, one time) -> Audience filter
  (bookedCall is not true, all following nodes) -> Email 1 -> Timer 3d -> Email 2 ->
  Timer 4d -> Email 3 -> Timer 5d -> Email 4 -> Timer 6d -> Email 5 -> Timer 7d ->
  Email 6 -> Timer 14d -> Audience filter (hasOpened is not true) -> Email 7 -> Exit.
- Confirm every email shows From name "Gautham from SellonTube" and From email
  gautham@mail.sellontube.com.
- Leave the workflow in DRAFT. Do NOT click Start.
- Report back: a list of the nodes as built, and anything that did not match these
  instructions.
