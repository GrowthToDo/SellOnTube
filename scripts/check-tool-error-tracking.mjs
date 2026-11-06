#!/usr/bin/env node
/**
 * check-tool-error-tracking.mjs
 *
 * Proves the tool-error helper (src/utils/track.ts) fires the right GA4 event with the right
 * params in a real browser, against the BUILT site (dist/).
 *
 * How: serves dist/ locally, stubs window.gtag before any page script runs, mocks the tool API
 * with a given HTTP status (or a network abort), clicks the real button, and asserts the recorded
 * event name and params. Also scans src/pages/tools for leftover inline error gtag calls.
 *
 * Fails loudly: exit code 1 on any failed case, on zero recorded events, and on a page that
 * never reached the API (a silent pass would read as "verified").
 *
 * Usage: npm run build && node scripts/check-tool-error-tracking.mjs [distDir]
 * Mutation test: point it at a copy of dist/ with one call deliberately broken; it must exit 1.
 */
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import puppeteer from 'puppeteer';

const DIST = path.resolve(process.argv[2] || 'dist');
const URL_OK = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';

// ---- static scan: no inline error gtag left in tool pages ----
const toolsDir = path.resolve('src/pages/tools');
const INLINE = /window\.gtag\(\s*'event'\s*,\s*'(tool_generate_error|tool_analyse_error|tool_cluster_fallback|tool_evaluate_error)'/;
const leftovers = fs
  .readdirSync(toolsDir)
  .filter((f) => f.endsWith('.astro'))
  .filter((f) => INLINE.test(fs.readFileSync(path.join(toolsDir, f), 'utf8')));
let failures = 0;
const fail = (msg) => {
  failures++;
  console.error('FAIL ' + msg);
};
if (leftovers.length) fail('inline error gtag still present in: ' + leftovers.join(', '));
else console.log('ok   static scan: no inline error gtag in src/pages/tools');

// ---- scenarios ----
const PAGES = [
  {
    page: '/tools/youtube-channel-audit/', tool: 'youtube-channel-audit', event: 'tool_generate_error',
    api: '/api/channel-audit', inputs: { '#channel-input': '@testchannel' }, button: '#audit-btn',
    cases: [
      { mock: { status: 429, body: {} }, reason: 'quota_exceeded', http: 429, cls: 'quota' },
      { mock: { status: 500, body: {} }, reason: 'api_error_500', http: 500, cls: 'upstream' },
      { mock: { status: 404, body: { error: 'nf' } }, reason: 'channel_not_found', http: 404, cls: 'validation' },
      { mock: { abort: true }, reason: 'network_error', http: undefined, cls: 'network' },
      { mock: { status: 200, body: {} }, reason: 'invalid_response', http: undefined, cls: 'unknown' },
    ],
  },
  {
    page: '/tools/youtube-seo-tool/', tool: 'youtube-seo-tool', event: 'tool_analyse_error',
    api: '/api/youtube-seo-tool', inputs: { '#video-url-input': URL_OK }, button: '#analyse-btn',
    cases: [
      { mock: { status: 429, body: {} }, reason: 'quota_exceeded', http: 429, cls: 'quota' },
      { mock: { status: 503, body: {} }, reason: 'api_error_503', http: 503, cls: 'upstream' },
    ],
  },
  {
    page: '/tools/youtube-description-extractor/', tool: 'youtube-description-extractor', event: 'tool_generate_error',
    api: '/api/extract-video-metadata', inputs: { '#video-url-input': URL_OK }, button: '#extract-btn',
    cases: [
      { mock: { status: 503, body: {} }, reason: 'upstream_unavailable', http: 503, cls: 'upstream' },
      { mock: { status: 500, body: {} }, reason: 'api_error_500', http: 500, cls: 'upstream' },
      { mock: { abort: true }, reason: 'network_error', http: undefined, cls: 'network' },
    ],
  },
  {
    page: '/tools/youtube-timestamp-generator/', tool: 'youtube-timestamp-generator', event: 'tool_generate_error',
    api: '/api/generate-chapters', inputs: { '#video-url-input': URL_OK }, button: '#generate-btn',
    cases: [
      { mock: { status: 422, body: { code: 'bad_input' } }, reason: 'bad_input', http: 422, cls: 'validation' },
      { mock: { status: 500, body: {} }, reason: 'api_error_500', http: 500, cls: 'upstream' },
    ],
  },
  {
    page: '/tools/youtube-tag-generator/', tool: 'youtube-tag-generator', event: 'tool_generate_error',
    api: '/api/generate-tags', inputs: { '#video-url-input': URL_OK }, button: '#generate-btn',
    cases: [{ mock: { status: 429, body: {} }, reason: 'quota_exceeded', http: 429, cls: 'quota' }],
  },
];

// ---- static server for dist ----
const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.json': 'application/json' };
const server = http.createServer((req, res) => {
  let p = decodeURIComponent(req.url.split('?')[0]);
  let f = path.join(DIST, p);
  if (!f.startsWith(DIST)) { res.writeHead(403).end(); return; }
  if (fs.existsSync(f) && fs.statSync(f).isDirectory()) f = path.join(f, 'index.html');
  if (!fs.existsSync(f)) { res.writeHead(404).end('nf'); return; }
  res.writeHead(200, { 'Content-Type': MIME[path.extname(f)] || 'application/octet-stream' });
  fs.createReadStream(f).pipe(res);
});
await new Promise((r) => server.listen(0, '127.0.0.1', r));
const base = 'http://127.0.0.1:' + server.address().port;

const browser = await puppeteer.launch({ headless: true });
try {
  for (const pg of PAGES) {
    for (const c of pg.cases) {
      const label = `${pg.tool} :: ${c.reason}`;
      const tab = await browser.newPage();
      await tab.evaluateOnNewDocument(() => {
        window.__events = [];
        const rec = function () {
          if (arguments[0] === 'event') window.__events.push({ name: arguments[1], params: arguments[2] || {} });
        };
        Object.defineProperty(window, 'gtag', { get: () => rec, set: () => {}, configurable: true });
        // free-use counter / gate state must not block the click
        try { localStorage.clear(); } catch (e) {}
      });
      await tab.setRequestInterception(true);
      let apiHit = false;
      tab.on('request', (rq) => {
        const u = rq.url();
        if (!u.startsWith(base)) return rq.abort();
        if (u.includes(pg.api)) {
          apiHit = true;
          if (c.mock.abort) return rq.abort('failed');
          return rq.respond({ status: c.mock.status, contentType: 'application/json', body: JSON.stringify(c.mock.body) });
        }
        rq.continue();
      });
      await tab.goto(base + pg.page, { waitUntil: 'load' });
      for (const [sel, val] of Object.entries(pg.inputs)) await tab.type(sel, val);
      await tab.click(pg.button);
      await tab.waitForFunction(() => window.__events.some((e) => /_error$|_fallback$/.test(e.name)), { timeout: 6000 }).catch(() => {});
      const events = await tab.evaluate(() => window.__events);
      const ev = events.find((e) => /_error$|_fallback$/.test(e.name));
      if (!apiHit) fail(`${label}: page never called ${pg.api} (selector or validation problem)`);
      else if (!ev) fail(`${label}: no error event recorded (events: ${events.map((e) => e.name).join(',') || 'none'})`);
      else {
        const p = ev.params;
        const bad = [];
        if (ev.name !== pg.event) bad.push(`event ${ev.name} != ${pg.event}`);
        if (p.tool !== pg.tool) bad.push(`tool ${p.tool}`);
        if (p.reason !== c.reason) bad.push(`reason ${p.reason} != ${c.reason}`);
        if (p.http_status !== c.http) bad.push(`http_status ${p.http_status} != ${c.http}`);
        if (p.error_class !== c.cls) bad.push(`error_class ${p.error_class} != ${c.cls}`);
        if (bad.length) fail(`${label}: ${bad.join('; ')}`);
        else console.log(`ok   ${label} -> ${ev.name} http=${p.http_status ?? '-'} class=${p.error_class}`);
      }
      await tab.close();
    }
  }

  // gate: invalid email fires tool_email_gate_invalid, Gmail does not (channel audit)
  const tab = await browser.newPage();
  await tab.evaluateOnNewDocument(() => {
    window.__events = [];
    const rec = function () { if (arguments[0] === 'event') window.__events.push({ name: arguments[1], params: arguments[2] || {} }); };
    Object.defineProperty(window, 'gtag', { get: () => rec, set: () => {}, configurable: true });
    localStorage.setItem('sot_audit_count', '3');
  });
  await tab.setRequestInterception(true);
  tab.on('request', (rq) => {
    const u = rq.url();
    if (!u.startsWith(base)) return rq.abort();
    if (u.includes('capture-email')) return rq.respond({ status: 200, contentType: 'application/json', body: '{}' });
    rq.continue();
  });
  await tab.goto(base + '/tools/youtube-channel-audit/', { waitUntil: 'load' });
  await tab.type('#channel-input', '@testchannel');
  await tab.click('#audit-btn');
  await tab.waitForSelector('#gate-email', { visible: true, timeout: 6000 }).catch(() => {});
  await tab.type('#gate-email', 'not-an-email');
  await tab.click('#gate-submit-btn');
  let evs = await tab.evaluate(() => window.__events);
  const inv = evs.find((e) => e.name === 'tool_email_gate_invalid');
  if (!inv || inv.params.reason !== 'invalid_format' || JSON.stringify(inv).includes('not-an-email')) fail('gate invalid-email event missing, wrong, or leaks the address');
  else console.log('ok   channel-audit gate: invalid email -> tool_email_gate_invalid (no address in payload)');
  await tab.click('#gate-email', { clickCount: 3 });
  await tab.type('#gate-email', 'someone@gmail.com');
  await tab.click('#gate-submit-btn');
  await new Promise((r) => setTimeout(r, 800));
  evs = await tab.evaluate(() => window.__events);
  const sub = evs.find((e) => e.name === 'tool_email_submitted');
  const errText = await tab.$eval('#gate-email-error', (el) => (el.classList.contains('hidden') ? '' : el.textContent)).catch(() => 'missing');
  if (!sub || errText) fail(`gmail address not accepted (submitted event: ${!!sub}, error text: "${errText}")`);
  else console.log('ok   channel-audit gate: gmail.com accepted, tool_email_submitted fired');
  await tab.close();
} finally {
  await browser.close();
  server.close();
}

if (failures) {
  console.error(`\n${failures} check(s) FAILED`);
  process.exit(1);
}
console.log('\nAll tool error tracking checks passed.');
