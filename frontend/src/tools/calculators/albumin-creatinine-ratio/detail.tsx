import type { ToolPageDetail } from '@/tools/page-detail';
import { AlbuminCreatinineRatioGuideArticle } from './AlbuminCreatinineRatioGuideArticle';
import {
  ALBUMIN_CREATININE_RATIO_FAQS,
  ALBUMIN_CREATININE_RATIO_TOC_ITEMS,
} from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Compute urine albumin-to-creatinine ratio (ACR) in mg/g from spot albumin and creatinine — educational only.',
  asideAriaLabel: 'Interactive Albumin Creatinine Ratio Calculator',
  tocItems: ALBUMIN_CREATININE_RATIO_TOC_ITEMS,
  GuideArticle: AlbuminCreatinineRatioGuideArticle,
  faqs: ALBUMIN_CREATININE_RATIO_FAQS,
  countryRules: null,
};
