import type { ToolPageDetail } from '@/tools/page-detail';
import { OptimalPriceGuideArticle } from './OptimalPriceGuideArticle';
import { OPTIMAL_PRICE_FAQS, OPTIMAL_PRICE_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Estimate a profit-maximizing price under constant marginal cost and constant-elasticity demand calibrated from two price–quantity observations.',
  asideAriaLabel: 'Interactive Optimal Price Calculator',
  tocItems: OPTIMAL_PRICE_TOC_ITEMS,
  GuideArticle: OptimalPriceGuideArticle,
  faqs: OPTIMAL_PRICE_FAQS,
  countryRules: null,
};
