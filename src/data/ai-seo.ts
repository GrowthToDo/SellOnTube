// Content for the /ai-seo subsite. Every public number here is logged, with source and
// definition, in the private evidence register (research/private/, never committed).
//
// `published` is the removal switch for a case study. Set it to false and the route is
// not generated, and the proof, links and proof-based metadata leave the landing page.
// For a full takedown, also delete src/assets/images/og/ai-seo-label-wizard.jpg,
// src/assets/images/case-studies/label-wizard-logo.png, label-wizard-label.jpg and
// label-wizard-chatgpt-full.png and label-wizard-chatgpt-answer.png, because
// Astro emits those files to dist/_astro even when no page links to them.

export const AI_SEO_PATH = '/ai-seo';
export const AI_SEO_CAL_LINK = 'https://cal.com/gautham-8bdvdx/30min';

export interface RecordedAnswer {
  question: string;
  shortQuestion?: string;
  lines: string[];
  position: string;
}

export interface TimelineItem {
  when: string;
  text: string;
  highlight?: boolean;
}

export interface SourceRate {
  label: string;
  rate: number;
  highlight?: boolean;
}

export interface FlowStep {
  label: string;
  text: string;
}

export interface CaseStudy {
  slug: string;
  published: boolean;
  client: string;
  clientLine: string;
  title: string;
  headline: string;
  description: string;
  publishDate: string;
  dataThrough: string;
  period: string;
  stats: { installEvents: number; sessions: number; rate: string };
  questions: { tracked: number; named: number };
  interval: { low: number; high: number; point: number };
  sourceNote: string;
  opening: string[];
  answersIntro: string;
  screenshotNote: string;
  recordsIntro: string;
  answerNote: string;
  answers: RecordedAnswer[];
  flow: FlowStep[];
  flowNote: string;
  cameIn: { first: string[]; comparison: string[]; rangeNote: string };
  sourceRates: SourceRate[];
  sourceRatesNote: string;
  cantProve: string[];
  didntGoWell: string[];
  limitsClose: string;
  work: string[];
  timeline: TimelineItem[];
  timelineNote: string;
  method: string[];
}

