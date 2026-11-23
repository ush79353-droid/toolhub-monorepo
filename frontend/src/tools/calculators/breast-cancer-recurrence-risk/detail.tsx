import type { ToolPageDetail } from '@/tools/page-detail';
import { BreastCancerRecurrenceGuideArticle } from './BreastCancerRecurrenceGuideArticle';
import {
  BREAST_CANCER_RECURRENCE_FAQS,
  BREAST_CANCER_RECURRENCE_TOC_ITEMS,
} from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    "Educational O'Rourke 1994 local-recurrence index after simple mastectomy (grade, nodes, LVI). Not therapy advice.",
  asideAriaLabel: 'Interactive Breast Cancer Recurrence Risk Calculator',
  tocItems: BREAST_CANCER_RECURRENCE_TOC_ITEMS,
  GuideArticle: BreastCancerRecurrenceGuideArticle,
  faqs: BREAST_CANCER_RECURRENCE_FAQS,
  countryRules: null,
};
