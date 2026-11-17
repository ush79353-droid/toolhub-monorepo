import type { ToolPageDetail } from '@/tools/page-detail';
import { FutureValueOfAnnuityGuideArticle } from './FutureValueOfAnnuityGuideArticle';
import {
  FUTURE_VALUE_OF_ANNUITY_FAQS,
  FUTURE_VALUE_OF_ANNUITY_TOC_ITEMS,
} from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Project the future value of level or growing annuity payments with independent FX on payment and result.',
  asideAriaLabel: 'Interactive Future Value of Annuity Calculator',
  tocItems: FUTURE_VALUE_OF_ANNUITY_TOC_ITEMS,
  GuideArticle: FutureValueOfAnnuityGuideArticle,
  faqs: FUTURE_VALUE_OF_ANNUITY_FAQS,
  countryRules: null,
};
