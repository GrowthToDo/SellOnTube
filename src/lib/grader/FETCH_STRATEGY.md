# Fetch Strategy — Shopify App Store Listing Grader

## Validated: 2026-06-04

### Method
Plain server-side `fetch()` with standard browser User-Agent headers.
No headless browser required.

### What works
- Shopify App Store listing pages (`apps.shopify.com/{handle}`) return fully server-rendered HTML.
- All graded fields are present in the initial HTML response:
  - JSON-LD (`SoftwareApplication`) for app name, rating, review count, developer
  - `<title>` and `<meta name="description">` for SEO fields
  - `<h2>` for introduction/tagline
  - `#adp-details-section [data-truncate-content-copy]` for app description
  - `#adp-pricing` section for pricing plans and feature lists
  - `img[src*="cdn.shopify.com/app-store/listing_images"]` for screenshots
  - `iframe[src*="youtube"]` for demo video detection
  - `a[href*="/categories/"]` with `surface_type=app_details` for app category
  - `dl dt/dd` pairs for metadata (pricing type, rating, developer)
  - "Built for Shopify" text presence

### Response size
~223KB for GS1 Assistant listing. Truncated to 120KB before any AI processing.

### Rate limiting
- Shopify does not block server-side requests with standard UAs (tested from local + Netlify).
- 4 User-Agent strings rotated across retries.
- Exponential backoff: 2s, 4s, 8s on failure.
- 15-second timeout per request.

### Risks
- Shopify may change HTML selectors at any time. Selectors are mapped to June 2026 markup.
- Review the `#adp-*` section IDs and Tailwind class selectors if scraping breaks.
- JSON-LD structure has been stable across multiple Shopify updates.

### Fixture
`__fixtures__/sample_listing.html` — GS1 Assistant listing snapshot (June 2026).
All scraper tests run against this fixture first.
