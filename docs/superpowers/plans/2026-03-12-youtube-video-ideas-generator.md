# YouTube Video Ideas Generator — Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a free AI microtool at `/tools/youtube-video-ideas-generator` that generates 5 buyer-intent YouTube video ideas from 4 user inputs, with an email gate after 3 free uses.

**Architecture:** Single Netlify function (`generate-video-ideas.ts`) for the Gemini API call. Single self-contained Astro page with all client-side JS inline. Email capture via existing Google Apps Script webhook. No new shared components.

**Tech Stack:** Astro 5, Tailwind CSS, TypeScript (Netlify Functions v2), Google Gemini API (`gemini-flash-latest`), localStorage for rate limiting, Google Apps Script for email capture.

**Design doc:** `docs/superpowers/specs/2026-03-12-youtube-video-ideas-generator-design.md`
**Reference implementation (page):** `src/pages/tools/youtube-topic-evaluator.astro`
**Reference implementation (function):** `netlify/functions/generate-alternatives.ts`

---

## Chunk 1: Netlify Function

### Task 1: Create `generate-video-ideas.ts`

**Files:**
- Create: `netlify/functions/generate-video-ideas.ts`

- [ ] **Step 1: Create the function file with this exact content**

```typescript
// generate-video-ideas.ts
const GEMINI_API_URL =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent';

const SYSTEM_INSTRUCTION = `You are a YouTube content strategist specialising in buyer-intent video ideas for businesses. Your job is to generate YouTube video ideas that attract viewers who are actively evaluating, comparing, or purchasing products or services — not general viewers looking for education or entertainment.

Every idea you generate must:
- Allow the creator to naturally recommend, compare, or position their product or service
- Attract viewers who are in the consideration or decision stage of buying
- Be specific enough to rank on YouTube for a high-intent search

You must NEVER generate:
- "What is X" or definition topics
- "Why X is important" awareness topics
- Beginner guides or broad tutorials
- Topics where the viewer could solve their problem without any product or service

Respond ONLY with a valid JSON object. No preamble, no explanation, no markdown. Format:
{"ideas": ["Video idea 1", "Video idea 2", "Video idea 3", "Video idea 4", "Video idea 5"]}`;

function buildUserPrompt(
  product: string,
  url: string | undefined,
  targetCustomer: string,
  problemSolved: string
): string {
  const urlLine = url?.trim() ? `\nProduct URL: ${url.trim()}` : '';
  return `Generate 5 buyer-intent YouTube video ideas for the following business:

Product/Service: ${product}${urlLine}
Target Customer: ${targetCustomer}
Problem it solves: ${problemSolved}

Generate ideas that attract buyers in the consideration or decision stage — people evaluating tools, comparing options, or looking for solutions to a specific problem. Use topic patterns such as: best tools comparisons, product vs product, alternatives to X, pricing evaluations, use-case specific recommendations, mistakes to avoid, decision criteria, migration topics, and case study / results topics.

Return exactly 5 ideas as a JSON object: {"ideas": ["...", "...", "...", "...", "..."]}`;
}

export default async (request: Request) => {
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': 'https://sellontube.com',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers });
  }

  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405, headers });
  }

  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
  if (!apiKey) {
    return new Response(
      JSON.stringify({ error: 'API key not configured. Set GEMINI_API_KEY in Netlify env vars.' }),
      { status: 500, headers }
    );
  }

  try {
    const body = await request.json();
    const { product, url, targetCustomer, problemSolved } = body;

    if (!product?.trim() || !targetCustomer?.trim() || !problemSolved?.trim()) {
      return new Response(
        JSON.stringify({ error: 'product, targetCustomer, and problemSolved are required' }),
        { status: 400, headers }
      );
    }

    const MAX_SHORT = 500;
    const MAX_URL = 2000;
    if (
      product.trim().length > MAX_SHORT ||
      targetCustomer.trim().length > MAX_SHORT ||
      problemSolved.trim().length > MAX_SHORT ||
      (url?.trim() && url.trim().length > MAX_URL)
    ) {
      return new Response(
        JSON.stringify({ error: 'One or more fields exceed the maximum allowed length' }),
        { status: 400, headers }
      );
    }

    const geminiRes = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: SYSTEM_INSTRUCTION }] },
        contents: [{
          parts: [{
            text: buildUserPrompt(product.trim(), url, targetCustomer.trim(), problemSolved.trim()),
          }],
        }],
        generationConfig: {
          responseMimeType: 'application/json',
          temperature: 0.8,
          maxOutputTokens: 2048,
        },
      }),
    });

    if (!geminiRes.ok) {
      const errText = await geminiRes.text();
      console.error('Gemini API error:', geminiRes.status, errText);
      if (geminiRes.status === 429) {
        return new Response(JSON.stringify({ error: 'quota_exceeded' }), { status: 429, headers });
      }
      // Use 503 not 502 — Cloudflare intercepts 502 and replaces the response body
      return new Response(
        JSON.stringify({ error: 'AI service unavailable', geminiStatus: geminiRes.status, detail: errText.slice(0, 500) }),
        { status: 503, headers }
      );
    }

    const geminiData = await geminiRes.json();
    const raw = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
    const result = JSON.parse(raw);

    if (!Array.isArray(result?.ideas) || result.ideas.length === 0) {
      throw new Error('Invalid response structure from Gemini');
    }

    return new Response(JSON.stringify({ ideas: result.ideas }), { status: 200, headers });
  } catch (error) {
    console.error('generate-video-ideas error:', error);
    return new Response(
      JSON.stringify({ error: 'Generation failed', detail: String(error) }),
      { status: 500, headers }
    );
  }
};

export const config = {
  path: '/api/generate-video-ideas',
};
```

