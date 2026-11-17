// Content for /ai-seo/dental: patient acquisition for independent dental practices.
// Source research: "research/ai-seo/dental/Dental Practices - Research.pdf".
// Wireframe and copy approved in session 2026-11-17 (plan: dental-rebuild-wireframe-copy.md).
//
// Owner decisions (2026-11-15, 2026-11-17):
// - Offer: patient acquisition through Google, Maps and AI search. Services include local SEO,
//   Google Business Profile and Maps, Google Ads, treatment pages, landing pages, tracking, AI search.
// - Audience: independent practices first; small groups of 2 to 5 locations welcome; DSOs out for now.
// - One action only: the discovery call (Cal, 30 minutes). No free audit.
// - No founder names or photos. No price, guarantee, invented results or testimonials.
// - Every sample number is labelled as made up. Every stat names its source; none is used yet.
// - Page stays noindex until the offer is validated (DENTAL_INDEXABLE).
//
// Outreach links: tag every link you send so GA4 shows which outreach drove the visit.
//   https://sellontube.com/ai-seo/dental?utm_source=outreach&utm_medium=email&utm_campaign=dental-pilot&utm_content=austin

export const DENTAL_PATH = '/ai-seo/dental';

/** Flip to true to let Google index the page once the offer is validated. */
export const DENTAL_INDEXABLE = false;

export const DENTAL_CTA = 'Book a free discovery call';
export const DENTAL_CTA_NOTE = '30 minutes. No pitch deck. No obligation.';

/** Used only by the unused DentalStatBars component; kept so it compiles. */
export interface DentalStat {
  label: string;
  rate: number;
  source: string;
  highlight?: boolean;
}

export interface ReportRow {
  channel: string;
  calls: number;
  forms: number;
  booked: number;
  spend?: number;
}

