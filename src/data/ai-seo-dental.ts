// Content for /ai-seo/dental, a validation page for the US dental patient-acquisition offer.
// Source research: "Dental AI SEO/Dental Practices - Research.pdf".
//
// Rules for this page (owner decisions, 2026-11-15):
// - No price, no guarantee, no dental client results, no competitor case-study numbers.
// - Every stat names its source and who answered. Survey figures are directional.
// - Only stats checked at the primary source appear. The MouthWatch 2026 figures (23.2%, 51.5%,
//   19.2%) stay out until someone opens the MouthWatch page; the 23.2% also mixes two bases.
//
// Outreach links: tag every link you send so GA4 shows which outreach drove the visit.
//   https://sellontube.com/ai-seo/dental?utm_source=outreach&utm_medium=email&utm_campaign=dental-pilot&utm_content=austin
//   utm_medium = email | linkedin | phone-followup; utm_content = the city slug.
//
// Photos: drop licensed stock files (with model releases) into src/assets/images/dental/ named
// hero, maps, front-desk and reception (.jpg, .png or .webp). Each slot renders only when its
// file exists. Update the matching alt text in `photos` below to describe the photo you bought.

export const DENTAL_PATH = '/ai-seo/dental';

/** Flip to true to let Google index the page once the offer is validated. */
export const DENTAL_INDEXABLE = false;

export interface DentalStat {
  label: string;
  rate: number;
  source: string;
  highlight?: boolean;
}

