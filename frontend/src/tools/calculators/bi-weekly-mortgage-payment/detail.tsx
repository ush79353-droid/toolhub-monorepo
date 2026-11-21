import type { ToolPageDetail } from '@/tools/page-detail';
import { BiWeeklyMortgagePaymentGuideArticle } from './BiWeeklyMortgagePaymentGuideArticle';
import {
  BI_WEEKLY_MORTGAGE_PAYMENT_FAQS,
  BI_WEEKLY_MORTGAGE_PAYMENT_TOC_ITEMS,
} from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Compare monthly vs accelerated bi-weekly mortgage payments; payment, term, interest, and payoff with independent FX on money fields.',
  asideAriaLabel: 'Interactive Bi-Weekly Mortgage Payment Calculator',
  tocItems: BI_WEEKLY_MORTGAGE_PAYMENT_TOC_ITEMS,
  GuideArticle: BiWeeklyMortgagePaymentGuideArticle,
  faqs: BI_WEEKLY_MORTGAGE_PAYMENT_FAQS,
  countryRules: null,
};
