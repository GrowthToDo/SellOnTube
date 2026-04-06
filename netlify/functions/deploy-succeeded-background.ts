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
};