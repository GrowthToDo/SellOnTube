# YouTube Video Keyword Finder — Claude Code Build Spec

---

## ROLE

You are building the **YouTube Video Keyword Finder** for SellonTube.com.

**What it does in plain English:** A business owner pastes any YouTube video URL. The tool discovers 12 keywords the video could rank for in YouTube search, checks the video's actual position for each keyword, and returns a scorecard showing which keywords the video owns, which are within reach, and which it's invisible for. It also shows which keywords appear in the video's tags and which don't. Then it gives specific recommendations to improve.

**The core insight it's built on:** Every YouTube rank checker requires you to already know the keyword. This tool flips the direction: video URL in, ranking keywords out. No free tool does this. The closest paid alternative is $99/month.

**The competitive positioning:** VidIQ and TubeBuddy are widely mistrusted (Reddit is full of backlash). They fabricate search volume, show contradictory scores, and only check ranking for keywords already in the video's tags. This tool checks real YouTube search results, uses real autocomplete data (not made-up volumes), and is transparent about what it can and can't measure. That honesty is the differentiator.

**Who it's for:** B2B founders, SaaS operators, and service businesses who published a YouTube video and want to know: "Is this video actually ranking for anything? What am I missing?"

**Access model:** 3 free reports, then business email required (matching existing SellonTube tools). No paid tier.

**Stack:**
- Frontend: Astro 5 + Tailwind CSS (static page with client-side JS)
- Backend: Netlify Function (TypeScript)
- APIs: YouTube Data API v3 (video metadata + search), YouTube Autocomplete (free, no quota, via existing `youtube-suggest` library), Gemini Flash (keyword selection + recommendations)
- Email capture: Google Sheets (Apps Script) + Loops (existing endpoints)
- Analytics: GA4 via window.dataLayer

**Reference implementation:** `src/pages/tools/youtube-video-ideas-generator.astro` + `netlify/functions/generate-video-ideas.ts` + `netlify/functions/capture-email.ts`. Mirror these exactly for component structure, email gate, error handling, and analytics.

---

## STEP 1 — READ BEFORE BUILDING

Read these files in order. Do not start building until all are read.

1. **`src/pages/tools/youtube-video-ideas-generator.astro`** — Extract: Astro page structure, Tailwind class patterns, step-based UI flow (input → loading → email gate → results), form validation, localStorage keys, GA4 event tracking, related tools grid, CallToAction component usage.

2. **`netlify/functions/generate-video-ideas.ts`** — Extract: Gemini API call structure (`gemini-flash-latest` model, `responseMimeType: 'application/json'`, `maxOutputTokens: 2048`), system instruction pattern, error handling (429 → pass through, other errors → 503 never 502), CORS headers, input validation.

3. **`netlify/functions/youtube-rank-check.ts`** — Extract: YouTube Data API search pattern (`search.list` endpoint), `YOUTUBE_API_KEY` env var, `resolveChannelId` helper, `videos.list` for view counts, how results are structured. This function's search logic will be reused directly.

4. **`netlify/functions/lib/youtube-suggest.ts`** — Extract: `getSuggestions()` and `getExpandedSuggestions()` functions. These hit YouTube's free autocomplete endpoint (no API key, no quota). The `getExpandedSuggestions()` function does A-Z expansion with buyer-intent modifiers. This is how we generate keyword candidates from real search data.

5. **`netlify/functions/capture-email.ts`** — Extract: Google Sheets endpoint URL, Loops endpoint URL, `Promise.allSettled` pattern, CORS headers. Reuse identically.

