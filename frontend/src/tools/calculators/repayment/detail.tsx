import type { ToolPageDetail } from '@/tools/page-detail';
import { RepaymentGuideArticle } from './RepaymentGuideArticle';
import { REPAYMENT_FAQS, REPAYMENT_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Calculate the installment needed to repay a loan in a fixed term, or estimate payoff time with a fixed installment — including interest and amortization.',
  asideAriaLabel: 'Interactive Repayment Calculator',
  tocItems: REPAYMENT_TOC_ITEMS,
  GuideArticle: RepaymentGuideArticle,
  faqs: REPAYMENT_FAQS,
  countryRules: null,
};
