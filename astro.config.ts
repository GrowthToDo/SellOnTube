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
      filter: (page) => !page.includes('/tag/') && !page.includes('/category/'),
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

    ...whenExternalScripts(() =>
      partytown({
        config: { forward: ['dataLayer.push'] },
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
    rehypePlugins: [responsiveTablesRehypePlugin, lazyImagesRehypePlugin],
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

            const env = loadEnv('development', process.cwd(), '');
            const apiKey = env.LF_YOUTUBE_KEY;
            if (!apiKey) { res.writeHead(500, { 'Content-Type': 'application/json' }); res.end(JSON.stringify({ error: 'LF_YOUTUBE_KEY not set in .env' })); return; }

            try {
              const apiRes = await fetch(`https://api.datafetchapi.com/v1/youtube/video/${videoId}/transcript/fast`, {
                headers: { 'X-API-KEY': apiKey },
              });
              const data = await apiRes.json();
              res.writeHead(apiRes.ok ? 200 : 503, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ videoId, ...data }));
            } catch {
              res.writeHead(500, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ error: 'Failed to fetch transcript' }));
            }
          });
        },
      },
    ],
  },
});
