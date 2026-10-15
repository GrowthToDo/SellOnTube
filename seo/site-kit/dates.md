Site kit for SellonTube: site-specific only. Method and rules live in seo-content-system.
Sources: `CLAUDE.md` L57-66; `src/utils/blog.ts` L71-77, L134-140; `scripts/validate-build.js` L254-264; `docs/sops/deploy-checklist.md` L11-12; `scripts/new-post.mjs` L92.

Excerpts are verbatim except that every em dash and en dash is replaced with " - ".

# The IST publishDate trap

Notes added for this kit (not in the sources):

- Format disagreement: `CLAUDE.md` L60 says `YYYY-MM-DDT00:00:00Z`; `docs/sops/deploy-checklist.md` L11 says `YYYY-MM-DD` treated as `T00:00:00+05:30`. All 56 dated posts use the `T00:00:00Z` form.
- pSEO pages (`niches.ts`, `comparisons.ts`) use bare `YYYY-MM-DD` plus `T00:00:00+05:30`; see `pseo.md`.
- `scripts/new-post.mjs` L92 stamps today's UTC date, not the IST date.

### `CLAUDE.md` L57-66: the rule

- **`publishDate` determines go-live. Get it right the first time.** Netlify builds filter out any
  post where `publishDate > today`, so a future date means a 404. If it ships now, use today's date
  from the `currentDate` context variable, never tomorrow. If scheduled, use that exact date. Format
  `YYYY-MM-DDT00:00:00Z`. This has caused deploy 404s multiple times.

- **Any code comparing `publishDate` must use IST conversion.** `src/utils/blog.ts` converts to IST
  via `toIST()` (line ~71) before filtering. Any other script that decides draft/future/published  - 
  e.g. `scripts/validate-build.js` - must use the identical `toIST()` conversion and end-of-day
  cutoff (`setHours(23, 59, 59, 999)`). Raw UTC comparison disagrees with Astro and causes false build
  failures. Copy the logic; do not reimplement it.

### `src/utils/blog.ts` L71-77: toIST()

```ts
  const toIST = (d: Date | string) => {
    const date = d instanceof Date ? d : new Date(String(d));
    const istDate = new Date(date.getTime() + 5.5 * 60 * 60 * 1000).toISOString().slice(0, 10);
    return new Date(istDate + 'T00:00:00+05:30');
  };
  const publishDate = toIST(rawPublishDate);
  const updateDate = rawUpdateDate ? toIST(rawUpdateDate) : undefined;
```

### `src/utils/blog.ts` L134-140: end-of-day cutoff and filter

```ts
  const cutoff = import.meta.env.DEV ? new Date('2099-12-31') : new Date();
  cutoff.setHours(23, 59, 59, 999);

  const results = (await Promise.all(normalizedPosts))
    .sort((a, b) => b.publishDate.valueOf() - a.publishDate.valueOf())
    .filter((post) => !post.draft)
    .filter((post) => post.publishDate <= cutoff);
```

### `scripts/validate-build.js` L254-264: the copied toIST() and cutoff

```js
function toIST(d) {
  const date = d instanceof Date ? d : new Date(String(d));
  const istDateStr = new Date(date.getTime() + 5.5 * 60 * 60 * 1000).toISOString().slice(0, 10);
  return new Date(istDateStr + 'T00:00:00+05:30');
}

function checkDraftLeaks(distRoot, postDir) {
  const violations = [];
  const now = new Date();
  const cutoff = new Date(now);
  cutoff.setHours(23, 59, 59, 999);
```

### `docs/sops/deploy-checklist.md` L11-12: deploy-time checks

- [ ] **publishDate:** IST timezone verified (format `YYYY-MM-DD`, treated as `T00:00:00+05:30`)
- [ ] **UTC check:** If current IST time is before 05:30, the page will not appear until 05:30 IST - flag this to user if they expect it live immediately

### `scripts/new-post.mjs` L92: scaffold date stamp

```js
  const today = new Date().toISOString().replace(/T.*/, 'T00:00:00Z');
```