const labelWizard: CaseStudy = {
  slug: 'label-wizard',
  published: true,
  client: 'Label Wizard',
  clientLine: 'Label Wizard, a Shopify app from Left Foot Software',
  title: 'Label Wizard in ChatGPT: 22 Install Events from 65 Sessions',
  headline: 'How Label Wizard Shows Up When Merchants Ask ChatGPT',
  description:
    'AI SEO case study: ChatGPT named Label Wizard first for one tracked question, and 65 ChatGPT sessions recorded 22 install events. See the method and the limits.',
  publishDate: '2026-11-06',
  dataThrough: '2026-10-28',
  period: 'August 5 to October 28, 2026',
  stats: { installEvents: 22, sessions: 65, rate: '34%' },
  questions: { tracked: 15, named: 3 },
  interval: { low: 23.5, high: 46, point: 34 },
  sourceNote:
    'Source: GA4 on the App Store listing, August 5 to October 28, 2026. Install events are not confirmed shops.',
  opening: [
    "I'm Sathyanand, and I run SellOnTube with two co-founders. Left Foot Software is our client.",
    "Here's what ChatGPT said about its Label Wizard app, what came in, and what I wouldn't claim from it.",
  ],
  answersIntro: 'I asked the kind of question a merchant would ask. Here is one answer, as ChatGPT showed it.',
  screenshotNote: 'Screenshot of a ChatGPT answer, cropped to the first of three apps it listed.',
  recordsIntro: 'And these are from logged-out sessions on October 31, 2026.',
  answerNote:
    'I shortened these to the parts about Label Wizard. You may see something different, because answers vary by person, place and time.',
  answers: [
    {
      question:
        "My labels don't fit any template in my Shopify label app. Is there an app where I can set my own label size?",
      shortQuestion: 'Is there an app where I can set my own label size?',
      lines: ['1. Label Wizard: Print Barcodes', 'My first recommendation', 'Enter your own label dimensions.'],
      position: 'Listed first of three apps',
    },
    {
      question: 'How can I print price labels that show the compare-at price for sale items in Shopify?',
      lines: ['Label Wizard', 'Supports printing both the compare-at price and sale price. See its guide.'],
      position: "Listed with one other third-party app, with a link to Label Wizard's guide",
    },
    {
      question: 'How do I print Black Friday sale price tags with the original price crossed out for my Shopify store?',
      lines: ['One option to investigate is Label Wizard.'],
      position: 'The only app named',
    },
  ],
  flow: [
    { label: '1. Ask', text: '"Is there an app where I can set my own label size?"' },
    { label: '2. Answer', text: '"My first recommendation"' },
    { label: '3. Visit', text: 'The Label Wizard App Store listing' },
    { label: '4. Act', text: 'An install event in GA4' },
  ],
  flowNote:
    'Steps 1 and 2 come from a recorded answer about our client. Steps 3 and 4 show the general path, not one tracked buyer.',
  cameIn: {
    first: [
      'Nice answers. So what do the numbers show?',
      'Between August 5 and October 28, 65 ChatGPT sessions reached the Label Wizard listing. They recorded 22 install events.',
    ],
    comparison: [
      'Is that good? It beat direct, Google organic and Google paid in the same period.',
      'Someone who asks an assistant for a product may already be close to a decision. That could explain part of the gap.',
    ],
    rangeNote: '65 sessions is a small sample. The true rate could sit anywhere in this range (95% interval).',
  },
  sourceRates: [
    { label: 'ChatGPT', rate: 33.8, highlight: true },
    { label: 'Direct', rate: 14.5 },
    { label: 'Google organic', rate: 12.4 },
    { label: 'Google paid', rate: 4.2 },
  ],
  sourceRatesNote: 'Install events per session, GA4, same period. ChatGPT has the smallest sample of the four.',
  cantProve: [
    "I can't tell you what caused this. Pricing, the listing and paid search all changed in the same period.",
    'I have no earlier baseline. GA4 on this listing starts on August 5.',
    "I can't credit individual posts. Most of the install events came before most of the posts were live.",
    "I can't say these visitors make better customers. I have no activation, paid or retention data for them.",
  ],
  didntGoWell: [
    'ChatGPT left Label Wizard out of 12 of the 15 tracked questions.',
    'ChatGPT sessions fell from September to October.',
    'Another Left Foot Software app recorded a much lower ChatGPT rate over a longer period.',
  ],
  limitsClose: "One client doesn't predict another, and nobody can guarantee an AI recommendation.",
  work: [
    'My team wrote a barcode label apps roundup, an alternative page for merchants leaving another label app, and how-to guides for specific label jobs.',
    'We refreshed the roundup using Search Console data and added a demo video.',
    'I ask ChatGPT the same buying questions on set dates, to see where Label Wizard appears and what it says.',
  ],
  timeline: [
    { when: 'July', text: 'App Store listing rewritten. This was separate work, not all of it ours.' },
    { when: 'August', text: 'First tracked ChatGPT session, then the rebuilt roundup goes live', highlight: true },
    { when: 'September', text: 'Label size and variant guides go live' },
    { when: 'October', text: 'Alternative page and sale label guide go live, and the roundup is refreshed' },
    { when: 'October 31', text: 'ChatGPT names Label Wizard in 3 of 15 tracked questions', highlight: true },
  ],
  timelineNote: "This shows the order of events. It doesn't show that one led to the next.",
  method: [
    'A session counts as ChatGPT when its GA4 session source contains "chatgpt". GA4 does not match each event to a specific session.',
    'The rate divides shopify_app_install events by sessions, with a 95% interval of about 23.5% to 46.0%.',
    "GA4 misses some real installs, and this data doesn't screen out test stores or all bot traffic. So I use it for sources and rates, not as an install count.",
    'The figures are a frozen snapshot from October 29, 2026. I publish findings rather than the full dataset, to protect client data.',
  ],
};

export const caseStudies: CaseStudy[] = [labelWizard];
export const publishedCaseStudies = caseStudies.filter((study) => study.published);
export const featuredCaseStudy: CaseStudy | undefined = publishedCaseStudies[0];

export const caseStudyPath = (slug: string) => `${AI_SEO_PATH}/case-studies/${slug}`;

