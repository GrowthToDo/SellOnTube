#!/usr/bin/env node
// Verifies the docs reorg: (1) every path-map `new` path exists, (2) no `old`
// root path remains, (3) every markdown link in DOCS.md resolves to a real file.
import { readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = join(__dirname, '..', '..');
const map = JSON.parse(readFileSync(join(__dirname, 'path-map.json'), 'utf8'));

let fail = 0;
const bad = (m) => { console.log('  FAIL: ' + m); fail++; };

console.log('1) path-map `new` targets exist:');
for (const { new: neu } of [...map.docs, ...map.data]) {
  if (!existsSync(join(REPO_ROOT, neu))) bad(`missing new path: ${neu}`);
}
console.log(fail === 0 ? '   ok' : '');

console.log('2) no `old` root path remains:');
let f2 = fail;
for (const { old } of map.docs) {
  if (existsSync(join(REPO_ROOT, old))) bad(`old path still at root: ${old}`);
}
console.log(fail === f2 ? '   ok' : '');

console.log('3) DOCS.md links resolve:');
let f3 = fail;
const docs = readFileSync(join(REPO_ROOT, 'DOCS.md'), 'utf8');
const linkRe = /\]\(([^)]+)\)/g;
let m;
while ((m = linkRe.exec(docs)) !== null) {
  let target = m[1].split('#')[0];
  if (!target || target.startsWith('http')) continue;
  if (!existsSync(join(REPO_ROOT, target))) bad(`DOCS.md broken link: ${target}`);
}
console.log(fail === f3 ? '   ok' : '');

console.log(fail === 0 ? '\nALL CHECKS PASSED' : `\n${fail} FAILURES`);
process.exit(fail === 0 ? 0 : 1);