- [ ] **Step 2: Verify the file was created**

```bash
cat "netlify/functions/generate-video-ideas.ts" | head -5
```
Expected: first line is `// generate-video-ideas.ts`

- [ ] **Step 3: Commit**

```bash
git add netlify/functions/generate-video-ideas.ts
git commit -m "feat: add generate-video-ideas Netlify function

Routes POST /api/generate-video-ideas. Accepts product, url (optional),
targetCustomer, problemSolved. Calls gemini-flash-latest with system_instruction
separation. Returns {ideas: string[]}. 503 on upstream failure, 429 on quota."
```

---

## Chunk 2: Astro Page

### Task 2: Create `youtube-video-ideas-generator.astro`

**Files:**
- Create: `src/pages/tools/youtube-video-ideas-generator.astro`

- [ ] **Step 1: Create the page file with this exact content**

```astro
---
import Layout from '~/layouts/PageLayout.astro';
import CallToAction from '~/components/widgets/CallToAction.astro';

const metadata = {
  title: 'YouTube Video Ideas Generator for Business | SellonTube',
  description:
    'Generate buyer-intent YouTube video ideas for your product or service. Free tool by SellonTube. Get 5 high-intent ideas in seconds.',
};
---

<Layout metadata={metadata}>

  <!-- Hero -->
  <section class="bg-slate-950 pt-16 pb-12 sm:pt-20 sm:pb-16">
    <div class="max-w-3xl mx-auto px-4 text-center">
      <div class="flex flex-wrap justify-center gap-2 mb-6">
        <span class="inline-flex items-center text-xs font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-3 py-1">5 video ideas</span>
        <span class="inline-flex items-center text-xs font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-3 py-1">Buyer intent only</span>
        <span class="inline-flex items-center text-xs font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-3 py-1">Built for B2B</span>
      </div>
      <h1 class="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight mb-4">
        Find YouTube Video Ideas That<br class="hidden sm:block" /> Attract Buyers (Not Just Viewers)
      </h1>
      <p class="text-slate-400 text-base sm:text-lg max-w-xl mx-auto">
        Enter your product or service and get 5 buyer-intent YouTube video ideas — the kind that drive leads and customers, not just views.
      </p>
    </div>
  </section>

  <!-- Tool -->
  <section class="bg-slate-950 pb-20">
    <div id="tool-container" class="max-w-xl mx-auto px-4">

      <!-- Step: Input -->
      <div id="step-input" class="rounded-2xl border border-slate-700 bg-slate-900 p-6 sm:p-8">
        <div class="space-y-5">

          <div>
            <label for="product-input" class="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Your product or service
            </label>
            <input
              type="text"
              id="product-input"
              placeholder="e.g. Shopify upsell app, LLC formation service"
              class="w-full text-base font-medium px-4 py-3 rounded-xl border border-slate-700 bg-slate-800 text-white placeholder-slate-500
                     focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-colors"
              aria-describedby="product-error"
            />
            <p id="product-error" class="hidden mt-1.5 text-xs text-rose-400" role="alert"></p>
          </div>

          <div>
            <label for="url-input" class="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Link to your product page
            </label>
            <input
              type="url"
              id="url-input"
              placeholder="https://yourwebsite.com/product"
              class="w-full text-base font-medium px-4 py-3 rounded-xl border border-slate-700 bg-slate-800 text-white placeholder-slate-500
                     focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-colors"
              aria-describedby="url-error"
            />
            <p id="url-error" class="hidden mt-1.5 text-xs text-rose-400" role="alert"></p>
          </div>

          <div>
            <label for="customer-input" class="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Your target customer
            </label>
            <input
              type="text"
              id="customer-input"
              placeholder="e.g. Shopify store owners, SaaS founders"
              class="w-full text-base font-medium px-4 py-3 rounded-xl border border-slate-700 bg-slate-800 text-white placeholder-slate-500
                     focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-colors"
              aria-describedby="customer-error"
            />
            <p id="customer-error" class="hidden mt-1.5 text-xs text-rose-400" role="alert"></p>
          </div>

          <div>
            <label for="problem-input" class="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Problem your product solves
            </label>
            <textarea
              id="problem-input"
              rows="3"
              placeholder="e.g. Low average order value, slow customer acquisition"
              class="w-full text-base font-medium px-4 py-3 rounded-xl border border-slate-700 bg-slate-800 text-white placeholder-slate-500
                     focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-colors resize-none"
              aria-describedby="problem-error"
            ></textarea>
            <p id="problem-error" class="hidden mt-1.5 text-xs text-rose-400" role="alert"></p>
          </div>

        </div>

        <button
          id="generate-btn"
          class="mt-7 w-full inline-flex items-center justify-center rounded-xl px-6 py-3.5 text-base font-bold
                 bg-emerald-500 text-slate-950 hover:bg-emerald-400 transition-colors"
        >
          Generate My Video Ideas &rarr;
        </button>

        <p id="ideas-counter-label" class="mt-3 text-center text-xs text-slate-600">
          3 free generations remaining
        </p>
      </div>

      <!-- Step: Loading -->
      <div
        id="step-loading"
        class="hidden rounded-2xl border border-slate-700 bg-slate-900 p-6 sm:p-8 text-center"
      >
        <div class="flex flex-col items-center gap-4 py-10">
          <div class="w-10 h-10 border-[3px] border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
          <p class="text-sm font-medium text-slate-400">Generating your video ideas...</p>
          <p class="text-xs text-slate-600">Tailoring to your audience</p>
        </div>
      </div>

      <!-- Step: Email Gate -->
      <div
        id="step-email-gate"
        class="hidden rounded-2xl border border-slate-700 bg-slate-900 p-6 sm:p-8"
      >
        <div class="text-center mb-6">
          <p class="text-base font-semibold text-white mb-2">You've used your 3 free generations</p>
          <p class="text-sm text-slate-400">
            Enter your business email to keep generating ideas — it's free.
          </p>
        </div>
        <div id="gate-form" class="space-y-3">
          <input
            type="email"
            id="gate-email"
            placeholder="your@company.com"
            class="w-full px-4 py-3 rounded-xl border border-slate-700 bg-slate-800 text-white placeholder-slate-500
                   focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
            aria-describedby="gate-email-error"
          />
          <p id="gate-email-error" class="hidden text-xs text-rose-400" role="alert"></p>
          <button
            id="gate-submit-btn"
            class="w-full inline-flex items-center justify-center rounded-xl px-6 py-3.5 text-base font-bold
                   bg-emerald-500 text-slate-950 hover:bg-emerald-400 transition-colors"
          >
            Continue Generating
          </button>
          <p class="text-center text-xs text-slate-600">No spam. We'll only send you content marketing resources from SellonTube.</p>
        </div>
        <div id="gate-success" class="hidden text-center mt-4">
          <p class="text-sm font-semibold text-emerald-400">Done. Generating your ideas now...</p>
        </div>
      </div>

    </div>

    <!-- Step: Results (wider) -->
    <div
      id="step-results"
      class="hidden max-w-2xl mx-auto px-4 mt-2"
      role="status"
      aria-live="polite"
    >
      <div class="rounded-2xl border border-slate-700 bg-slate-900 overflow-hidden">

        <!-- Header -->
        <div class="p-6 sm:p-8 border-b border-slate-700/60">
          <p class="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">5 buyer-intent ideas for</p>
          <p id="result-product" tabindex="-1" class="text-sm font-semibold text-white"></p>
        </div>

        <!-- Ideas list -->
        <div class="p-6 sm:p-8 border-b border-slate-700/60">
          <p class="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-4">Your video ideas</p>
          <div id="ideas-list" class="space-y-3"></div>
        </div>

        <!-- Inline CTA -->
        <div class="p-6 sm:p-8 border-b border-slate-700/60 bg-emerald-500/5">
          <p class="text-sm font-medium text-slate-300 mb-1">Want help turning these ideas into a full YouTube strategy?</p>
          <p class="text-xs text-slate-500 mb-4">Book a free diagnostic call with SellonTube.</p>
          <a
            id="results-cta"
            href="https://cal.com/gautham-8bdvdx/30min"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center justify-center rounded-xl px-6 py-3 text-sm font-bold bg-emerald-500 text-slate-950 hover:bg-emerald-400 transition-colors"
          >
            Book a free diagnostic call &rarr;
          </a>
        </div>

        <!-- Reset -->
        <div class="px-6 pb-6 sm:px-8 sm:pb-8 pt-6">
          <button
            id="reset-btn"
            class="w-full py-3 rounded-xl border border-slate-700 text-sm font-medium text-slate-400 hover:text-white hover:border-slate-500 transition-colors"
          >
            &larr; Generate more ideas
          </button>
        </div>

      </div>
    </div>
  </section>

  <CallToAction
    title="Ideas are a start. A strategy converts."
    subtitle="In our diagnostic, we map your full YouTube acquisition system: topics, CTAs, and the lead path from viewer to customer."
    actions={[
      {
        variant: 'primary',
        text: 'Book a diagnostic call',
        href: 'https://cal.com/gautham-8bdvdx/30min',
        target: '_blank',
        rel: 'noopener noreferrer',
      },
    ]}
  />

  <!-- How it works -->
  <section class="py-16 sm:py-20 bg-slate-950">
    <div class="max-w-4xl mx-auto px-4">
      <p class="text-xs font-semibold uppercase tracking-wider text-slate-500 text-center mb-10">How it works</p>
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-6">
        <div>
          <div class="inline-flex items-center justify-center w-9 h-9 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-bold mb-4">1</div>
          <h3 class="text-white font-semibold mb-2">Enter your details</h3>
          <p class="text-sm text-slate-400 leading-relaxed">Tell us what you sell, who buys it, and what problem it solves. Four fields. Under a minute.</p>
        </div>
        <div>
          <div class="inline-flex items-center justify-center w-9 h-9 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-bold mb-4">2</div>
          <h3 class="text-white font-semibold mb-2">Generate in seconds</h3>
          <p class="text-sm text-slate-400 leading-relaxed">AI generates 5 buyer-intent video ideas tailored to your product, customer, and the problem you solve.</p>
        </div>
        <div>
          <div class="inline-flex items-center justify-center w-9 h-9 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-bold mb-4">3</div>
          <h3 class="text-white font-semibold mb-2">Use what converts</h3>
          <p class="text-sm text-slate-400 leading-relaxed">Copy the ideas that fit. Every one is designed to attract decision-stage buyers, not just curious viewers.</p>
        </div>
      </div>
    </div>
  </section>

  <!-- Methodology -->
  <section class="py-16 sm:py-20">
    <div class="max-w-2xl mx-auto px-4 space-y-14">

      <div>
        <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-4">Why most YouTube idea tools get it wrong for business</h2>
        <p class="text-gray-600 dark:text-slate-400 leading-relaxed mb-4">
          Most YouTube content tools optimise for views. They surface high-volume topics, trending audio, and broad educational content. That works if you are a creator building an audience. It does not work if you are a business trying to generate leads.
        </p>
        <p class="text-gray-600 dark:text-slate-400 leading-relaxed mb-4">
          The difference is buyer intent. A video with 300 views that brings in 12 qualified leads outperforms a video with 30,000 views that brings in zero. The YouTube Video Ideas Generator is built around this principle. Every idea it generates is filtered through one question: does this attract someone who is actively evaluating, comparing, or purchasing?
        </p>
        <p class="text-gray-600 dark:text-slate-400 leading-relaxed">
          If the answer is no, the idea is excluded — regardless of search volume or trend data.
        </p>
      </div>

      <div>
        <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-4">The 13 buyer-intent topic patterns</h2>
        <p class="text-gray-600 dark:text-slate-400 leading-relaxed mb-4">
          The generator uses 13 proven BoFu (bottom-of-funnel) topic patterns: best tools comparisons, product vs product, alternatives to X, pricing evaluations, use-case specific recommendations, mistakes to avoid, decision criteria, migration topics, and case study results topics — among others.
        </p>
        <p class="text-gray-600 dark:text-slate-400 leading-relaxed">
          These are the patterns that consistently attract viewers who are in the consideration or decision stage. They are also the patterns where product recommendations feel natural rather than forced — which matters for conversion.
        </p>
      </div>

      <div>
        <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-4">What the tool does not generate</h2>
        <p class="text-gray-600 dark:text-slate-400 leading-relaxed mb-4">
          Definition videos ("What is X"), awareness content ("Why X is important"), beginner guides, and broad educational topics are explicitly excluded. These attract learners, not buyers. A new site or small B2B channel cannot afford to spend production time on content that will not generate pipeline.
        </p>
        <p class="text-gray-600 dark:text-slate-400 leading-relaxed">
          The ideas you get from this tool are ready to brief a video producer or scriptwriter. Each one has a natural moment to demonstrate your product, reference a result, or recommend your service without the recommendation feeling like an interruption.
        </p>
      </div>

    </div>
  </section>

</Layout>

<script>
  // ===== CONSTANTS =====

  const RATE_LIMIT = 3;
  const COUNT_KEY = 'sot_video_ideas_count';
  const EMAIL_KEY = 'sot_video_ideas_email_submitted';
  const GATE_EMAIL_DOMAINS = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'icloud.com', 'aol.com', 'protonmail.com', 'mail.com', 'ymail.com', 'live.com'];
  const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwNJSU1oWry-OSkFGit4OCs1f_0W6KX9K9WASHhah5ZXcDSxjZWUQ5Uw2S4PSSoZhgD/exec';

  // ===== STORAGE =====

  function getCount(): number { return parseInt(localStorage.getItem(COUNT_KEY) || '0', 10); }
  function incrementCount(): void { localStorage.setItem(COUNT_KEY, (getCount() + 1).toString()); }
  function isEmailSubmitted(): boolean { return localStorage.getItem(EMAIL_KEY) === 'true'; }
  function setEmailSubmitted(): void { localStorage.setItem(EMAIL_KEY, 'true'); }

  // ===== STEP MANAGEMENT =====

  const STEPS = ['step-input', 'step-loading', 'step-email-gate', 'step-results'];
  function showStep(id: string): void {
    STEPS.forEach((s) => {
      const el = document.getElementById(s);
      if (el) el.classList.toggle('hidden', s !== id);
    });
    if (id === 'step-results') {
      const heading = document.getElementById('result-product');
      heading?.focus();
    }
  }

  // ===== COUNTER LABEL =====

  function updateCounterLabel(): void {
    const label = document.getElementById('ideas-counter-label');
    if (!label) return;
    if (isEmailSubmitted()) {
      label.textContent = 'Unlimited generations unlocked';
      return;
    }
    const remaining = Math.max(0, RATE_LIMIT - getCount());
    label.textContent = remaining === 1 ? '1 free generation remaining' : remaining + ' free generations remaining';
  }

  // ===== INLINE VALIDATION =====

  function showFieldError(fieldId: string, message: string): void {
    const input = document.getElementById(fieldId) as HTMLInputElement | HTMLTextAreaElement | null;
    const error = document.getElementById(fieldId.replace('-input', '-error'));
    if (input) input.setAttribute('aria-invalid', 'true');
    if (error) { error.textContent = message; error.classList.remove('hidden'); }
  }

  function clearFieldError(fieldId: string): void {
    const input = document.getElementById(fieldId) as HTMLInputElement | HTMLTextAreaElement | null;
    const error = document.getElementById(fieldId.replace('-input', '-error'));
    if (input) input.removeAttribute('aria-invalid');
    if (error) { error.textContent = ''; error.classList.add('hidden'); }
  }

  function validateInputs(): boolean {
    const product = (document.getElementById('product-input') as HTMLInputElement).value.trim();
    const url = (document.getElementById('url-input') as HTMLInputElement).value.trim();
    const customer = (document.getElementById('customer-input') as HTMLInputElement).value.trim();
    const problem = (document.getElementById('problem-input') as HTMLTextAreaElement).value.trim();

    let valid = true;

    if (!product || product.length < 3) {
      showFieldError('product-input', 'Please enter your product or service (min 3 characters).');
      valid = false;
    } else { clearFieldError('product-input'); }

    if (!url || (!url.startsWith('http://') && !url.startsWith('https://'))) {
      showFieldError('url-input', 'Please enter a valid URL starting with https://');
      valid = false;
    } else { clearFieldError('url-input'); }

    if (!customer || customer.length < 3) {
      showFieldError('customer-input', 'Please enter your target customer (min 3 characters).');
      valid = false;
    } else { clearFieldError('customer-input'); }

    if (!problem || problem.length < 10) {
      showFieldError('problem-input', 'Please describe the problem your product solves (min 10 characters).');
      valid = false;
    } else { clearFieldError('problem-input'); }

    return valid;
  }

  // ===== IDEA CARD RENDERING =====

  function renderIdeas(ideas: string[]): void {
    const list = document.getElementById('ideas-list');
    if (!list) return;

    const product = (document.getElementById('product-input') as HTMLInputElement).value.trim();
    const resultProduct = document.getElementById('result-product');
    if (resultProduct) resultProduct.textContent = product;

    list.innerHTML = ideas.map((idea, i) => {
      const escaped = idea.replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
      return (
        '<div class="rounded-xl border border-slate-700 bg-slate-800 p-4">' +
          '<div class="flex items-start gap-3">' +
            '<span class="flex-shrink-0 w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold flex items-center justify-center mt-0.5">' + (i + 1) + '</span>' +
            '<div class="min-w-0 flex-1">' +
              '<p class="text-sm font-semibold text-white mb-3" data-idea-text="' + escaped + '"></p>' +
              '<div class="flex items-center justify-end">' +
                '<button class="copy-btn text-xs border border-slate-600 rounded-lg px-3 py-1.5 text-slate-400 hover:border-emerald-500/50 hover:text-emerald-400 transition-colors" data-index="' + i + '">' +
                  'Copy' +
                '</button>' +
              '</div>' +
            '</div>' +
          '</div>' +
        '</div>'
      );
    }).join('');

    // Set textContent (not innerHTML) for idea text — XSS safe
    list.querySelectorAll('[data-idea-text]').forEach((el, i) => {
      (el as HTMLElement).textContent = ideas[i];
    });

    // Wire copy buttons
    list.querySelectorAll('.copy-btn').forEach((btn, i) => {
      btn.addEventListener('click', () => {
        navigator.clipboard.writeText(ideas[i]).then(() => {
          btn.textContent = 'Copied!';
          (btn as HTMLElement).classList.add('text-emerald-400', 'border-emerald-500/50');
          setTimeout(() => {
            btn.textContent = 'Copy';
            (btn as HTMLElement).classList.remove('text-emerald-400', 'border-emerald-500/50');
          }, 1500);
        });
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({ event: 'idea_copied', tool: 'video-ideas-generator', idea_index: i });
      });
    });
  }

  // ===== API CALL =====

  async function fetchVideoIdeas(product: string, url: string, targetCustomer: string, problemSolved: string): Promise<void> {
    const btn = document.getElementById('generate-btn') as HTMLButtonElement;

    try {
      const res = await fetch('/api/generate-video-ideas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product, url, targetCustomer, problemSolved }),
      });

      if (res.status === 429) {
        showStep('step-input');
        btn.disabled = false;
        btn.textContent = 'Generate My Video Ideas →';
        showFieldError('problem-input', 'AI is at capacity right now. Free daily limit reached — please try again in a moment.');
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({ event: 'tool_generate_error', tool: 'video-ideas-generator', reason: 'quota_exceeded' });
        return;
      }

      if (!res.ok) throw new Error('API error ' + res.status);

      const data = await res.json();
      if (!Array.isArray(data?.ideas) || data.ideas.length === 0) throw new Error('Empty ideas array');

      renderIdeas(data.ideas);
      incrementCount();
      updateCounterLabel();
      showStep('step-results');
      document.getElementById('step-results')?.scrollIntoView({ behavior: 'smooth', block: 'start' });

      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({ event: 'tool_generate_success', tool: 'video-ideas-generator' });

    } catch {
      showStep('step-input');
      btn.disabled = false;
      btn.textContent = 'Generate My Video Ideas →';
      showFieldError('problem-input', 'Something went wrong on our end. Please try again in a moment.');
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({ event: 'tool_generate_error', tool: 'video-ideas-generator', reason: 'api_error' });
    }
  }

  // ===== GENERATE =====

  async function generate(): Promise<void> {
    if (!validateInputs()) return;

    const product = (document.getElementById('product-input') as HTMLInputElement).value.trim();
    const url = (document.getElementById('url-input') as HTMLInputElement).value.trim();
    const targetCustomer = (document.getElementById('customer-input') as HTMLInputElement).value.trim();
    const problemSolved = (document.getElementById('problem-input') as HTMLTextAreaElement).value.trim();

    // Email gate check
    if (getCount() >= RATE_LIMIT && !isEmailSubmitted()) {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({ event: 'tool_email_gate_shown', tool: 'video-ideas-generator' });
      showStep('step-email-gate');
      return;
    }

    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event: 'tool_generate_click', tool: 'video-ideas-generator' });

    const btn = document.getElementById('generate-btn') as HTMLButtonElement;
    btn.disabled = true;
    btn.textContent = 'Generating...';
    showStep('step-loading');

    await fetchVideoIdeas(product, url, targetCustomer, problemSolved);
  }

  // ===== EMAIL GATE =====

  async function submitGateEmail(): Promise<void> {
    const emailInput = document.getElementById('gate-email') as HTMLInputElement;
    const email = emailInput.value.trim().toLowerCase();
    const errorEl = document.getElementById('gate-email-error');

    // Validate format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      if (errorEl) { errorEl.textContent = 'Please enter a valid business email address.'; errorEl.classList.remove('hidden'); }
      return;
    }

    // Block personal domains
    const domain = email.split('@')[1];
    if (GATE_EMAIL_DOMAINS.includes(domain)) {
      if (errorEl) { errorEl.textContent = 'Please use a business email address (not Gmail, Yahoo, etc.)'; errorEl.classList.remove('hidden'); }
      return;
    }

    if (errorEl) errorEl.classList.add('hidden');

    const btn = document.getElementById('gate-submit-btn') as HTMLButtonElement;
    btn.textContent = 'Submitting...';
    btn.setAttribute('disabled', 'true');

    try {
      await fetch(APPS_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source: 'youtube-video-ideas-generator' }),
      });
    } catch { /* no-cors always resolves */ }

    setEmailSubmitted();
    updateCounterLabel();

    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event: 'tool_email_submitted', tool: 'video-ideas-generator' });

    const form = document.getElementById('gate-form') as HTMLElement;
    const success = document.getElementById('gate-success') as HTMLElement;
    form.classList.add('hidden');
    success.classList.remove('hidden');

    // Proceed with generation after brief confirmation
    setTimeout(() => {
      form.classList.remove('hidden');
      success.classList.add('hidden');
      btn.textContent = 'Continue Generating';
      btn.removeAttribute('disabled');
      emailInput.value = '';
      generate();
    }, 1200);
  }

  // ===== RESET =====

  function reset(): void {
    (['product-input', 'url-input', 'customer-input'] as string[]).forEach((id) => {
      (document.getElementById(id) as HTMLInputElement).value = '';
      clearFieldError(id);
    });
    (document.getElementById('problem-input') as HTMLTextAreaElement).value = '';
    clearFieldError('problem-input');
    showStep('step-input');
    (document.getElementById('product-input') as HTMLInputElement).focus();
    const btn = document.getElementById('generate-btn') as HTMLButtonElement;
    btn.disabled = false;
    btn.textContent = 'Generate My Video Ideas →';
  }

  // ===== CTA TRACKING =====

  document.getElementById('results-cta')?.addEventListener('click', () => {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event: 'tool_cta_click', tool: 'video-ideas-generator' });
  });

  // ===== EVENT LISTENERS =====

  document.getElementById('generate-btn')?.addEventListener('click', generate);
  document.getElementById('reset-btn')?.addEventListener('click', reset);
  document.getElementById('gate-submit-btn')?.addEventListener('click', submitGateEmail);

  // Enter key navigation through fields
  const inputIds = ['product-input', 'url-input', 'customer-input'];
  inputIds.forEach((id, i) => {
    document.getElementById(id)?.addEventListener('keydown', (e) => {
      if ((e as KeyboardEvent).key === 'Enter') {
        e.preventDefault();
        if (i < inputIds.length - 1) {
          (document.getElementById(inputIds[i + 1]) as HTMLInputElement)?.focus();
        } else {
          (document.getElementById('problem-input') as HTMLTextAreaElement)?.focus();
        }
      }
    });
  });

  document.getElementById('gate-email')?.addEventListener('keydown', (e) => {
    if ((e as KeyboardEvent).key === 'Enter') submitGateEmail();
  });

  updateCounterLabel();
</script>
```

