import type { ToolPageDetail } from '@/tools/page-detail';
import { BounceRateGuideArticle } from './BounceRateGuideArticle';
import { BOUNCE_RATE_FAQS, BOUNCE_RATE_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Calculate your website bounce rate from total visits and one-page visits with the standard analytics formula.',
  asideAriaLabel: 'Interactive Bounce Rate Calculator',
  tocItems: BOUNCE_RATE_TOC_ITEMS,
  GuideArticle: BounceRateGuideArticle,
  faqs: BOUNCE_RATE_FAQS,
  countryRules: null,
};
