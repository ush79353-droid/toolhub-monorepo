import type { ToolPageDetail } from '@/tools/page-detail';
import { AccrualRatioGuideArticle } from './AccrualRatioGuideArticle';
import { ACCRUAL_RATIO_FAQS, ACCRUAL_RATIO_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Estimate balance-sheet or cash-flow accrual ratios from net operating assets and (when selected) the gap between net income and operating cash flow, with clear handling for zero or negative average NOA.',
  asideAriaLabel: 'Interactive Accrual Ratio Calculator',
  tocItems: ACCRUAL_RATIO_TOC_ITEMS,
  GuideArticle: AccrualRatioGuideArticle,
  faqs: ACCRUAL_RATIO_FAQS,
  countryRules: null,
};
