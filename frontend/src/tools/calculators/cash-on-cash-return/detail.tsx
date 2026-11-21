import type { ToolPageDetail } from '@/tools/page-detail';
import { CashOnCashReturnGuideArticle } from './CashOnCashReturnGuideArticle';
import { CASH_ON_CASH_FAQS, CASH_ON_CASH_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Estimate cash-on-cash return from out-of-pocket cash invested, gross rent after vacancy, operating expenses, and debt service, with NOI, annual debt service, and annual cash flow shown separately.',
  asideAriaLabel: 'Interactive Cash On Cash Return Calculator',
  tocItems: CASH_ON_CASH_TOC_ITEMS,
  GuideArticle: CashOnCashReturnGuideArticle,
  faqs: CASH_ON_CASH_FAQS,
  countryRules: null,
};
