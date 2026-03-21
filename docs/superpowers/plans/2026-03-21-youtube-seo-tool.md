# YouTube SEO Tool — Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build `/tools/youtube-seo-tool` — a free diagnostic that scores a YouTube video's metadata across 5 BoFu-aligned dimensions and generates exact fixes, using DataFetch API for video metadata + Gemini for AI analysis.

**Architecture:** Netlify function handles DataFetch API call (video metadata) + optional website scrape + single Gemini call. Astro page handles all UI, localStorage gate, and email capture. The two files share only the JSON response schema defined below — they are fully independent and can be built in parallel.

**Tech Stack:** Astro 5, Tailwind CSS, TypeScript, Netlify Functions, DataFetch API (`LF_YOUTUBE_KEY`), Gemini Flash (`GEMINI_API_KEY`), Google Apps Script (email capture)

**Spec:** `docs/superpowers/specs/2026-03-21-youtube-seo-tool-design.md`

---

## Shared Contract (read before building either file)

The Netlify function returns this exact JSON shape on success (HTTP 200):

```json
{
  "business_summary": "string — one sentence about what this business sells and who they serve",
  "recommended_keywords": ["string", "string", "string"],
  "scores": {
    "title":       { "score": 14, "label": "Title Relevance",    "fix": "string or null" },
    "description": { "score": 11, "label": "Description Opening", "fix": "string or null" },
    "keywords":    { "score": 9,  "label": "Keyword Coverage",    "fix": "string or null" },
    "cta":         { "score": 6,  "label": "CTA Quality",         "fix": "string or null" },
    "chapters":    { "score": 0,  "label": "Chapter Labels",      "fix": "string or null" }
  },
  "total_score": 40,
  "headline_diagnosis": "string — one sentence naming the single biggest reason this video isn't found by buyers"
}
```

`fix` is `null` when `score >= 15`. Never omit a key — always include all 5 dimension objects.

Error responses:
```json
{ "error": "human-readable message" }         // 400, 500
{ "error": "quota_exceeded" }                  // 429
{ "error": "AI service unavailable", "geminiStatus": 503, "detail": "..." }  // 503
```

---

## Chunk 1: Netlify Function

**Can be built in parallel with Chunk 2.**

### Files
- **Create:** `netlify/functions/youtube-seo-tool.ts`
- **Reference:** `netlify/functions/generate-video-ideas.ts` (mirror structure)

---

### Task 1.1 — Video ID extractor + DataFetch API call

- [ ] **Step 1: Create the file with video ID extraction**

Create `netlify/functions/youtube-seo-tool.ts`. Start with the `extractVideoId` helper — copy from `netlify/functions/get-transcript.ts` (already handles all YouTube URL formats):

```typescript
// youtube-seo-tool.ts

const DATAFETCH_BASE = 'https://api.datafetchapi.com/v1/youtube/video';
const GEMINI_API_URL =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent';

function extractVideoId(input: string): string | null {
  const trimmed = input.trim();
  if (/^[\w-]{11}$/.test(trimmed)) return trimmed;
  const longMatch = trimmed.match(/[?&]v=([\w-]{11})/);
  if (longMatch) return longMatch[1];
  const shortMatch = trimmed.match(/youtu\.be\/([\w-]{11})/);
  if (shortMatch) return shortMatch[1];
  const embedMatch = trimmed.match(/youtube\.com\/(?:embed|v)\/([\w-]{11})/);
  if (embedMatch) return embedMatch[1];
  const shortsMatch = trimmed.match(/youtube\.com\/shorts\/([\w-]{11})/);
  if (shortsMatch) return shortsMatch[1];
  return null;
}
```

- [ ] **Step 2: Add the `fetchVideoMetadata` helper**

```typescript
interface VideoMetadata {
  title: string;
  description: string;
}

async function fetchVideoMetadata(videoId: string, apiKey: string): Promise<VideoMetadata> {
  const res = await fetch(`${DATAFETCH_BASE}/${videoId}`, {
    headers: { 'X-API-KEY': apiKey },
  });

  if (res.status === 404) {
    throw Object.assign(new Error('Video not found or private'), { code: 'VIDEO_NOT_FOUND' });
  }
  if (!res.ok) {
    throw Object.assign(new Error(`DataFetch error: ${res.status}`), { code: 'DATAFETCH_ERROR' });
  }

  const data = await res.json();

  if (!data.title || !data.description) {
    throw Object.assign(new Error('Unexpected DataFetch response shape'), { code: 'DATAFETCH_ERROR' });
  }

  return { title: String(data.title), description: String(data.description) };
}
```

- [ ] **Step 3: Add the `fetchWebsiteText` helper**

```typescript
async function fetchWebsiteText(url: string): Promise<string | null> {
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; SellonTube/1.0)' },
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) return null;

    const html = await res.text();
    // Strip tags, collapse whitespace, truncate
    const text = html
      .replace(/<script[\s\S]*?<\/script>/gi, '')
      .replace(/<style[\s\S]*?<\/style>/gi, '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, 3000);

    return text || null;
  } catch {
    return null;
  }
}
```

