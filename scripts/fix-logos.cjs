#!/usr/bin/env node
/**
 * Convert all non-PNG logos (ICO, SVG) to proper PNG format using sharp.
 * Also resizes all logos to a consistent 128x128 for blog display.
 */

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');
const https = require('https');

const logosDir = path.join(__dirname, '..', 'src', 'assets', 'images', 'blog', 'tools', 'logos');

// For ICO files, we use Google's favicon API to get a proper PNG
// For SVG files, sharp can convert them directly
async function fetchGoogleFavicon(domain, outPath) {
  return new Promise((resolve, reject) => {
    const url = `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        https.get(res.headers.location, (res2) => {
          const chunks = [];
          res2.on('data', c => chunks.push(c));
          res2.on('end', () => {
            const buf = Buffer.concat(chunks);
            fs.writeFileSync(outPath, buf);
            resolve(buf);
          });
        }).on('error', reject);
        return;
      }
      const chunks = [];
      res.on('data', c => chunks.push(c));
      res.on('end', () => {
        const buf = Buffer.concat(chunks);
        fs.writeFileSync(outPath, buf);
        resolve(buf);
      });
    }).on('error', reject);
  });
}

const icoFiles = {
  'tubemagic.png': 'tubemagic.com',
  'instapage.png': 'instapage.com',
  'renderforest.png': 'renderforest.com',
  'speaknotes.png': 'speaknotes.io',
  'veed.png': 'veed.io',
};

const svgFiles = ['sellontube.png', 'tubebuddy.png', 'utubekit.png'];

async function run() {
  // Fix ICO files - re-fetch as PNG from Google
  for (const [file, domain] of Object.entries(icoFiles)) {
    const filePath = path.join(logosDir, file);
    console.log(`Fixing ICO: ${file} (fetching from Google for ${domain})...`);
    try {
      const buf = await fetchGoogleFavicon(domain, filePath);
      // Convert to proper 128x128 PNG
      await sharp(buf)
        .resize(128, 128, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } })
        .png()
        .toFile(filePath + '.tmp');
      fs.renameSync(filePath + '.tmp', filePath);
      console.log(`  -> Fixed ${file}`);
    } catch (e) {
      console.error(`  -> FAILED: ${e.message}`);
    }
  }

  // Fix SVG files - convert with sharp
  for (const file of svgFiles) {
    const filePath = path.join(logosDir, file);
    console.log(`Fixing SVG: ${file}...`);
    try {
      await sharp(filePath)
        .resize(128, 128, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } })
        .png()
        .toFile(filePath + '.tmp');
      fs.renameSync(filePath + '.tmp', filePath);
      console.log(`  -> Fixed ${file}`);
    } catch (e) {
      console.error(`  -> FAILED: ${e.message}`);
    }
  }

  // Also resize existing PNGs to consistent 128x128
  const allFiles = fs.readdirSync(logosDir).filter(f => f.endsWith('.png'));
  for (const file of allFiles) {
    const filePath = path.join(logosDir, file);
    try {
      const meta = await sharp(filePath).metadata();
      if (meta.width !== 128 || meta.height !== 128) {
        console.log(`Resizing ${file} (${meta.width}x${meta.height} -> 128x128)...`);
        await sharp(filePath)
          .resize(128, 128, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } })
          .png()
          .toFile(filePath + '.tmp');
        fs.renameSync(filePath + '.tmp', filePath);
      }
    } catch (e) {
      // Skip already-fixed files that might still be processing
    }
  }

  console.log('\nDone. Verifying all files...');
  for (const file of fs.readdirSync(logosDir).filter(f => f.endsWith('.png'))) {
    const filePath = path.join(logosDir, file);
    try {
      const meta = await sharp(filePath).metadata();
      console.log(`  ${file}: ${meta.format} ${meta.width}x${meta.height}`);
    } catch (e) {
      console.log(`  ${file}: ERROR - ${e.message}`);
    }
  }
}

run().catch(e => { console.error(e); process.exit(1); });