6. **`src/pages/tools/index.astro`** — Find the `tools` array. Note the position where this tool should be added (after youtube-ranking-checker, since it's a natural next step in the same workflow).

7. **`src/navigation.ts`** — Find the `Free Tools` linkGroup. Note where to add this tool.

8. **`CLAUDE.md`** — Read and apply all build standards, especially: never return HTTP 502, use `gemini-flash-latest` (never a pinned version), `maxOutputTokens` at least 2048, always include `geminiStatus` and `detail` in error responses.

9. **`docs/blog/style-guide.md`** — Apply all copy rules: no em-dashes, no filler openers, no banned AI phrases, active voice, consultant tone.

10. **Check `.env` or Netlify env vars** for: `YOUTUBE_API_KEY` (must exist), `GEMINI_API_KEY` (must exist), `LOOPS_API_KEY` (must exist).

**Do not proceed to Step 2 until all reads are complete.**

---

## STEP 2 — CONFIRM BEFORE BUILDING

Present findings to Sathya before touching any files:

1. Confirm all env vars are present (`YOUTUBE_API_KEY`, `GEMINI_API_KEY`, `LOOPS_API_KEY`)
2. Confirm the Gemini model ID is `gemini-flash-latest`
3. Confirm the Google Sheets endpoint URL from `capture-email.ts`
4. Confirm the Loops endpoint URL from `capture-email.ts`
5. Confirm the `youtube-suggest.ts` library exports `getSuggestions` and `getExpandedSuggestions`
6. Show proposed file structure:
   - New: `netlify/functions/find-video-keywords.ts`
   - New: `src/pages/tools/youtube-video-keyword-finder.astro`
   - Modify: `src/pages/tools/index.astro` (add to tools array)
   - Modify: `src/navigation.ts` (add to Free Tools linkGroup)
   - Modify: `src/pages/tools/youtube-ranking-checker.astro` (add cross-tool CTA in results)
   - Modify: `src/pages/tools/youtube-seo-tool.astro` (add cross-tool CTA in results)
7. Show the YouTube API quota impact: each tool use = ~1,201 quota units (1 `videos.list` + 12 `search.list`). Autocomplete calls are free. With 10,000 daily quota, supports ~8 uses/day alongside existing tools.

**Wait for explicit confirmation before proceeding.**

---

## STEP 3 — BACKEND (Netlify Function)

**File:** `netlify/functions/find-video-keywords.ts`

**What the function does:** Accepts a YouTube video URL, extracts the video's metadata, uses YouTube autocomplete to gather real search term candidates, uses Gemini to select the 12 most relevant, checks the video's actual YouTube search position for each keyword, flags which keywords appear in the video's tags, generates recommendations, and returns a complete keyword report.

### Input schema (POST body)

```typescript
{
  videoUrl: string;  // YouTube video URL (any format) or bare 11-char video ID
}
```

### Data pipeline (step by step)

**Step 1: Extract video ID from URL**

Support these URL formats:
- `https://www.youtube.com/watch?v=VIDEO_ID`
- `https://youtu.be/VIDEO_ID`
- `https://www.youtube.com/embed/VIDEO_ID`
- `https://www.youtube.com/shorts/VIDEO_ID`
- `https://youtube.com/watch?v=VIDEO_ID&t=123`
- Bare 11-character video ID (e.g., `dQw4w9WgXcQ`)

Use regex to extract the 11-character video ID. Return 400 if no valid ID found.

**Step 2: Fetch video metadata via YouTube Data API**

```
GET https://www.googleapis.com/youtube/v3/videos
  ?part=snippet
  &id={videoId}
  &key={YOUTUBE_API_KEY}
```

Extract: `title`, `description` (first 500 chars), `tags` (array, may be empty), `channelTitle`, `channelId`, `thumbnails.medium.url`.

If video not found, return 400 with message "Video not found. Check the URL and make sure it's a public video."

**Step 3: Generate keyword candidates (HYBRID APPROACH)**

This is the most important step. Use two sources to generate high-quality keyword candidates:

**3a. YouTube Autocomplete (real search terms, free, no quota)**

Import `getSuggestions` from `./lib/youtube-suggest.js`.

Extract 2-3 seed terms from the video title. Rules for seed extraction:
- Take the first meaningful 2-3 word phrase from the title (skip filler words like "how to", "the best", "a guide to")
- If the title has a colon or pipe, take the text before it as one seed and after it as another
- Always include the most specific noun phrase from the title

For each seed term, call `getSuggestions(seed)` to get autocomplete results. Run seeds in parallel. Collect all suggestions into a deduplicated array. This typically yields 20-40 real YouTube search terms.

**3b. Gemini Selection (pick the 12 most relevant)**

Call Gemini with `responseMimeType: 'application/json'` and `temperature: 0.5` and `maxOutputTokens: 2048`.

**System instruction (use this exact text):**

```
You are a YouTube keyword analyst. You will receive a video's metadata and a list of real YouTube autocomplete suggestions. Your job is to select the 12 keywords that this specific video is most likely to rank for.

SELECTION RULES:

1. PRIORITIZE keywords from the autocomplete list. These are real search terms that people actually type. Only generate new keywords if the autocomplete list has fewer than 12 relevant options.

2. Select this mix:
   - 3 SHORT-TAIL (2-3 words): Broadest, highest-potential terms
   - 4 MEDIUM-TAIL (3-5 words): More specific phrases
   - 3 LONG-TAIL (5+ words): Questions or specific scenarios
   - 2 BUYER-INTENT: Keywords with "best", "review", "vs", "for small business", "worth it", "how to choose"

3. Every keyword must be something the video COULD plausibly rank for based on its actual content. Do not select keywords just because they appear in autocomplete if they are unrelated to the video.

4. Include at least 2 question-format keywords.

5. DO NOT select:
   - The exact video title verbatim
   - The channel name
   - Single-word keywords
   - Keywords obviously unrelated to the video content
   - Near-duplicate keywords (pick the better phrasing)

6. If the autocomplete list has fewer than 8 relevant keywords, generate additional keywords to reach 12 total. Mark generated keywords by prefixing them with "~" so the system can track which are from autocomplete vs generated.

Return valid JSON: { "keywords": ["keyword1", "keyword2", ..., "keyword12"] }
```

**User prompt:**

```
VIDEO METADATA:
Title: {title}
Description (first 500 chars): {description}
Tags: {tags joined by comma, or "none" if empty}
Channel: {channelTitle}

YOUTUBE AUTOCOMPLETE SUGGESTIONS:
{autocomplete results, one per line, max 40}

Select the 12 most relevant keywords for this video. Prioritize autocomplete terms.
```

Parse the response. Strip any "~" prefixes (used internally to track source). Validate it's an array with 8-12 entries. If parsing fails, return 503 with detail.

**Step 4: Check YouTube search position for each keyword**

For each keyword from Step 3, call YouTube Data API `search.list`:

```
GET https://www.googleapis.com/youtube/v3/search
  ?part=snippet
  &q={keyword}
  &type=video
  &maxResults=20
  &key={YOUTUBE_API_KEY}
```

Run all 12 searches in parallel using `Promise.allSettled()`. For each successful search, scan the results for the target video ID. Record:
- `position`: 1-based index if found, `null` if not in top 20
- `status`: `"ranking"` (position 1-5), `"within_reach"` (position 6-20), `"not_found"` (not in top 20)
- `inTags`: boolean — whether this keyword (or a close match) appears in the video's tags array. Use case-insensitive substring matching: if any tag contains the keyword or the keyword contains any tag, mark as `true`.

If an individual search fails, mark that keyword with `status: "error"` and continue. Do not fail the entire request because one keyword search failed.

**Step 5: Generate recommendations via Gemini**

Second Gemini call with the keyword results. Use `temperature: 0.5` and `maxOutputTokens: 1024`.

**System instruction:**

```
You are a YouTube SEO consultant for business channels. Given a video's keyword ranking report, write 3 specific, actionable recommendations. Each recommendation must be one sentence that tells the business owner exactly what to change and why.

Rules:
- Reference specific keywords and positions from the data
- Suggest concrete metadata changes (title rewording, description additions, tag changes)
- Prioritize quick wins: keywords at position 6-10 that could reach top 5 with small changes
- If a keyword ranks but is NOT in the video's tags, recommend adding it as a tag
- If a keyword IS in the tags but doesn't rank, recommend strengthening it in the title or description
- Never use jargon. Write like you're advising a business owner, not an SEO professional.
- No filler. No "consider" or "you might want to". Direct instructions.
- No em-dashes. Use commas, periods, or colons instead.
```

**User prompt:**

```
Video title: {title}
Current tags: {tags}

Keyword report:
{for each keyword: "- {keyword}: position {position or 'not found'} ({status}) [in tags: {yes/no}]"}

Write 3 specific recommendations to improve this video's search visibility.

Return valid JSON: { "recommendations": ["rec1", "rec2", "rec3"] }
```

If this Gemini call fails, return results without recommendations (graceful degradation). Do not block the entire response.

### Output schema (exact JSON structure)

```typescript
{
  video: {
    videoId: string;
    title: string;
    channel: string;
    thumbnail: string;
    tags: string[];  // the video's current tags
  };
  keywords: Array<{
    keyword: string;
    position: number | null;
    status: "ranking" | "within_reach" | "not_found" | "error";
    inTags: boolean;  // whether keyword appears in the video's tags
  }>;
  summary: {
    total: number;
    ranking: number;
    withinReach: number;
    notFound: number;
    grade: "A" | "B" | "C" | "D" | "F";
  };
  recommendations: string[];  // 3 items, or empty array if Gemini failed
}
```

**Grading logic (nuanced, factors in within_reach):**

```
ranking >= 7                                    → "A"
ranking >= 4                                    → "B"
ranking >= 2 OR (ranking >= 1 AND withinReach >= 5)  → "C"
ranking >= 1 OR withinReach >= 4                → "D"
everything else                                 → "F"
```

(where `ranking` = count of keywords with position 1-5, `withinReach` = count with position 6-20)

### Error handling

- Missing `YOUTUBE_API_KEY` or `GEMINI_API_KEY` → 500 with message
- Invalid or missing video URL → 400 with user-friendly message
- Video not found → 400: "Video not found. Check the URL and make sure it's a public video."
- YouTube API returns 403 (quota exceeded) → 429: `{ error: "quota_exceeded", detail: "YouTube API daily limit reached. Try again tomorrow." }`
- Gemini returns 429 → 429: `{ error: "quota_exceeded" }`
- Gemini returns other error → 503 (never 502) with `geminiStatus` and `detail`
- Individual keyword search fails → mark as `"error"`, continue with remaining keywords
- YouTube autocomplete fails → fall back to pure Gemini generation (degrade gracefully, do not fail)
- Gemini recommendation call fails → return results with empty `recommendations` array
- Never expose raw API error messages to the user
- Never block the user due to a non-critical failure (recommendations and autocomplete are non-critical)

### Function config

```typescript
export const config = {
  path: '/api/find-video-keywords',
};
```

---

## STEP 4 — USAGE TRACKING & EMAIL GATE

**localStorage key for count:** `sot_keyword_finder_count`

**Shared unlock key:** `sot_tools_email_unlocked` (same key all SellonTube tools use)

**Free uses before gate:** 3 free keyword reports

**Gate trigger:** When `getCount() >= 3 && !isEmailSubmitted()`

**Email gate overlay copy:**

- Heading: "You've used your 3 free reports"
- Subheading: "Enter your business email to keep discovering your video keywords. It's free."
- Placeholder: "your@company.com"
- Button text: "Unlock unlimited reports"
- Disclaimer: "No spam. We'll only send you content marketing resources from SellonTube."
- Error (personal email): "Please use a business email address (not Gmail, Yahoo, etc.)"
- Success message: "You're in. Generating your report now."

**Business email validation:** Block personal domains — gmail.com, yahoo.com, hotmail.com, outlook.com, icloud.com, aol.com, protonmail.com, mail.com, ymail.com, live.com.

**Google Sheets payload:**

```json
{
  "email": "user@company.com",
  "source": "youtube-video-keyword-finder"
}
```

Use the same Google Apps Script endpoint and Loops endpoint from `capture-email.ts`. Fire both with `Promise.allSettled`. Silent failure on both.

**After capture:** Set `sot_tools_email_unlocked` to `'true'` in localStorage. Unlimited uses for rest of session. Show success overlay for 1.2 seconds, then auto-trigger the report.

**Session caching:** After a successful report, store the result in `sessionStorage` keyed by video ID (`sot_kwf_{videoId}`). If the same video URL is checked again in the same browser session, return cached results instantly without an API call. This saves quota and gives instant UX on repeat checks.

---

## STEP 5 — FRONTEND (Astro Page)

**File:** `src/pages/tools/youtube-video-keyword-finder.astro`

**Page route:** `/tools/youtube-video-keyword-finder`

**Design rule:** Match the existing tool pages exactly. Same layout, same Tailwind patterns, same CallToAction component. Do not invent new design patterns.

### Meta tags

```
title: "Free YouTube Video Keyword Finder for Business"
description: "Find every keyword your YouTube video ranks for. Paste any URL, see your exact positions, and discover hidden ranking opportunities. Free, no signup."
canonical: https://sellontube.com/tools/youtube-video-keyword-finder
```

### Structured data

Include three schemas (matching existing tool pattern):
1. **BreadcrumbList:** Home → Tools → YouTube Video Keyword Finder
2. **WebApplication:** name, url, description, applicationCategory: "SEOApplication", offers: free
3. **FAQPage:** 10 questions (written below)

### Page layout (top to bottom)

**1. SEO content block above the tool**

H1: `Free YouTube Video Keyword Finder for Business`

Subheading (regular weight, text-lg): `Paste any video URL and discover every keyword it ranks for in YouTube search. See your exact positions and find the keywords you're missing.`

Paragraph 1: `Every YouTube rank checker makes you guess the keyword first. This tool works in reverse. Paste your video URL and get a complete keyword report: which searches your video appears in, where it ranks, and what you're invisible for. Built for business channels that need to know if their video investment is paying off in search visibility.`

Paragraph 2: `The tool pulls your video's metadata, finds real search terms from YouTube's autocomplete data, then checks your actual position for each one. You get a scorecard, a grade, and specific recommendations to improve. It also shows which keywords appear in your tags and which don't, so you can see exactly where your metadata has gaps. Works on your own videos and competitors' videos.`

Feature badges (same style as video ideas generator): `"12 keywords checked"`, `"Real-time positions"`, `"Built for B2B"`

**2. Input form**

Single field:
- Label: "YouTube video URL"
- Placeholder: "https://www.youtube.com/watch?v=..."
- Helper text: "Any public YouTube video URL or video ID. Works with your videos and competitor videos."
- Validation: Must be a valid YouTube URL containing a video ID, or a bare 11-character ID. Auto-prepend `https://` if it looks like a bare domain.
- Min length: 10 characters (or exactly 11 for bare video IDs)

Below the input field, add a "Try with an example" link. When clicked, it pre-fills the input with a real SellonTube video URL (use the first video from the channel — check the channel for a good candidate during build). This lets first-time visitors see what the output looks like without needing their own video.

Button text: "Find my ranking keywords"

Counter label: "{X} free reports remaining" or "Unlimited reports unlocked"

**3. Loading state**

Spinner animation (match existing pattern). Cycling status messages (rotate every 2.5 seconds):

1. "Reading your video's metadata..."
2. "Scanning YouTube autocomplete for real search terms..."
3. "Selecting the 12 most relevant keywords..."
4. "Checking your position for each keyword..."
5. "Building your keyword report..."

**4. Email gate overlay**

(Copy specified in Step 4 above)

**5. Results panel**

Layout in order:

**5a. Video info card**
Rounded card with: thumbnail (left), title + channel name (right). Small text: "Video ID: {id}".

**5b. Summary bar**
Full-width card with 4 stats in a row:
- "Keywords Checked" — {total} — neutral color
- "Ranking (Top 5)" — {ranking} — green
- "Within Reach (6-20)" — {withinReach} — amber/yellow
- "Invisible" — {notFound} — red

Grade badge in top-right corner: large letter (A/B/C/D/F) with color coding (A=green, B=blue, C=amber, D=orange, F=red).

**5c. Keyword table**

Three sections, each with a header:

Green section header: "Keywords You Own" (position 1-5)
- Each row: position badge (#1, #2, etc.) | keyword text | tag indicator (green dot if `inTags`, empty circle if not) | Copy button
- If no keywords in this section: "No keywords in top 5 yet. See recommendations below."

Yellow section header: "Within Striking Distance" (position 6-20)
- Each row: position badge | keyword text | tag indicator | Copy button
- If none: "No keywords in positions 6-20."

Red section header: "Not Ranking" (not in top 20)
- Each row: dash icon | keyword text | tag indicator | Copy button
- If none: "Your video ranks for every keyword checked."

**Tag indicator legend** (small text below the table header): "Green dot = keyword is in your video's tags. Empty circle = keyword is missing from your tags."

Each keyword row also has a small "Check in Ranking Checker" link that opens `/tools/youtube-ranking-checker` with the keyword pre-filled (via URL param if supported, otherwise just the link).

Two buttons below the table:
- "Copy All Keywords" — copies all 12 keywords as a newline-separated list
- "Copy Full Report" — copies a formatted text report (see format below)

**Copy Full Report format:**
```
YouTube Keyword Report: [Video Title]
Channel: [Channel Name]
Grade: [Letter] ([ranking] ranking, [withinReach] within reach, [notFound] invisible)
Generated: [date]

RANKING (Top 5):
#[pos] — [keyword] [in tags / not in tags]
...

WITHIN REACH (6-20):
#[pos] — [keyword] [in tags / not in tags]
...

NOT RANKING:
— [keyword] [in tags / not in tags]
...

Generated by SellonTube YouTube Video Keyword Finder
https://sellontube.com/tools/youtube-video-keyword-finder
```

**5d. Recommendations section**

Header: "What to fix first"

3 recommendation cards, each with a lightbulb icon and the recommendation text from Gemini.

If recommendations are empty (Gemini failed), show: "Recommendations could not be generated. Focus on the keywords in the 'Within Striking Distance' section. Small metadata changes can push these into the top 5."

**5e. Next steps CTA block**

Two-column grid:
- Left card: "Optimize this video's SEO" — "Run a full SEO audit on this video to get specific title, description, and tag rewrites." — Button: "Run SEO Audit" → `/tools/youtube-seo-tool`
- Right card: "Check a specific keyword" — "Want to see exactly who you're competing against for a keyword?" — Button: "Open Ranking Checker" → `/tools/youtube-ranking-checker`

**5f. Reset button**

"Check another video" — clears input, resets to input step, clears sessionStorage cache for this video.

**6. How it works section**

3-column grid (matching existing pattern):
1. "Paste your video URL" — "Any public YouTube video. Your own or a competitor's."
2. "We find 12 real keywords" — "We scan YouTube autocomplete for terms people actually search, then check your position for each one in real time."
3. "Get your keyword report" — "See which keywords you own, which are within reach, which you're missing from your tags, and exactly what to fix."

**7. Methodology section**

H2: "How the YouTube keyword finder works"

Explain honestly:
- The tool extracts seed terms from your video's title and runs them through YouTube's actual autocomplete system to find real search terms people type
- Gemini AI then selects the 12 keywords most relevant to your specific video from those autocomplete results
- It checks real YouTube search results for each keyword and records your exact position
- It also cross-references each keyword against your video's tags to show metadata gaps
- This is an intelligent scan of your most likely ranking keywords, not an exhaustive index of every possible search term
- YouTube does not provide a "show all ranking keywords" endpoint to anyone. No tool has this data. The difference is that this tool is transparent about that fact, while others present estimates as definitive data.

H2: "Why this tool uses real YouTube autocomplete data"

2 paragraphs: YouTube's autocomplete suggestions reflect actual search behavior. Every keyword this tool checks is a real term that YouTube suggests to searchers. Compare this to tools that fabricate "search volume" numbers: YouTube's API does not share search volume data with any third party. VidIQ and TubeBuddy estimate it, and their estimates frequently contradict each other. This tool skips the made-up numbers and focuses on what's verifiable: does your video appear when someone searches this term?

H2: "Why business channels need this"

2 paragraphs on: YouTube Studio only shows search terms that drove clicks (not all keywords you appear for). Small and B2B channels with lower view counts see even less data because YouTube hides metrics below undisclosed thresholds. The only alternative until now was manually searching keywords one by one in an incognito browser window, or paying $99/month for a paid rank tracking tool.

**8. FAQ section**

10 questions (expanded for long-tail keyword coverage):

Q1: "Is this tool free?"
A1: "Yes. You get 3 free keyword reports without any signup. After that, enter your business email to keep checking videos at no cost. There is no paid tier."

Q2: "How do I find what keywords my YouTube video ranks for?"
A2: "Paste your video URL into the tool above. It extracts your video's metadata, scans YouTube autocomplete for real search terms related to your topic, checks your position for each keyword, and gives you a complete report in under 15 seconds. No login required."

Q3: "Can I check a competitor's video?"
A3: "Yes. Paste any public YouTube video URL. Many business owners use this to reverse-engineer which keywords a competitor's top video ranks for, then target the same keywords with better content."

Q4: "How accurate are the keyword suggestions?"
A4: "The keywords come from YouTube's own autocomplete system, which reflects real search behavior. The ranking positions are checked against live YouTube search results in real time. The keyword list is a focused selection of your 12 most likely ranking terms, not every possible keyword. Think of it as checking the keywords that matter most rather than scanning every search term on YouTube."

Q5: "How is this different from VidIQ or TubeBuddy?"
A5: "Three differences. First, VidIQ and TubeBuddy show rankings only for the tags already on your video. If your video ranks for a keyword that's not in your tags, they won't show it. This tool generates keywords independently. Second, this tool uses real YouTube autocomplete data instead of fabricated search volume numbers. Third, VidIQ and TubeBuddy cost $20-49/month for rank tracking. This tool is free."

Q6: "Does YouTube show you what keywords your video ranks for?"
A6: "YouTube Studio shows search terms that drove clicks to your video, but only for the last 28 days, only for keywords that reached a minimum traffic threshold, and without position data. Small channels and B2B channels often see almost no search term data because their traffic is too low to meet YouTube's thresholds. This tool fills that gap."

Q7: "How often should I run this?"
A7: "Check after publishing a new video to see if it's picking up search visibility. Check again 2 weeks later to see how positions have shifted. Run it on your top 5 videos quarterly to catch ranking changes."

Q8: "Why only 12 keywords?"
A8: "Each keyword check queries YouTube's search results in real time. Twelve keywords gives a meaningful picture of your video's search visibility while keeping the tool fast and free. For a deeper analysis across more keywords, book a diagnostic call."

Q9: "What does the tag indicator mean?"
A9: "The green dot next to a keyword means it appears in your video's tags. An empty circle means it's missing. If you're ranking for a keyword that's not in your tags, add it. If you tagged a keyword but you're not ranking for it, the tag alone isn't enough. You may need to include that keyword in your title or description."

Q10: "Can I see what keywords a competitor's YouTube video ranks for?"
A10: "Yes. This works on any public video. Paste a competitor's video URL, see which keywords they rank for, and use the results to find gaps in your own content strategy. The report shows the same keyword scorecard for any video, whether it's yours or someone else's."

**9. Related tools grid**

3-column grid linking to:
- YouTube Ranking Checker — "Check your position for a specific keyword"
- YouTube SEO Tool — "Get a full SEO audit of your video's metadata"
- YouTube Tag Generator — "Generate optimized tags for any video topic"

**10. CallToAction component**

Use the existing `CallToAction` component (same as other tool pages). CTA heading: "Want a complete YouTube SEO strategy?" Body: "A keyword report shows you where you stand. A strategy shows you where to go. Book a free 30-minute diagnostic and we'll map out your YouTube search plan." Button: "Book your diagnostic" → `https://cal.com/gautham-8bdvdx/30min`

### GA4 events (via window.dataLayer)

| Event name | Trigger | Data |
|---|---|---|
| `tool_generate_click` | "Find my ranking keywords" button clicked | `tool: 'video-keyword-finder'` |
| `tool_example_click` | "Try with an example" clicked | `tool: 'video-keyword-finder'` |
| `tool_email_gate_shown` | Email gate overlay displayed | `tool: 'video-keyword-finder'` |
| `tool_email_submitted` | Email submitted successfully | `tool: 'video-keyword-finder'` |
| `tool_generate_success` | Results rendered | `tool: 'video-keyword-finder'`, `grade: 'B'`, `ranking_count: 5` |
| `tool_generate_error` (429) | Quota exceeded | `tool: 'video-keyword-finder'`, `reason: 'quota_exceeded'` |
| `tool_generate_error` (other) | API error | `tool: 'video-keyword-finder'`, `reason: 'api_error'` |
| `keyword_copied` | Copy button clicked on a keyword | `tool: 'video-keyword-finder'`, `keyword_index: number` |
| `all_keywords_copied` | "Copy All Keywords" clicked | `tool: 'video-keyword-finder'` |
| `report_copied` | "Copy Full Report" clicked | `tool: 'video-keyword-finder'` |
| `tool_cta_click` | Any cross-tool CTA clicked | `tool: 'video-keyword-finder'`, `destination: 'seo-tool'` |

### Error states (user-facing messages)

| Condition | Message |
|---|---|
| Invalid URL | "That doesn't look like a YouTube video URL. Paste a link like https://www.youtube.com/watch?v=... or an 11-character video ID." |
| Video not found | "Video not found. Check the URL and make sure it's a public video." |
| YouTube API quota (429) | "YouTube's API limit has been reached for today. Try again tomorrow, or check a specific keyword with our Ranking Checker." |
| Gemini quota (429) | "AI analysis is at capacity right now. Free daily limit reached. Check back tomorrow." |
| Generic server error | "Something went wrong on our end. Try again in a moment." |

---

## STEP 6 — CROSS-TOOL CTAS (TRAFFIC DRIVER)

After building the tool page, add cross-tool CTAs on these existing pages to drive traffic from pages that already get impressions:

**1. YouTube Ranking Checker** (`src/pages/tools/youtube-ranking-checker.astro`)

In the results section (after the results table or in the related tools area), add a CTA card:
- Text: "Want to check ALL your ranking keywords at once?"
- Subtext: "Instead of checking one keyword at a time, get a full keyword report for any video."
- Button: "Try the Keyword Finder" → `/tools/youtube-video-keyword-finder`

This is the primary traffic source. The ranking checker gets 609 impressions. Users who check one keyword naturally want to check all of them.

**2. YouTube SEO Tool** (`src/pages/tools/youtube-seo-tool.astro`)

In the results section or related tools area, add:
- Text: "See which keywords this video actually ranks for"
- Button: "Run Keyword Report" → `/tools/youtube-video-keyword-finder`

**3. YouTube Channel Audit** (`src/pages/tools/youtube-channel-audit.astro`)

In the results or related tools area, add:
- Text: "Check which keywords each video ranks for"
- Button: "Video Keyword Finder" → `/tools/youtube-video-keyword-finder`

---

## STEP 7 — VALIDATION CHECKLIST

### Files created
- [ ] `netlify/functions/find-video-keywords.ts`
- [ ] `src/pages/tools/youtube-video-keyword-finder.astro`

### Files modified
- [ ] `src/pages/tools/index.astro` — tool added to array
- [ ] `src/navigation.ts` — tool added to Free Tools linkGroup
- [ ] `src/pages/tools/youtube-ranking-checker.astro` — cross-tool CTA added
- [ ] `src/pages/tools/youtube-seo-tool.astro` — cross-tool CTA added
- [ ] `src/pages/tools/youtube-channel-audit.astro` — cross-tool CTA added

### Test checklist

**Form and input:**
- [ ] Valid YouTube URL accepted (all 5 URL formats + bare video ID)
- [ ] Invalid URL shows error message
- [ ] Empty input shows validation error
- [ ] Auto-prepends https:// to bare domains
- [ ] "Try with an example" pre-fills input and triggers submit
- [ ] Button disables during request
- [ ] Enter key submits form

**Loading state:**
- [ ] Spinner appears immediately on submit
- [ ] Status messages cycle every 2.5 seconds
- [ ] Loading state persists until results or error

**Email gate:**
- [ ] Counter shows correct remaining count
- [ ] Gate appears after 3rd use
- [ ] Personal email domains rejected with message
- [ ] Valid business email accepted
- [ ] Email sent to Sheets + Loops
- [ ] Gate does not appear if `sot_tools_email_unlocked` is `'true'`
- [ ] After email: shows "Unlimited reports unlocked"
- [ ] After email: auto-triggers the pending report

**Results:**
- [ ] Video info card shows correct thumbnail, title, channel
- [ ] Summary bar shows correct counts
- [ ] Grade badge shows correct letter and color (using nuanced grading)
- [ ] Keywords grouped correctly by status (ranking/within_reach/not_found)
- [ ] Tag indicator (green dot / empty circle) displays correctly for each keyword
- [ ] Tag indicator legend is visible
- [ ] Copy button copies individual keyword
- [ ] "Copy All Keywords" copies all 12
- [ ] "Copy Full Report" copies formatted text report with all sections
- [ ] Recommendations display (or fallback message if empty)
- [ ] Cross-tool links work (ranking checker, SEO tool)
- [ ] "Check another video" resets to input step
- [ ] Session caching works: same video URL returns cached results instantly

**Error handling:**
- [ ] 400 errors show user-friendly messages
- [ ] 429 shows quota message
- [ ] 503 shows generic error
- [ ] Console has no unhandled errors
- [ ] Failed individual keyword searches don't break the whole report
- [ ] YouTube autocomplete failure falls back to pure Gemini generation

**SEO and meta:**
- [ ] Meta title renders correctly
- [ ] Meta description renders correctly
- [ ] Canonical URL is absolute
- [ ] BreadcrumbList schema is valid (test with Google Rich Results Test)
- [ ] WebApplication schema is valid
- [ ] FAQPage schema is valid (10 questions)

**Mobile:**
- [ ] Form usable on 375px width
- [ ] Results table scrollable or stacks on mobile
- [ ] Summary bar stacks to 2x2 grid on small screens
- [ ] Touch targets meet 44px minimum
- [ ] "Copy Full Report" button usable on mobile

**Integration:**
- [ ] Tool appears on `/tools/` listing page
- [ ] Tool appears in footer navigation
- [ ] Cross-tool CTA appears on ranking checker results page
- [ ] Cross-tool CTA appears on SEO tool results page
- [ ] Cross-tool CTA appears on channel audit results page
- [ ] All GA4 events fire correctly (check dataLayer in console)

---

## RULES

- **Approval gate mandatory** before modifying any files. Present your plan, wait for explicit "yes."
- **No new dependencies.** Use only what's already in the codebase. No new npm packages, no new APIs, no new auth patterns. The `youtube-suggest` library is already in the codebase.
- **Mirror existing patterns exactly.** The video ideas generator is your reference for everything: page structure, function structure, email gate, error handling, analytics.
- **Never block the user due to API failure.** If Gemini recommendations fail, return results without them. If autocomplete fails, fall back to pure Gemini generation. If one keyword search fails, return the rest.
- **Never expose raw API errors.** Every error the user sees must be a plain-English sentence.
- **Never return HTTP 502 from the Netlify function.** Cloudflare intercepts 502 and replaces the body. Use 503 for upstream failures.
- **Use `gemini-flash-latest` model.** Never pin to a versioned model like `gemini-2.0-flash` or `gemini-2.5-flash`.
- **`maxOutputTokens` must be at least 2048.** Gemini 2.5-flash uses thinking tokens that count against the limit.
- **No em-dashes in any copy.** Use commas, periods, or colons instead. After writing all copy, grep the file for em-dashes and fix any found.
- **No banned AI phrases.** No "Moreover," "Furthermore," "Let's dive in," "It's worth noting." Read `docs/blog/style-guide.md` for the full list.
- **Present conflicts as questions, not decisions.** If something is unclear or contradicts these instructions, ask.
- **After building, add the tool to `/tools/` listing and footer.** This is part of building the tool, not a follow-up task.
- **After building, add cross-tool CTAs** on ranking checker, SEO tool, and channel audit pages. This is part of building the tool.

---

## ANTI-CANNIBALIZATION: Keyword Finder vs Ranking Checker

These two tools serve opposite directions of the same workflow. They MUST NOT compete for the same keywords.

**YouTube Ranking Checker** (existing, 609 impressions)
- Job: "I know a keyword. Where does my video rank?"
- Input: keyword + channel URL
- Output: position in top 20, competing videos
- Target keywords: "youtube ranking checker", "youtube rank checker", "check youtube ranking", "where does my video rank"
- Title tag: "Free YouTube Ranking Checker for Business"

**YouTube Video Keyword Finder** (new)
- Job: "Here's my video. What keywords does it rank for?"
- Input: video URL only
- Output: 12 discovered keywords with positions, tag gaps, grade, recommendations
- Target keywords: "youtube video keyword finder", "find keywords youtube video ranks for", "what keywords does my youtube video rank for", "youtube keyword lookup"
- Title tag: "Free YouTube Video Keyword Finder for Business"

**Rules to prevent overlap:**
1. The Keyword Finder page must NEVER use "ranking checker", "rank checker", or "check ranking" in its title, H1, meta description, or H2s
2. The Ranking Checker page must NEVER use "keyword finder", "find keywords", or "discover keywords" in its title, H1, meta description, or H2s
3. Both pages cross-link to each other as complementary tools (not competing)
4. The FAQ on each page differentiates: Ranking Checker FAQ Q7 already mentions "check what keywords" but frames it as manual keyword-by-keyword checking. The Keyword Finder FAQ should reference the Ranking Checker for single-keyword deep dives.
5. On-page copy positioning: Keyword Finder = "discovery" (find what you don't know). Ranking Checker = "verification" (confirm what you suspect).

---

## ENVIRONMENT VARIABLES

| Variable | Value | Notes |
|---|---|---|
| `YOUTUBE_API_KEY` | (existing) | Already set in Netlify. Used by ranking checker. |
| `GEMINI_API_KEY` | (existing) | Already set in Netlify. Fallback: `GOOGLE_API_KEY`. |
| `LOOPS_API_KEY` | (existing) | Already set in Netlify. Used by email capture. |

No new environment variables needed.

---

## QUOTA CONSIDERATIONS

Each tool use consumes approximately:
- 1 `videos.list` call = 1 quota unit
- 12 `search.list` calls = 1,200 quota units
- YouTube autocomplete calls = 0 quota units (free endpoint, no API key needed)
- Total: ~1,201 YouTube API quota units per use

With the default 10,000 units/day quota, this supports ~8 uses/day alongside existing tools. At current traffic levels this is sufficient. If the tool gains traction:
1. Request a quota increase in Google Cloud Console (straightforward, free)
2. Session caching prevents duplicate API calls for the same video within a session
3. Reduce to 10 keywords per report if quota becomes a bottleneck

---

## POST-LAUNCH CHECKLIST

After the tool is built and deployed:

1. **Submit to search engines:**
   - Submit `/tools/youtube-video-keyword-finder` to Bing via Webmaster API (IndexNow is broken due to Cloudflare; use `curl` to `SubmitUrlbatch` endpoint)
   - Remind Sathya to submit the URL in Google Search Console (URL Inspection → Request Indexing)

2. **Internal linking from existing content:**
   - Add a contextual link from `/blog/youtube-marketing-strategy` (pillar page, mentions keyword research)
   - Add a contextual link from `/blog/youtube-seo-guide` (covers keyword optimization)
   - Add a contextual link from `/blog/how-to-find-youtube-autocomplete-keywords` (directly related topic)
   - Add a contextual link from `/blog/best-youtube-seo-tools-for-business` (tool roundup, mention this as SellonTube's own tool)

3. **Blog companion post (ALREADY PUBLISHED):**
   - Post exists at `/blog/how-to-find-youtube-video-ranking-keywords` (published 2026-04-23)
   - Title: "How to Find What Keywords Your YouTube Videos Rank For"
   - Action: Add a contextual link FROM this blog post TO the new tool. Find the section where manual methods are discussed and add: "Or skip the manual work: paste your URL into the [YouTube Video Keyword Finder](/tools/youtube-video-keyword-finder) and get all 12 keywords checked in under 15 seconds."
   - Do NOT create a new blog post. The companion content already exists.

4. **Community launch:**
   - Reddit posts per `docs/strategy/reddit-marketing-playbook.md` in relevant subreddits (r/NewTubers, r/youtubers, r/SmallYTChannel)
   - Position around the VidIQ/TubeBuddy backlash: "I built a free tool because I was tired of VidIQ making up numbers"

---

---

# Document 2: "Why This Tool" Positioning Brief

## 1. The GSC Signal

**Page analysed:** `/tools/youtube-ranking-checker`
**Total queries:** 88 unique queries, 609 combined impressions (last 90 days)
**The cluster:** 7 queries specifically asking for reverse keyword lookup: "see what keywords a site ranks for free youtube" (4 imp, pos 34.8), "what keywords are my competitors ranking for free youtube" (1 imp, pos 12), "youtube keyword rank" (1 imp, pos 28), "top ranking keywords on youtube free" (1 imp, pos 39).
**Adjacent demand (site-wide):** "how to track keywords for youtube" (11 imp), "how to check keywords inyoutube" (2 imp). Total demand signal: ~20 impressions.

The impression volume is modest, but the query intent is razor-sharp and completely unserved. Every searcher explicitly wants: "show me what keywords this video ranks for."

## 2. The Search Behaviour Behind It

**Who:** Business owners and marketers who published YouTube videos and need to know if the investment is working. Also SEO practitioners doing competitive research on YouTube.

**What they're doing:** They've published a video (or found a competitor's video) and want to understand its search footprint. They don't want to guess keywords and check one by one. They want to paste a URL and see the full picture.

**Why a tool beats a blog post:** This is a doing task, not a learning task. No amount of explanation replaces the output of: "Your video ranks #3 for 'youtube seo for SaaS' and is invisible for 'B2B video marketing.'" The answer changes with every video URL and every week as rankings shift.

## 3. Community Validation

**Reddit pain points confirmed across 15+ posts:**
- r/SEO: "Is there any way to find what search keywords are directing traffic to a specific video?"
- BlackHatWorld: "I'm looking for something like I put the URL of a YouTube channel and get all the Ranking Keywords, like we do with website in Ahrefs."
- r/NewTubers: "VidIQ was the worst waste of 20 bucks I've made in my life."
- r/YouTubeCreators: Someone built and shared a free tool for exactly this problem, confirming the gap was painful enough to build for.

**Competitive landscape:** No free tool does reverse keyword lookup. All free rank checkers require the user to already know the keyword. The only paid tool (Arvow/YouTube Rank Tracker) starts at $99/month. VidIQ and TubeBuddy only show rankings for keywords in the video's tags, missing everything else.

## 4. Repeatability Argument

**Why it gets repeat use:**
- Every new video needs a keyword check after publishing
- Every existing video should be re-checked after metadata changes
- Competitor videos change: new content enters the market, old content loses position
- The input changes every time: different video URL, different results

**Email capture potential:** At 20 impressions/month (current) growing as the page climbs from position 30-60 toward page 1 for "youtube keyword rank checker" queries, a 15% capture rate on business emails would yield 3+ leads/month. At page-1 positions (where the ranking checker page would attract 200+ monthly visits based on the keyword volume), that scales to 30+ leads/month.

## 5. Funnel Fit

**Position:** Mid-funnel. The user has already published a video (past the "should I do YouTube?" stage) and is evaluating performance. They're close to the "I need help doing this properly" moment.

**Natural CTA:** "Your video ranks for 3 out of 12 keywords and you're invisible for the rest. Want a YouTube SEO strategy that fixes this?" Direct path to the diagnostic call.

**Cross-tool connections:**
- **From:** YouTube Ranking Checker ("I checked one keyword, now I want all of them") — 609 impressions, primary traffic source via in-tool CTA
- **To:** YouTube SEO Tool ("My video got a D grade, let me audit the metadata")
- **To:** YouTube Tag Generator ("My tags aren't covering these keywords, generate better ones")
- **To:** YouTube Title Generator ("The recommendation says to reword my title")

This tool is the bridge between "check one keyword" and "fix my entire video SEO."

## 6. What This Tool Is NOT

This tool does not provide an exhaustive list of every keyword a video ranks for. YouTube's API does not expose that data, and any tool claiming to do so is misleading its users. This tool uses real YouTube autocomplete data to identify 12 high-probability keywords, checks real search positions for each, and shows tag coverage gaps. It is an informed scan, not a complete index. The copy and FAQ are transparent about this, which differentiates SellonTube from tools that present fabricated data as definitive.