- [ ] **Step 4: Add the `scoreDimension` type and response types**

```typescript
interface ScoreDimension {
  score: number;
  label: string;
  fix: string | null;
}

interface SeoToolResponse {
  business_summary: string;
  recommended_keywords: string[];
  scores: {
    title: ScoreDimension;
    description: ScoreDimension;
    keywords: ScoreDimension;
    cta: ScoreDimension;
    chapters: ScoreDimension;
  };
  total_score: number;
  headline_diagnosis: string;
}
```

- [ ] **Step 5: Type-check**

```bash
cd "c:/Users/D E L L/Downloads/Claude Coded/SellonTube"
npm run check:astro
```

Expected: no errors on the new file (partial file — may warn about missing export default, that's fine at this stage).

---

### Task 1.2 — Gemini prompt + system instruction

- [ ] **Step 1: Add the system instruction constant**

Add to `netlify/functions/youtube-seo-tool.ts`:

```typescript
const SYSTEM_INSTRUCTION = `You are a YouTube SEO specialist focused on B2B buyer-intent optimisation. You help business owners rank their videos for queries that actual buyers type — not general viewers.

## Your Scoring Framework

Score each dimension 0–20. A "fix" is required when score < 15. The fix must be the ACTUAL rewritten text — not advice about what to write.

### 1. Title Relevance (0–20)
Score on BoFu alignment, not keyword presence.
- ToFu titles ("What is X", "Introduction to Y", "How X works") score 0–5 regardless of keywords
- Buyer-intent signal words: "best," "vs," "review," "cost," "alternatives," "fix," "setup," "how to choose," "for [specific business type]"
- Problem-solving and comparison titles score 15–20
- Fix: write the ACTUAL improved title — specific, BoFu-framed, using the buyer keyword

### 2. Description Opening (0–20)
Two-layer score combined:
- Layer A (0–10): First 150 chars — does it include the keyword + a value proposition?
- Layer B (0–10): Full description body — buyer-intent keywords appearing consistently?
- Fix: write the ACTUAL first 150 characters of an improved description

### 3. Keyword Coverage (0–20)
- Identify 3 buyer-intent keywords this video should rank for
- Score how many appear and how naturally in the full description
- Fix: list the exact buyer-intent keywords to weave into the description

### 4. CTA Quality (0–20)
Two-part check:
- Part A: Is a CTA present in the FIRST 150 chars (above YouTube's "Show more" fold)?
- Part B: Is it action-oriented toward a business outcome ("book a call," "download the guide," "start your free trial") — not just a bare URL?
- Bare URL only = 4/20. Strong above-fold CTA = 18–20/20
- Fix: write the ACTUAL CTA copy with exact placement instruction

### 5. Chapter Labels (0–20)
- No timestamps = 0/20
- Bland labels ("Introduction," "Part 2," "Overview") = 6–10/20
- Searchable buyer-intent labels = 16–20/20
- Fix: generate 4–5 ACTUAL chapter label suggestions in the format "00:00 Label text here"

## Anti-AI Writing Rules (MANDATORY for all fix text)
Before returning your response, audit every fix for these patterns and rewrite any that appear:
- No AI vocabulary: emphasizing, fostering, landscape, testament, delve, utilize, leverage, robust, comprehensive, seamless
- No negative parallelisms ("not just X, it's Y")
- No em dashes
- No rule-of-three lists
- No filler phrases ("in order to," "due to the fact that," "it is important to note")
- Write specific, not vague — concrete details, not generalisations
- Short, direct sentences
- Varied structure — not formulaic
- If a fix sounds like AI wrote it, rewrite it until it sounds like a direct person said it

## Output Format
Return ONLY valid JSON. No preamble, no markdown fences, no explanation.

{
  "business_summary": "One sentence: what this business sells and who they serve",
  "recommended_keywords": ["keyword 1", "keyword 2", "keyword 3"],
  "scores": {
    "title":       { "score": 0-20, "label": "Title Relevance",    "fix": "string or null if score >= 15" },
    "description": { "score": 0-20, "label": "Description Opening", "fix": "string or null" },
    "keywords":    { "score": 0-20, "label": "Keyword Coverage",    "fix": "string or null" },
    "cta":         { "score": 0-20, "label": "CTA Quality",         "fix": "string or null" },
    "chapters":    { "score": 0-20, "label": "Chapter Labels",      "fix": "string or null" }
  },
  "total_score": 0-100,
  "headline_diagnosis": "One sentence naming the single biggest reason this video isn't found by buyers"
}`;
```

- [ ] **Step 2: Add the `buildUserPrompt` function**

```typescript
function buildUserPrompt(
  title: string,
  description: string,
  websiteText: string | null
): string {
  const websiteSection = websiteText
    ? `WEBSITE CONTENT (use this to understand what the business sells and who their buyers are):\n${websiteText}`
    : `WEBSITE CONTENT: Not available. Infer the business context from the video title and description alone.`;

  return `Analyse this YouTube video's metadata and score it across the 5 dimensions.

VIDEO TITLE:
${title}

VIDEO DESCRIPTION:
${description}

${websiteSection}

Identify the buyer-intent keywords this video should rank for based on the business context. Score each dimension. For any dimension scoring below 15, write the actual improved text (not advice — the real copy). Apply the anti-AI writing rules to all fix text before returning.`;
}
```

---

### Task 1.3 — Main handler + Gemini call + full error handling

- [ ] **Step 1: Add CORS headers constant and the main export**

```typescript
const HEADERS = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': 'https://sellontube.com',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export default async (request: Request) => {
  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: HEADERS });
  }
  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405, headers: HEADERS });
  }

  // --- API key checks ---
  const youtubeKey = process.env.LF_YOUTUBE_KEY;
  if (!youtubeKey) {
    return new Response(
      JSON.stringify({ error: 'Service temporarily unavailable.' }),
      { status: 500, headers: HEADERS }
    );
  }

  const geminiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
  if (!geminiKey) {
    return new Response(
      JSON.stringify({ error: 'Service temporarily unavailable.' }),
      { status: 500, headers: HEADERS }
    );
  }

  // --- Parse body ---
  let videoUrl: string;
  let websiteUrl: string;
  try {
    const body = await request.json();
    videoUrl = (body.videoUrl || '').trim();
    websiteUrl = (body.websiteUrl || '').trim();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid request body.' }), { status: 400, headers: HEADERS });
  }

  // --- Validate video URL ---
  const videoId = extractVideoId(videoUrl);
  if (!videoId) {
    return new Response(
      JSON.stringify({ error: "That doesn't look like a valid YouTube URL. Try pasting the full link from your browser." }),
      { status: 400, headers: HEADERS }
    );
  }

  try {
    // --- Stage 1: Fetch video metadata ---
    let metadata: VideoMetadata;
    try {
      metadata = await fetchVideoMetadata(videoId, youtubeKey);
    } catch (err: unknown) {
      const code = (err as { code?: string }).code;
      if (code === 'VIDEO_NOT_FOUND') {
        return new Response(
          JSON.stringify({ error: "We couldn't access that video. Make sure it's public and the URL is correct." }),
          { status: 400, headers: HEADERS }
        );
      }
      // DataFetch service error — treat as 503
      return new Response(
        JSON.stringify({ error: 'Something went wrong on our end. Please try again in a moment.' }),
        { status: 503, headers: HEADERS }
      );
    }

    // --- Stage 2: Fetch website text (optional enrichment) ---
    const websiteText = websiteUrl ? await fetchWebsiteText(websiteUrl) : null;

    // --- Stage 3: Gemini analysis ---
    const geminiRes = await fetch(`${GEMINI_API_URL}?key=${geminiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: SYSTEM_INSTRUCTION }] },
        contents: [{
          parts: [{ text: buildUserPrompt(metadata.title, metadata.description, websiteText) }],
        }],
        generationConfig: {
          responseMimeType: 'application/json',
          temperature: 0.3,
          maxOutputTokens: 2048,
        },
      }),
    });

    if (!geminiRes.ok) {
      const errText = await geminiRes.text();
      console.error('Gemini error:', geminiRes.status, errText);
      if (geminiRes.status === 429) {
        return new Response(JSON.stringify({ error: 'quota_exceeded' }), { status: 429, headers: HEADERS });
      }
      // Use 503 not 502 — Cloudflare intercepts 502 and replaces the response body
      return new Response(
        JSON.stringify({
          error: 'AI service unavailable',
          geminiStatus: geminiRes.status,
          detail: errText.slice(0, 500),
        }),
        { status: 503, headers: HEADERS }
      );
    }

    const geminiData = await geminiRes.json();
    const raw = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
    const result: SeoToolResponse = JSON.parse(raw);

    // Basic shape validation
    if (
      !result.business_summary ||
      !Array.isArray(result.recommended_keywords) ||
      !result.scores?.title ||
      typeof result.total_score !== 'number'
    ) {
      throw new Error('Invalid response structure from Gemini');
    }

    return new Response(JSON.stringify(result), { status: 200, headers: HEADERS });

  } catch (error) {
    console.error('youtube-seo-tool error:', error);
    return new Response(
      JSON.stringify({ error: 'Something went wrong on our end. Please try again in a moment.' }),
      { status: 500, headers: HEADERS }
    );
  }
};

