#!/usr/bin/env node

/**
 * get-feature-image.mjs
 *
 * Fetches a feature image for a blog post from Unsplash → Pexels → Pollinations.
 * Processes it with sharp (1200×630 crop, JPEG + WebP + LQIP).
 *
 * Usage:
 *   node scripts/get-feature-image.mjs <slug> <title> <keyword>
 *
 * Returns a JSON object with paths, alt text, and credit info.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(__dirname, '..');
const IMAGES_DIR = path.join(PROJECT_ROOT, 'src', 'assets', 'images', 'blog');
const USED_IMAGES_PATH = path.join(__dirname, 'used-images.json');

// ---------------------------------------------------------------------------
// ENV
// ---------------------------------------------------------------------------
function loadEnv() {
  const envPath = path.join(PROJECT_ROOT, '.env');
  if (!fs.existsSync(envPath)) return {};
  const env = {};
  for (const line of fs.readFileSync(envPath, 'utf-8').split('\n')) {
    const match = line.match(/^\s*([\w]+)\s*=\s*(.+)\s*$/);
    if (match) env[match[1]] = match[2];
  }
  return env;
}

const env = loadEnv();
const UNSPLASH_KEY = env.UNSPLASH_ACCESS_KEY;
const PEXELS_KEY = env.PEXELS_API_KEY;

// ---------------------------------------------------------------------------
// Used-images tracker
// ---------------------------------------------------------------------------
function loadUsedImages() {
  try {
    return JSON.parse(fs.readFileSync(USED_IMAGES_PATH, 'utf-8'));
  } catch {
    return [];
  }
}

function saveUsedImage(entry) {
  const used = loadUsedImages();
  used.push(entry);
  fs.writeFileSync(USED_IMAGES_PATH, JSON.stringify(used, null, 2) + '\n');
}

function isImageUsed(imageId) {
  return loadUsedImages().some((e) => e.imageId === imageId);
}

// ---------------------------------------------------------------------------
// Search query builder — strips generic words, keeps visual nouns
// ---------------------------------------------------------------------------
const GENERIC_WORDS = new Set([
  'marketing', 'business', 'tips', 'guide', 'how', 'to', 'strategy', 'strategies',
  'best', 'top', 'ultimate', 'complete', 'for', 'the', 'a', 'an', 'of', 'in',
  'on', 'with', 'and', 'or', 'your', 'that', 'this', 'what', 'why', 'most',
  'actually', 'drives', 'pipeline', 'businesses', 'case', 'study', 'power',
  'step', 'framework', 'effect', 'fail', 'roi', '2024', '2025', '2026',
]);

function buildSearchQuery(title, keyword) {
  const words = `${title} ${keyword}`
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .split(/\s+/)
    .filter((w) => w.length > 2 && !GENERIC_WORDS.has(w));

  // Deduplicate and take top 3-4 visual words
  const unique = [...new Set(words)].slice(0, 4);
  return unique.join(' ') || keyword;
}

// ---------------------------------------------------------------------------
// Rejection filters — avoid generic stock photos
// ---------------------------------------------------------------------------
const REJECT_KEYWORDS = new Set([
  'handshake', 'teamwork', 'meeting', 'diverse team', 'smiling',
  'whiteboard presentation', 'pointing at screen', 'group photo',
  'corporate portrait', 'office party',
]);

function shouldRejectImage(description = '', tags = []) {
  const text = `${description} ${tags.join(' ')}`.toLowerCase();
  for (const keyword of REJECT_KEYWORDS) {
    if (text.includes(keyword)) return true;
  }
  return false;
}

// ---------------------------------------------------------------------------
// Unsplash
// ---------------------------------------------------------------------------
async function searchUnsplash(query) {
  if (!UNSPLASH_KEY) {
    console.log('  [unsplash] No API key, skipping');
    return null;
  }
  console.log(`  [unsplash] Searching: "${query}"`);

  const url = new URL('https://api.unsplash.com/search/photos');
  url.searchParams.set('query', query);
  url.searchParams.set('orientation', 'landscape');
  url.searchParams.set('per_page', '15');
  url.searchParams.set('content_filter', 'high');

  const res = await fetch(url, { headers: { Authorization: `Client-ID ${UNSPLASH_KEY}` } });
  if (!res.ok) {
    console.log(`  [unsplash] API error: ${res.status}`);
    return null;
  }

  const data = await res.json();
  for (const photo of data.results || []) {
    const id = `unsplash-${photo.id}`;
    if (isImageUsed(id)) continue;
    if (shouldRejectImage(photo.description || photo.alt_description || '', photo.tags?.map((t) => t.title) || [])) continue;

    // Download at 1200w
    const imageUrl = `${photo.urls.raw}&w=1200&q=82&fm=jpg&fit=crop&crop=center`;
    console.log(`  [unsplash] Selected: ${photo.id} — ${photo.alt_description || '(no description)'}`);

    return {
      imageUrl,
      id,
      source: 'unsplash',
      description: photo.alt_description || photo.description || '',
      credit: `${photo.user.name} on Unsplash`,
      creditUrl: photo.links.html,
    };
  }

  console.log('  [unsplash] No suitable image found');
  return null;
}

// ---------------------------------------------------------------------------
// Pexels
// ---------------------------------------------------------------------------
async function searchPexels(query) {
  if (!PEXELS_KEY) {
    console.log('  [pexels] No API key, skipping');
    return null;
  }
  console.log(`  [pexels] Searching: "${query}"`);

  const url = new URL('https://api.pexels.com/v1/search');
  url.searchParams.set('query', query);
  url.searchParams.set('orientation', 'landscape');
  url.searchParams.set('per_page', '15');

  const res = await fetch(url, { headers: { Authorization: PEXELS_KEY } });
  if (!res.ok) {
    console.log(`  [pexels] API error: ${res.status}`);
    return null;
  }

  const data = await res.json();
  for (const photo of data.photos || []) {
    const id = `pexels-${photo.id}`;
    if (isImageUsed(id)) continue;
    if (shouldRejectImage(photo.alt || '', [])) continue;

    const imageUrl = photo.src.large2x || photo.src.large || photo.src.original;
    console.log(`  [pexels] Selected: ${photo.id} — ${photo.alt || '(no alt)'}`);

    return {
      imageUrl,
      id,
      source: 'pexels',
      description: photo.alt || '',
      credit: `${photo.photographer} on Pexels`,
      creditUrl: photo.url,
    };
  }

  console.log('  [pexels] No suitable image found');
  return null;
}

// ---------------------------------------------------------------------------
// Pollinations.ai (fallback — AI generated, no key needed)
// ---------------------------------------------------------------------------
async function generatePollinations(title, keyword) {
  const scenePrompt = `${keyword} ${title.split(' ').slice(0, 4).join(' ')}`.trim();
  const prompt = `${scenePrompt}, professional photography style, flat lay or overhead view, clean minimal background, no text, no logos, no people, high quality, neutral tones`;

  console.log(`  [pollinations] Generating: "${prompt.slice(0, 80)}..."`);

  const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=1200&height=630&nologo=true`;
  const res = await fetch(url);
  if (!res.ok) {
    console.log(`  [pollinations] Failed: ${res.status}`);
    return null;
  }

  const buffer = Buffer.from(await res.arrayBuffer());
  console.log(`  [pollinations] Generated (${(buffer.length / 1024).toFixed(0)}KB)`);

  return {
    buffer,
    id: `pollinations-${Date.now()}`,
    source: 'generated',
    description: scenePrompt,
    credit: 'AI-generated',
    creditUrl: '',
  };
}

// ---------------------------------------------------------------------------
// Image processing with sharp
// ---------------------------------------------------------------------------
async function processImage(inputBuffer, slug) {
  // Ensure output directory exists
  fs.mkdirSync(IMAGES_DIR, { recursive: true });

  const jpegPath = path.join(IMAGES_DIR, `${slug}-feature.jpg`);
  const webpPath = path.join(IMAGES_DIR, `${slug}-feature.webp`);

  // Resize and crop to 1200×630 (1.91:1)
  const resized = sharp(inputBuffer).resize(1200, 630, { fit: 'cover', position: 'center' });

  // JPEG — quality 82, progressive
  await resized.clone().jpeg({ quality: 82, progressive: true }).toFile(jpegPath);

  // WebP — quality 80
  await resized.clone().webp({ quality: 80 }).toFile(webpPath);

  // LQIP — 20×11 blurred, base64
  const lqipBuffer = await resized.clone().resize(20, 11).blur(2).jpeg({ quality: 30 }).toBuffer();
  const lqip = `data:image/jpeg;base64,${lqipBuffer.toString('base64')}`;

  // Dominant color for visual consistency tracking
  const { dominant } = await sharp(inputBuffer).stats();
  const dominantColor = `rgb(${dominant.r},${dominant.g},${dominant.b})`;

  const jpegSize = fs.statSync(jpegPath).size;
  const webpSize = fs.statSync(webpPath).size;
  console.log(`  [sharp] JPEG: ${(jpegSize / 1024).toFixed(0)}KB | WebP: ${(webpSize / 1024).toFixed(0)}KB`);

  return { jpegPath, webpPath, lqip, dominantColor };
}

// ---------------------------------------------------------------------------
// Alt text generator
// ---------------------------------------------------------------------------
function generateAltText(description, keyword) {
  // Clean up the description
  let visual = (description || '').trim();
  if (!visual || visual.length < 10) {
    visual = keyword;
  }

  // Capitalize first letter
  visual = visual.charAt(0).toUpperCase() + visual.slice(1);

  // Remove trailing period
  if (visual.endsWith('.')) visual = visual.slice(0, -1);

  // Build alt: "[visual] — [keyword] | SellonTube"
  let alt = `${visual} — ${keyword} | SellonTube`;

  // Truncate to 125 chars if needed
  if (alt.length > 125) {
    const maxVisual = 125 - ` — ${keyword} | SellonTube`.length;
    visual = visual.slice(0, maxVisual - 1).trim();
    alt = `${visual} — ${keyword} | SellonTube`;
  }

  return alt;
}

// ---------------------------------------------------------------------------
// Consecutive color check
// ---------------------------------------------------------------------------
function checkConsecutiveColors(dominantColor) {
  const used = loadUsedImages();
  const recent = used.slice(-2);
  if (recent.length < 2) return;

  // Simple heuristic: if all three share the same dominant channel, warn
  const parse = (c) => {
    const m = c?.match(/rgb\((\d+),(\d+),(\d+)\)/);
    if (!m) return null;
    return { r: +m[1], g: +m[2], b: +m[3] };
  };

  const colors = [...recent.map((e) => parse(e.dominantColor)), parse(dominantColor)].filter(Boolean);
  if (colors.length < 3) return;

  // Check if dominant channel is the same for all three
  const dominantChannel = (c) => {
    if (c.r >= c.g && c.r >= c.b) return 'red';
    if (c.g >= c.r && c.g >= c.b) return 'green';
    return 'blue';
  };

  const channels = colors.map(dominantChannel);
  if (channels[0] === channels[1] && channels[1] === channels[2]) {
    console.log(`  [warning] Three consecutive posts have similar dominant color (${channels[0]}). Consider variety.`);
  }
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
async function main() {
  const [slug, title, keyword] = process.argv.slice(2);

  if (!slug || !title || !keyword) {
    console.error('Usage: node scripts/get-feature-image.mjs <slug> <title> <keyword>');
    process.exit(1);
  }

  console.log(`\nFetching feature image for: "${title}"`);
  console.log(`Slug: ${slug} | Keyword: ${keyword}\n`);

  const query = buildSearchQuery(title, keyword);
  console.log(`Search query: "${query}"\n`);

  // Try Unsplash → Pexels → Pollinations
  let result = await searchUnsplash(query);

  if (!result) {
    result = await searchPexels(query);
  }

  let imageBuffer;

  if (result && !result.buffer) {
    // Download the image from URL (Unsplash or Pexels)
    console.log(`  Downloading image...`);
    const res = await fetch(result.imageUrl);
    if (!res.ok) {
      console.log(`  Download failed: ${res.status}, falling back to Pollinations`);
      result = null;
    } else {
      imageBuffer = Buffer.from(await res.arrayBuffer());
    }
  }

  if (!result) {
    result = await generatePollinations(title, keyword);
    if (!result) {
      console.error('All image sources failed.');
      process.exit(1);
    }
    imageBuffer = result.buffer;
  } else if (result.buffer) {
    imageBuffer = result.buffer;
  }

  // Process the image
  console.log(`\nProcessing image...`);
  const { lqip, dominantColor } = await processImage(imageBuffer, slug);

  // Check consecutive color similarity
  checkConsecutiveColors(dominantColor);

  // Generate alt text
  const altText = generateAltText(result.description, keyword);

  // Save to used-images tracker
  saveUsedImage({
    postSlug: slug,
    imageId: result.id,
    source: result.source,
    dominantColor,
    usedAt: new Date().toISOString().slice(0, 10),
  });

  // Build the result paths (relative to src/assets for Astro's ~ alias)
  const imagePath = `~/assets/images/blog/${slug}-feature.jpg`;
  const webpPath = `~/assets/images/blog/${slug}-feature.webp`;

  const output = {
    path: imagePath,
    webpPath,
    alt: altText,
    credit: result.credit,
    creditUrl: result.creditUrl,
    width: 1200,
    height: 630,
    placeholder: lqip,
    source: result.source,
  };

  console.log('\n--- Result ---');
  console.log(JSON.stringify(output, null, 2));

  return output;
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
