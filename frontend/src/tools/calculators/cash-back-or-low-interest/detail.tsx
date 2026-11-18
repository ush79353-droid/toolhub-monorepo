import type { ToolPageDetail } from '@/tools/page-detail';
import { CashBackOrLowInterestGuideArticle } from './CashBackOrLowInterestGuideArticle';
import {
  CASH_BACK_OR_LOW_INTEREST_FAQS,
  CASH_BACK_OR_LOW_INTEREST_TOC_ITEMS,
} from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Compare a cash-back auto loan at a higher APR with a low-rate offer that skips the rebate, using fixed USD.',
  asideAriaLabel: 'Interactive Cash Back or Low Interest Calculator',
  tocItems: CASH_BACK_OR_LOW_INTEREST_TOC_ITEMS,
  GuideArticle: CashBackOrLowInterestGuideArticle,
  faqs: CASH_BACK_OR_LOW_INTEREST_FAQS,
  countryRules: null,
};
