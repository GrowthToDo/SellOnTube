// scripts/indexnow-ping.js
// Pings IndexNow API after deploy to trigger fast indexing by Bing/search engines.
// Run: node scripts/indexnow-ping.js
// Env: INDEXNOW_KEY (required), SITE_URL (default: https://sellontube.com)

const https = require('https');

const key = process.env.INDEXNOW_KEY;
const siteUrl = process.env.SITE_URL || 'https://sellontube.com';

if (!key) {
  console.error('[IndexNow] ERROR: INDEXNOW_KEY environment variable is not set.');
  console.error('[IndexNow] Set it in Netlify dashboard > Site settings > Environment variables.');
  process.exit(0); // Exit 0 so missing key does not fail the build
}

const sitemapUrl = `${siteUrl}/sitemap-index.xml`;

const endpoints = [
  `https://api.indexnow.org/indexnow?url=${encodeURIComponent(sitemapUrl)}&key=${key}`,
  `https://www.bing.com/indexnow?url=${encodeURIComponent(sitemapUrl)}&key=${key}`,
];

function ping(url) {
  return new Promise((resolve) => {
    https.get(url, (res) => {
      let body = '';
      res.on('data', (chunk) => { body += chunk; });
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          console.log(`[IndexNow] ✓ Success (${res.statusCode}): ${url}`);
          resolve(true);
        } else {
          console.error(`[IndexNow] ✗ Failed (${res.statusCode}): ${url}`);
          if (body) console.error(`[IndexNow]   Response: ${body.slice(0, 200)}`);
          resolve(false);
        }
      });
    }).on('error', (err) => {
      console.error(`[IndexNow] ✗ Network error: ${url}`);
      console.error(`[IndexNow]   ${err.message}`);
      resolve(false);
    });
  });
}

async function main() {
  console.log(`[IndexNow] Pinging with sitemap: ${sitemapUrl}`);
  const results = await Promise.all(endpoints.map(ping));
  const allOk = results.every(Boolean);
  if (!allOk) {
    console.error('[IndexNow] One or more pings failed.');
    process.exit(1);
  }
  console.log('[IndexNow] All pings successful.');
}

main();
