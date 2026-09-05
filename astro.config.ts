import path from 'path';
import { fileURLToPath } from 'url';
import { loadEnv } from 'vite';

import { defineConfig } from 'astro/config';

import sitemap from '@astrojs/sitemap';
import tailwind from '@astrojs/tailwind';
import mdx from '@astrojs/mdx';
import partytown from '@astrojs/partytown';
import icon from 'astro-icon';
import compress from 'astro-compress';
import type { AstroIntegration } from 'astro';

import astrowind from './vendor/integration';

import { readingTimeRemarkPlugin, responsiveTablesRehypePlugin, lazyImagesRehypePlugin } from './src/utils/frontmatter';
import rehypeExternalLinks from 'rehype-external-links';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const hasExternalScripts = true;
const whenExternalScripts = (items: (() => AstroIntegration) | (() => AstroIntegration)[] = []) =>
  hasExternalScripts ? (Array.isArray(items) ? items.map((item) => item()) : [items()]) : [];

export default defineConfig({
  output: 'static',

  integrations: [
    tailwind({
      applyBaseStyles: false,
    }),
    sitemap({
      filter: (page) =>
        !page.includes('/tag/') &&
        !page.includes('/category/') &&
        !/\/blog\/\d+$/.test(page) &&
        !page.includes('/changelog') &&
        !page.includes('/next-steps') &&
        !page.endsWith('/shopify-app/tools') &&
        !page.endsWith('/shopify-app/tools/') &&
        !page.includes('listing-grader/report') &&
        !page.includes('/case-studies/left-foot-software/slides'),
      lastmod: new Date(),
    }),
    mdx(),
    icon({
      include: {
        tabler: ['*'],
        'flat-color-icons': [
          'template',
          'gallery',
          'approval',
          'document',
          'advertising',
          'currency-exchange',
          'voice-presentation',
          'business-contact',
          'database',
        ],
      },
    }),

    // `forward` is intentionally empty. It used to contain 'dataLayer.push' so that
    // Partytown would relay analytics calls into the web worker running gtag.js.
    // Google Analytics no longer runs in the worker (see src/config.yaml), so that
    // forward installs a main-thread dataLayer.push proxy that ships events into a
    // worker with no gtag in it. Any event fired before gtag.js finishes loading
    // would be queued there and silently lost. Verified 2026-07-21.
    ...whenExternalScripts(() =>
      partytown({
        config: { forward: [] },
      })
    ),

    compress({
      CSS: true,
      HTML: {
        'html-minifier-terser': {
          removeAttributeQuotes: false,
        },
      },
      Image: false,
      JavaScript: true,
      SVG: false,
      Logger: 1,
    }),

    astrowind({
      config: './src/config.yaml',
    }),
  ],

  image: {
    domains: ['cdn.pixabay.com'],
  },

  markdown: {
    remarkPlugins: [readingTimeRemarkPlugin],
    rehypePlugins: [
      responsiveTablesRehypePlugin,
      lazyImagesRehypePlugin,
      [rehypeExternalLinks, { target: '_blank', rel: ['noopener', 'noreferrer'] }],
    ],
  },

  vite: {
    resolve: {
      alias: {
        '~': path.resolve(__dirname, './src'),
      },
    },
    plugins: [
      {
        name: 'dev-api-proxy',
        configureServer(server) {
          server.middlewares.use('/api/get-transcript', async (req, res) => {
            if (req.method === 'OPTIONS') {
              res.writeHead(204, { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'POST', 'Access-Control-Allow-Headers': 'Content-Type' });
              res.end();
              return;
            }
            if (req.method !== 'POST') { res.writeHead(405); res.end(); return; }

            let body = '';
            for await (const chunk of req) body += chunk;
            const { url } = JSON.parse(body);

            // Extract video ID
            const m = url?.match(/(?:[?&]v=|youtu\.be\/|\/(?:embed|v|shorts)\/)([\w-]{11})/) || [];
            const videoId = m[1];
            if (!videoId) { res.writeHead(400, { 'Content-Type': 'application/json' }); res.end(JSON.stringify({ error: 'Invalid YouTube URL' })); return; }

            // Same adapter the production function uses, so dev and prod cannot drift.
            // `.env` is not in process.env under `astro dev`; load it and expose the key.
            const env = loadEnv('development', process.cwd(), '');
            if (env.TRANSCRIPT_API_KEY) process.env.TRANSCRIPT_API_KEY = env.TRANSCRIPT_API_KEY;
            // ssrLoadModule lets Vite transform the .ts file; a plain import() from the bundled
            // config would be resolved by Node, which cannot load TypeScript.
            const { getTranscript } = (await server.ssrLoadModule(
              path.resolve(__dirname, 'netlify/functions/lib/transcript.ts')
            )) as typeof import('./netlify/functions/lib/transcript');

            const json = (status: number, payload: unknown) => {
              res.writeHead(status, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify(payload));
            };

            try {
              const result = await getTranscript(videoId);
              if (result.status === 'ok') {
                const t = result.transcript;
                json(200, { videoId, title: t.title, channel: t.channel, thumbnail: t.thumbnail, lang: t.lang, segments: t.segments, cached: result.cached });
              } else if (result.status === 'unavailable') {
                json(422, { error: 'No transcript found. The video may not exist, may be private, or may have no captions.', code: 'no_captions' });
              } else if (result.status === 'quota') {
                json(429, { error: 'quota_exceeded' });
              } else {
                json(503, { error: 'The transcript service is temporarily unavailable. Please try again later.' });
              }
            } catch {
              // Upstream unreachable (DNS/TLS/refused). 503, matching netlify/functions/get-transcript.ts.
              json(503, { error: 'The transcript service is temporarily unavailable. Please try again later.' });
            }
          });
        },
      },
    ],
  },
});
