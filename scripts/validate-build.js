#!/usr/bin/env node
/**
 * validate-build.js — Post-build safety net for SellonTube
 *
 * Checks:
 *   1. Internal link integrity (every href="/..." resolves to a file in dist/)
 *   2. Sitemap integrity (every <loc> in sitemap XML resolves to a file in dist/)
 *   3. Draft/future leak detection (draft or future posts must NOT have HTML in dist/)
 *
 * Exit 0 = clean, Exit 1 = violations found.
 * Uses only Node.js built-in modules.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

const DIST_DIR = path.resolve(__dirname, '..', 'dist');
const POST_DIR = path.resolve(__dirname, '..', 'src', 'data', 'post');
const NETLIFY_TOML = path.resolve(__dirname, '..', 'netlify.toml');

// Asset extensions to ignore when checking internal links
const ASSET_EXTS = new Set([
  '.js', '.css', '.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp', '.ico',
  '.xml', '.json', '.txt', '.woff', '.woff2', '.ttf', '.eot', '.map',
  '.pdf', '.mp4', '.webm', '.avif', '.mjs',
]);

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Recursively collect all files under a directory. Returns forward-slash paths. */
function walkDir(dir, fileList = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walkDir(full, fileList);
    } else {
      // Normalize to forward slashes for cross-platform comparison
      fileList.push(full.split(path.sep).join('/'));
    }
  }
  return fileList;
}

/** Check whether a given URL path resolves to a file in dist/. */
function distFileExists(urlPath, distRoot) {
  // Remove leading slash
  const rel = urlPath.replace(/^\//, '');
  const base = path.join(distRoot, rel);

  // Exact file (e.g. /robots.txt -> dist/robots.txt)
  if (fs.existsSync(base) && fs.statSync(base).isFile()) return true;
  // Directory with index.html (e.g. /blog/foo -> dist/blog/foo/index.html)
  const indexPath = path.join(base, 'index.html');
  if (fs.existsSync(indexPath)) return true;
  // With .html extension (e.g. /blog/foo -> dist/blog/foo.html)
  const htmlPath = base + '.html';
  if (fs.existsSync(htmlPath)) return true;

  return false;
}

/** Parse YAML-ish frontmatter from a markdown file. Returns key-value pairs. */
function parseFrontmatter(content) {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return {};
  const fm = {};
  for (const line of match[1].split(/\r?\n/)) {
    const kv = line.match(/^(\w+):\s*(.+)$/);
    if (kv) {
      let val = kv[2].trim();
      // Strip surrounding quotes
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }
      fm[kv[1]] = val;
    }
  }
  return fm;
}

/**
 * Parse netlify.toml redirect "from" paths into a set of exact paths and
 * an array of wildcard/splat patterns. A link matching any redirect is
 * considered valid (Netlify handles it at the edge).
 */
function parseNetlifyRedirects(tomlPath) {
  const exactFroms = new Set();
  const wildcardFroms = []; // regex patterns

  if (!fs.existsSync(tomlPath)) return { exactFroms, wildcardFroms };

  const content = fs.readFileSync(tomlPath, 'utf-8');
  // Match `from = "..."` lines
  const fromRegex = /from\s*=\s*"([^"]+)"/g;
  let m;
  while ((m = fromRegex.exec(content)) !== null) {
    const from = m[1];
    if (from.includes('*') || from.includes(':')) {
      // Convert Netlify pattern to regex:
      //   * (splat) -> match anything
      //   :param   -> match a path segment
      const regexStr = '^' + from
        .replace(/[.*+?^${}()|[\]\\]/g, (ch) => {
          if (ch === '*') return '.*';
          return '\\' + ch;
        })
        .replace(/:(\w+)/g, '[^/]+') + '$';
      wildcardFroms.push(new RegExp(regexStr));
    } else {
      exactFroms.add(from.replace(/\/$/, ''));
    }
  }

  return { exactFroms, wildcardFroms };
}

/** Check if a path is covered by a Netlify redirect. */
function isCoveredByRedirect(href, exactFroms, wildcardFroms) {
  if (exactFroms.has(href)) return true;
  for (const re of wildcardFroms) {
    if (re.test(href)) return true;
  }
  return false;
}

// ---------------------------------------------------------------------------
// Check 1: Internal link integrity
// ---------------------------------------------------------------------------