- [ ] **Step 2: Verify the file was created**

```bash
ls src/pages/tools/
```
Expected: `index.astro  youtube-roi-calculator.astro  youtube-topic-evaluator.astro  youtube-video-ideas-generator.astro`

- [ ] **Step 3: Run the dev server and open the page manually to verify it loads**

```bash
npm run dev
```
Open: `http://localhost:4321/tools/youtube-video-ideas-generator`

Check:
- Hero section renders with H1 "Find YouTube Video Ideas That Attract Buyers (Not Just Viewers)"
- 4 input fields visible
- Counter label shows "3 free generations remaining"
- Loading step and results step are hidden on initial load

- [ ] **Step 4: Test form validation manually**

Click "Generate My Video Ideas →" with all fields empty.
Expected: inline red error messages appear under each field. No `alert()` dialogs.

Fill only the product field, click generate.
Expected: only the other 3 fields show errors.

- [ ] **Step 5: Test email gate manually**

Open browser console. Set `localStorage.setItem('sot_video_ideas_count', '3')`.
Fill all 4 fields. Click generate.
Expected: email gate panel appears.

Try submitting with `test@gmail.com`.
Expected: "Please use a business email address (not Gmail, Yahoo, etc.)"

Try submitting with `test@` (invalid format).
Expected: "Please enter a valid business email address."

