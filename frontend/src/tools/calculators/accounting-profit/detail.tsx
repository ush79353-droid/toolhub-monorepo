import type { ToolPageDetail } from '@/tools/page-detail';
import { AccountingProfitGuideArticle } from './AccountingProfitGuideArticle';
import {
  ACCOUNTING_PROFIT_FAQS,
  ACCOUNTING_PROFIT_TOC_ITEMS,
} from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Estimate accounting profit from total revenue minus explicit costs, with independent FX on each money field.',
  asideAriaLabel: 'Interactive Accounting Profit Calculator',
  tocItems: ACCOUNTING_PROFIT_TOC_ITEMS,
  GuideArticle: AccountingProfitGuideArticle,
  faqs: ACCOUNTING_PROFIT_FAQS,
  countryRules: null,
};
