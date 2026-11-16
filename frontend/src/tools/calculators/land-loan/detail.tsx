import type { ToolPageDetail } from '@/tools/page-detail';
import { LandLoanGuideArticle } from './LandLoanGuideArticle';
import { LAND_LOAN_FAQS, LAND_LOAN_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Estimate land loan payments after a down payment with flexible payment frequency and real FX conversion.',
  asideAriaLabel: 'Interactive Land Loan Calculator',
  tocItems: LAND_LOAN_TOC_ITEMS,
  GuideArticle: LandLoanGuideArticle,
  faqs: LAND_LOAN_FAQS,
  countryRules: null,
};
