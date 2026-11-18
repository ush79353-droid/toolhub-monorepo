import type { ToolPageDetail } from '@/tools/page-detail';
import { MortgageComparisonGuideArticle } from './MortgageComparisonGuideArticle';
import { MORTGAGE_COMPARISON_FAQS, MORTGAGE_COMPARISON_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Estimate a mortgage payment, interest, PMI, and total cost with independent FX on money fields — then compare constructions by changing inputs.',
  asideAriaLabel: 'Interactive Mortgage Comparison Calculator',
  tocItems: MORTGAGE_COMPARISON_TOC_ITEMS,
  GuideArticle: MortgageComparisonGuideArticle,
  faqs: MORTGAGE_COMPARISON_FAQS,
  countryRules: null,
};
