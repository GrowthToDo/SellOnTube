#!/usr/bin/env node
// Deterministic reference rewriter for the docs reorg.
// Reads path-map.json and replaces ONLY backtick-anchored bare filenames
// (`old.md` -> `new/path`) and markdown links (](old.md) / ](./old.md) -> ](new/path)).
// Literal string replacement (no regex) so filename dots/hyphens are safe and
// slugs/URLs (e.g. /youtube-for-*, page slug youtube-video-keyword-finder) are never touched.
//
// Usage:
//   node scripts/reorg/rewrite-refs.mjs --dry-run   # report only, no writes
//   node scripts/reorg/rewrite-refs.mjs --apply     # write changes

import { readFileSync, writeFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, extname, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = join(__dirname, '..', '..');
const APPLY = process.argv.includes('--apply');

const map = JSON.parse(readFileSync(join(__dirname, 'path-map.json'), 'utf8'));
const docs = map.docs; // [{old:'seo-rules.md', new:'docs/seo/seo-rules.md'}, ...]

// External auto-memory index (outside repo) — keep its pointers correct too.
const EXTERNAL = [
  'C:/Users/D E L L/.claude/projects/c--Users-D-E-L-L-Downloads-Claude-Coded-SellonTube/memory/MEMORY.md',
];

// Scan whitelist: root-level *.md/*.txt + these dirs recursively. Excludes src/,
// shopify-app-marketing/, node_modules, dist, .astro, .git, vendor, scripts/.
const SCAN_DIRS = ['agents', 'docs', '.claude', 'research'];
const EXCLUDE = new Set(['node_modules', 'dist', '.astro', '.git', '.netlify', 'vendor']);
const EXTS = new Set(['.md', '.txt']);

function walk(dir, out) {
  for (const name of readdirSync(dir)) {
    if (EXCLUDE.has(name)) continue;
    const p = join(dir, name);
    const st = statSync(p);
    if (st.isDirectory()) walk(p, out);
    else if (EXTS.has(extname(name))) out.push(p);
  }
}

const files = [];
// root-level files only (non-recursive)
for (const name of readdirSync(REPO_ROOT)) {
  const p = join(REPO_ROOT, name);
  if (statSync(p).isFile() && EXTS.has(extname(name))) files.push(p);
}
for (const d of SCAN_DIRS) {
  const abs = join(REPO_ROOT, d);
  if (existsSync(abs)) walk(abs, files);
}
for (const e of EXTERNAL) if (existsSync(e)) files.push(e);

let totalHits = 0;
const perFile = [];

for (const file of files) {
  let text = readFileSync(file, 'utf8');
  const before = text;
  let fileHits = 0;
  const detail = [];
  // Frozen historical planning docs contain shell-command examples (grep/git add
  // <file>); the space-anchored prose rule would mangle those. Their backtick/link
  // refs are still updated — only the fragile prose rule is skipped for them.
  const proseRule = !file.includes('superpowers');
  for (const { old, new: neu } of docs) {
    const rules = [
      ['`' + old + '`', '`' + neu + '`'],
      ['](' + old + ')', '](' + neu + ')'],
      ['](./' + old + ')', '](' + neu + ')'],
      // bare prose mention anchored on a leading space (never matches a longer
      // filename like comparison-content-playbook.md, whose char before the
      // basename is '-', nor a path form '/old'). Re-wraps in backticks.
      ...(proseRule ? [[' ' + old, ' `' + neu + '`']] : []),
    ];
    for (const [needle, repl] of rules) {
      if (text.includes(needle)) {
        const n = text.split(needle).length - 1;
        text = text.split(needle).join(repl);
        fileHits += n;
        detail.push(`  ${n}x  ${needle}  ->  ${repl}`);
      }
    }
  }
  if (fileHits > 0) {
    totalHits += fileHits;
    const rel = file.startsWith(REPO_ROOT) ? file.slice(REPO_ROOT.length + 1) : file;
    perFile.push({ rel, fileHits, detail });
    if (APPLY && text !== before) writeFileSync(file, text, 'utf8');
  }
}

console.log(`\n${APPLY ? 'APPLIED' : 'DRY-RUN'} — ${totalHits} replacements across ${perFile.length} files:\n`);
for (const f of perFile.sort((a, b) => b.fileHits - a.fileHits)) {
  console.log(`${f.rel}  (${f.fileHits})`);
  for (const d of f.detail) console.log(d);
}
console.log(`\n${APPLY ? 'Written.' : 'No files written (dry-run). Re-run with --apply to write.'}`);
