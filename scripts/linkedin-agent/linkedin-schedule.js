// scripts/linkedin-agent/linkedin-schedule.js
// Reads queue.json, schedules each post via Zernio API at 9 AM IST,
// appends successful posts to linkedin-history.json.
//
// Run:  node scripts/linkedin-agent/linkedin-schedule.js
// Env:  ZERNIO_API_KEY, ZERNIO_ACCOUNT_ID (from .env or environment)

import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath, pathToFileURL } from 'url';
import { dirname, join, resolve } from 'path';
import { validatePost } from './validate-post.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Load .env manually (no dotenv dependency — keep it simple)
function loadEnv() {
  try {
    const envPath = join(__dirname, '../../.env');
    const lines = readFileSync(envPath, 'utf8').split('\n');
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const eq = trimmed.indexOf('=');
      if (eq === -1) continue;
      const key = trimmed.slice(0, eq).trim();
      const val = trimmed.slice(eq + 1).trim().replace(/^["']|["']$/g, '');
      if (!process.env[key]) process.env[key] = val;
    }
  } catch {
    // .env not present — rely on environment variables directly
  }
}

// Posting time, tuned for US + Europe audiences: 7 PM IST = 13:30 UTC
// (= 9 AM US-Eastern, 2:30 PM Central Europe).
const POST_TIME_UTC = '13:30:00';

// Pure: convert YYYY-MM-DD to the scheduled UTC instant.
export function buildScheduledFor(dateStr) {
  return `${dateStr}T${POST_TIME_UTC}Z`;
}

// Pure: compose the LinkedIn body actually posted -- the copy plus up to 3
// hashtags (LinkedIn convention: a blank line, then the tags). Tags live in the
// queue separately so they can be tuned without touching the prose.
export function composeLinkedInContent(post) {
  let content = post.linkedinPost || '';
  const tags = Array.isArray(post.hashtags) ? post.hashtags.slice(0, 3) : [];
  if (tags.length) content += `\n\n${tags.join(' ')}`;
  return content;
}

// Pure: build Zernio API payload from a queue post object
// zernioImageUrl is the uploaded image URL from Zernio's media endpoint (optional)
export function buildPayload(post, accountId, zernioImageUrl) {
  // firstComment is LinkedIn-specific: it goes INSIDE the platform's
  // platformSpecificData, not at the payload top level (Zernio ignores it there).
  const linkedin = { platform: 'linkedin', accountId };
  if (post.firstComment) {
    linkedin.platformSpecificData = { firstComment: post.firstComment };
  }
  const payload = {
    content: composeLinkedInContent(post),
    timezone: 'Asia/Kolkata',
    platforms: [linkedin],
  };
  if (post.publishNow) {
    payload.publishNow = true;
  } else {
    payload.scheduledFor = buildScheduledFor(post.scheduledDate);
  }
  if (zernioImageUrl) {
    payload.mediaItems = [{ url: zernioImageUrl, type: 'image' }];
  }
  return payload;
}

// --- X (Twitter) via upload-post.com --------------------------------------
// LinkedIn goes through Zernio (above). X is posted through upload-post.com,
// which is free and purpose-built for X. Two upload-post facts drive the design:
//   1. It STRIPS every URL from X posts on the free tier (to keep X on the
//      cheap billing tier), so X posts are intentionally link-free -- the value
//      lives in-feed, and link-free is X-native anyway.
//   2. It auto-threads any `title` longer than 280 chars. We don't want a thread
//      of a LinkedIn post, so we repurpose down to a single native <=280 tweet.
const X_LIMIT = 280;
const URL_G = /https?:\/\/[^\s]+/g;

function stripUrls(s) {
  return s.replace(URL_G, '').replace(/[ \t]{2,}/g, ' ').trim();
}

// Plain char length (X posts here carry no URLs, so no t.co weighting needed).
export function xLen(str) {
  return str.length;
}

// Greedily pack whole sentences from the start until the next would overflow.
function fitSentences(text, budget) {
  const clean = stripUrls(text);
  const sentences = clean.match(/[^.!?]+[.!?]+(\s|$)/g) || [clean];
  let out = '';
  for (const s of sentences) {
    const next = (out ? out + ' ' : '') + s.trim();
    if (next.length > budget) break;
    out = next;
  }
  return out || hardTrim(clean, budget);
}

// Word-boundary trim to <= limit chars, with an ellipsis.
function hardTrim(str, limit) {
  if (str.length <= limit) return str;
  let out = '';
  for (const w of str.split(/\s+/)) {
    const cand = out ? out + ' ' + w : w;
    if (cand.length + 1 > limit) break; // +1 reserves the ellipsis
    out = cand;
  }
  if (!out) out = str.slice(0, Math.max(0, limit - 1));
  return out.trim() + '…';
}

// Pure: repurpose a queue post's LinkedIn body into a native, link-free X post
// of at most 280 chars. Leads with the hook; keeps the closing question when it
// fits. Never emits a URL (upload-post strips URLs from X on the free tier).
export function buildXText(post) {
  // Prefer a bespoke, hand-authored tweet (line-break casual voice) when the
  // queue provides one. The auto-derivation below is the fallback.
  if (post.xPost && post.xPost.trim()) {
    const t = post.xPost.trim();
    if (t.length > X_LIMIT) {
      throw new Error(`xPost ${t.length} > ${X_LIMIT} for ${post.scheduledDate}`);
    }
    return t;
  }

  const raw = (post.linkedinPost || '').trim();
  const full = stripUrls(raw);
  const paras = raw.split(/\n{2,}/).map((p) => stripUrls(p)).filter(Boolean);
  const hook = paras[0] || '';
  const last = paras[paras.length - 1] || '';
  const closingQ = /\?\s*$/.test(last) && last !== hook ? last : '';

  let text;
  if (hook.length > X_LIMIT) {
    text = fitSentences(full, X_LIMIT);
  } else if (closingQ && `${hook}\n\n${closingQ}`.length <= X_LIMIT) {
    text = `${hook}\n\n${closingQ}`;
  } else {
    text = hook;
  }

  if (text.length > X_LIMIT) {
    // Unreachable given the budgeting above; fail loud, never ship a long tweet.
    throw new Error(`X text ${text.length} > ${X_LIMIT} for ${post.scheduledDate}`);
  }
  return text;
}

// Pure: build the multipart form for upload-post's POST /api/upload_text (X only).
export function buildUploadPostForm(post, user) {
  const form = new FormData();
  form.append('user', user);
  form.append('platform[]', 'x');
  form.append('title', buildXText(post));
  if (!post.publishNow) {
    // buildScheduledFor gives an ISO-8601 UTC instant (7 PM IST = 13:30 UTC).
    form.append('scheduled_date', buildScheduledFor(post.scheduledDate));
    form.append('timezone', 'UTC');
  }
  return form;
}

// POST the X post to upload-post with one retry on network failure. FormData is
// single-use once a fetch consumes it, so the retry rebuilds the form.
async function postToUploadPost(post, apiKey, user) {
  const url = 'https://api.upload-post.com/api/upload_text';
  const headers = { Authorization: `Apikey ${apiKey}` };
  let res;
  try {
    res = await fetch(url, { method: 'POST', headers, body: buildUploadPostForm(post, user) });
  } catch (networkErr) {
    console.warn(`  [warn] upload-post network error, retrying in 3s... (${networkErr.message})`);
    await sleep(3000);
    res = await fetch(url, { method: 'POST', headers, body: buildUploadPostForm(post, user) });
  }
  const body = await res.text();
  if (!res.ok) {
    throw new Error(`HTTP ${res.status}: ${body.slice(0, 200)}`);
  }
  return JSON.parse(body);
}

// Sleep helper for retry
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Upload an image to Zernio and return the hosted URL
async function uploadImageToZernio(imageUrl, apiKey) {
  // Fetch the image
  const imgRes = await fetch(imageUrl);
  if (!imgRes.ok) {
    throw new Error(`Failed to fetch image ${imageUrl}: HTTP ${imgRes.status}`);
  }
  const imgBuffer = await imgRes.arrayBuffer();
  const contentType = imgRes.headers.get('content-type') || 'image/webp';
  const ext = contentType.includes('svg') ? 'svg' : contentType.includes('png') ? 'png' : contentType.includes('jpeg') || contentType.includes('jpg') ? 'jpg' : 'webp';
  const filename = `linkedin-image.${ext}`;

  // Build multipart form
  const blob = new Blob([imgBuffer], { type: contentType });
  const form = new FormData();
  form.append('files', blob, filename);

  const res = await fetch('https://zernio.com/api/v1/media', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${apiKey}` },
    body: form,
  });

  const body = await res.text();
  if (!res.ok) {
    throw new Error(`Image upload failed: HTTP ${res.status}: ${body.slice(0, 200)}`);
  }

  const data = JSON.parse(body);
  // Zernio returns: { files: [{ type, url, filename, size, mimeType }] }
  if (data.files && Array.isArray(data.files) && data.files.length > 0 && data.files[0].url) {
    return data.files[0].url;
  }
  if (Array.isArray(data) && data.length > 0 && data[0].url) {
    return data[0].url;
  }
  if (data.url) return data.url;
  if (data.data && Array.isArray(data.data) && data.data.length > 0) {
    return data.data[0].url || data.data[0];
  }
  throw new Error(`Unexpected upload response: ${body.slice(0, 200)}`);
}

// POST to Zernio with one retry on network failure
async function postToZernio(payload, apiKey) {
  const url = 'https://zernio.com/api/v1/posts';
  const options = {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  };

  let res;
  try {
    res = await fetch(url, options);
  } catch (networkErr) {
    console.warn(`  [warn] Network error, retrying in 3s... (${networkErr.message})`);
    await sleep(3000);
    try {
      res = await fetch(url, options);
    } catch (retryErr) {
      throw new Error(`Network failure after retry: ${retryErr.message}`);
    }
  }

  const body = await res.text();
  if (!res.ok) {
    throw new Error(`HTTP ${res.status}: ${body.slice(0, 200)}`);
  }
  return JSON.parse(body);
}

// Append a post record to linkedin-history.json (keeps last 30)
function saveToHistory(post) {
  const historyPath = join(__dirname, 'linkedin-history.json');
  let history = { posts: [] };
  try {
    history = JSON.parse(readFileSync(historyPath, 'utf8'));
  } catch {
    // start fresh if file is missing or corrupt
  }

  history.posts.unshift({
    date: post.scheduledDate,
    dayOfWeek: post.dayOfWeek,
    weekdayTheme: post.weekdayTheme,
    sourceTitle: post.sourceTitle,
    sourceUrl: post.sourceUrl,
    postAngle: post.postAngle,
    archetype: post.archetype ?? null,
    linkLocation: post.linkLocation ?? null,
    thesis: post.thesis ?? null,
    hook: post.linkedinPost.split('\n')[0].slice(0, 120),
    hashtags: post.hashtags ?? [],
    imageUrl: post.imageUrl ?? null,
    status: 'scheduled',
  });

  // Keep only last 30
  history.posts = history.posts.slice(0, 30);
  writeFileSync(historyPath, JSON.stringify(history, null, 2));
}

// Main
async function main() {
  loadEnv();

  const apiKey = process.env.ZERNIO_API_KEY;
  const accountId = process.env.ZERNIO_ACCOUNT_ID;
  const uploadPostKey = process.env.UPLOAD_POST_API_KEY;
  const uploadPostUser = process.env.UPLOAD_POST_USER || 'SellonTube';

  if (!apiKey) {
    console.error('[linkedin-schedule] ERROR: ZERNIO_API_KEY is not set.');
    console.error('  Add it to your .env file: ZERNIO_API_KEY=sk_...');
    process.exit(1);
  }
  if (!accountId) {
    console.error('[linkedin-schedule] ERROR: ZERNIO_ACCOUNT_ID is not set.');
    console.error('  Add it to your .env file: ZERNIO_ACCOUNT_ID=acc_...');
    process.exit(1);
  }

  // Load queue
  const queuePath = join(__dirname, 'queue.json');
  let queue;
  try {
    queue = JSON.parse(readFileSync(queuePath, 'utf8'));
  } catch (e) {
    console.error(`[linkedin-schedule] ERROR: Could not read queue.json — ${e.message}`);
    process.exit(1);
  }

  if (!Array.isArray(queue) || queue.length === 0) {
    console.error('[linkedin-schedule] ERROR: queue.json is empty. Generate posts first.');
    process.exit(1);
  }

  console.log(`[linkedin-schedule] Scheduling ${queue.length} post(s) to LinkedIn via Zernio...`);
  console.log(
    uploadPostKey
      ? `[linkedin-schedule] X cross-posting: ON via upload-post (user=${uploadPostUser}, repurposed link-free <=280)\n`
      : '[linkedin-schedule] X cross-posting: OFF (set UPLOAD_POST_API_KEY to enable)\n',
  );

  // Recent hooks from history, for dedup in the mechanical assert.
  let recentHooks = [];
  try {
    const hist = JSON.parse(readFileSync(join(__dirname, 'linkedin-history.json'), 'utf8'));
    recentHooks = (hist.posts || []).map((p) => (p.hook || '').trim()).filter(Boolean);
  } catch {
    // no history yet
  }

  let successCount = 0;
  let failCount = 0;

  for (const post of queue) {
    const label = `${post.scheduledDate} (${post.dayOfWeek}) -- ${post.sourceTitle}`;

    // Last-line mechanical assert: skip a failing post, keep the rest.
    const check = validatePost(post, recentHooks);
    if (!check.ok) {
      console.error(`  SKIPPED    ${label}`);
      console.error(`             failed validation: ${check.reasons.join('; ')}\n`);
      failCount++;
      continue;
    }

    try {
      // Upload image to Zernio first if present
      let zernioImageUrl = null;
      if (post.imageUrl) {
        console.log(`  UPLOADING  Image for ${post.dayOfWeek}...`);
        zernioImageUrl = await uploadImageToZernio(post.imageUrl, apiKey);
        console.log(`             Uploaded: ${zernioImageUrl}`);
      }

      const payload = buildPayload(post, accountId, zernioImageUrl);
      await postToZernio(payload, apiKey);
      saveToHistory(post);
      console.log(`  SCHEDULED  ${label}`);
      const when = post.publishNow ? 'now' : payload.scheduledFor;
      console.log(`             Publish: ${when} | Image: ${zernioImageUrl ? 'yes' : 'none'}`);
      successCount++;

      // Cross-post a repurposed, link-free version to X via upload-post. A
      // failure here never fails the item -- the LinkedIn post already shipped.
      if (uploadPostKey) {
        try {
          const xText = buildXText(post);
          await postToUploadPost(post, uploadPostKey, uploadPostUser);
          console.log(`             X: scheduled via upload-post (${xText.length}/280 chars)\n`);
        } catch (xErr) {
          console.error(`             X: FAILED via upload-post, LinkedIn OK -- ${xErr.message}\n`);
        }
      } else {
        console.log('');
      }
    } catch (err) {
      console.error(`  FAILED     ${label}`);
      console.error(`             ${err.message}\n`);
      failCount++;
    }
  }

  console.log(`Done. ${successCount} scheduled, ${failCount} failed.`);
  if (failCount > 0) process.exit(1);
}

// Only run main if invoked directly (not imported). Guard argv[1] so importing
// this module (e.g. from a test, or `node -e`) never crashes when it is absent.
const invokedPath = process.argv[1]
  ? pathToFileURL(resolve(process.argv[1])).href
  : null;
if (invokedPath && import.meta.url === invokedPath) {
  main();
}
