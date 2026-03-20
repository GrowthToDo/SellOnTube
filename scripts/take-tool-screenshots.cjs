#!/usr/bin/env node
/**
 * Enhanced screenshot script for tool review posts.
 * Produces consistent, nav-cropped, focused screenshots of each tool's actual UI.
 *
 * Usage:
 *   node scripts/take-tool-screenshots.cjs [toolName]
 *   node scripts/take-tool-screenshots.cjs          # runs all tools
 *   node scripts/take-tool-screenshots.cjs sellontube  # runs one tool
 *
 * Output: src/assets/images/blog/tools/screenshots/<toolName>.png
 * Dimensions: 1200 × 675 (16:9)
 */

const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

const OUT_DIR = path.join(__dirname, '..', 'src', 'assets', 'images', 'blog', 'tools', 'screenshots');
const VIEWPORT_W = 1280;
const CLIP_W = 1200;
const CLIP_H = 675;

/**
 * Per-tool configuration.
 * - url:        page to load
 * - scrollTo:   CSS selector to scroll into view (tool form/UI), or null
 * - scrollPx:   fallback scroll amount in px if selector not found
 * - clipY:      Y offset to start clip from (to skip nav bar)
 * - waitFor:    CSS selector to wait for before screenshotting
 * - fillInputs: array of { selector, value } to fill with demo data
 * - hideSelectors: CSS selectors to hide (cookie banners, chat widgets, etc.)
 * - extraDelay: ms to wait after setup before capturing
 */
