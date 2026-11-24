import type { ToolPageDetail } from '@/tools/page-detail';
import { HematocritHemoglobinRatioGuideArticle } from './HematocritHemoglobinRatioGuideArticle';
import { HCT_HGB_RATIO_FAQS, HCT_HGB_RATIO_TOC } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Educational Hct/Hgb ratio with the approximate rule-of-three factor — not a laboratory report.',
  asideAriaLabel: 'Interactive Hematocrit to Hemoglobin Ratio Calculator',
  tocItems: HCT_HGB_RATIO_TOC,
  GuideArticle: HematocritHemoglobinRatioGuideArticle,
  faqs: HCT_HGB_RATIO_FAQS,
  countryRules: null,
};
