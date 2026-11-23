import type { ToolPageDetail } from '@/tools/page-detail';
import { EjectionFractionGuideArticle } from './EjectionFractionGuideArticle';
import {
  EJECTION_FRACTION_FAQS,
  EJECTION_FRACTION_TOC_ITEMS,
} from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Educational ejection fraction from end-diastolic volume and stroke volume — via SV, ESV, or cardiac output & heart rate. Not a heart-failure grade.',
  asideAriaLabel: 'Interactive Ejection Fraction Calculator',
  tocItems: EJECTION_FRACTION_TOC_ITEMS,
  GuideArticle: EjectionFractionGuideArticle,
  faqs: EJECTION_FRACTION_FAQS,
  countryRules: null,
};