const TOOLS = {
  sellontube: {
    url: 'https://sellontube.com/tools/youtube-video-ideas-generator',
    scrollTo: 'form, [data-tool], main section',
    scrollPx: 80,
    clipY: 72,
    waitFor: null,
    fillInputs: [
      { selector: 'textarea[name*="product"], textarea[placeholder*="product"], textarea[placeholder*="service"], textarea:nth-of-type(1), input[placeholder*="product"]', value: 'B2B SaaS project management software for operations teams' },
      { selector: 'textarea[name*="url"], input[name*="url"], input[placeholder*="link"], input[placeholder*="url"], textarea:nth-of-type(2)', value: 'https://example.com' },
      { selector: 'textarea[placeholder*="customer"], textarea[placeholder*="audience"], textarea:nth-of-type(3)', value: 'Operations managers at mid-sized B2B SaaS companies' },
    ],
    hideSelectors: ['[class*="cookie"]', '[id*="cookie"]', '[class*="chat"]', '[id*="chat"]'],
    extraDelay: 1000,
  },
  vidiq: {
    url: 'https://vidiq.com/ai-video-ideas-generator/',
    scrollTo: null,
    scrollPx: 0,
    clipY: 68,
    waitFor: null,
    fillInputs: [],
    hideSelectors: ['[class*="cookie"]', '[id*="cookie"]', '[class*="CookieBanner"]', '[class*="consent"]', '[class*="gdpr"]', '#onetrust-banner-sdk', '.ot-sdk-container'],
    extraDelay: 1500,
  },
  '1of10': {
    url: 'https://1of10.com/idea-generator/',
    scrollTo: '[class*="generator"], form, [class*="idea"], .hero, main',
    scrollPx: 0,
    clipY: 64,
    waitFor: null,
    fillInputs: [],
    hideSelectors: ['[class*="cookie"]', '[id*="cookie"]', '[class*="popup"]', '[class*="modal"]'],
    extraDelay: 1500,
  },
  tubemagic: {
    url: 'https://tubemagic.com/features/video-ideas',
    scrollTo: null,
    scrollPx: 0,
    clipY: 64,
    waitFor: null,
    fillInputs: [],
    hideSelectors: ['[class*="cookie"]', '[id*="cookie"]', '[class*="banner"]', '[class*="chat"]'],
    extraDelay: 1500,
  },
  embarque: {
    url: 'https://www.embarque.io/ai-tools/free-ai-youtube-video-idea-generator',
    scrollTo: 'form, [class*="tool"], [class*="generator"], [class*="input"]',
    scrollPx: 480,
    clipY: 0,
    waitFor: null,
    fillInputs: [],
    hideSelectors: ['nav', 'header', '[class*="cookie"]', '[id*="cookie"]', '[class*="chat"]'],
    extraDelay: 1500,
  },
  ryrob: {
    url: 'https://www.ryrob.com/youtube-video-idea-generator/',
    scrollTo: 'form, [class*="generator"], [class*="tool"]',
    scrollPx: 300,
    clipY: 0,
    waitFor: null,
    fillInputs: [],
    hideSelectors: ['[class*="cookie"]', '[id*="cookie"]', '[class*="popup"]', '[class*="banner"]', '[class*="chat"]'],
    extraDelay: 1500,
  },
  utubekit: {
    url: 'https://utubekit.com/tools/video-ideas-generator',
    scrollTo: 'form, [class*="generator"], [class*="tool"], main',
    scrollPx: 0,
    clipY: 64,
    waitFor: null,
    fillInputs: [],
    hideSelectors: ['[class*="cookie"]', '[id*="cookie"]', '[class*="chat"]'],
    extraDelay: 1500,
  },
  speaknotes: {
    url: 'https://speaknotes.io/free-tools/youtube-ideas-generator',
    scrollTo: 'form, [class*="generator"], [class*="tool"], main',
    scrollPx: 0,
    clipY: 64,
    waitFor: null,
    fillInputs: [],
    hideSelectors: ['[class*="cookie"]', '[id*="cookie"]', '[class*="popup"]'],
    extraDelay: 1500,
  },
  toolsaday: {
    url: 'https://toolsaday.com/writing/youtube-video-ideas-generator',
    scrollTo: 'form, [class*="generator"], [class*="tool"], textarea',
    scrollPx: 0,
    clipY: 64,
    waitFor: null,
    fillInputs: [],
    hideSelectors: ['[class*="cookie"]', '[id*="cookie"]', '[class*="popup"]', '[class*="chat"]'],
    extraDelay: 1500,
  },
  lenostube: {
    url: 'https://www.lenostube.com/en/youtube-video-idea-generator/',
    scrollTo: 'form, [class*="generator"], [class*="tool"], input[type="text"], textarea',
    scrollPx: 0,
    clipY: 64,
    waitFor: null,
    fillInputs: [],
    hideSelectors: ['[class*="cookie"]', '[id*="cookie"]', '[class*="popup"]', '[class*="chat"]'],
    extraDelay: 1500,
  },
  renderforest: {
    url: 'https://www.renderforest.com/youtube-video-ideas',
    scrollTo: 'form, [class*="generator"], [class*="tool"], textarea, input[placeholder]',
    scrollPx: 0,
    clipY: 64,
    waitFor: null,
    fillInputs: [],
    hideSelectors: ['[class*="cookie"]', '[id*="cookie"]', '[class*="chat"]', '[class*="intercom"]'],
    extraDelay: 2000,
  },
  veed: {
    url: 'https://www.veed.io/tools/script-generator/video-idea-generator',
    scrollTo: 'form, [class*="generator"], [class*="tool"], textarea',
    scrollPx: 0,
    clipY: 64,
    waitFor: null,
    fillInputs: [],
    hideSelectors: ['[class*="cookie"]', '[id*="cookie"]', '[class*="chat"]', '[class*="intercom"]', '[class*="beacon"]'],
    extraDelay: 2000,
  },
  tubebuddy: {
    url: 'https://www.tubebuddy.com/tools/video-topic-planner',
    scrollTo: 'form, [class*="planner"], [class*="tool"], [class*="topic"]',
    scrollPx: 0,
    clipY: 64,
    waitFor: null,
    fillInputs: [],
    hideSelectors: ['[class*="cookie"]', '[id*="cookie"]', '[class*="chat"]', '[class*="popup"]'],
    extraDelay: 1500,
  },
  instapage: {
    url: 'https://instapage.com/en/ai-tools/ai-youtube-video-ideas-generator',
    scrollTo: 'form, [class*="generator"], [class*="tool"], textarea',
    scrollPx: 0,
    clipY: 64,
    waitFor: null,
    fillInputs: [],
    hideSelectors: ['[class*="cookie"]', '[id*="cookie"]', '[class*="chat"]', '[class*="intercom"]'],
    extraDelay: 1500,
  },
};

async function dismissOverlays(page) {
  await page.evaluate(() => {
    // Click accept/dismiss buttons on cookie banners
    const patterns = /accept|agree|ok|got it|close|dismiss|allow|continue|reject all|decline/i;
    document.querySelectorAll('button, [role="button"], a').forEach(el => {
      if (patterns.test(el.textContent) && el.offsetParent !== null) {
        el.click();
      }
    });
  });
  await new Promise(r => setTimeout(r, 600));
}

