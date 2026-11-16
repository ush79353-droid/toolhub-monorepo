import type { ToolPageDetail } from '@/tools/page-detail';
import { PartiallyAmortizedLoanGuideArticle } from './PartiallyAmortizedLoanGuideArticle';
import {
  PARTIALLY_AMORTIZED_FAQS,
  PARTIALLY_AMORTIZED_TOC_ITEMS,
} from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Estimate monthly payments, balloon balance, and total repayment on a partially amortized loan.',
  asideAriaLabel: 'Interactive Partially Amortized Loan Calculator',
  tocItems: PARTIALLY_AMORTIZED_TOC_ITEMS,
  GuideArticle: PartiallyAmortizedLoanGuideArticle,
  faqs: PARTIALLY_AMORTIZED_FAQS,
  countryRules: null,
};
