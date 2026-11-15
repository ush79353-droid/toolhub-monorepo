import type { ToolPageDetail } from '@/tools/page-detail';
import { InchLbsToNmGuideArticle } from './InchLbsToNmGuideArticle';
import { INCH_LBS_TO_NM_FAQS, INCH_LBS_TO_NM_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert inch-pounds to newton-meters and newton-meters to inch-pounds with exact torque factors.',
  asideAriaLabel: 'Interactive inch-lbs to Nm converter',
  tocItems: INCH_LBS_TO_NM_TOC_ITEMS,
  GuideArticle: InchLbsToNmGuideArticle,
  faqs: INCH_LBS_TO_NM_FAQS,
  countryRules: null,
};
