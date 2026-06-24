#!/usr/bin/env node
/**
 * bing-submit.mjs — Submit URLs to the Bing Webmaster URL Submission API.
 *
 * Bing's index is the grounding layer for Microsoft Copilot + Bing AI, so
 * getting pages (re)crawled here makes them eligible for AI citations sooner.
 *
 * Usage:
 *   node scripts/bing-submit.mjs --quota              # print daily/monthly quota
 *   node scripts/bing-submit.mjs path/to/urls.txt     # submit URLs (one per line)
 *
 * Reads BING_WEBMASTER_API_KEY from env or the local .env file.
 * Refuses to submit more than the remaining daily quota.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SITE_URL = 'https://sellontube.com';

function getKey() {
  if (process.env.BING_WEBMASTER_API_KEY) return process.env.BING_WEBMASTER_API_KEY;
  const envPath = path.resolve(__dirname, '..', '.env');
  if (fs.existsSync(envPath)) {
    const m = fs.readFileSync(envPath, 'utf-8').match(/^BING_WEBMASTER_API_KEY\s*=\s*(.+)$/m);
    if (m) return m[1].trim().replace(/^["']|["']$/g, '');
  }
  throw new Error('BING_WEBMASTER_API_KEY not found in env or .env');
}

const KEY = getKey();

async function getQuota() {
  const res = await fetch(
    `https://ssl.bing.com/webmaster/api.svc/json/GetUrlSubmissionQuota?siteUrl=${encodeURIComponent(SITE_URL)}&apikey=${KEY}`
  );
  const j = await res.json();
  return j.d; // { DailyQuota, MonthlyQuota }
}

async function submit(urls) {
  const res = await fetch(`https://ssl.bing.com/webmaster/api.svc/json/SubmitUrlbatch?apikey=${KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify({ siteUrl: SITE_URL, urlList: urls }),
  });
  return { status: res.status, ok: res.ok, body: await res.text() };
}

const arg = process.argv[2];

if (!arg || arg === '--quota') {
  console.log('Bing URL submission quota:', await getQuota());
} else {
  const urls = fs
    .readFileSync(arg, 'utf-8')
    .split(/\r?\n/)
    .map((s) => s.trim())
    .filter((s) => s.startsWith('http'));

  if (urls.length === 0) {
    console.error('No URLs found in', arg);
    process.exit(1);
  }

  const q = await getQuota();
  console.log(`Quota before: daily=${q.DailyQuota} monthly=${q.MonthlyQuota}. Submitting ${urls.length} URLs.`);
  if (urls.length > q.DailyQuota) {
    console.error(`Refusing: ${urls.length} URLs exceeds remaining daily quota (${q.DailyQuota}). Split the batch.`);
    process.exit(1);
  }

  const r = await submit(urls);
  console.log(`HTTP ${r.status}. Response: ${r.body.slice(0, 300)}`);
  if (!r.ok) process.exit(1);
  console.log('Quota after:', await getQuota());
}
