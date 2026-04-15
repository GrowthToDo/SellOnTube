# SellOnTube's YouTube Dashboard

A minimal, Plausible-inspired YouTube analytics dashboard for SaaS founders.

## Features

- One-click Google OAuth to connect your YouTube channel
- At-a-glance KPIs: Impressions, Views, CTR, Watch Time, Videos Published
- Traffic sources breakdown
- Top search terms driving views
- Deploys on Netlify (free tier)

## Prerequisites

- Node.js 18+
- A Google Cloud project with OAuth 2.0 credentials

## Google Cloud Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project (or select an existing one)
3. Enable these APIs:
   - **YouTube Data API v3**
   - **YouTube Analytics API**
4. Go to **Credentials** > **Create Credentials** > **OAuth 2.0 Client ID**
5. Set application type to **Web application**
6. Add authorized redirect URIs:
   - Local dev: `http://localhost:3000/api/auth/callback/google`
   - Production: `https://your-site.netlify.app/api/auth/callback/google`
7. Copy the **Client ID** and **Client Secret**

## Local Development

```bash
cd dashboard
cp .env.example .env
```

Fill in `.env` with your Google OAuth credentials, then generate a NextAuth secret:

```bash
openssl rand -base64 32
```

Paste the output as `NEXTAUTH_SECRET` in `.env`. Then:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deploy to Netlify

1. Push this repo to GitHub
2. Go to [app.netlify.com](https://app.netlify.com) and import the repository
3. Set **Base directory** to `dashboard`
4. Build command: `npm run build`
5. Publish directory: `dashboard/.next`
6. Add environment variables in Netlify's site settings:
   - `GOOGLE_CLIENT_ID` -- your Google OAuth client ID
   - `GOOGLE_CLIENT_SECRET` -- your Google OAuth client secret
   - `NEXTAUTH_SECRET` -- generate with `openssl rand -base64 32`
   - `NEXTAUTH_URL` -- `https://your-site.netlify.app`
7. Install the **Next.js Runtime** plugin (should auto-detect from `netlify.toml`)
8. Deploy
9. Update the Google Cloud Console redirect URI to match your Netlify URL

## Tech Stack

- **Next.js 14** (App Router)
- **NextAuth.js v4** (Google OAuth with YouTube scopes)
- **Tailwind CSS 3** (Plausible-style minimal UI)
- **YouTube Data API v3** + **YouTube Analytics API**
- **Netlify** (free tier deployment)

## Project Structure

```
dashboard/
  src/
    app/
      page.tsx              # Landing page with "Connect YouTube" CTA
      layout.tsx            # Root layout (Inter font, SessionProvider)
      providers.tsx         # Client-side NextAuth SessionProvider
      globals.css           # Tailwind base styles
      dashboard/
        page.tsx            # Analytics dashboard (KPIs + tables)
      api/
        auth/[...nextauth]/
          route.ts          # NextAuth Google OAuth handler
        analytics/
          route.ts          # Fetches YouTube data, returns JSON
    components/
      KpiCard.tsx           # Big-number stat card
      Sidebar.tsx           # Dark sidebar with nav + user info
      TrafficSourcesTable.tsx
      SearchTermsTable.tsx
    lib/
      auth.ts               # NextAuth config (Google + YouTube scopes)
      youtube.ts            # YouTube API fetch helpers
    middleware.ts            # Protects /dashboard routes
  netlify.toml              # Netlify build config
  package.json
  tailwind.config.ts
  tsconfig.json
```
