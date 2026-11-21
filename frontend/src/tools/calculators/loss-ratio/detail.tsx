import type { ToolPageDetail } from '@/tools/page-detail';
import { LOSS_RATIO_FAQS, LOSS_RATIO_TOC_ITEMS } from './content';
import { LossRatioGuideArticle } from './LossRatioGuideArticle';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Calculate the insurance loss ratio from earned premiums, claims paid, and loss adjustment expenses, with interpretation, formulas, and examples. Currency changes formatting only.',
  asideAriaLabel: 'Loss Ratio Calculator guide',
  tocItems: LOSS_RATIO_TOC_ITEMS,
  GuideArticle: LossRatioGuideArticle,
  faqs: LOSS_RATIO_FAQS,
  countryRules: null,
};
