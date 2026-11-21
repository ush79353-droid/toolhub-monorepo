import type { ToolPageDetail } from '@/tools/page-detail';
import { ProfitGuideArticle } from './ProfitGuideArticle';
import { PROFIT_FAQS, PROFIT_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Estimate total profit from unit-normalized buying cost and selling price, quantity sold, and an optional revenue discount — with independent Phase 2 FX on every money field.',
  asideAriaLabel: 'Interactive Profit Calculator',
  tocItems: PROFIT_TOC_ITEMS,
  GuideArticle: ProfitGuideArticle,
  faqs: PROFIT_FAQS,
  countryRules: null,
};