export const dental = {
  title: 'Dental Patient Acquisition: Google, Maps and AI Search | SellOnTube',
  description:
    'Patient acquisition for independent dental practices: local SEO, Google Business Profile, Google Ads, treatment pages and AI search, measured in booked consults.',
  headerSubline: 'Dental patient acquisition',

  // Stock photos, free licences, no attribution required. Models, not clients.
  // hero, consult: Pexels (5355709, 4269206).
  // scan: Unsplash -m-4tYmtLlI by Caroline LM, Unsplash License (checked 2026-11-17).
  // front-desk-call: Unsplash WEmqaN6eh8o by Centre for Ageing Better, Public Domain & Unsplash License (checked 2026-11-17).
  // AI-looking candidates were rejected (2026-11-17).
  photos: {
    hero: { alt: 'A dentist shows a smiling patient her treatment plan on a tablet' },
    scan: { alt: 'A dentist points to a dental scan on a screen while the patient in the chair looks on' },
    frontDesk: { alt: 'A practice team member takes a phone call at a desk with two monitors' },
    consult: { alt: 'A dentist explains a dental model to a patient' },
  },
  heroChip: {
    label: 'Sample month',
    booked: '18 booked consults',
    detail: '$500 per booked consult from Ads',
    note: 'Made-up numbers',
  },
  reportBand: {
    title: 'See which channel booked each consult',
    text: 'Every month you get one page like this. It follows calls and forms to booked consults, channel by channel, with the cost per consult where spend is known.',
  },

  hero: {
    eyebrow: 'Patient acquisition for independent dental practices',
    headline: 'More high-value patients from Google, Maps and AI search',
    subhead:
      'We help independent practices win more implant, full-arch and cosmetic cases. Local SEO, Google Ads, treatment pages and AI search run as one system, and every month you see which channel booked each consult.',
    trust: ['You keep every account', 'Privacy review before any tracking', 'Month-to-month after the 90-day pilot'],
    qualifier: 'Founding program: one practice per treatment in each city.',
  },

  report: {
    title: 'Monthly report',
    subtitle: 'Implant and cosmetic consults by channel',
    sampleNote: 'Made-up numbers, for illustration',
    columns: ['Channel', 'Calls', 'Forms', 'Booked', 'Ad spend', 'Cost per booked consult'],
    rows: [
      { channel: 'Google Maps', calls: 20, forms: 4, booked: 8 },
      { channel: 'Google Ads', calls: 12, forms: 10, booked: 6, spend: 3000 },
      { channel: 'Search results', calls: 6, forms: 8, booked: 4 },
    ] as ReportRow[],
    noSpendLabel: 'No ad spend',
    footnote: 'Sample report. Not a real practice. Our fee is reported separately.',
    alt: 'Sample monthly report with made-up numbers: 18 booked consults from 60 calls and forms, split by Google Maps, Google Ads and search results, with $500 cost per booked consult from Ads.',
  },

  trustStrip: [
    'Built for dental practices',
    'Google Search, Maps and AI assistants',
    'Measured in booked consults',
    'One practice per treatment per city',
  ],

  problem: {
    title: 'Your next implant patient is searching. Do they find you, or the practice down the road?',
    items: [
      {
        title: 'Someone else shows up first in Maps.',
        text: 'Nearby practices take the top spots for "dental implants near me", and most patients never scroll past them.',
      },
      {
        title: 'Treatment searches land on your homepage.',
        text: 'A patient researching full-arch implants wants the process, the cost questions answered, and proof. A general homepage gives them none of that.',
      },
      {
        title: 'Your website undersells your clinical work.',
        text: 'Years of training and complex cases look the same online as a practice that refers them out.',
      },
      {
        title: "You can't see what books consults.",
        text: 'You pay Google and maybe an agency every month. Neither shows you which consults that money produced.',
      },
    ],
  },

  system: {
    title: 'One patient acquisition system, from first search to booked consult',
    lede: 'Most practices buy SEO, ads and a website from different places. We plan them as one system, so each part feeds the next.',
    steps: [
      {
        title: 'Get found',
        items: ['Local SEO', 'Google Business Profile and Maps', 'Google Ads for high-value searches', 'AI search'],
      },
      {
        title: 'Earn trust',
        items: ['A page for each treatment you want more of', 'Patient education content and video', 'Reviews that reflect your work'],
      },
      {
        title: 'Turn visits into inquiries',
        items: ['Clear treatment landing pages', 'Easy calling and booking', 'Forms that ask only what you need'],
      },
      {
        title: 'Measure what booked',
        items: ['Call and form tracking by channel', 'A monthly report from inquiry to booked consult'],
      },
    ],
  },

  aiSearch: {
    title: 'Patients now ask AI assistants too',
    text: 'Some patients now ask ChatGPT, Gemini or Perplexity which dentist to see for implants. These assistants tend to draw on the same signals Google uses: your Business Profile, your reviews, and pages that answer treatment questions clearly. We build those once, so they work for both.',
    honest: 'No one can guarantee an AI assistant will recommend your practice. We make you easy to find, check and cite.',
    panelNote: 'Illustrative example, not a real search.',
    query: 'Who does full-arch dental implants near me?',
    proof: {
      label: 'Outside dental',
      text: 'For Label Wizard, a Shopify app, 65 ChatGPT sessions recorded 22 install events between August 5 and October 28, 2026. Different market, same method.',
      cta: 'Read the case study',
    },
  },

  services: {
    title: 'What we run for your practice',
    groups: [
      {
        name: 'Visibility',
        items: [
          { title: 'Local SEO', text: 'So nearby patients find you for the treatments you want, not just "dentist near me".' },
          { title: 'Google Business Profile and Maps', text: 'Categories, services, photos and reviews that help you win the map listing.' },
          {
            title: 'Google Ads',
            text: 'Campaigns for implant, full-arch and cosmetic searches when they make sense for your market. Ad spend goes to Google; our fee is separate.',
          },
          { title: 'AI search optimization', text: 'Clear, checkable answers about your practice and treatments that AI assistants can find.' },
        ],
      },
      {
        name: 'Conversion',
        items: [
          { title: 'Treatment pages', text: 'Implants, full-arch, veneers and more, each answering what patients ask before they call.' },
          { title: 'Landing pages and conversion fixes', text: "Fewer steps to call or book, and forms that don't scare people off." },
          { title: 'Patient education content and video', text: 'Explainers that answer questions before the consult.' },
        ],
      },
      {
        name: 'Measurement',
        items: [
          { title: 'Call and form tracking', text: 'Every inquiry tied to its channel, after a privacy review.' },
          { title: 'Monthly consult report', text: 'One page from inquiry to booked consult, with cost per consult where spend is known.' },
        ],
      },
    ],
  },

  measure: {
    title: 'How you will know it works',
    lede: 'We count booked consults first. Rankings come second, because they can move without bringing in a single patient.',
    oldTitle: 'Most dental marketing reports',
    old: [
      'Rankings, clicks and website traffic',
      'Calls and forms with no channel attached',
      'SEO and ads run as separate jobs',
      'One page for "dentist near me"',
    ],
    newTitle: 'What we report',
    new: [
      'Inquiries, calls and booked consults',
      'Calls and forms tied to their channel',
      'Local SEO, Ads and AI search planned together',
      'A page for each treatment you want more of',
    ],
    rulesTitle: 'How we report to you',
    rules: [
      'Every number comes from your own phone, form and booking data.',
      'Booked consults first. Rankings last.',
      'We record your starting point before we change anything.',
      "We tell you what we can't measure, and why.",
    ],
    note: 'What we can measure depends on your phone and booking systems.',
  },

  audience: {
    title: 'Who we work with',
    segments: [
      {
        title: 'Independent practices',
        text: 'Established practices that want more implant, full-arch, veneer or cosmetic cases, can take on more patients, and where the owner or lead dentist makes the call.',
      },
      {
        title: 'Small groups, 2 to 5 locations',
        text: 'The same system, with visibility and reporting broken out by location.',
      },
    ],
    fitTitle: 'A good fit',
    fit: [
      'You already pay for Google Ads or an agency, or you are ready to set a budget',
      'You will share call and booking data',
    ],
    notFitTitle: 'Not a fit right now',
    notFit: [
      'Brand-new practices with no marketing budget',
      'Anyone after the cheapest SEO',
      'Anyone expecting guaranteed rankings or patient numbers',
      'Large corporate groups with long procurement',
    ],
  },

  pilot: {
    title: 'Founding practice program',
    text: "We're taking a small number of founding practices, so each one gets senior attention. One practice per treatment in each city.",
    steps: [
      { label: 'Baseline', text: 'Your Google, Maps and AI search presence, recorded before we start' },
      { label: 'Tracking', text: 'Call and form tracking, set up after a privacy review' },
      { label: 'Launch', text: 'Treatment pages, profile fixes and Ads go live' },
      { label: 'Report', text: 'Two full monthly reports, then month-to-month with 30 days notice' },
    ],
  },

  privacy: {
    title: 'How we handle patient privacy',
    text: 'HIPAA can affect tracking and forms on a dental site, so we review privacy before we install anything.',
    points: [
      { title: 'The first call needs no patient data', text: 'We talk about your practice and goals. No patient names or health details.' },
      { title: 'We review before we install', text: 'We go through the privacy rules with you and, where needed, your privacy or legal advisor.' },
      {
        title: 'We settle the paperwork first',
        text: 'We handle no patient information until you, your advisor and we agree whether a Business Associate Agreement is needed.',
      },
    ],
    note: 'We are a marketing team, not a law firm. Your advisor makes the compliance call.',
  },

  faqs: [
    {
      q: 'How much does it cost?',
      a: 'One fixed monthly fee, quoted after the discovery call once we know your market and goals. Ad spend is paid to Google directly, separate from our fee.',
    },
    {
      q: 'How is this different from my current agency?',
      a: 'We report booked consults by channel, not rankings and clicks. We plan local SEO, Ads and AI search together, and we build a page for each treatment you want more of.',
    },
    {
      q: 'What is AI search optimization for a dental practice?',
      a: 'Making sure assistants like ChatGPT, Gemini and Perplexity can find clear, accurate information about your practice and treatments. It builds on the same work as local SEO: your Business Profile, reviews and treatment pages.',
    },
    {
      q: 'Do you run Google Ads?',
      a: 'Yes, when it makes sense for your market. Ads usually bring inquiries sooner, while local SEO and Maps build visibility that lasts.',
    },
    {
      q: 'How long until I see new inquiries?',
      a: 'Ads can bring inquiries within weeks of launch. Local SEO, Maps and AI search build over months. We set expectations for your market on the discovery call.',
    },
    {
      q: 'Have you worked with dental practices before?',
      a: 'Dental is a new market for us, which is why this is a founding program. You get a 90-day pilot, a recorded starting point, a monthly report you can check against your own booking data, and the right to leave with 30 days notice.',
    },
    {
      q: 'Can you help a practice with several locations?',
      a: 'Yes, for groups of 2 to 5 locations. We report visibility and inquiries by location.',
    },
    {
      q: 'Can you guarantee rankings, AI recommendations or new patients?',
      a: 'No. Results also depend on Google, AI platforms, your front desk and treatment acceptance. We report what the data shows.',
    },
    {
      q: 'Is there a long contract?',
      a: 'No. The founding pilot runs 90 days. After that it is month-to-month, with 30 days notice to leave.',
    },
    {
      q: 'I already have an agency. Can I switch?',
      a: "Yes. You keep ownership of your Google Business Profile, Ads account, website and tracking numbers. We review what's in place before anything moves.",
    },
    {
      q: 'How much of my time does this take?',
      a: 'One 45-minute kickoff, then a 20-minute review each month.',
    },
    {
      q: 'Is your tracking HIPAA-compliant?',
      a: 'We install no tracking until you and your advisor approve it. Your advisor makes the compliance call, and we follow it.',
    },
  ],

  closing: {
    title: 'Find out how many more patients your practice could be reaching',
    text: "Book a free 30-minute discovery call. We'll look at how patients find you today on Google, Maps and AI search, talk through the treatments you want more of, and tell you plainly if we're not the right fit.",
  },

  // Not shown on the page (free audit removed 2026-11-17). Kept only so the unused
  // DentalAuditForm component still compiles until the owner approves deleting it.
  audit: {
    treatmentLabel: 'Treatment you want more of',
    treatments: ['Dental implants', 'Full-arch', 'Veneers and cosmetic', 'Invisalign and orthodontics', 'Other'],
    marketingLabel: 'Do you pay for marketing today?',
    marketing: ['Google Ads', 'An agency', 'Both', 'Neither yet'],
    submit: 'Send my free audit',
    success: 'Got it. Your walkthrough video arrives within 3 business days. Want to talk sooner?',
    successCta: 'Book a call',
  },
};