export const config = {
  path: '/api/youtube-seo-tool',
};
```

- [ ] **Step 2: Run TypeScript check**

```bash
npm run check:astro
```

Expected: no type errors in `netlify/functions/youtube-seo-tool.ts`.

- [ ] **Step 3: Run lint**

```bash
npm run check:eslint
```

Fix any ESLint warnings before proceeding.

- [ ] **Step 4: Commit**

```bash
git add netlify/functions/youtube-seo-tool.ts
git commit -m "feat: add youtube-seo-tool Netlify function"
```

---

## Chunk 2: Astro Page

**Can be built in parallel with Chunk 1.**

### Files
- **Create:** `src/pages/tools/youtube-seo-tool.astro`
- **Reference:** `src/pages/tools/youtube-video-ideas-generator.astro` (mirror structure exactly)

---

### Task 2.1 — Page shell + hero + input form

- [ ] **Step 1: Create the Astro page with metadata + hero**

Create `src/pages/tools/youtube-seo-tool.astro`:

```astro
---
import Layout from '~/layouts/PageLayout.astro';
import CallToAction from '~/components/widgets/CallToAction.astro';

const metadata = {
  title: 'YouTube SEO Tool — Free Video Metadata Checker for Business Channels',
  description:
    'Paste your YouTube video URL and get a plain-English diagnosis: why buyers aren\'t finding it and exactly what to fix. Free. No login.',
};
---

