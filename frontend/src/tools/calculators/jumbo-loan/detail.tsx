import type { ToolPageDetail } from '@/tools/page-detail';
import { JumboLoanGuideArticle } from './JumboLoanGuideArticle';
import { JUMBO_LOAN_FAQS, JUMBO_LOAN_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Estimate jumbo loan monthly payments after a down payment with real FX conversion and a first-payment date.',
  asideAriaLabel: 'Interactive Jumbo Loan Calculator',
  tocItems: JUMBO_LOAN_TOC_ITEMS,
  GuideArticle: JumboLoanGuideArticle,
  faqs: JUMBO_LOAN_FAQS,
  countryRules: null,
};