function checkInternalLinks(distRoot, exactFroms, wildcardFroms) {
  const violations = [];
  const allHtmlFiles = walkDir(distRoot).filter(f => f.endsWith('.html'));
  const checkedLinks = new Map(); // href -> exists (cache)
  let totalLinks = 0;
  let redirectCovered = 0;

  for (const htmlFile of allHtmlFiles) {
    const content = fs.readFileSync(htmlFile, 'utf-8');
    // Match href="..." or href='...'
    const hrefRegex = /href=["']([^"']+)["']/g;
    let m;
    while ((m = hrefRegex.exec(content)) !== null) {
      let href = m[1];

      // Skip external, anchors, mailto, tel, javascript, data URIs
      if (!href.startsWith('/')) continue;
      if (href.startsWith('//')) continue; // protocol-relative

      // Strip anchor and query string
      href = href.split('#')[0].split('?')[0];
      if (!href || href === '/') continue;

      // Remove trailing slash for consistency
      href = href.replace(/\/$/, '');

      // Skip asset files
      const ext = path.extname(href).toLowerCase();
      if (ext && ASSET_EXTS.has(ext)) continue;

      totalLinks++;

      // Cache lookup
      if (checkedLinks.has(href)) {
        if (!checkedLinks.get(href)) {
          const distNorm = distRoot.split(path.sep).join('/');
          violations.push({ href, source: htmlFile.replace(distNorm, '') });
        }
        continue;
      }

      let exists = distFileExists(href, distRoot);
      // If no file in dist/, check if Netlify handles it via redirect
      if (!exists && isCoveredByRedirect(href, exactFroms, wildcardFroms)) {
        exists = true;
        redirectCovered++;
      }
      checkedLinks.set(href, exists);
      if (!exists) {
        const distNorm = distRoot.split(path.sep).join('/');
        violations.push({ href, source: htmlFile.replace(distNorm, '') });
      }
    }
  }

  return { totalFiles: allHtmlFiles.length, totalLinks, uniqueLinks: checkedLinks.size, redirectCovered, violations };
}

// ---------------------------------------------------------------------------
// Check 2: Sitemap integrity
// ---------------------------------------------------------------------------

function checkSitemap(distRoot) {
  const violations = [];
  const sitemapFiles = fs.readdirSync(distRoot).filter(f => /^sitemap.*\.xml$/.test(f));
  let totalUrls = 0;

  for (const sitemapFile of sitemapFiles) {
    const content = fs.readFileSync(path.join(distRoot, sitemapFile), 'utf-8');

    // Skip sitemap index files (they contain <loc> pointing to other sitemaps, not pages)
    if (content.includes('<sitemapindex')) continue;

    const locRegex = /<loc>([^<]+)<\/loc>/g;
    let m;
    while ((m = locRegex.exec(content)) !== null) {
      const url = m[1];
      totalUrls++;

      // Extract path from full URL
      let urlPath;
      try {
        urlPath = new URL(url).pathname;
      } catch {
        // If not a full URL, treat as path
        urlPath = url;
      }

      // Remove trailing slash
      urlPath = urlPath.replace(/\/$/, '');
      if (!urlPath) urlPath = '/'; // Homepage

      // Skip homepage (always exists as dist/index.html)
      if (urlPath === '/') continue;

      // Skip asset files
      const ext = path.extname(urlPath).toLowerCase();
      if (ext && ASSET_EXTS.has(ext)) continue;

      if (!distFileExists(urlPath, distRoot)) {
        violations.push({ url, urlPath, sitemap: sitemapFile });
      }
    }
  }

  return { sitemapFiles, totalUrls, violations };
}

// ---------------------------------------------------------------------------
// Check 3: Draft/future leak detection
// ---------------------------------------------------------------------------