<Layout metadata={metadata}>

  <!-- Hero -->
  <section class="bg-white dark:bg-slate-950 pt-16 pb-12 sm:pt-20 sm:pb-16">
    <div class="max-w-3xl mx-auto px-4 text-center">
      <div class="flex flex-wrap justify-center gap-2 mb-6">
        <span class="inline-flex items-center text-xs font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-3 py-1">5 SEO dimensions</span>
        <span class="inline-flex items-center text-xs font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-3 py-1">Buyer-intent scoring</span>
        <span class="inline-flex items-center text-xs font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-3 py-1">Exact fixes included</span>
      </div>
      <h1 class="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white leading-tight mb-4">
        Find Out Why Your YouTube Videos<br class="hidden sm:block" /> Aren't Reaching Buyers
      </h1>
      <p class="text-gray-500 dark:text-slate-400 text-base sm:text-lg max-w-xl mx-auto">
        Paste your video URL and website. Get a plain-English diagnosis and exact fixes in 30 seconds.
      </p>
    </div>
  </section>

  <!-- Tool -->
  <section class="bg-white dark:bg-slate-950 pb-20">
    <div id="tool-container" class="max-w-xl mx-auto px-4">

      <!-- Step: Input -->
      <div id="step-input" class="rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 p-6 sm:p-8">
        <div class="space-y-5">

          <div>
            <label for="video-url-input" class="block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-slate-400 mb-2">
              YouTube Video URL
            </label>
            <input
              type="url"
              id="video-url-input"
              placeholder="https://youtube.com/watch?v=..."
              class="w-full text-base font-medium px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-500 focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-colors"
              aria-describedby="video-url-error"
            />
            <p id="video-url-error" class="hidden mt-1.5 text-xs text-rose-600 dark:text-rose-400" role="alert"></p>
          </div>

          <div>
            <label for="website-url-input" class="block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-slate-400 mb-2">
              Your Website or Product Page URL
            </label>
            <input
              type="url"
              id="website-url-input"
              placeholder="https://yoursite.com"
              class="w-full text-base font-medium px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-500 focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-colors"
              aria-describedby="website-url-error"
            />
            <p id="website-url-error" class="hidden mt-1.5 text-xs text-rose-600 dark:text-rose-400" role="alert"></p>
          </div>

        </div>

        <button
          id="analyse-btn"
          class="mt-7 w-full inline-flex items-center justify-center rounded-xl px-6 py-3.5 text-base font-bold bg-emerald-500 text-white dark:text-slate-950 hover:bg-emerald-400 transition-colors"
        >
          Analyse My Video &rarr;
        </button>

        <p id="uses-counter-label" class="mt-3 text-center text-xs text-gray-400 dark:text-slate-600">
          3 free analyses remaining
        </p>
      </div>

      <!-- Step: Loading -->
      <div
        id="step-loading"
        class="hidden rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 p-6 sm:p-8 text-center"
      >
        <div class="flex flex-col items-center gap-4 py-10">
          <div class="w-10 h-10 border-[3px] border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
          <p class="text-sm font-medium text-gray-500 dark:text-slate-400">Analysing your video and business...</p>
          <p class="text-xs text-gray-400 dark:text-slate-600">Checking 5 SEO dimensions</p>
        </div>
      </div>

    </div>

    <!-- Results panel (wider) -->
    <div id="step-results" class="hidden max-w-2xl mx-auto px-4 mt-2" role="status" aria-live="polite">
      <!-- populated by JS -->
    </div>

  </section>

  <CallToAction
    title="A score is a start. A strategy converts."
    subtitle="We map your full YouTube acquisition system: the keywords your buyers search, the topics that drive demos, the CTA structure that converts viewers to leads."
    actions={[
      {
        variant: 'primary',
        text: 'Book a free diagnostic call',
        href: 'https://cal.com/gautham-8bdvdx/30min',
        target: '_blank',
        rel: 'noopener noreferrer',
      },
    ]}
  />

  <!-- How it works -->
  <section class="py-16 sm:py-20 bg-white dark:bg-slate-950">
    <div class="max-w-4xl mx-auto px-4">
      <p class="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-slate-500 text-center mb-10">How it works</p>
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-6">
        <div>
          <div class="inline-flex items-center justify-center w-9 h-9 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-sm font-bold mb-4">1</div>
          <h3 class="text-gray-900 dark:text-white font-semibold mb-2">Paste your video and website</h3>
          <p class="text-sm text-gray-500 dark:text-slate-400 leading-relaxed">Two URLs. The tool reads your video metadata and your business context automatically.</p>
        </div>
        <div>
          <div class="inline-flex items-center justify-center w-9 h-9 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-sm font-bold mb-4">2</div>
          <h3 class="text-gray-900 dark:text-white font-semibold mb-2">Get a buyer-intent score</h3>
          <p class="text-sm text-gray-500 dark:text-slate-400 leading-relaxed">5 dimensions scored on one question: will buyers find this video when they're ready to act?</p>
        </div>
        <div>
          <div class="inline-flex items-center justify-center w-9 h-9 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-sm font-bold mb-4">3</div>
          <h3 class="text-gray-900 dark:text-white font-semibold mb-2">Copy the exact fixes</h3>
          <p class="text-sm text-gray-500 dark:text-slate-400 leading-relaxed">Every failing dimension includes the actual rewritten title, description, or chapter labels. Paste and publish.</p>
        </div>
      </div>
    </div>
  </section>

