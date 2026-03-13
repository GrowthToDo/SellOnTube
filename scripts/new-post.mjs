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

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createInterface } from 'readline';
import { execSync } from 'child_process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(__dirname, '..');
const POSTS_DIR = path.join(PROJECT_ROOT, 'src', 'data', 'post');

function prompt(question) {
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.trim());
    });
  });
}

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

async function main() {
  console.log('\n--- New Blog Post ---\n');

  const title = await prompt('Post title: ');
  if (!title) {
    console.error('Title is required.');
    process.exit(1);
  }

  const keyword = await prompt('Primary keyword: ');
  if (!keyword) {
    console.error('Keyword is required.');
    process.exit(1);
  }

  const suggestedSlug = slugify(title);
  const slugInput = await prompt(`Slug [${suggestedSlug}]: `);
  const slug = slugInput || suggestedSlug;

  // Check if post already exists
  const postPath = path.join(POSTS_DIR, `${slug}.md`);
  if (fs.existsSync(postPath)) {
    console.error(`\nPost already exists: ${postPath}`);
    process.exit(1);
  }

  // Fetch feature image
  console.log('\nFetching feature image...\n');

  let imageResult;
  try {
    const output = execSync(
      `node "${path.join(__dirname, 'get-feature-image.mjs')}" "${slug}" "${title}" "${keyword}"`,
      { encoding: 'utf-8', stdio: ['inherit', 'pipe', 'inherit'] }
    );

    // Extract JSON from the output (after "--- Result ---")
    const jsonMatch = output.match(/--- Result ---\n([\s\S]+)$/);
    if (jsonMatch) {
      imageResult = JSON.parse(jsonMatch[1].trim());
    }
  } catch (err) {
    console.error('Image fetch failed. Creating post without image.');
  }

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

  fs.writeFileSync(postPath, frontmatter.join('\n'));

  console.log(`\n--- Done ---`);
  console.log(`Post created: ${postPath}`);
  if (imageResult) {
    console.log(`Image: ${imageResult.path}`);
    console.log(`Source: ${imageResult.source}`);
  }
  console.log(`\nOpen in your editor and start writing!`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
