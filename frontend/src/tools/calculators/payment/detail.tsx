import type { ToolPageDetail } from '@/tools/page-detail';
import { PaymentGuideArticle } from './PaymentGuideArticle';
import { PAYMENT_FAQS, PAYMENT_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Calculate fixed-term monthly payments or solve payoff time from a fixed payment, with amortization tables and repayment charts.',
  asideAriaLabel: 'Interactive Payment Calculator',
  tocItems: PAYMENT_TOC_ITEMS,
  GuideArticle: PaymentGuideArticle,
  faqs: PAYMENT_FAQS,
  countryRules: null,
};