</Layout>
```

- [ ] **Step 2: Run check**

```bash
npm run check:astro
```

Expected: no errors.

---

### Task 2.2 — Results panel rendering + score cards

- [ ] **Step 1: Add the `<script>` block — constants, storage, step management**

Add inside `youtube-seo-tool.astro` before `</Layout>`:

```html
<script>
  // ===== CONSTANTS =====
  const RATE_LIMIT = 3;
  const COUNT_KEY = 'yt_seo_tool_uses';
  const EMAIL_KEY = 'yt_seo_tool_email';
  const APPS_SCRIPT_URL =
    'https://script.google.com/macros/s/AKfycbwNJSU1oWry-OSkFGit4OCs1f_0W6KX9K9WASHhah5ZXcDSxjZWUQ5Uw2S4PSSoZhgD/exec';

  // ===== STORAGE =====
  function getCount(): number {
    return parseInt(localStorage.getItem(COUNT_KEY) || '0', 10);
  }
  function incrementCount(): void {
    localStorage.setItem(COUNT_KEY, (getCount() + 1).toString());
  }
  function isEmailSubmitted(): boolean {
    return localStorage.getItem(EMAIL_KEY) === 'true';
  }
  function setEmailSubmitted(): void {
    localStorage.setItem(EMAIL_KEY, 'true');
  }

  // ===== STEP MANAGEMENT =====
  const STEPS = ['step-input', 'step-loading'];
  function showStep(id: string): void {
    STEPS.forEach((s) => {
      const el = document.getElementById(s);
      if (el) el.classList.toggle('hidden', s !== id);
    });
    if (id === 'step-results') {
      // results panel is separate — shown by removing 'hidden' directly
      document.getElementById('step-results')?.classList.remove('hidden');
      STEPS.forEach((s) => document.getElementById(s)?.classList.add('hidden'));
    }
  }

  // ===== SCORE HELPERS =====
  function scoreColor(score: number, max: number): string {
    const pct = score / max;
    if (pct >= 0.75) return 'bg-emerald-500';
    if (pct >= 0.5) return 'bg-amber-400';
    return 'bg-rose-500';
  }

  function totalScoreLabel(total: number): string {
    if (total >= 80) return 'Strong metadata — minor refinements needed';
    if (total >= 50) return 'Your video is partially optimised — buyers are missing it';
    return 'Your video is nearly invisible to buyers';
  }

  function totalScoreColor(total: number): string {
    if (total >= 80) return 'text-emerald-600 dark:text-emerald-400';
    if (total >= 50) return 'text-amber-600 dark:text-amber-400';
    return 'text-rose-600 dark:text-rose-400';
  }
