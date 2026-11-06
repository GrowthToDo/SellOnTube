// Content for the /ai-seo subsite. Every public number here is logged, with source and
// definition, in the private evidence register (research/private/, never committed).
//
// `published` is the removal switch for a case study. Set it to false and the route is
// not generated, and the proof, links and proof-based metadata leave the landing page.
// For a full takedown, also delete src/assets/images/og/ai-seo-label-wizard.jpg and
// src/assets/images/case-studies/label-wizard-listing.png, because Astro emits those
// files to dist/_astro even when no page links to them.

export const AI_SEO_PATH = '/ai-seo';
export const AI_SEO_CAL_LINK = 'https://cal.com/gautham-8bdvdx/30min';

export interface WorkType {
  title: string;
  text: string;
}

export interface Definition {
  term: string;
  text: string;
}

export interface RecordedAnswer {
  question: string;
  lines: string[];
  position: string;
}

export interface TimelineItem {
  when: string;
  text: string;
}

export interface GrowthBar {
  label: string;
  multiple: string;
  startWidth: number;
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
  proofLine: string;
  sourceNote: string;
  answer: string;
  limits: string[];
  context: string[];
  challenge: string[];
  work: WorkType[];
  timeline: TimelineItem[];
  opening: string;
  statQuote: { value: string; label: string };
  bridges: { answers: string; numbers: string; limits: string; growth: string; weak: string };
  answerNote: string;
  answers: RecordedAnswer[];
  findings: string[];
  growth: GrowthBar[];
  growthNote: string;
  readingNotes: string[];
  definitions: Definition[];
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
  proofLine: '22 install events from 65 ChatGPT sessions (34%)',
  sourceNote:
    'Source: GA4 on the Label Wizard App Store listing, August 5 to October 28, 2026. These are install events, not confirmed unique shops, in a small sample with no earlier ChatGPT baseline.',
  answer:
    "Label Wizard recorded 22 install events from 65 ChatGPT sessions on its Shopify App Store listing between August 5 and October 28, 2026, a rate of 34%. Label Wizard is a barcode label app from Left Foot Software, a SellOnTube client. On October 31, a logged-out ChatGPT session called Label Wizard its first recommendation for merchants who need a custom label size, and it linked to the Label Wizard guide when asked about printing sale prices. ChatGPT sessions also converted at a higher rate than direct and Google organic sessions in the same period, though ChatGPT visitors may simply arrive closer to a decision. The sample is small, and this data does not prove that SellOnTube's work caused these sessions or install events. It does show merchants reaching a niche Shopify app through ChatGPT, at an install rate worth measuring.",
  limits: [
    'The sample is small: 65 sessions, with no earlier ChatGPT baseline.',
    "The data doesn't prove what caused these sessions. The listing, pricing and paid search changed in the same period.",
    "One client doesn't predict another, and nobody can guarantee an AI recommendation.",
  ],
  context: [
    'Label Wizard helps Shopify merchants design and print barcode and QR labels from their product data. Left Foot Software builds it, and it is one of several apps in the company portfolio.',
  ],
  challenge: [
    "Merchants ask ChatGPT practical questions: which app fits a custom label size, or how to print a sale price with the old price crossed out. In my first dated checks, from October 2026, ChatGPT led some answers with printer brands and others with Shopify's own free label app.",
    "ChatGPT answers draw on what's published, so I wanted clear, accurate pages for each of these jobs. My team wrote for specifics, like a custom label size or a crossed-out sale price.",
  ],
  work: [
    {
      title: 'Buying-Intent Content',
      text: 'My team wrote a barcode label apps roundup, an alternative page for merchants leaving another label app, and how-to guides for specific label jobs.',
    },
    {
      title: 'Ongoing Optimization',
      text: 'We refreshed the roundup using Search Console data and added a demo video.',
    },
    {
      title: 'Repeated AI Answer Checks',
      text: 'I ask ChatGPT the same set of buying questions on set dates, to see where Label Wizard appears and what it says.',
    },
    {
      title: 'Separate Listing Work',
      text: 'App Store listing changes, which are not part of our AI SEO service. Not every change was ours. I mention them because the rate on this page is measured on that listing.',
    },
  ],
  timeline: [
    { when: 'July', text: 'App Store listing rewritten (separate listing work)' },
    { when: 'August', text: 'First tracked ChatGPT session, then the rebuilt roundup goes live' },
    { when: 'September', text: 'Label size and variant guides go live' },
    { when: 'October', text: 'Alternative page and sale label guide go live, and the roundup is refreshed' },
    { when: 'October 31', text: 'ChatGPT names Label Wizard in 3 of 15 tracked questions' },
  ],
  opening:
    "I'm Sathyanand, and I run SellOnTube with two co-founders. Left Foot Software is our client. Here's what ChatGPT said about its Label Wizard app, what came in, and what I wouldn't claim from it.",
  statQuote: { value: 'My first recommendation', label: 'What ChatGPT wrote for one tracked question, Oct 31' },
  bridges: {
    answers: "Here's what ChatGPT said when I asked.",
    numbers: 'Nice answers. So what do the numbers show?',
    limits: "But there's a catch.",
    growth: "You'll see about 5x below. Don't credit ChatGPT or us for it.",
    weak: "Here's what didn't go well.",
  },
  answerNote:
    'I recorded these from logged-out ChatGPT sessions on October 31, 2026, and shortened them to the parts about Label Wizard. You may see something different, because answers vary by person, place and time. On that date, ChatGPT named Label Wizard in 3 of the 15 tracked questions.',
  answers: [
    {
      question:
        "My labels don't fit any template in my Shopify label app. Is there an app where I can set my own label size?",
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
  findings: [
    'ChatGPT sessions recorded a higher install rate than direct, Google organic and Google paid sessions in the same period. Someone who asks an assistant for a product may already be close to a decision, which could explain part of the gap.',
    'The rate stayed in a similar range across the three months, on small monthly counts.',
  ],
  growth: [
    { label: 'Install events a week', multiple: 'About 5x', startWidth: 20 },
    { label: 'New paying shops a week', multiple: 'More than 6x', startWidth: 15 },
  ],
  growthNote:
    'All channels, not only ChatGPT, from early summer to autumn 2026, in Shopify Partner data. Pricing, the App Store listing and paid search also changed, so this is context and not an AI result. Same-day uninstalls stayed about flat.',
  readingNotes: [
    'ChatGPT left Label Wizard out of most tracked questions on October 31, and ChatGPT sessions fell from September to October.',
    "Most of the install events came before most of the posts were live, so I can't credit individual posts with them.",
    'Another Left Foot Software app recorded a much lower ChatGPT rate over a longer period.',
    "I have no activation, paid or retention data for the ChatGPT group, so I can't say these visitors make better customers.",
  ],
  definitions: [
    {
      term: 'Citation',
      text: 'A source link in an AI answer. In one October check, ChatGPT cited the Left Foot Software site in an answer that ranked a competitor first, so a citation is not a recommendation.',
    },
    { term: 'Mention', text: 'The AI answer names the brand, with or without a link.' },
    { term: 'Recommendation', text: 'The AI answer suggests the product for a relevant need.' },
    {
      term: 'Referral',
      text: 'A tracked visit from the AI assistant. It does not prove that any agency caused the visit.',
    },
    { term: 'Conversion', text: 'A defined customer action. Here, the shopify_app_install event in GA4.' },
  ],
  method: [
    'A session counts as ChatGPT when its GA4 session source contains "chatgpt". GA4 on this listing starts on August 5, so no earlier baseline exists.',
    'The rate divides shopify_app_install events by sessions, with a 95% interval of about 23.5% to 46.0%. GA4 misses some real installs, and this data does not screen out test stores or all bot traffic, so I use it for sources and rates, not as an install count.',
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
  stakes:
    "Your buyers may be asking ChatGPT about your category right now. You can't see those chats, and a competitor may get named instead of you.",
  subhead:
    'We do AI SEO for B2B products. We work to get you recommended when your buyers ask ChatGPT, and we judge the work by your signups, leads and paying customers.',
  methodLine:
    'We find the questions your buyers ask, publish the answers, keep them current and show you what the data says.',
  bridges: {
    what: "You don't sell labels. So why should you care?",
    services: "You can't buy your way into these answers. So here's what we do instead.",
    check: "Not ready for a call? You don't need one.",
    team: 'You may be wondering why a company called SellOnTube does AI SEO.',
  },
  answer:
    'AI SEO is the work of making your product easier for AI assistants to find, understand and suggest when buyers ask for help choosing. Buyers ask tools like ChatGPT to explain their options, compare products and suggest a fit for a specific need. Those answers draw on what you and others publish about your product and category. We research the questions your buyers ask, check how AI assistants answer them today, and find where your product is missing or misunderstood. Then we publish and maintain the blog posts, comparison pages and YouTube videos that answer those questions accurately. We work toward a recommendation, and nobody can buy one. So we judge the work by your signups, leads, demos, installs, trials and paying customers where your data allows, and we never treat one AI answer as proof.',
  services: [
    {
      title: 'Buying-Question Research',
      text: 'We map the questions buyers ask before they choose, how ChatGPT and other AI tools answer them today, which products get suggested, and where good answers are missing. You see where a buyer might pick a competitor, and what you could publish in response.',
    },
    {
      title: 'Buying-Intent Content',
      text: 'We produce blog posts, comparison pages, alternatives pages and YouTube videos that answer product, evaluation and purchasing questions. Each piece says who the product suits, who it does not suit, and how it compares.',
    },
    {
      title: 'Ongoing Optimization',
      text: 'Products and competitors change, and pages go stale. We update pages when features, pricing, screenshots, comparisons or evidence change. A new date on old content is not a refresh, and we do not sell it as one.',
    },
    {
      title: 'Measuring What Comes In',
      text: 'We ask the same questions again over time, and we separate real recommendations from name-drops and source links. You also see referrals, signups and leads beside them, where your data allows.',
    },
  ],
  check: {
    title: 'See How ChatGPT Answers Your Buyers, Free',
    text: "Send us your product. We'll ask ChatGPT the questions your buyers are likely to ask, then email you what it says about you and your competitors.",
  },
  team: {
    title: "Who You'll Work With",
    text: [
      'Three founders run SellOnTube: Sathyanand S, Gautham and Pradeep Pandey. We started with YouTube acquisition for B2B companies, and we apply the same buying-intent research to AI answers.',
      "You'll talk to a founder on the call. Gautham built the research framework we use, and he will tell you if AI SEO does not look worth it for your product.",
    ],
  },
  takeaway:
    'If your product does a specific job, ChatGPT can name it for that job, and you can track those visits through to install events.',
  optionalLine: 'Optional: relevant offsite mentions and outreach, scoped to your opportunities.',
  topicTests:
    'We choose topics by four tests: relevance to your product, evidence of buying intent, real customer problems, and where your product differs.',
  illustrativeQuestions: ['Which tool fits our workflow?', 'X versus Y?', 'How can we solve this specific problem?'],
  illustrativeNote: 'Illustrative questions only, not measured search volumes or customer quotes.',
  steps: [
    {
      title: 'Understand the Product and Buyers',
      text: 'We learn what you sell, who buys it, and what they compare it against.',
    },
    {
      title: 'Set a Baseline',
      text: 'We record how ChatGPT and other AI tools treat your category today, plus your signups and sales numbers where we can measure them.',
    },
    {
      title: 'Identify Opportunities',
      text: 'We work out what to publish first, based on how close the buyer is to choosing.',
    },
    {
      title: 'Create, Optimize and Publish',
      text: 'We make the content, publish it and keep the facts current.',
    },
    {
      title: 'Measure and Improve',
      text: 'We read trends across repeated checks and do more of what works.',
    },
  ],
  measures: [
    { level: 'Customers and Revenue', items: 'Paying customers and attributed revenue' },
    {
      level: 'Signups and Leads',
      items: 'Signups, leads, demos, installs, trials and paid activation, as they apply to you',
    },
    {
      level: 'Early Signs',
      items: 'Relevant AI recommendations, citations, referral visits and search performance',
    },
  ],
  measureNote: 'What we can measure depends on the data you can share.',
  fit: 'This fits you if your buyers compare products before they choose. That includes self-serve SaaS and other B2B products.',
  faqs: [
    {
      q: 'What Do AI SEO, AEO and GEO Mean?',
      a: 'AI SEO is the work of improving how your product is found and suggested in AI answers. AEO (Answer Engine Optimization) and GEO (Generative Engine Optimization) are overlapping industry terms for the same broad goal. We use AI SEO because it is the plainest of the three.',
    },
    {
      q: "Isn't This Just SEO?",
      a: "A lot of it is. Good SEO is the foundation, and you shouldn't let anyone tell you otherwise. We add research into what ChatGPT actually says, content built for buyers comparing products, and tracking of whether you get recommended. Good rankings help, but they don't ensure a recommendation.",
    },
    {
      q: 'Is SellOnTube AI Writing Software?',
      a: "No. SellOnTube provides a marketing service. Our team does the research, content, optimization and measurement. You don't get a software login or an article generator.",
    },
    {
      q: 'What Do I Get?',
      a: 'You get buying-intent blog posts, comparison and alternatives pages, YouTube content, and substantive refreshes when features, pricing, screenshots, comparisons or evidence change. We agree the mix for your product on the call.',
    },
    {
      q: 'Do You Do Offsite Mentions and Outreach?',
      a: "Yes, as an optional addition with its own scope. It isn't part of every project. A brand mention can be linked or unlinked, and it's different from a backlink. We don't guarantee editorial placements or backlinks.",
    },
    {
      q: "How Will I Know It's Working?",
      a: 'We look first at your signups, leads, demos, installs, trials and paying customers, where your data allows. ChatGPT recommendations, citations and referral visits are early signs. We read them as trends across repeated checks, because one AI answer can change the next day.',
    },
    {
      q: 'Can You Guarantee AI Recommendations?',
      a: "No. Nobody can buy, control or guarantee what an AI tool recommends. Publishing content doesn't automatically produce citations, recommendations or revenue. We work toward recommendations, and we show you what the data does and doesn't support.",
    },
    {
      q: 'Can I Pay to Get Recommended by ChatGPT?',
      a: "We can't sell you that, and neither can anyone else who's being straight with you. We can't buy, control or guarantee what ChatGPT recommends. What you can do is make sure clear, accurate information about your product exists where ChatGPT can find it.",
    },
    {
      q: "Why Doesn't ChatGPT Mention My Product?",
      a: "We can't see inside ChatGPT, so anyone who claims certainty is guessing. Common suspects are thin information about the specific job you solve, few mentions outside your own site, or pages it can't easily read. The free check is a good place to start.",
    },
    {
      q: 'Is This Only for Shopify Apps?',
      a: 'No. Shopify apps are one example. The service is for B2B companies whose buyers research and compare products, including self-serve SaaS.',
    },
    {
      q: 'What Is the Free AI Answer Check?',
      a: "We ask ChatGPT the questions your buyers are likely to ask, then email you what it says about your product and your competitors. There's no charge, and you don't have to book a call.",
    },
    {
      q: 'How Much Does It Cost?',
      a: "We price each project to your product and goals, and we'll give you the number on the call.",
    },
  ],
  closing: {
    title: 'See Whether ChatGPT Mentions Your Product',
    text: "Bring your product and the questions your buyers ask. We'll talk through where AI SEO could help, and where it might not.",
  },
};
