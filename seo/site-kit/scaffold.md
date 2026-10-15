Site kit for SellonTube: site-specific only. Method and rules live in seo-content-system.
Sources: `scripts/new-post.mjs` L1-15, L64-70, L91-135; `scripts/get-feature-image.mjs` L231-240; `package.json` L23.

Excerpts are verbatim except that every em dash and en dash is replaced with " - ".

# New-post scaffold (`npm run new-post`)

Notes added for this kit (read from the script 2026-10-15; the script was not run):

- Interactive: prompts for title, keyword and slug, so it cannot run headless.
- Always writes `src/data/post/{slug}.md`. `blog-production-standard.md` L219 says posts with inline HTML or SVG must be `.mdx`. Rename before adding HTML.
- The image step writes a raster `{slug}-feature.webp` (plus a JPEG) at 1200x630 from Unsplash or Pexels. The house featured-image spec is a hand-made `{slug}-featured.svg` at 1200x675 (`brand-visuals.md`). The raster output does satisfy L-TE-09 for og:image.
- Hardcodes `author: Sathyanand`, `draft: true`, empty `excerpt` and empty `metadata.description` (the field that becomes the meta description).
- Stamps today's UTC date (`dates.md`).

### `scripts/new-post.mjs` L1-15: header

```js
#!/usr/bin/env node

/**
 * new-post.mjs
 *
 * Interactive helper to create a new blog post with a feature image.
 *
 * Usage:
 *   npm run new-post
 *   node scripts/new-post.mjs
 *
 * Prompts for title, keyword, and slug, then:
 * 1. Runs get-feature-image.mjs to fetch + process an image
 * 2. Creates a new .md file at src/data/post/{slug}.md with full frontmatter
 */
```

### `scripts/new-post.mjs` L64-70: overwrite guard

```js

  // Check if post already exists
  const postPath = path.join(POSTS_DIR, `${slug}.md`);
  if (fs.existsSync(postPath)) {
    console.error(`\nPost already exists: ${postPath}`);
    process.exit(1);
  }
```

### `scripts/new-post.mjs` L91-135: frontmatter it writes

```js
  // Build frontmatter
  const today = new Date().toISOString().replace(/T.*/, 'T00:00:00Z');

  const frontmatter = [
    '---',
    `publishDate: ${today}`,
    `author: Sathyanand`,
    `title: "${title}"`,
    `excerpt: ""`,
  ];

  if (imageResult) {
    frontmatter.push(`image: ${imageResult.path}`);
    frontmatter.push(`image_alt: "${imageResult.alt}"`);
    frontmatter.push(`featuredImageCaption: ""`);
    frontmatter.push(`featuredImageCredit: "${imageResult.credit}"`);
    frontmatter.push(`featuredImageCreditUrl: "${imageResult.creditUrl}"`);
    frontmatter.push(`featuredImageWidth: ${imageResult.width}`);
    frontmatter.push(`featuredImageHeight: ${imageResult.height}`);
    frontmatter.push(`featuredImagePlaceholder: "${imageResult.placeholder}"`);
  }

  frontmatter.push(`category: ""`);
  frontmatter.push(`tags:`);
  frontmatter.push(`  - ${keyword.toLowerCase().replace(/\s+/g, '-')}`);
  frontmatter.push(`metadata:`);
  frontmatter.push(`  canonical: https://sellontube.com/blog/${slug}`);
  frontmatter.push(`  description: ""`);
  frontmatter.push(`  robots:`);
  frontmatter.push(`    index: true`);
  frontmatter.push(`    follow: true`);
  frontmatter.push(`  openGraph:`);
  frontmatter.push(`    url: https://sellontube.com/blog/${slug}`);
  frontmatter.push(`    siteName: SellOnTube`);
  frontmatter.push(`    locale: en_US`);
  frontmatter.push(`    type: article`);
  frontmatter.push(`  twitter:`);
  frontmatter.push(`    handle: "@sellontube"`);
  frontmatter.push(`    site: "@sellontube"`);
  frontmatter.push(`    cardType: summary_large_image`);
  frontmatter.push(`draft: true`);
  frontmatter.push('---');
  frontmatter.push('');
  frontmatter.push('Write your post here.');
  frontmatter.push('');
```

### `scripts/get-feature-image.mjs` L231-240: image output

```js
  const webpPath = path.join(IMAGES_DIR, `${slug}-feature.webp`);

  // Resize and crop to 1200×630 (1.91:1)
  const resized = sharp(inputBuffer).resize(1200, 630, { fit: 'cover', position: 'center' });

  // JPEG - quality 82, progressive
  await resized.clone().jpeg({ quality: 82, progressive: true }).toFile(jpegPath);

  // WebP - quality 80
  await resized.clone().webp({ quality: 80 }).toFile(webpPath);
```

### `package.json` L23: npm script

```json
    "new-post": "node scripts/new-post.mjs",
```