```

- [ ] **Step 2: Add the `renderResults` function**

Continue inside the script block:

```typescript
  // ===== RENDER RESULTS =====
  interface ScoreDimension {
    score: number;
    label: string;
    fix: string | null;
  }
  interface SeoResult {
    business_summary: string;
    recommended_keywords: string[];
    scores: {
      title: ScoreDimension;
      description: ScoreDimension;
      keywords: ScoreDimension;
      cta: ScoreDimension;
      chapters: ScoreDimension;
    };
    total_score: number;
    headline_diagnosis: string;
  }

  function renderResults(result: SeoResult): void {
    const container = document.getElementById('step-results');
    if (!container) return;

    const dimensionOrder: (keyof SeoResult['scores'])[] = [
      'title', 'description', 'keywords', 'cta', 'chapters',
    ];

    const dimensionRows = dimensionOrder.map((key) => {
      const dim = result.scores[key];
      const barColor = scoreColor(dim.score, 20);
      const barWidth = Math.round((dim.score / 20) * 100);
      const fixHtml = dim.fix
        ? `<div class="mt-3 p-3 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
             <p class="text-xs font-semibold uppercase tracking-wider text-amber-700 dark:text-amber-400 mb-1">What to change:</p>
             <p class="text-sm text-amber-900 dark:text-amber-100 leading-relaxed">${dim.fix}</p>
           </div>`
        : '';
      return `
        <div class="py-4 border-b border-slate-100 dark:border-slate-800 last:border-0">
          <div class="flex items-center justify-between mb-2">
            <span class="text-sm font-semibold text-gray-800 dark:text-slate-200">${dim.label}</span>
            <span class="text-sm font-bold ${dim.score >= 15 ? 'text-emerald-600 dark:text-emerald-400' : dim.score >= 10 ? 'text-amber-600 dark:text-amber-400' : 'text-rose-600 dark:text-rose-400'}">${dim.score}/20</span>
          </div>
          <div class="h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
            <div class="h-full ${barColor} rounded-full transition-all" style="width: ${barWidth}%"></div>
          </div>
          ${fixHtml}
        </div>`;
    }).join('');

    const keywordBadges = result.recommended_keywords.map((kw) =>
      `<span class="inline-flex items-center text-xs font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800 rounded-full px-3 py-1">${kw}</span>`
    ).join('');

    container.innerHTML = `
      <div class="rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 overflow-hidden">

        <!-- Diagnosis -->
        <div class="p-6 sm:p-8 border-b border-slate-200 dark:border-slate-700/60 bg-rose-50 dark:bg-rose-900/10">
          <p class="text-xs font-semibold uppercase tracking-wider text-rose-500 dark:text-rose-400 mb-2">Primary issue</p>
          <p class="text-base font-semibold text-gray-900 dark:text-white leading-snug">${result.headline_diagnosis}</p>
        </div>

        <!-- Score -->
        <div class="p-6 sm:p-8 border-b border-slate-200 dark:border-slate-700/60">
          <p class="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-slate-500 mb-2">Overall score</p>
          <div class="flex items-baseline gap-2">
            <span class="text-5xl font-bold ${totalScoreColor(result.total_score)}">${result.total_score}</span>
            <span class="text-xl text-gray-400 dark:text-slate-500">/ 100</span>
          </div>
          <p class="mt-1 text-sm text-gray-500 dark:text-slate-400">${totalScoreLabel(result.total_score)}</p>
        </div>

        <!-- Business read + keywords -->
        <div class="p-6 sm:p-8 border-b border-slate-200 dark:border-slate-700/60">
          <p class="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-slate-500 mb-2">Business read</p>
          <p class="text-sm text-gray-700 dark:text-slate-300 mb-4">${result.business_summary}</p>
          <p class="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-slate-500 mb-2">Keywords you should rank for</p>
          <div class="flex flex-wrap gap-2">${keywordBadges}</div>
        </div>

        <!-- Dimension scores -->
        <div class="px-6 sm:px-8 pb-2">
          <p class="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-slate-500 pt-6 mb-2">Score breakdown</p>
          ${dimensionRows}
        </div>

        <!-- CTA -->
        <div class="p-6 sm:p-8 border-t border-slate-200 dark:border-slate-700/60 bg-emerald-500/5">
          <p class="text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Want us to build a YouTube strategy around keywords your buyers are actually searching?</p>
          <p class="text-xs text-gray-400 dark:text-slate-500 mb-4">Book a free diagnostic call with SellonTube.</p>
          <a
            href="https://cal.com/gautham-8bdvdx/30min"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center justify-center rounded-xl px-6 py-3 text-sm font-bold bg-emerald-500 text-white dark:text-slate-950 hover:bg-emerald-400 transition-colors"
          >
            Book a free diagnostic call &rarr;
          </a>
        </div>

        <!-- Reset -->
        <div class="px-6 pb-6 sm:px-8 sm:pb-8 pt-4">
          <button
            id="reset-btn"
            class="w-full py-3 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-medium text-gray-500 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white hover:border-slate-400 dark:hover:border-slate-500 transition-colors"
          >
            &larr; Analyse another video
          </button>
        </div>

      </div>
    `;

    // Bind reset
    document.getElementById('reset-btn')?.addEventListener('click', () => {
      container.classList.add('hidden');
      container.innerHTML = '';
      showStep('step-input');
      updateCounterLabel();
    });
  }