- [ ] **Step 6: Test full generation flow (requires Netlify dev or deployed GEMINI_API_KEY)**

If testing locally with Netlify CLI:
```bash
netlify dev
```
Open: `http://localhost:8888/tools/youtube-video-ideas-generator`

Fill all 4 fields. Click generate.
Expected: loading spinner appears, then 5 idea cards with copy buttons appear.

Click a copy button.
Expected: button text changes to "Copied!" for 1.5s.

- [ ] **Step 7: Commit**

```bash
git add src/pages/tools/youtube-video-ideas-generator.astro
git commit -m "feat: add YouTube Video Ideas Generator page

4-input form → POST /api/generate-video-ideas → 5 buyer-intent idea cards.
Email gate after 3 free uses (localStorage). Inline validation (no alert()).
GA4 tracking via dataLayer.push. Copy buttons per idea. Inline CTA in results."
```

---

## Chunk 3: Nav, Tools Index, and Final Verification

### Task 3: Add to tools index page

**Files:**
- Modify: `src/pages/tools/index.astro`

- [ ] **Step 1: Add the new tool to the `tools` array in `src/pages/tools/index.astro`**

In the `tools` array (after the ROI Calculator entry), add:

```javascript
{
  name: 'YouTube Video Ideas Generator',
  slug: '/tools/youtube-video-ideas-generator',
  tagline: 'What YouTube videos should I create to attract buyers?',
  description:
    'Enter your product, target customer, and the problem you solve. Get 5 buyer-intent video ideas — the kind that drive leads and customers, not just views.',
  badge: 'Idea Generation',
  badgeColor: 'emerald',
},
```

