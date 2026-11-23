import type { ToolPageDetail } from '@/tools/page-detail';
import { AllowableBloodLossGuideArticle } from './AllowableBloodLossGuideArticle';
import {
  ALLOWABLE_BLOOD_LOSS_FAQS,
  ALLOWABLE_BLOOD_LOSS_TOC_ITEMS,
} from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Educational maximum allowable blood loss via the Gross formula — clinician-set hemoglobin threshold, not transfusion guidance.',
  asideAriaLabel: 'Interactive Allowable Blood Loss Calculator',
  tocItems: ALLOWABLE_BLOOD_LOSS_TOC_ITEMS,
  GuideArticle: AllowableBloodLossGuideArticle,
  faqs: ALLOWABLE_BLOOD_LOSS_FAQS,
  countryRules: null,
};