```

- [ ] **Step 3: Run check**

```bash
npm run check:astro
```

Expected: no errors.

---

### Task 2.3 — Email gate overlay + API call + form submission

- [ ] **Step 1: Add `showEmailGate` function**

Continue inside script block:

```typescript
  // ===== EMAIL GATE =====
  function showEmailGate(onUnlock: () => void): void {
    const resultsEl = document.getElementById('step-results');
    if (!resultsEl) return;

    // Wrap existing content in blur
    const inner = resultsEl.querySelector('.rounded-2xl');
    if (inner) (inner as HTMLElement).style.filter = 'blur(4px)';

    // Inject overlay
    const overlay = document.createElement('div');
    overlay.id = 'email-gate-overlay';
    overlay.className =
      'absolute inset-0 flex items-center justify-center bg-white/80 dark:bg-slate-950/80 backdrop-blur-sm rounded-2xl z-10 p-6';
    overlay.innerHTML = `
      <div class="w-full max-w-sm text-center">
        <p class="text-base font-semibold text-gray-900 dark:text-white mb-2">You've used your 3 free analyses</p>
        <p class="text-sm text-gray-500 dark:text-slate-400 mb-5">Enter your email to keep going. Still free.</p>
        <div id="gate-form" class="space-y-3">
          <input
            type="email"
            id="gate-email"
            placeholder="your@company.com"
            class="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
          />
          <p id="gate-email-error" class="hidden text-xs text-rose-600 dark:text-rose-400" role="alert"></p>
          <button
            id="gate-submit-btn"
            class="w-full inline-flex items-center justify-center rounded-xl px-6 py-3.5 text-base font-bold bg-emerald-500 text-white dark:text-slate-950 hover:bg-emerald-400 transition-colors"
          >
            Unlock Results
          </button>
          <p class="text-xs text-gray-400 dark:text-slate-600">No spam. No sales calls unless you want one.</p>
        </div>
        <div id="gate-success" class="hidden">
          <p class="text-sm font-semibold text-emerald-600 dark:text-emerald-400">Got it. Loading your results...</p>
        </div>
      </div>
    `;

    // Gate overlay needs relative parent
    resultsEl.style.position = 'relative';
    resultsEl.appendChild(overlay);

    // Bind submit
    document.getElementById('gate-submit-btn')?.addEventListener('click', async () => {
      const emailInput = document.getElementById('gate-email') as HTMLInputElement;
      const errorEl = document.getElementById('gate-email-error');
      const email = emailInput?.value.trim();

      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        if (errorEl) {
          errorEl.textContent = 'Please enter a valid email address.';
          errorEl.classList.remove('hidden');
        }
        return;
      }
      if (errorEl) errorEl.classList.add('hidden');

      document.getElementById('gate-form')?.classList.add('hidden');
      document.getElementById('gate-success')?.classList.remove('hidden');

      // Capture to Google Sheets (fire and forget — never block unlock)
      try {
        await fetch(APPS_SCRIPT_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email,
            tool: 'youtube-seo-tool',
            timestamp: new Date().toISOString(),
          }),
        });
      } catch {
        // Sheets failure — still unlock
      }

      setEmailSubmitted();

      // Remove gate
      setTimeout(() => {
        overlay.remove();
        if (inner) (inner as HTMLElement).style.filter = '';
        resultsEl.style.position = '';
        onUnlock();
      }, 800);
    });
  }
```

- [ ] **Step 2: Add the main `handleSubmit` function + form wiring**

Continue inside script block:

```typescript
  // ===== COUNTER LABEL =====
  function updateCounterLabel(): void {
    const label = document.getElementById('uses-counter-label');
    if (!label) return;
    const remaining = Math.max(0, RATE_LIMIT - getCount());
    if (isEmailSubmitted() || remaining > 0) {
      label.textContent = isEmailSubmitted()
        ? 'Unlimited analyses'
        : `${remaining} free ${remaining === 1 ? 'analysis' : 'analyses'} remaining`;
    } else {
      label.textContent = 'Enter your email to keep analysing — free';
    }
  }

  // ===== SUBMIT HANDLER =====
  async function handleSubmit(): Promise<void> {
    const videoInput = document.getElementById('video-url-input') as HTMLInputElement;
    const websiteInput = document.getElementById('website-url-input') as HTMLInputElement;
    const videoErrorEl = document.getElementById('video-url-error');
    const websiteErrorEl = document.getElementById('website-url-error');

    // Clear errors
    [videoErrorEl, websiteErrorEl].forEach((el) => el?.classList.add('hidden'));

    const videoUrl = videoInput?.value.trim();
    const websiteUrl = websiteInput?.value.trim();

    if (!videoUrl) {
      if (videoErrorEl) {
        videoErrorEl.textContent = 'Please enter a YouTube video URL.';
        videoErrorEl.classList.remove('hidden');
      }
      return;
    }
    if (!websiteUrl) {
      if (websiteErrorEl) {
        websiteErrorEl.textContent = 'Please enter your website URL.';
        websiteErrorEl.classList.remove('hidden');
      }
      return;
    }

    showStep('step-loading');

    try {
      const res = await fetch('/api/youtube-seo-tool', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ videoUrl, websiteUrl }),
      });

      if (res.status === 429) {
        showStep('step-input');
        if (videoErrorEl) {
          videoErrorEl.textContent =
            'AI analysis is at capacity right now. Free daily limit reached. Check back tomorrow or try again in a moment.';
          videoErrorEl.classList.remove('hidden');
        }
        return;
      }

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        showStep('step-input');
        if (videoErrorEl) {
          videoErrorEl.textContent = data.error || 'Something went wrong. Please try again.';
          videoErrorEl.classList.remove('hidden');
        }
        return;
      }

      const result = await res.json();
      incrementCount();
      updateCounterLabel();

      // Render results first (gate may need them visible to blur)
      showStep('step-results');
      renderResults(result);

      // Check gate
      const needsGate = getCount() > RATE_LIMIT && !isEmailSubmitted();
      if (needsGate) {
        showEmailGate(() => {
          // After email submitted, results already rendered — nothing else to do
        });
      }

    } catch {
      showStep('step-input');
      if (videoErrorEl) {
        videoErrorEl.textContent = 'Something went wrong. Please try again.';
        videoErrorEl.classList.remove('hidden');
      }
    }
  }

  // ===== INIT =====
  document.addEventListener('DOMContentLoaded', () => {
    updateCounterLabel();

    document.getElementById('analyse-btn')?.addEventListener('click', handleSubmit);

    // Allow Enter key in inputs
    ['video-url-input', 'website-url-input'].forEach((id) => {
      document.getElementById(id)?.addEventListener('keydown', (e) => {
        if ((e as KeyboardEvent).key === 'Enter') handleSubmit();
      });
    });
  });
