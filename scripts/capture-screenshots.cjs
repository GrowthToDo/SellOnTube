/**
 * Capture above-the-fold screenshots of tool websites.
 * Usage: node scripts/capture-screenshots.js
 */
const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

const OUTPUT_DIR = path.join(
  __dirname,
  '../src/assets/images/blog/tools/screenshots/autocomplete tools'
);

const TOOLS = [
  { name: 'autocomplete-sellontube', url: 'https://sellontube.com/tools/youtube-autocomplete-keywords' },
  { name: 'autocomplete-keywordtool-io', url: 'https://keywordtool.io/youtube' },
  { name: 'autocomplete-pemavor', url: 'https://www.pemavor.com/solution/autocomplete-keyword-tool/' },
  { name: 'autocomplete-keyword-tool-dominator', url: 'https://www.keywordtooldominator.com/youtube-keyword-tool' },
  { name: 'autocomplete-keyword-io', url: 'https://www.keyword.io/tool/youtube-longtail-finder' },
  { name: 'autocomplete-ryrob', url: 'https://www.ryrob.com/youtube-keyword-tool/' },
  { name: 'autocomplete-youautocompleteme', url: 'https://youautocompleteme.io/youtube/' },
  { name: 'autocomplete-ahrefs', url: 'https://ahrefs.com/youtube-keyword-tool' },
  { name: 'autocomplete-semanticpen', url: 'https://www.semanticpen.com/tools/youtube-autocomplete-suggestion' },
  { name: 'autocomplete-botster', url: 'https://botster.io/bots/youtube-keyword-suggestions-scraper' },
  { name: 'autocomplete-apify', url: 'https://apify.com/powerai/youtube-keyword-suggestions-scraper' },
];

async function captureScreenshot(browser, tool) {
  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 675 });

  try {
    console.log(`Capturing: ${tool.name} (${tool.url})`);
    await page.goto(tool.url, { waitUntil: 'networkidle2', timeout: 30000 });
    // Wait a bit for any lazy-loaded hero content
    await new Promise(r => setTimeout(r, 2000));

    const filePath = path.join(OUTPUT_DIR, `${tool.name}.png`);
    await page.screenshot({ path: filePath, type: 'png' });
    console.log(`  Saved: ${filePath}`);
  } catch (err) {
    console.error(`  FAILED: ${tool.name} - ${err.message}`);
  } finally {
    await page.close();
  }
}

(async () => {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  for (const tool of TOOLS) {
    await captureScreenshot(browser, tool);
  }

  await browser.close();
  console.log('\nDone. All screenshots saved to:', OUTPUT_DIR);
})();