- [ ] **Step 2: Verify the tools index renders correctly**

```bash
npm run dev
```
Open: `http://localhost:4321/tools`
Expected: 3 tool cards visible. New card links to `/tools/youtube-video-ideas-generator`.

### Task 4: Add nav link

**Files:**
- Modify: `src/config.yaml`

- [ ] **Step 1: Check current nav links**

The current `header.links` in `src/config.yaml`:
```yaml
links:
  - text: "Home"
    href: "/"
  - text: "How It Works"
    href: "/how-it-works"
  - text: "Pricing"
    href: "/pricing"
  - text: "Blog"
    href: "/blog"
```

Note: there is currently no "Free Tools" nav item. Add a "Free Tools" link pointing to `/tools`:

```yaml
  - text: "Free Tools"
    href: "/tools"
```

Add it after "Blog" and before the `actions` section.

- [ ] **Step 2: Verify nav renders**

```bash
npm run dev
```
Open any page and confirm "Free Tools" appears in the navigation linking to `/tools`.

### Task 5: Build verification

- [ ] **Step 1: Run the production build**

```bash
npm run build
```
Expected: build completes with no errors. Watch for TypeScript errors in the new `.astro` file.

- [ ] **Step 2: Check for any TypeScript errors in the script block**

If the build reports TS errors, the most likely issue is the `window.dataLayer` not being typed. Fix by adding a declaration at the top of the `<script>` block if needed:

```typescript
declare global { interface Window { dataLayer: Record<string, unknown>[]; } }
```

- [ ] **Step 3: Final commit**

```bash
git add src/pages/tools/index.astro src/config.yaml
git commit -m "feat: add Video Ideas Generator to tools index and nav

Adds tool card to /tools page. Adds Free Tools nav link in config.yaml."
```

---

## Post-Deploy Checklist

After the PR is merged and deployed to production:

- [ ] Open `https://sellontube.com/tools/youtube-video-ideas-generator` — page loads
- [ ] Fill all 4 fields and click generate — 5 ideas appear
- [ ] Click a copy button — clipboard works
- [ ] Click CTA — booking link opens in new tab
- [ ] Check GA4 real-time events: `tool_generate_click`, `tool_generate_success` appear
- [ ] Set count to 3 in localStorage — email gate appears
- [ ] Submit a business email — generation proceeds after gate
- [ ] Check `/tools` — new tool card appears with correct link
- [ ] Check nav — "Free Tools" link visible and working
