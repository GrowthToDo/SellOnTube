import { getPermalink, getBlogPermalink } from './utils/permalinks';

export const headerData = {
  links: [
    { text: 'Home', href: getPermalink('/') },
    { text: 'How It Works', href: getPermalink('/how-it-works') },
    { text: 'Pricing', href: getPermalink('/pricing') },
    { text: 'Tools', href: getPermalink('/tools') },
    { text: 'Blog', href: getBlogPermalink() },
  ],
  actions: [
    {
      text: 'Book a Diagnostic Call',
      href: 'https://cal.com/gautham-8bdvdx/30min',
      target: '_blank',
    },
  ],
};
export const footerData = {
  linkGroups: [
    {
      title: 'SellonTube',
      links: [
        { text: 'How It Works', href: getPermalink('/how-it-works') },
        { text: 'Pricing', href: getPermalink('/pricing') },
        { text: 'Book a Call', href: 'https://cal.com/gautham-8bdvdx/30min', target: '_blank', rel: 'noopener noreferrer' },
      ],
    },
    {
      title: 'Free Tools',
      links: [
        { text: 'All Tools', href: getPermalink('/tools') },
        { text: 'YouTube SEO Tool', href: getPermalink('/tools/youtube-seo-tool') },
        { text: 'ROI Calculator', href: getPermalink('/tools/youtube-roi-calculator') },
        { text: 'Video Idea Evaluator', href: getPermalink('/tools/youtube-video-ideas-evaluator') },
        { text: 'Video Ideas Generator', href: getPermalink('/tools/youtube-video-ideas-generator') },
        { text: 'Transcript Generator', href: getPermalink('/tools/youtube-transcript-generator') },
      ],
    },
    {
      title: 'Resources',
      links: [
        { text: 'YouTube For', href: getPermalink('/youtube-for') },
        { text: 'YouTube Vs', href: getPermalink('/youtube-vs') },
        { text: 'YouTube Video Ideas', href: getPermalink('/youtube-video-ideas') },
        { text: 'Blog', href: getBlogPermalink() },
      ],
    },
    {
      title: 'Company',
      links: [
        { text: 'About', href: getPermalink('/about') },
        { text: 'Privacy Policy', href: getPermalink('/privacy-policy') },
        { text: 'Terms of Service', href: getPermalink('/terms-of-service') },
      ],
    },
  ],

  socialLinks: [
    { ariaLabel: 'X', icon: 'tabler:brand-x', href: 'https://x.com/SellOnTube' },
    { ariaLabel: 'YouTube', icon: 'tabler:brand-youtube', href: 'https://youtube.com/@SellOnTube' },
    { ariaLabel: 'LinkedIn', icon: 'tabler:brand-linkedin', href: 'https://linkedin.com/company/sell-on-youtube' },
  ],

  footNote: `© ${new Date().getFullYear()} SellOnTube. All rights reserved.`,
};
