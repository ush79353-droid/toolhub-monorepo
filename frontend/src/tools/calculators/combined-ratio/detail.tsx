import type { ToolPageDetail } from '@/tools/page-detail';
import { COMBINED_RATIO_FAQS, COMBINED_RATIO_TOC_ITEMS } from './content';
import { CombinedRatioGuideArticle } from './CombinedRatioGuideArticle';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Calculate the insurance combined ratio from claim losses, loss adjustments, premiums, and underwriting expenses — with loss/expense ratios, underwriting result, and optional reverse solves. Currency changes formatting only.',
  asideAriaLabel: 'Combined Ratio Calculator guide',
  tocItems: COMBINED_RATIO_TOC_ITEMS,
  GuideArticle: CombinedRatioGuideArticle,
  faqs: COMBINED_RATIO_FAQS,
  countryRules: null,
};
