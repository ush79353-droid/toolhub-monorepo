import type { ToolPageDetail } from '@/tools/page-detail';
import { PresentValueOfAnnuityGuideArticle } from './PresentValueOfAnnuityGuideArticle';
import {
  PRESENT_VALUE_OF_ANNUITY_FAQS,
  PRESENT_VALUE_OF_ANNUITY_TOC_ITEMS,
} from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Discount level or growing annuity payments to present value with independent FX on payment and result.',
  asideAriaLabel: 'Interactive Present Value of Annuity Calculator',
  tocItems: PRESENT_VALUE_OF_ANNUITY_TOC_ITEMS,
  GuideArticle: PresentValueOfAnnuityGuideArticle,
  faqs: PRESENT_VALUE_OF_ANNUITY_FAQS,
  countryRules: null,
};
