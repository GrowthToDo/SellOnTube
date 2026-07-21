// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />
/// <reference types="vite/client" />
/// <reference types="../vendor/integration/types.d.ts" />

// Analytics globals. `gtag` is defined by the main-thread shim in
// src/components/common/Analytics.astro. Use window.gtag('event', name, params)
// for analytics events, never window.dataLayer.push({ event: ... }) -- that is
// Google Tag Manager syntax and there is no GTM container on this site.
interface Window {
  dataLayer: unknown[];
  gtag: (...args: unknown[]) => void;
}
