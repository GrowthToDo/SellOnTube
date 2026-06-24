// IndexNow: pings Bing (+ Yandex, Naver, etc.) after every Netlify deploy
// Fetches the sitemap, extracts all URLs, and submits them in one batch.

const INDEXNOW_KEY = '96a261587bfb9306b6dfd7dc03eb05e3';
const SITE_URL = 'https://sellontube.com';
const SITEMAP_INDEX_URL = `${SITE_URL}/sitemap-index.xml`;

async function fetchSitemapUrls(): Promise<string[]> {
  // Fetch sitemap index to get child sitemap URLs
  const indexRes = await fetch(SITEMAP_INDEX_URL);
  const indexXml = await indexRes.text();
  const sitemapLocs = [...indexXml.matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => m[1]);

  // Fetch each child sitemap and extract page URLs
  const urls: string[] = [];
  for (const sitemapUrl of sitemapLocs) {
    const res = await fetch(sitemapUrl);
    const xml = await res.text();
    const pageUrls = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => m[1]);
    urls.push(...pageUrls);
  }
  return urls;
}

export default async () => {
  try {
    const urls = await fetchSitemapUrls();
    if (urls.length === 0) {
      console.log('IndexNow: No URLs found in sitemap, skipping.');
      return;
    }

    // IndexNow batch API (max 10,000 URLs per request)
    const body = {
      host: 'sellontube.com',
      key: INDEXNOW_KEY,
      keyLocation: `${SITE_URL}/${INDEXNOW_KEY}.txt`,
      urlList: urls.slice(0, 10000),
    };

    const res = await fetch('https://api.indexnow.org/indexnow', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify(body),
    });

    console.log(`IndexNow: Submitted ${urls.length} URLs. Response: ${res.status}`);
  } catch (err) {
    console.error('IndexNow: Failed to submit URLs', err);
  }

  // --- Bing Webmaster URL Submission (changed-only, quota-aware) ---
  // Bing's index grounds Microsoft Copilot + Bing AI, so submitting here makes
  // pages citation-eligible faster. Daily quota is small (~100), so submit only
  // URLs not submitted before (tracked in a Netlify Blobs manifest) and cap the
  // batch to stay under quota. Never throws (background function must not fail).
  try {
    const bingKey = process.env.BING_WEBMASTER_API_KEY;
    if (!bingKey) {
      console.log('Bing: BING_WEBMASTER_API_KEY not set, skipping.');
      return;
    }
    const urls = await fetchSitemapUrls();
    const { getStore } = await import('@netlify/blobs');
    const store = getStore('bing-submitted-urls');
    const prev = JSON.parse((await store.get('manifest')) || '[]');
    const submitted = new Set(prev);
    const fresh = urls.filter((u) => !submitted.has(u)).slice(0, 90); // < 100/day quota

    if (fresh.length === 0) {
      console.log('Bing: no new URLs to submit.');
      return;
    }

    const bingRes = await fetch(`https://ssl.bing.com/webmaster/api.svc/json/SubmitUrlbatch?apikey=${bingKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify({ siteUrl: SITE_URL, urlList: fresh }),
    });

    if (bingRes.ok) {
      fresh.forEach((u) => submitted.add(u));
      await store.set('manifest', JSON.stringify([...submitted]));
      console.log(`Bing: submitted ${fresh.length} new URLs. HTTP ${bingRes.status}`);
    } else {
      console.error(`Bing: submission failed HTTP ${bingRes.status}: ${(await bingRes.text()).slice(0, 200)}`);
    }
  } catch (err) {
    console.error('Bing: submission error', err);
  }
};