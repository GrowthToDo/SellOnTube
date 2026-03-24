// scripts/indexnow-ping.js
// Pings IndexNow API after deploy to trigger fast indexing by search engines.
// Run: node scripts/indexnow-ping.js
// Env: INDEXNOW_KEY (required), SITE_URL (default: https://sellontube.com)
//
// Endpoints:
//   - Yandex: confirmed working (202)
//   - api.indexnow.org / Bing: known to fail with Netlify-hosted sites (403 on key
//     verification from their crawler). Logged as a warning but does not fail the deploy.

import https from 'https';

const key = process.env.INDEXNOW_KEY;
const siteUrl = process.env.SITE_URL || 'https://sellontube.com';

if (!key) {
  console.error('[IndexNow] ERROR: INDEXNOW_KEY environment variable is not set.');
  console.error('[IndexNow] Set it in Netlify dashboard > Site settings > Environment variables.');
  process.exit(0); // Exit 0 so missing key does not fail the build
}

const sitemapUrl = `${siteUrl}/sitemap-index.xml`;

// required = must succeed for exit 0; optional = logged but non-fatal
const endpoints = [
  { url: `https://yandex.com/indexnow?url=${encodeURIComponent(sitemapUrl)}&key=${key}`, required: true },
  { url: `https://api.indexnow.org/indexnow?url=${encodeURIComponent(sitemapUrl)}&key=${key}`, required: false },
  { url: `https://www.bing.com/indexnow?url=${encodeURIComponent(sitemapUrl)}&key=${key}`, required: false },
];

function ping({ url, required }) {
  return new Promise((resolve) => {
    https.get(url, (res) => {
      let body = '';
      res.on('data', (chunk) => { body += chunk; });
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          console.log(`[IndexNow] ✓ Success (${res.statusCode}): ${url}`);
          resolve(true);
        } else {
          const label = required ? '✗' : '⚠';
          console[required ? 'error' : 'warn'](`[IndexNow] ${label} ${required ? 'Failed' : 'Warning'} (${res.statusCode}): ${url}`);
          if (body) console[required ? 'error' : 'warn'](`[IndexNow]   Response: ${body.slice(0, 200)}`);
          resolve(!required); // non-fatal endpoints resolve true so they don't block exit 0
        }
      });
    }).on('error', (err) => {
      console[required ? 'error' : 'warn'](`[IndexNow] ${required ? '✗' : '⚠'} Network error: ${url}`);
      console[required ? 'error' : 'warn'](`[IndexNow]   ${err.message}`);
      resolve(!required);
    });
  });
}

async function main() {
  console.log(`[IndexNow] Pinging with sitemap: ${sitemapUrl}`);
  const results = await Promise.all(endpoints.map(ping));
  const allOk = results.every(Boolean);
  if (!allOk) {
    console.error('[IndexNow] Required ping failed.');
    process.exit(1);
  }
  console.log('[IndexNow] Done.');
}

main();