export const dental = {
  title: 'Dental Patient Acquisition for Implant Practices | SellOnTube',
  description:
    'Local SEO, Google Ads and treatment pages for implant and cosmetic dental practices, with call and form tracking from the first search to the booked consultation.',
  headerSubline: 'Dental patient acquisition',
  eyebrow: 'Dental patient acquisition by SellOnTube, a founder-led growth team',
  headline: 'More implant and cosmetic consultations from Google, tracked call by call',
  subhead:
    'We run local SEO, Google Ads and treatment pages for established independent practices, and show you which channel booked each consultation.',
  qualifier: 'Built for practices ready to invest in marketing alongside their ad budget.',
  trust: [
    'Founder-led: you talk to an owner',
    'Google Ads run by a specialist partner',
    'Privacy review before any tracking',
  ],

  photos: {
    hero: { file: 'hero', alt: 'A dentist talks a patient through a treatment plan in a consultation room' },
    maps: { file: 'maps', alt: 'A person searching for a dentist on a phone map' },
    frontDesk: { file: 'front-desk', alt: 'A dental receptionist answering a phone call at the front desk' },
    reception: { file: 'reception', alt: 'The reception area of an independent dental practice' },
  },

  pain: {
    title: 'Where Implant and Cosmetic Inquiries Get Lost',
    items: [
      {
        title: 'Calls nobody can trace',
        text: 'The phone rings, but no one knows whether the ad, the map listing or the website made it ring.',
      },
      {
        title: 'Ad spend with no case attached',
        text: 'Money goes to Google every month, with no link to the consultations it produced.',
      },
      {
        title: 'One homepage for every treatment',
        text: 'Implant and veneer patients want specifics, and land on a general homepage.',
      },
      {
        title: 'Reports full of rankings',
        text: 'Rankings and clicks look busy. They do not tell you who booked.',
      },
    ],
  },

  contrast: {
    oldTitle: 'Most Dental Marketing Reports',
    old: [
      'Rankings, clicks and website traffic',
      'Calls and forms with no channel attached',
      'SEO and ads run as separate jobs',
      'One page for "dentist near me"',
    ],
    newTitle: 'What We Report',
    new: [
      'Inquiries, calls and booked consultations',
      'Calls and forms tied to their channel where your systems allow',
      'Local SEO and Google Ads planned together',
      'A page for each treatment: implants, full-arch, veneers',
    ],
  },

  data: {
    lead: 'Part of the reason: marketing often sits with the front desk.',
    chartTitle: 'How dental staff say their practice markets itself, DentalPost survey',
    stats: [
      {
        label: 'Say the front office team markets the practice',
        rate: 59,
        source: 'DentalPost, fielded Aug to Oct 2023',
      },
      {
        label: 'Say their practice uses an agency or consultant, alone or with in-house staff',
        rate: 29.5,
        source: 'DentalPost, fielded Aug to Oct 2023',
        highlight: true,
      },
    ] as DentalStat[],
    note: 'Share of respondents to a 2023 DentalPost survey. Respondents are individual dentists, hygienists, assistants and office staff, not a count of practices, and the two shares overlap. Treat them as direction, not a census.',
  },

  system: {
    title: 'One System From First Search to Booked Consultation',
    text: [
      'We plan local SEO, ads, treatment pages and tracking as one connected system.',
    ],
    flowLabel: 'How a patient moves from a Google search to a booked consultation',
    flow: [
      { label: '1. Search', text: 'A patient searches Google or Maps for implants or veneers' },
      { label: '2. Land', text: 'They reach a treatment page or an ad landing page' },
      { label: '3. Contact', text: 'They call or send a form, and we log which channel it came from' },
      { label: '4. Book', text: 'A consultation lands on your calendar' },
    ],
    tilesTitle: 'What Do We Run?',
    tiles: [
      {
        title: 'Be Found',
        text: [
          'Local SEO and your Google Business Profile, so you show up in Maps and local search.',
          'Treatment pages for the cases you want more of.',
        ],
      },
      {
        title: 'Get the Inquiry',
        text: [
          'Google Ads for high-intent treatment searches, sent to pages built to turn a visit into a call or form.',
          'Ad spend goes to Google. Our fee is separate.',
        ],
      },
      {
        title: 'Know the Result',
        text: [
          'Call and form tracking, plus a report that follows each inquiry toward a booked consultation.',
          'You see which channel earned it.',
        ],
      },
    ],
    optionalLine: 'When it fits: review management, patient education content and YouTube.',
  },

  measure: {
    title: 'How Will You Know It Is Working?',
    text: 'We count consultations first. Rankings come second, because they can move without bringing in a single patient.',
    levels: [
      { level: 'Consultations', items: 'Booked consultations, and accepted treatment where you can share it' },
      { level: 'Inquiries', items: 'Calls and form submissions by channel' },
      { level: 'Early Signs', items: 'Map visibility, impressions and clicks' },
    ],
    note: 'What we can measure depends on your phone and booking systems.',
  },

  team: {
    title: "Who You'll Work With",
    text: [
      'Three founders run SellOnTube: Sathyanand S, Gautham and Pradeep Pandey. Your contact is always a founder.',
    ],
    roles: [
      { name: 'Gautham', role: 'Your main contact and calls' },
      { name: 'Sathyanand S', role: 'Local search, treatment pages and reporting' },
      { name: 'Pradeep Pandey', role: 'Dental market research and privacy coordination' },
      { name: 'Google Ads', role: 'Run by our specialist partner' },
    ],
    photoAlt: 'SellOnTube founders Gautham, Sathyanand and Pradeep Pandey standing together outdoors',
  },

  fit: {
    title: 'Who This Is For',
    yesTitle: 'A Good Fit',
    yes: [
      'An established, independent practice with a patient base',
      'You want more implant, full-arch, veneer or cosmetic cases',
      'The owner or lead dentist makes the call',
      'You can take on more patients',
      'You will share call and booking data',
    ],
    noTitle: 'Not a Fit',
    no: [
      'A brand-new practice with no marketing budget',
      'You want the cheapest SEO you can find',
      'You expect guaranteed rankings or patient numbers',
      'You cannot add patients right now',
      'A large corporate group with a long procurement process, for now',
    ],
  },

  report: {
    title: 'What a Monthly Report Looks Like',
    text: 'Each month you get one page that follows inquiries to consultations, channel by channel.',
    tableTitle: 'Sample layout',
    columns: ['Channel', 'Calls', 'Forms', 'Booked'],
    rows: [
      { channel: 'Google Maps', calls: 20, forms: 4, booked: 8 },
      { channel: 'Google Ads', calls: 12, forms: 10, booked: 6 },
      { channel: 'Search results', calls: 6, forms: 8, booked: 4 },
    ],
    totalLabel: 'Total',
    note: 'Sample layout with made-up numbers. These are not client results. Your report uses your own data.',
  },

  privacy: {
    title: 'How We Handle Patient Privacy',
    text: 'HIPAA can affect tracking, forms and analytics on a dental site. So privacy comes before setup.',
    points: [
      { title: 'The audit needs no patient data', text: 'We ask for your website, city and email. No patient names or health details.' },
      { title: 'We review before we install', text: 'We go through the privacy rules with you and, where needed, your privacy or legal advisor.' },
      { title: 'We settle the paperwork first', text: 'We handle no patient information until you, your advisor and we agree whether a Business Associate Agreement is needed.' },
    ],
    note: 'We are a marketing team, not a law firm. Your advisor makes the compliance call.',
  },

  pilot: {
    title: 'Founding Practice Program',
    text: [
      "We're taking a small number of founding practices, so each one gets founder time.",
    ],
    exclusivity:
      'One practice per treatment in each city.',
    length: 'Each pilot runs 90 days: enough for a baseline, setup and two full monthly reports.',
    getTitle: 'What You Get',
    get: [
      'A baseline of your Google presence before we start',
      'An agreed scope, so you know what we will do',
      'Call and form tracking set up after a privacy review',
      'A monthly report from inquiry to consultation',
    ],
    stepsTitle: 'How It Starts',
    steps: [
      { title: 'Audit', text: 'We review your Google presence and send you the gaps, free.' },
      { title: 'Plan', text: 'We agree on scope, set a baseline and set up tracking.' },
      { title: 'Run and Report', text: 'We work the plan and report monthly from inquiry to consultation.' },
    ],
  },

  audit: {
    title: 'Get a Free Patient-Acquisition Audit',
    text: [
      'Send your website and city. We review what a patient sees when they search for you.',
      'Within 3 business days you get a short screen-recorded walkthrough and a one-page summary of the gaps. If it helps, we walk through them on a call.',
    ],
    sample: {
      title: 'Sample audit summary',
      practice: 'Made-up practice, for illustration',
      findings: [
        { priority: 'High', text: 'No page for full-arch implants. Those searches land on the homepage.' },
        { priority: 'High', text: 'Map listing shows no implant or cosmetic services and few photos.' },
        { priority: 'Medium', text: 'Booking takes 3 clicks from a treatment page, and the form has 9 fields.' },
        { priority: 'Low', text: 'Two nearby practices appear above you in Maps for "veneers".' },
      ],
      note: 'Sample with made-up findings. Your audit covers your own practice.',
    },
    checklistTitle: 'What We Check',
    checklist: [
      'Your Google Business Profile: categories, photos, hours and reviews',
      'Where you appear in Maps for implant and cosmetic searches, and who shows up above you',
      'Whether you have a page for each treatment you want more of',
      'Whether ads are running, and where they send patients',
      'How easy it is to call, book or send a form from your site',
    ],
    limit: 'We cannot see your call volume or bookings from outside. We cover that on the call.',
    treatmentLabel: 'Treatment you want more of',
    treatments: ['Dental implants', 'Full-arch', 'Veneers and cosmetic', 'Invisalign and orthodontics', 'Other'],
  },

  faqs: [
    {
      q: 'Can You Guarantee Rankings or New Patients?',
      a: 'No. Results also depend on Google, your front desk and treatment acceptance. We report what the data shows.',
    },
    {
      q: 'How Much Does It Cost?',
      a: "We price each practice to its goals and market. Google Ads spend goes to Google and is separate from our fee. You'll get the number on the call.",
    },
    {
      q: 'Do I Need Both SEO and Google Ads?',
      a: 'Ads bring inquiries sooner. Local SEO and your Maps listing build visibility that lasts. We plan them together, and we tell you if one should wait.',
    },
    {
      q: 'Is Your Tracking HIPAA-Compliant?',
      a: 'We install no tracking until you and your advisor approve it. Your advisor makes the compliance call, and we follow it.',
    },
    {
      q: 'Is There a Long Contract?',
      a: 'The founding pilot runs 90 days. After that, we agree on the next step together based on the reports.',
    },
  ],

  closing: {
    title: 'Find Out Where Your Practice Loses Implant and Cosmetic Inquiries',
    text: "Bring your website and your numbers. We'll show you what we would fix first, and tell you if we're not the right fit.",
    faces: "You'll talk to a founder.",
  },
};
