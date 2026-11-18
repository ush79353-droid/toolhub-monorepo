import type { ToolPageDetail } from '@/tools/page-detail';
import { CostOfEquityGuideArticle } from './CostOfEquityGuideArticle';
import { COST_OF_EQUITY_FAQS, COST_OF_EQUITY_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Estimate cost of equity for dividend-paying companies with the Dividend Growth (Gordon Growth) Model.',
  asideAriaLabel: 'Interactive Cost of Equity Calculator',
  tocItems: COST_OF_EQUITY_TOC_ITEMS,
  GuideArticle: CostOfEquityGuideArticle,
  faqs: COST_OF_EQUITY_FAQS,
  countryRules: null,
};
