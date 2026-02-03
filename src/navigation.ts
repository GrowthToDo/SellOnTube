import { getPermalink, getBlogPermalink } from './utils/permalinks';

export const headerData = {
  links: [
    { text: 'Home', href: getPermalink('/') },
    { text: 'How It Works', href: getPermalink('/how-it-works') },
    { text: 'YouTube for Shopify', href: getPermalink('/youtube-for-shopify') },
    { text: 'Pricing', href: getPermalink('/pricing') },
    { text: 'Blog', href: getBlogPermalink() },
  ],
  actions: [
    {
      text: 'Book a Diagnostic Call',
      href: 'https://cal.com/gautham-8bdvdx/30min?date=2025-12-31',
      target: '_blank',
    },
  ],
};
export const footerData = {
  links: [
    { text: 'How It Works', href: getPermalink('/how-it-works') },
    { text: 'YouTube for Shopify', href: getPermalink('/youtube-for-shopify') },
    { text: 'Pricing', href: getPermalink('/pricing') },
    { text: 'Blog', href: getBlogPermalink() },
  ],
  secondaryLinks: [],

  socialLinks: [
    { ariaLabel: 'X', icon: 'tabler:brand-x', href: 'https://x.com/SellOnTube' },
    { ariaLabel: 'YouTube', icon: 'tabler:brand-youtube', href: 'https://youtube.com/@SellOnTube' },
    { ariaLabel: 'LinkedIn', icon: 'tabler:brand-linkedin', href: 'https://linkedin.com/company/sell-on-youtube' },
  ],

  footNote: `© 2025 SellOnTube. All rights reserved.`,
};
