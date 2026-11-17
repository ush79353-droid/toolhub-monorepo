import type { ToolPageDetail } from '@/tools/page-detail';
import { HomeImprovementLoanGuideArticle } from './HomeImprovementLoanGuideArticle';
import {
  HOME_IMPROVEMENT_LOAN_FAQS,
  HOME_IMPROVEMENT_LOAN_TOC_ITEMS,
} from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Estimate home improvement loan payments, fee-adjusted APR, and annual balances with real currency conversion.',
  asideAriaLabel: 'Interactive Home Improvement Loan Calculator',
  tocItems: HOME_IMPROVEMENT_LOAN_TOC_ITEMS,
  GuideArticle: HomeImprovementLoanGuideArticle,
  faqs: HOME_IMPROVEMENT_LOAN_FAQS,
  countryRules: null,
};
