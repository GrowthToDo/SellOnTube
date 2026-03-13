# Video Ideas Generator CTA Blocks — Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add prominent CTA blocks linking to `/tools/youtube-video-ideas-generator` across all youtube-video-ideas pages (individual + hub) and relevant blog posts, to drive tool usage.

**Architecture:** Three CTA insertion points — all using the same visual pattern (slate card, horizontal layout, primary button with arrow, GA4 tracking). pSEO pages get the CTA unconditionally. Blog posts get it conditionally via a `toolCta` frontmatter field piped through the Post type.

**Tech Stack:** Astro components, Tailwind CSS, GA4 dataLayer events, TypeScript types

---

## File Map

| File | Action | Responsibility |
|------|--------|----------------|
| `src/pages/youtube-video-ideas/[slug].astro` | Modify | Add tool CTA after "Example Video Titles" section |
| `src/pages/youtube-video-ideas/index.astro` | Modify | Add tool CTA after industry grid, before bottom booking CTA |
| `src/types.d.ts` | Modify | Add `toolCta?: string` to Post interface |
| `src/utils/blog.ts` | Modify | Destructure and pass `toolCta` from frontmatter |
| `src/components/blog/SinglePost.astro` | Modify | Conditionally render tool CTA above existing booking CTA |

---

### Task 1: Add Video Ideas Generator CTA to `youtube-video-ideas/[slug].astro`

**Files:**
- Modify: `src/pages/youtube-video-ideas/[slug].astro:203` (after example video titles `</section>`)

- [ ] **Step 1: Add CTA block after Example Video Titles section (line ~203)**

Insert after the closing `</section>` of the example video titles section and before the "How to Find" section:

```astro
<!-- Video Ideas Generator CTA -->
<div class="my-4 bg-gradient-to-br from-primary/5 to-primary/10 dark:from-primary/10 dark:to-primary/20 border border-primary/20 dark:border-primary/30 rounded-2xl p-6">
  <div class="flex flex-col sm:flex-row items-start sm:items-center gap-5">
    <div class="flex-1">
      <p class="font-semibold text-gray-900 dark:text-white mb-1">Want video ideas tailored to YOUR business?</p>
      <p class="text-gray-600 dark:text-slate-400 text-sm leading-relaxed">
        These are general examples. The Video Ideas Generator creates personalised, buyer-intent video ideas based on your product, audience, and competitive landscape — in 30 seconds.
      </p>
    </div>
    <a
      href="/tools/youtube-video-ideas-generator"
      class="flex-shrink-0 inline-flex items-center gap-2 bg-primary text-white font-semibold px-5 py-2.5 rounded-full hover:bg-primary/90 transition-all text-sm whitespace-nowrap"
      data-cta="video-ideas-generator"
    >
      Generate ideas free
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
      </svg>
    </a>
  </div>
</div>
```

- [ ] **Step 2: Add GA4 click tracking script**

Add at end of file (before `</Layout>`):

```astro
<script>
  document.querySelectorAll('[data-cta="video-ideas-generator"]').forEach((el) => {
    el.addEventListener('click', () => {
      window.dataLayer?.push({ event: 'tool_cta_click', tool_name: 'video-ideas-generator', cta_location: 'youtube-video-ideas-slug' });
    });
  });
</script>
```

---

### Task 2: Add Video Ideas Generator CTA to `youtube-video-ideas/index.astro` (hub page)

**Files:**
- Modify: `src/pages/youtube-video-ideas/index.astro:170` (after industry grid `</div>`, before bottom CTA)

- [ ] **Step 1: Add full-width tool CTA block after the industry sections grid**

Insert after the closing `</div>` of the industry sections grid (line ~170) and before the bottom booking CTA `<div class="bg-slate-900">`:

