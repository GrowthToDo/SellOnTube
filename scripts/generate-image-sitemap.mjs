#!/usr/bin/env node

/**
 * generate-image-sitemap.mjs
 *
 * Reads blog post frontmatter and generates public/image-sitemap.xml
 * with <image:image> entries for Google Search Console.
 *
 * Run as part of the build: node scripts/generate-image-sitemap.mjs
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(__dirname, '..');
const POSTS_DIR = path.join(PROJECT_ROOT, 'src', 'data', 'post');
const OUTPUT_PATH = path.join(PROJECT_ROOT, 'public', 'image-sitemap.xml');
const SITE_URL = 'https://sellontube.com';

function extractFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return null;

  const fm = {};
  for (const line of match[1].split('\n')) {
    const kv = line.match(/^(\w[\w\-]*):\s*(.+)$/);
    if (kv) {
      let val = kv[2].trim();
      // Strip quotes
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }
      fm[kv[1]] = val;
    }
  }
  return fm;
}

function main() {
  const files = fs.readdirSync(POSTS_DIR).filter((f) => f.endsWith('.md') || f.endsWith('.mdx'));

  const entries = [];

  for (const file of files) {
    const content = fs.readFileSync(path.join(POSTS_DIR, file), 'utf-8');
    const fm = extractFrontmatter(content);
    if (!fm || fm.draft === 'true') continue;
    if (!fm.image) continue;

    const slug = file.replace(/\.(md|mdx)$/, '');
    const postUrl = `${SITE_URL}/blog/${slug}/`;

    // Resolve image path to a public URL
    // Astro hashes images from src/assets at build time into /_astro/
    let imageUrl;
    if (fm.image.startsWith('~/assets/images/')) {
      const filename = fm.image.split('/').pop();
      imageUrl = `${SITE_URL}/_astro/${filename}`;
    } else if (fm.image.startsWith('http')) {
      imageUrl = fm.image;
    } else {
      imageUrl = `${SITE_URL}${fm.image}`;
    }

    entries.push({
      postUrl,
      imageUrl,
      title: fm.title || slug,
      caption: fm.image_alt || fm.title || '',
    });
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${entries
  .map(
    (e) => `  <url>
    <loc>${escapeXml(e.postUrl)}</loc>
    <image:image>
      <image:loc>${escapeXml(e.imageUrl)}</image:loc>
      <image:title>${escapeXml(e.title)}</image:title>
      <image:caption>${escapeXml(e.caption)}</image:caption>
    </image:image>
  </url>`
  )
  .join('\n')}
</urlset>
`;

  fs.writeFileSync(OUTPUT_PATH, xml);
  console.log(`Image sitemap generated: ${OUTPUT_PATH} (${entries.length} entries)`);
}

function escapeXml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

main();
