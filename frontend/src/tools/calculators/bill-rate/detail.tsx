import type { ToolPageDetail } from '@/tools/page-detail';
import { BillRateGuideArticle } from './BillRateGuideArticle';
import { BILL_RATE_FAQS, BILL_RATE_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Estimate a client bill rate from annual salary, annual capacity hours, and a user-defined pricing multiplier, with independent FX on salary and bill rate.',
  asideAriaLabel: 'Interactive Bill Rate Calculator',
  tocItems: BILL_RATE_TOC_ITEMS,
  GuideArticle: BillRateGuideArticle,
  faqs: BILL_RATE_FAQS,
  countryRules: null,
};
