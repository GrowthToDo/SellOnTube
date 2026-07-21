// Shared Zernio API client. The LinkedIn agent still carries its own private
// copies of these helpers; migrate it here when that stream is un-parked.
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const BASE = 'https://zernio.com/api/v1';

export function loadEnv() {
  try {
    const lines = readFileSync(join(__dirname, '../../.env'), 'utf8').split('\n');
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
    // .env absent: rely on real environment variables
  }
}

// Pure: shape Zernio's /usage response into what callers actually need.
export function parseUsage(raw) {
  const limit = raw?.limits?.uploads ?? 0;
  const used = raw?.usage?.uploads ?? 0;
  return {
    limit,
    used,
    remaining: Math.max(0, limit - used),
    anchorDay: raw?.billingAnchorDay ?? null,
  };
}

async function request(path, apiKey, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${apiKey}`,
      ...(options.body ? { 'Content-Type': 'application/json' } : {}),
      ...(options.headers || {}),
    },
  });
  const body = await res.text();
  if (!res.ok) throw new Error(`HTTP ${res.status} on ${path}: ${body.slice(0, 200)}`);
  return body ? JSON.parse(body) : {};
}

export async function getUsage(apiKey) {
  return parseUsage(await request('/usage', apiKey));
}

export async function postToZernio(payload, apiKey) {
  return request('/posts', apiKey, { method: 'POST', body: JSON.stringify(payload) });
}

// Pure: shape Zernio's /accounts response into an array.
//
// This sits directly on the account-deactivation signal path, so it must never
// degrade to `[]` on an unrecognised payload: an empty list makes the verifier
// iterate nothing and print "All clear" during exactly the vendor-side
// disconnect it exists to catch. Two shapes are accepted (an `{ accounts: [] }`
// envelope and a bare array); anything else throws.
export function normalizeAccounts(raw) {
  if (Array.isArray(raw)) return raw;
  if (raw && Array.isArray(raw.accounts)) return raw.accounts;
  const preview = (JSON.stringify(raw) || String(raw)).slice(0, 200);
  throw new Error(
    `Zernio /accounts returned an unexpected shape; refusing to treat it as "no accounts". Got: ${preview}`,
  );
}

export async function getAccounts(apiKey) {
  return normalizeAccounts(await request('/accounts', apiKey));
}

export async function listPosts(apiKey) {
  const all = [];
  for (let page = 1; page <= 20; page++) {
    const d = await request(`/posts?page=${page}&limit=50`, apiKey);
    const posts = d.posts || [];
    all.push(...posts);
    if (posts.length < 50) break;
  }
  return all;
}

export async function deletePost(id, apiKey) {
  await request(`/posts/${id}`, apiKey, { method: 'DELETE' });
  return true;
}
