// scripts/gsc-sitemap-submit.js
// Submits the sitemap to Google Search Console after every production deploy.
// This prompts Google to re-crawl the sitemap and discover new/updated pages faster.
//
// Run: node scripts/gsc-sitemap-submit.js
// Env: GOOGLE_SERVICE_ACCOUNT_JSON — optional; falls back to scripts/credentials.json
//      GSC_SITE_URL   (default: sc-domain:sellontube.com)
//      SITEMAP_URL    (default: https://sellontube.com/sitemap-index.xml)
//
// The service account must have "Full" permission in GSC (Settings → Users and permissions).
// Non-fatal: any failure logs a warning and exits 0 so the deploy is never blocked.

import crypto from 'crypto';
import https from 'https';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const GSC_SITE_URL = process.env.GSC_SITE_URL || 'sc-domain:sellontube.com';
const SITEMAP_URL  = process.env.SITEMAP_URL  || 'https://sellontube.com/sitemap-index.xml';

function loadCredentials() {
  // 1. Prefer env var (Netlify / CI)
  if (process.env.GOOGLE_SERVICE_ACCOUNT_JSON) {
    return JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON);
  }
  // 2. Fall back to local credentials.json (developer machine)
  const localPath = path.join(__dirname, 'credentials.json');
  if (fs.existsSync(localPath)) {
    return JSON.parse(fs.readFileSync(localPath, 'utf8'));
  }
  return null;
}

const sa = loadCredentials();
if (!sa) {
  console.warn('[GSC] WARNING: No credentials found (env var or credentials.json). Skipping.');
  process.exit(0);
}

// ── JWT helpers ──────────────────────────────────────────────────────────────

function base64url(str) {
  return Buffer.from(str)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}

function makeJwt(clientEmail, privateKey) {
  const now    = Math.floor(Date.now() / 1000);
  const header  = base64url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }));
  const payload = base64url(JSON.stringify({
    iss:   clientEmail,
    scope: 'https://www.googleapis.com/auth/webmasters',
    aud:   'https://oauth2.googleapis.com/token',
    iat:   now,
    exp:   now + 3600,
  }));
  const sigInput = `${header}.${payload}`;
  const signer   = crypto.createSign('RSA-SHA256');
  signer.update(sigInput);
  const sig = signer.sign(privateKey, 'base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
  return `${sigInput}.${sig}`;
}

// ── HTTP helpers ─────────────────────────────────────────────────────────────

function httpPost(url, body) {
  return new Promise((resolve, reject) => {
    const buf = Buffer.from(body);
    const u   = new URL(url);
    const req = https.request(
      {
        hostname: u.hostname,
        path:     u.pathname + u.search,
        method:   'POST',
        headers:  {
          'Content-Type':   'application/x-www-form-urlencoded',
          'Content-Length': buf.length,
        },
      },
      (res) => {
        let data = '';
        res.on('data', (c) => { data += c; });
        res.on('end',  () => resolve({ status: res.statusCode, body: data }));
      }
    );
    req.on('error', reject);
    req.write(buf);
    req.end();
  });
}

function httpPut(url, accessToken) {
  return new Promise((resolve, reject) => {
    const u   = new URL(url);
    const req = https.request(
      {
        hostname: u.hostname,
        path:     u.pathname + u.search,
        method:   'PUT',
        headers:  {
          Authorization:    `Bearer ${accessToken}`,
          'Content-Length': 0,
        },
      },
      (res) => {
        let data = '';
        res.on('data', (c) => { data += c; });
        res.on('end',  () => resolve({ status: res.statusCode, body: data }));
      }
    );
    req.on('error', reject);
    req.end();
  });
}

// ── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log(`[GSC] Submitting sitemap: ${SITEMAP_URL}`);

  // 1. Exchange JWT for access token
  const jwt      = makeJwt(sa.client_email, sa.private_key);
  const tokenRes = await httpPost(
    'https://oauth2.googleapis.com/token',
    `grant_type=urn%3Aietf%3Aparams%3Aoauth%3Agrant-type%3Ajwt-bearer&assertion=${jwt}`
  );

  if (tokenRes.status !== 200) {
    console.warn(`[GSC] ⚠ Could not get access token (${tokenRes.status}). Skipping.`);
    console.warn(`[GSC]   ${tokenRes.body.slice(0, 200)}`);
    process.exit(0);
  }

  const { access_token } = JSON.parse(tokenRes.body);

  // 2. Submit sitemap via GSC Sitemaps API
  const apiUrl = `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(GSC_SITE_URL)}/sitemaps/${encodeURIComponent(SITEMAP_URL)}`;
  const submitRes = await httpPut(apiUrl, access_token);

  if (submitRes.status === 200 || submitRes.status === 204) {
    console.log(`[GSC] ✓ Sitemap submitted successfully (${submitRes.status})`);
  } else {
    console.warn(`[GSC] ⚠ Sitemap submission returned ${submitRes.status}. Non-fatal.`);
    console.warn(`[GSC]   ${submitRes.body.slice(0, 300)}`);
  }
}

main().catch((err) => {
  console.warn(`[GSC] ⚠ Unexpected error: ${err.message}. Non-fatal.`);
  process.exit(0);
});