function checkDraftLeaks(distRoot, postDir) {
  const violations = [];
  const now = new Date();
  let totalPosts = 0;
  let drafts = 0;
  let futurePosts = 0;

  if (!fs.existsSync(postDir)) {
    return { totalPosts: 0, drafts: 0, futurePosts: 0, violations };
  }

  const postFiles = fs.readdirSync(postDir).filter(f => /\.(md|mdx)$/.test(f));

  for (const file of postFiles) {
    totalPosts++;
    const content = fs.readFileSync(path.join(postDir, file), 'utf-8');
    const fm = parseFrontmatter(content);
    const slug = file.replace(/\.(md|mdx)$/, '');
    const distPath = path.join(distRoot, 'blog', slug);
    const htmlExists =
      fs.existsSync(path.join(distPath, 'index.html')) ||
      fs.existsSync(distPath + '.html');

    const isDraft = fm.draft === 'true';
    const isFuture = fm.publishDate ? new Date(fm.publishDate) > now : false;

    if (isDraft) {
      drafts++;
      if (htmlExists) {
        violations.push({
          file,
          slug,
          reason: 'Draft post leaked into build (draft: true)',
        });
      }
    }

    if (isFuture) {
      futurePosts++;
      if (htmlExists) {
        violations.push({
          file,
          slug,
          reason: `Future post leaked into build (publishDate: ${fm.publishDate}, build time: ${now.toISOString()})`,
        });
      }
    }
  }

  return { totalPosts, drafts, futurePosts, violations };
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

function main() {
  console.log('=== SellonTube Build Validation ===\n');

  if (!fs.existsSync(DIST_DIR)) {
    console.error('ERROR: dist/ directory not found. Run `npm run build` first.');
    process.exit(1);
  }

  let hasViolations = false;

  // Parse Netlify redirects so we don't flag links that Netlify handles at the edge
  const { exactFroms, wildcardFroms } = parseNetlifyRedirects(NETLIFY_TOML);

  // -- Check 1: Internal links --
  console.log('--- Check 1: Internal Link Integrity ---');
  const linkResult = checkInternalLinks(DIST_DIR, exactFroms, wildcardFroms);
  console.log(`  HTML files scanned: ${linkResult.totalFiles}`);
  console.log(`  Internal links checked: ${linkResult.totalLinks} (${linkResult.uniqueLinks} unique)`);
  console.log(`  Links covered by Netlify redirects: ${linkResult.redirectCovered}`);
  if (linkResult.violations.length > 0) {
    hasViolations = true;
    // Deduplicate by href
    const byHref = new Map();
    for (const v of linkResult.violations) {
      if (!byHref.has(v.href)) byHref.set(v.href, []);
      byHref.get(v.href).push(v.source);
    }
    console.log(`  VIOLATIONS: ${byHref.size} broken internal links found:\n`);
    for (const [href, sources] of byHref) {
      console.log(`    Broken: ${href}`);
      // Show up to 3 source files
      const shown = sources.slice(0, 3);
      for (const s of shown) {
        console.log(`      <- ${s}`);
      }
      if (sources.length > 3) {
        console.log(`      ... and ${sources.length - 3} more files`);
      }
    }
  } else {
    console.log('  OK: All internal links resolve.');
  }
  console.log();

  // -- Check 2: Sitemap --
  console.log('--- Check 2: Sitemap Integrity ---');
  const sitemapResult = checkSitemap(DIST_DIR);
  if (sitemapResult.sitemapFiles.length === 0) {
    console.log('  WARNING: No sitemap XML files found in dist/.');
  } else {
    console.log(`  Sitemap files: ${sitemapResult.sitemapFiles.join(', ')}`);
    console.log(`  URLs checked: ${sitemapResult.totalUrls}`);
    if (sitemapResult.violations.length > 0) {
      hasViolations = true;
      console.log(`  VIOLATIONS: ${sitemapResult.violations.length} sitemap URLs have no matching HTML:\n`);
      for (const v of sitemapResult.violations) {
        console.log(`    Missing: ${v.urlPath} (in ${v.sitemap})`);
      }
    } else {
      console.log('  OK: All sitemap URLs resolve.');
    }
  }
  console.log();

  // -- Check 3: Draft/future leaks --
  console.log('--- Check 3: Draft/Future Post Leak Detection ---');
  const leakResult = checkDraftLeaks(DIST_DIR, POST_DIR);
  console.log(`  Blog posts scanned: ${leakResult.totalPosts}`);
  console.log(`  Drafts: ${leakResult.drafts}, Future posts: ${leakResult.futurePosts}`);
  if (leakResult.violations.length > 0) {
    hasViolations = true;
    console.log(`  VIOLATIONS: ${leakResult.violations.length} draft/future posts leaked:\n`);
    for (const v of leakResult.violations) {
      console.log(`    LEAKED: /blog/${v.slug}`);
      console.log(`      File: ${v.file}`);
      console.log(`      Reason: ${v.reason}`);
    }
  } else {
    console.log('  OK: No draft or future posts leaked into build.');
  }
  console.log();

  // -- Summary --
  console.log('=== Summary ===');
  if (hasViolations) {
    console.log('FAILED: Build validation found violations. See above for details.');
    process.exit(1);
  } else {
    console.log('PASSED: All checks clean.');
    process.exit(0);
  }
}

main();