export const landing = {
  title: 'AI SEO Services: Show Up When B2B Buyers Ask ChatGPT | SellOnTube',
  descriptionWithProof:
    'AI SEO services for B2B products buyers compare in ChatGPT. See recorded answers naming our client Label Wizard, and 22 install events from 65 ChatGPT sessions.',
  descriptionPlain:
    'AI SEO services that help B2B buyers find and choose your product in AI assistants like ChatGPT, through buying-intent content, YouTube and ongoing updates.',
  eyebrow: 'AI SEO services for B2B companies',
  headline: 'When your buyers ask ChatGPT what to use, does it name you?',
  subhead:
    'We do AI SEO for B2B products. We work to get you recommended, and we judge the work by your signups, leads and paying customers.',
  deliverables: 'Buying-question research, buying-intent content and ongoing updates, measured by your signups.',
  heroAnswerNote:
    'A real ChatGPT answer about our client, cropped to the first of three apps. Answers vary by person, place and time.',
  proof: {
    title: "What One Client's ChatGPT Sessions Recorded",
    text: [
      "You don't sell labels. But if your product does a specific job, ChatGPT can name it for that job. And you can often track what those visitors do next.",
      "These numbers don't show what caused those sessions. The case study shows what we did, and what we can't claim.",
    ],
  },
  team: {
    title: "Who You'll Work With",
    text: [
      'Three founders run SellOnTube: Sathyanand S, Gautham and Pradeep Pandey. We started with YouTube acquisition for B2B companies, and we apply the same buying research to AI answers.',
      "You'll talk to a founder on the call. If AI SEO doesn't look worth it for your product, we'll tell you.",
    ],
    fit: 'This fits you if your buyers compare products before they choose. Shopify apps are one example, and self-serve SaaS is another.',
  },
  what: {
    title: 'What Is AI SEO?',
    text: [
      'AI SEO makes your product easier for ChatGPT and other AI assistants to find, understand and suggest.',
      'Why now? Your buyers ask these tools for help choosing.',
      'So we find those questions. Then we publish the pages and videos that answer them.',
      'Nobody can buy a recommendation. We judge the work by your signups, leads and customers.',
    ],
  },
  flow: [
    { label: '1. Ask', text: 'A buyer asks which product fits their need' },
    { label: '2. Answer', text: 'AI explains the options and may suggest products' },
    { label: '3. Visit', text: 'They check your page, listing or video' },
    { label: '4. Act', text: 'A lead, demo, install or paying customer' },
  ] as FlowStep[],
  servicesTitle: 'What Do Our AI SEO Services Include?',
  services: [
    {
      title: 'Buying-Question Research',
      text: [
        'What do your buyers ask before they choose? We list those questions and put each one to ChatGPT.',
        'You see who gets named, and where a buyer might pick a competitor.',
      ],
    },
    {
      title: 'Buying-Intent Content',
      text: [
        'We write the blog posts, comparison pages, alternatives pages and YouTube videos your buyers look for.',
        "Each one says who your product suits, who it doesn't suit, and how it compares.",
      ],
    },
    {
      title: 'Ongoing Optimization',
      text: [
        'Features, pricing and competitors change, and pages go stale. We update the page when the facts change.',
        "A new date on old content doesn't count as a refresh.",
      ],
    },
  ],
  optionalLine: 'Optional: relevant offsite mentions and outreach, scoped to your opportunities.',
  check: {
    title: 'See How ChatGPT Answers Your Buyers, Free',
    text: [
      "Not ready for a call? You don't need one.",
      "Send us your product. We'll ask ChatGPT the questions your buyers are likely to ask. Then we'll email you what it says about you and your competitors.",
    ],
  },
  know: {
    title: "How Will You Know It's Working?",
    text: 'We count customers first. AI answers come second, because one answer can change the next day.',
    stepsTitle: 'What Happens After You Say Yes?',
  },
  measures: [
    { level: 'Customers and Revenue', items: 'Paying customers and attributed revenue' },
    { level: 'Signups and Leads', items: 'Signups, leads, demos, installs and trials' },
    { level: 'Early Signs', items: 'AI recommendations, citations and referral visits' },
  ],
  measureNote: 'What we can measure depends on the data you can share.',
  steps: [
    { title: 'Learn', text: 'We learn what you sell, who buys it and what they compare it against.' },
    { title: 'Set a Baseline', text: 'We record how AI tools treat your category today, plus your signups and sales.' },
    { title: 'Prioritize', text: 'We work out what to publish first, based on how close the buyer is to choosing.' },
    { title: 'Publish', text: 'We make the content, publish it and keep the facts current.' },
    { title: 'Improve', text: 'We read trends across repeated checks and do more of what works.' },
  ],
  faqs: [
    {
      q: 'What Do AI SEO, AEO and GEO Mean?',
      a: 'AI SEO improves how AI answers find and suggest your product. AEO (answer engine optimization) and GEO (generative engine optimization) are overlapping terms for the same goal.',
    },
    {
      q: "Isn't This Just SEO?",
      a: 'A lot of it is. Good SEO is the foundation. We add research into what ChatGPT says, content for buyers comparing products, and tracking of whether you get recommended.',
    },
    {
      q: 'Is SellOnTube AI Writing Software?',
      a: "No. We're a marketing service, and our team does the research, content, optimization and measurement. You don't get a software login or an article generator.",
    },
    {
      q: 'Do You Do Offsite Mentions and Outreach?',
      a: "Yes, as an optional addition with its own scope. It isn't part of every project. We don't guarantee editorial placements or backlinks.",
    },
    {
      q: 'Can You Guarantee AI Recommendations?',
      a: "No. Nobody can buy, control or guarantee what an AI tool recommends. We work toward recommendations and show you what the data does and doesn't support.",
    },
    {
      q: 'How Much Does It Cost?',
      a: "We price each project to your product and goals. You'll get the number on the call.",
    },
  ],
  closing: {
    title: 'See Whether ChatGPT Mentions Your Product',
    text: "Bring your product and the questions your buyers ask. We'll talk through where AI SEO could help, and where it might not.",
    faces: "You'll talk to a founder.",
  },
  caseClosing: {
    title: 'What Does This Mean for You?',
    text: [
      'If your product does a specific job, ChatGPT can name it for that job. You can often track those visits through to the action you care about.',
      "You don't know yet what ChatGPT says to your buyers. Start with a free check, or book a call.",
    ],
    prompt: 'Curious what ChatGPT says about your product?',
  },
};