async function hideElements(page, selectors) {
  if (!selectors || selectors.length === 0) return;
  await page.evaluate((sels) => {
    sels.forEach(sel => {
      document.querySelectorAll(sel).forEach(el => {
        el.style.setProperty('display', 'none', 'important');
        el.style.setProperty('visibility', 'hidden', 'important');
        el.style.setProperty('opacity', '0', 'important');
        el.style.setProperty('pointer-events', 'none', 'important');
      });
    });
  }, selectors);
}

async function fillInputs(page, inputs) {
  for (const { selector, value } of inputs) {
    try {
      const selectors = selector.split(', ');
      let filled = false;
      for (const sel of selectors) {
        try {
          const el = await page.$(sel.trim());
          if (el) {
            await el.click({ clickCount: 3 });
            await el.type(value, { delay: 20 });
            filled = true;
            break;
          }
        } catch (e) { /* try next selector */ }
      }
      if (filled) await new Promise(r => setTimeout(r, 200));
    } catch (e) { /* skip failed input fills */ }
  }
}

async function scrollToTool(page, config) {
  // Try scrollTo selector first
  if (config.scrollTo) {
    try {
      const selectors = config.scrollTo.split(', ');
      for (const sel of selectors) {
        try {
          const el = await page.$(sel.trim());
          if (el) {
            await page.evaluate((elem) => {
              elem.scrollIntoView({ behavior: 'instant', block: 'start' });
            }, el);
            // Scroll up a bit so the element isn't at top edge
            await page.evaluate(() => window.scrollBy(0, -80));
            return;
          }
        } catch (e) { /* try next */ }
      }
    } catch (e) { /* fall through to scrollPx */ }
  }
  // Fallback to pixel scroll
  if (config.scrollPx > 0) {
    await page.evaluate((px) => window.scrollTo(0, px), config.scrollPx);
  }
}

async function takeToolScreenshot(toolName, config) {
  const outPath = path.join(OUT_DIR, `${toolName}.png`);
  console.log(`\n📸 ${toolName}`);
  console.log(`   URL: ${config.url}`);

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-web-security'],
    defaultViewport: { width: VIEWPORT_W, height: 900 },
  });

  try {
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36');

    // Inject CSS to prevent layout shift from scrollbars
    await page.evaluateOnNewDocument(() => {
      document.documentElement.style.overflowX = 'hidden';
    });

    await page.goto(config.url, { waitUntil: 'domcontentloaded', timeout: 45000 });

    // Fixed delay instead of waitForNetworkIdle (avoids hanging on open SSE/WS connections)
    await new Promise(r => setTimeout(r, 2500));

    // Dismiss overlays
    await dismissOverlays(page);

    // Wait for specific element if configured
    if (config.waitFor) {
      try { await page.waitForSelector(config.waitFor, { timeout: 5000 }); } catch (e) {}
    }

    // Hide distracting elements
    await hideElements(page, config.hideSelectors);

    // Scroll to the tool
    await scrollToTool(page, config);

    // Fill in demo data
    await fillInputs(page, config.fillInputs);

    // Extra wait for animations/lazy loads
    await new Promise(r => setTimeout(r, config.extraDelay || 1000));

    // Get scroll position for clip
    const scrollY = await page.evaluate(() => window.scrollY);
    const clipX = Math.round((VIEWPORT_W - CLIP_W) / 2);
    const clipY = scrollY + (config.clipY || 0);

    await page.screenshot({
      path: outPath,
      type: 'png',
      clip: {
        x: clipX,
        y: clipY,
        width: CLIP_W,
        height: CLIP_H,
      },
    });

    console.log(`   ✅ Saved: ${outPath} (${CLIP_W}×${CLIP_H})`);
  } finally {
    await browser.close();
  }
}

async function main() {
  const target = process.argv[2];
  const tools = target ? { [target]: TOOLS[target] } : TOOLS;

  if (target && !TOOLS[target]) {
    console.error(`Unknown tool: "${target}". Available: ${Object.keys(TOOLS).join(', ')}`);
    process.exit(1);
  }

  if (!fs.existsSync(OUT_DIR)) {
    fs.mkdirSync(OUT_DIR, { recursive: true });
  }

  console.log(`Taking screenshots for: ${Object.keys(tools).join(', ')}`);

  for (const [name, config] of Object.entries(tools)) {
    try {
      await takeToolScreenshot(name, config);
    } catch (e) {
      console.error(`   ❌ FAILED (${name}): ${e.message}`);
    }
  }

  console.log('\nDone.');
}

main().catch(e => { console.error(e); process.exit(1); });