```astro
<!-- Video Ideas Generator CTA -->
<div class="max-w-5xl mx-auto px-4 sm:px-6 py-12">
  <div class="bg-gradient-to-br from-primary/5 to-primary/10 dark:from-primary/10 dark:to-primary/20 border border-primary/20 dark:border-primary/30 rounded-2xl p-8 text-center">
    <p class="text-xs font-semibold uppercase tracking-wider text-primary mb-3">Free tool</p>
    <h2 class="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-3">
      Skip browsing. Generate video ideas for YOUR business in 30 seconds.
    </h2>
    <p class="text-gray-600 dark:text-slate-400 leading-relaxed max-w-xl mx-auto mb-6">
      Tell us your product, target customer, and the problem you solve — get 5 buyer-intent video ideas instantly, tailored to your specific business.
    </p>
    <a
      href="/tools/youtube-video-ideas-generator"
      class="inline-flex items-center gap-2 bg-primary text-white font-semibold px-8 py-3.5 rounded-full hover:bg-primary/90 transition-all"
      data-cta="video-ideas-generator"
    >
      Generate video ideas free
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
      </svg>
    </a>
  </div>
</div>
```

- [ ] **Step 2: Add GA4 tracking script**

Add before `</Layout>`:

```astro
<script>
  document.querySelectorAll('[data-cta="video-ideas-generator"]').forEach((el) => {
    el.addEventListener('click', () => {
      window.dataLayer?.push({ event: 'tool_cta_click', tool_name: 'video-ideas-generator', cta_location: 'youtube-video-ideas-hub' });
    });
  });
</script>
```

---

### Task 3: Add conditional Video Ideas Generator CTA to blog posts

**Files:**
- Modify: `src/types.d.ts:4-45` (Post interface)
- Modify: `src/utils/blog.ts:47-58,76-100` (destructure + return)
- Modify: `src/components/blog/SinglePost.astro:106-120` (conditional rendering)

- [ ] **Step 1: Add `toolCta` to Post interface in `types.d.ts`**

Add after `readingTime?: number;` (line 44):

```typescript
  /** Optional tool CTA slug to show above the booking CTA */
  toolCta?: string;
```

- [ ] **Step 2: Destructure `toolCta` in `blog.ts` getNormalizedPost**

In the destructuring block (line 47-58), add `toolCta` to the extracted fields:

```typescript
    toolCta,
```

In the return block (line 76-100), add after `readingTime`:

```typescript
    toolCta,
```

- [ ] **Step 3: Add conditional CTA block in `SinglePost.astro`**

Insert before the existing `<!-- Internal links CTA -->` block (line 106):

```astro
    {post.toolCta === 'video-ideas-generator' && (
      <div class="mx-auto px-6 sm:px-6 max-w-3xl mt-12 rounded-2xl bg-gradient-to-br from-primary/5 to-primary/10 dark:from-primary/10 dark:to-primary/20 border border-primary/20 dark:border-primary/30 p-8">
        <div class="flex flex-col sm:flex-row items-start sm:items-center gap-5">
          <div class="flex-1">
            <p class="text-lg font-semibold text-gray-900 dark:text-white mb-1">Generate video ideas for your business</p>
            <p class="text-muted dark:text-slate-400 text-sm leading-relaxed">
              Stop guessing which topics to cover. The Video Ideas Generator creates buyer-intent video ideas tailored to your product, audience, and competitive landscape — free.
            </p>
          </div>
          <a
            href="/tools/youtube-video-ideas-generator"
            class="flex-shrink-0 inline-flex items-center gap-2 bg-primary text-white font-semibold px-5 py-2.5 rounded-full hover:bg-primary/90 transition-all text-sm whitespace-nowrap"
            data-cta="video-ideas-generator"
          >
            Try it free
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
            </svg>
          </a>
        </div>
      </div>
    )}
```

- [ ] **Step 4: Add GA4 tracking in SinglePost.astro**

Add before closing `</section>`:

```astro
<script>
  document.querySelectorAll('[data-cta="video-ideas-generator"]').forEach((el) => {
    el.addEventListener('click', () => {
      window.dataLayer?.push({ event: 'tool_cta_click', tool_name: 'video-ideas-generator', cta_location: 'blog-post' });
    });
  });
</script>
```

---

### Usage: How to enable the CTA in a blog post

Add `toolCta: video-ideas-generator` to the blog post's frontmatter:

```yaml
---
title: "YouTube Video Ideas for Business: 50+ High-Intent Topics"
toolCta: video-ideas-generator
---
```

The 5 blog posts in the video ideas cluster (W3–W7) should all include this field.
