import type { ToolPageDetail } from '@/tools/page-detail';
import { MortgageRefinanceGuideArticle } from './MortgageRefinanceGuideArticle';
import { MORTGAGE_REFINANCE_FAQS, MORTGAGE_REFINANCE_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Compare the remaining mortgage with a refinance offer — payment, interest, upfront points and costs, and break-even, with independent Phase 2 FX on money fields.',
  asideAriaLabel: 'Interactive Mortgage Refinance Calculator',
  tocItems: MORTGAGE_REFINANCE_TOC_ITEMS,
  GuideArticle: MortgageRefinanceGuideArticle,
  faqs: MORTGAGE_REFINANCE_FAQS,
  countryRules: null,
};
