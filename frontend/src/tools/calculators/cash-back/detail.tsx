import type { ToolPageDetail } from '@/tools/page-detail';
import { CashBackGuideArticle } from './CashBackGuideArticle';
import { CASH_BACK_FAQS, CASH_BACK_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Calculate cashback rewards, optional reward caps, effective purchase cost, and the true cashback rate on eligible spending.',
  asideAriaLabel: 'Interactive Cash Back Calculator',
  tocItems: CASH_BACK_TOC_ITEMS,
  GuideArticle: CashBackGuideArticle,
  faqs: CASH_BACK_FAQS,
  countryRules: null,
};
