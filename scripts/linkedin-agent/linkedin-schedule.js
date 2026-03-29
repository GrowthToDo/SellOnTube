// scripts/linkedin-agent/linkedin-schedule.js
// Reads queue.json, schedules each post via Zernio API at 9 AM IST,
// appends successful posts to linkedin-history.json.
//
// Run:  node scripts/linkedin-agent/linkedin-schedule.js
// Env:  ZERNIO_API_KEY, ZERNIO_ACCOUNT_ID (from .env or environment)

import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath, pathToFileURL } from 'url';
import { dirname, join, resolve } from 'path';

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

// Pure: convert YYYY-MM-DD to 9 AM IST = 03:30 UTC
export function buildScheduledFor(dateStr) {
  return `${dateStr}T03:30:00Z`;
}

// Upload an image to Zernio's media endpoint, returns the Zernio-hosted URL
async function uploadImageToZernio(imageUrl, apiKey) {
  // Download the image
  const imgRes = await fetch(imageUrl);
  if (!imgRes.ok) throw new Error(`Failed to download image: HTTP ${imgRes.status}`);
  const imgBuffer = Buffer.from(await imgRes.arrayBuffer());
  const fileName = imageUrl.split('/').pop() || 'image.webp';

  // Build multipart form data manually (no dependencies)
  const boundary = '----ZernioUpload' + Date.now();
  const bodyParts = [
    `--${boundary}\r\n`,
    `Content-Disposition: form-data; name="files"; filename="${fileName}"\r\n`,
    `Content-Type: application/octet-stream\r\n\r\n`,
  ];
  const header = Buffer.from(bodyParts.join(''));
  const footer = Buffer.from(`\r\n--${boundary}--\r\n`);
  const body = Buffer.concat([header, imgBuffer, footer]);

  const uploadRes = await fetch('https://zernio.com/api/v1/media', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': `multipart/form-data; boundary=${boundary}`,
    },
    body,
  });

  if (!uploadRes.ok) throw new Error(`Media upload failed: HTTP ${uploadRes.status}`);
  const uploadData = JSON.parse(await uploadRes.text());
  if (!uploadData.files || !uploadData.files[0]?.url) {
    throw new Error('Media upload returned no URL');
  }
  return uploadData.files[0].url;
}

// Pure: build Zernio API payload from a queue post object
export function buildPayload(post, accountId, zernioMediaUrl) {
  const payload = {
    content: post.linkedinPost,
    timezone: 'Asia/Kolkata',
    platforms: [{ platform: 'linkedin', accountId }],
  };
  if (post.publishNow) {
    payload.publishNow = true;
  } else {
    payload.scheduledFor = buildScheduledFor(post.scheduledDate);
  }
  if (zernioMediaUrl) {
    payload.mediaItems = [{ url: zernioMediaUrl, type: 'image' }];
  }
  return payload;
}

// Sleep helper for retry
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
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

  console.log(`[linkedin-schedule] Scheduling ${queue.length} post(s) to LinkedIn via Zernio...\n`);

  let successCount = 0;
  let failCount = 0;

  for (const post of queue) {
    const label = `${post.scheduledDate} (${post.dayOfWeek}) — ${post.sourceTitle}`;

    try {
      // Upload image to Zernio if provided
      let zernioMediaUrl = null;
      if (post.imageUrl) {
        console.log(`  UPLOADING  image for ${post.dayOfWeek}...`);
        zernioMediaUrl = await uploadImageToZernio(post.imageUrl, apiKey);
      }

      const payload = buildPayload(post, accountId, zernioMediaUrl);
      await postToZernio(payload, apiKey);
      saveToHistory(post);
      console.log(`  SCHEDULED  ${label}`);
      const when = post.publishNow ? 'now' : payload.scheduledFor;
      console.log(`             Publish: ${when} | Image: ${zernioMediaUrl ? 'yes' : 'none'}\n`);
      successCount++;
    } catch (err) {
      console.error(`  FAILED     ${label}`);
      console.error(`             ${err.message}\n`);
      failCount++;
    }
  }

  console.log(`Done. ${successCount} scheduled, ${failCount} failed.`);
  if (failCount > 0) process.exit(1);
}

// Only run main if invoked directly (not imported)
const scriptPath = pathToFileURL(resolve(process.argv[1])).href;
if (import.meta.url === scriptPath) {
  main();
}
