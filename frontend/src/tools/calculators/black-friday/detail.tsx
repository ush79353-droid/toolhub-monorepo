import type { ToolPageDetail } from '@/tools/page-detail';
import { BlackFridayGuideArticle } from './BlackFridayGuideArticle';
import { BLACK_FRIDAY_FAQS, BLACK_FRIDAY_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Calculate Black Friday sale prices, percentage discounts, total savings, and optional sales tax before buying.',
  asideAriaLabel: 'Interactive Black Friday Calculator',
  tocItems: BLACK_FRIDAY_TOC_ITEMS,
  GuideArticle: BlackFridayGuideArticle,
  faqs: BLACK_FRIDAY_FAQS,
  countryRules: null,
};