</script>
```

- [ ] **Step 3: Run full check**

```bash
npm run check:astro && npm run check:eslint
```

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add src/pages/tools/youtube-seo-tool.astro
git commit -m "feat: add youtube-seo-tool Astro page"
```

---

## Chunk 3: Integration + Polish

**Run after Chunks 1 and 2 are complete.**

### Task 3.1 — Add tool to tools index

- [ ] **Step 1: Edit `src/pages/tools/index.astro`**

Add the new tool as the **first** item in the `tools` array (it's the flagship tool):

```typescript
{
  name: 'YouTube SEO Tool',
  slug: '/tools/youtube-seo-tool',
  tagline: 'Why aren\'t buyers finding your YouTube videos?',
  description:
    'Paste your video URL and website. Get a buyer-intent score across 5 dimensions — title relevance, description quality, keyword coverage, CTA strength, chapter labels — plus the exact rewritten text to fix each failing dimension.',
  badge: 'SEO Audit',
  badgeColor: 'emerald',
},
```

- [ ] **Step 2: Run check**

```bash
npm run check:astro
```

- [ ] **Step 3: Update `.env.example`**

Add a comment documenting `LF_YOUTUBE_KEY` is also used by the SEO tool:

```bash
# YouTube / DataFetch API (used by transcript generator + youtube-seo-tool)
LF_YOUTUBE_KEY=your_datafetch_api_key_here
```

- [ ] **Step 4: Commit**

```bash
git add src/pages/tools/index.astro .env.example
git commit -m "feat: add YouTube SEO Tool to tools index"
```

---

### Task 3.2 — Local dev test

- [ ] **Step 1: Add `LF_YOUTUBE_KEY` to your local `.env`**

Copy the value from Netlify dashboard → Site settings → Environment variables → `LF_YOUTUBE_KEY`.

Add to `.env`:
```
LF_YOUTUBE_KEY=your_actual_key_here
```

- [ ] **Step 2: Start dev server with Netlify CLI**

```bash
netlify dev
```

Expected: server starts on `http://localhost:8888`.

- [ ] **Step 3: Test happy path**

Open `http://localhost:8888/tools/youtube-seo-tool`. Use a real public YouTube video from your own channel or a test channel. Enter a website URL. Click "Analyse My Video".

Expected:
- Loading spinner appears
- Results panel appears with headline diagnosis, total score, 5 dimension score cards
- At least one dimension has a fix (unless the video is very well optimised)
- Business read and keyword badges render correctly

- [ ] **Step 4: Test error paths**

1. Enter `https://youtube.com/watch?v=invalidid123` → expect "We couldn't access that video" message
2. Enter `not-a-url` as video URL → expect "That doesn't look like a valid YouTube URL" message
3. Leave website URL blank → expect validation error before API call

- [ ] **Step 5: Test usage gate**

Open DevTools → Application → Local Storage. Set `yt_seo_tool_uses` to `3`. Run an analysis. Expected: email gate overlay appears over blurred results.

- [ ] **Step 6: Test email capture**

Submit an email in the gate. Expected: overlay disappears, results fully visible, Google Sheets receives the entry (check the sheet).

- [ ] **Step 7: Commit if all tests pass**

```bash
git add .env.example
git commit -m "chore: document LF_YOUTUBE_KEY usage in .env.example"
```

---

### Task 3.3 — Final checks + PR

- [ ] **Step 1: Run full check suite**

```bash
npm run check
```

Expected: all pass (astro check + eslint + prettier).

- [ ] **Step 2: Build check**

```bash
npm run build
```

Expected: builds without errors or type failures.

- [ ] **Step 3: Mobile check**

Open DevTools → toggle device toolbar → test on 375px width. Verify: inputs, score cards, fix panels, email gate all usable.

- [ ] **Step 4: Em-dash check (style guide)**

```bash
grep -r "—" src/pages/tools/youtube-seo-tool.astro
```

Expected: no matches. Fix any found before proceeding.

- [ ] **Step 5: Confirm with Sathya before pushing**

Present:
> **YouTube SEO Tool — Build Complete**
> - Page: `/tools/youtube-seo-tool`
> - Function: `/api/youtube-seo-tool`
> - API: DataFetch (`LF_YOUTUBE_KEY`) + Gemini Flash
> - Email gate: 3 free uses → Google Sheets capture
> - Test checklist: all items above verified
>
> Ready to push and deploy?

- [ ] **Step 6: Push only after explicit approval**

```bash
git push origin tool/youtube-seo-checker
```
