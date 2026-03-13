#!/usr/bin/env node
/**
 * Reusable script: Fetch a tool's logo/favicon from its website.
 * Usage: node scripts/fetch-logo.js <domain> <output-filename>
 * Example: node scripts/fetch-logo.js vidiq.com vidiq
 *
 * Tries in order:
 *   1. /favicon.ico
 *   2. Parse HTML for <link rel="icon"> or <link rel="shortcut icon">
 *   3. Google's favicon service as fallback
 *
 * Saves to: src/assets/images/blog/tools/logos/<output-filename>.png
 */

const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');
const { URL } = require('url');

const domain = process.argv[2];
const outputName = process.argv[3];

if (!domain || !outputName) {
  console.error('Usage: node scripts/fetch-logo.js <domain> <output-filename>');
  process.exit(1);
}

const outDir = path.join(__dirname, '..', 'src', 'assets', 'images', 'blog', 'tools', 'logos');
const outPath = path.join(outDir, `${outputName}.png`);

function fetch(url, maxRedirects = 5) {
  return new Promise((resolve, reject) => {
    if (maxRedirects <= 0) return reject(new Error('Too many redirects'));
    const mod = url.startsWith('https') ? https : http;
    mod.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120' }, timeout: 10000 }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        let loc = res.headers.location;
        if (loc.startsWith('/')) loc = new URL(loc, url).href;
        return resolve(fetch(loc, maxRedirects - 1));
      }
      const chunks = [];
      res.on('data', c => chunks.push(c));
      res.on('end', () => resolve({ status: res.statusCode, headers: res.headers, body: Buffer.concat(chunks) }));
    }).on('error', reject);
  });
}

function extractFaviconUrl(html, baseUrl) {
  const patterns = [
    /< *link[^>]*rel=["'](?:shortcut )?icon["'][^>]*href=["']([^"']+)["']/i,
    /< *link[^>]*href=["']([^"']+)["'][^>]*rel=["'](?:shortcut )?icon["']/i,
    /< *link[^>]*rel=["']apple-touch-icon["'][^>]*href=["']([^"']+)["']/i,
  ];
  for (const pat of patterns) {
    const m = html.match(pat);
    if (m) {
      let href = m[1];
      if (href.startsWith('//')) href = 'https:' + href;
      else if (href.startsWith('/')) href = new URL(href, baseUrl).href;
      else if (!href.startsWith('http')) href = new URL(href, baseUrl).href;
      return href;
    }
  }
  return null;
}

async function run() {
  const baseUrl = `https://${domain}`;

  // Try 1: Parse HTML for favicon link
  try {
    const res = await fetch(baseUrl);
    if (res.status === 200) {
      const html = res.body.toString('utf-8');
      const favUrl = extractFaviconUrl(html, baseUrl);
      if (favUrl) {
        console.log(`Found favicon link: ${favUrl}`);
        const favRes = await fetch(favUrl);
        if (favRes.status === 200 && favRes.body.length > 100) {
          fs.writeFileSync(outPath, favRes.body);
          console.log(`Saved logo to ${outPath} (${favRes.body.length} bytes)`);
          return;
        }
      }
    }
  } catch (e) {
    console.log(`HTML parse attempt failed: ${e.message}`);
  }

  // Try 2: Direct /favicon.ico
  try {
    const res = await fetch(`${baseUrl}/favicon.ico`);
    if (res.status === 200 && res.body.length > 100) {
      fs.writeFileSync(outPath, res.body);
      console.log(`Saved favicon.ico to ${outPath} (${res.body.length} bytes)`);
      return;
    }
  } catch (e) {
    console.log(`favicon.ico attempt failed: ${e.message}`);
  }

  // Try 3: Google favicon service
  try {
    const googleUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
    const res = await fetch(googleUrl);
    if (res.status === 200 && res.body.length > 100) {
      fs.writeFileSync(outPath, res.body);
      console.log(`Saved Google favicon to ${outPath} (${res.body.length} bytes)`);
      return;
    }
  } catch (e) {
    console.log(`Google favicon attempt failed: ${e.message}`);
  }

  console.error(`FAILED: Could not fetch logo for ${domain}`);
  process.exit(1);
}

run().catch(e => { console.error(e.message); process.exit(1); });
