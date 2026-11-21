import type { ToolPageDetail } from '@/tools/page-detail';
import { CashRatioGuideArticle } from './CashRatioGuideArticle';
import { CASH_RATIO_FAQS, CASH_RATIO_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Compute the cash ratio from cash and cash equivalents and current liabilities, with real FX on money fields, result as a multiple (x).',
  asideAriaLabel: 'Interactive Cash Ratio Calculator',
  tocItems: CASH_RATIO_TOC_ITEMS,
  GuideArticle: CashRatioGuideArticle,
  faqs: CASH_RATIO_FAQS,
  countryRules: null,
};
