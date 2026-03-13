#!/usr/bin/env node
/**
 * Reusable script: Take a screenshot of a URL using Puppeteer.
 * Usage: node scripts/take-screenshot.js <url> <output-filename>
 * Example: node scripts/take-screenshot.js "https://vidiq.com/ai-video-ideas-generator/" vidiq
 *
 * Saves to: src/assets/images/blog/tools/screenshots/<output-filename>.png
 */

const puppeteer = require('puppeteer');
const path = require('path');

const url = process.argv[2];
const outputName = process.argv[3];

if (!url || !outputName) {
  console.error('Usage: node scripts/take-screenshot.js <url> <output-filename>');
  process.exit(1);
}

const outDir = path.join(__dirname, '..', 'src', 'assets', 'images', 'blog', 'tools', 'screenshots');
const outPath = path.join(outDir, `${outputName}.png`);

async function run() {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
    defaultViewport: { width: 1280, height: 800 },
  });

  try {
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

    console.log(`Navigating to ${url}...`);
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });

    // Dismiss common cookie/popup overlays
    try {
      await page.evaluate(() => {
        const selectors = [
          '[class*="cookie"]', '[id*="cookie"]',
          '[class*="consent"]', '[id*="consent"]',
          '[class*="popup"]', '[class*="modal"]',
          '[class*="overlay"]',
        ];
        selectors.forEach(sel => {
          document.querySelectorAll(sel).forEach(el => {
            const btn = el.querySelector('button, [role="button"], a');
            if (btn && /accept|agree|ok|got it|close|dismiss/i.test(btn.textContent)) {
              btn.click();
            }
          });
        });
      });
      await new Promise(r => setTimeout(r, 1000));
    } catch (e) { /* ignore overlay dismissal errors */ }

    await page.screenshot({ path: outPath, type: 'png' });
    console.log(`Screenshot saved to ${outPath}`);
  } finally {
    await browser.close();
  }
}

run().catch(e => { console.error(`FAILED: ${e.message}`); process.exit(1); });
