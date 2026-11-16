import type { ToolPageDetail } from '@/tools/page-detail';
import { CanadianMortgageGuideArticle } from './CanadianMortgageGuideArticle';
import { CANADIAN_MORTGAGE_FAQS, CANADIAN_MORTGAGE_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Estimate Canadian fixed-rate mortgage payments with semi-annual compounding, optional ownership costs, and payoff date.',
  asideAriaLabel: 'Interactive Canadian Mortgage Calculator',
  tocItems: CANADIAN_MORTGAGE_TOC_ITEMS,
  GuideArticle: CanadianMortgageGuideArticle,
  faqs: CANADIAN_MORTGAGE_FAQS,
  countryRules: null,
};
