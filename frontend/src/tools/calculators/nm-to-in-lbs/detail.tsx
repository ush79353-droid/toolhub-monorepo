import type { ToolPageDetail } from '@/tools/page-detail';
import { NmToInLbsGuideArticle } from './NmToInLbsGuideArticle';
import { NM_TO_IN_LBS_FAQS, NM_TO_IN_LBS_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert newton-meters to inch-pounds and inch-pounds to newton-meters with exact torque factors.',
  asideAriaLabel: 'Interactive Nm to in-lbs converter',
  tocItems: NM_TO_IN_LBS_TOC_ITEMS,
  GuideArticle: NmToInLbsGuideArticle,
  faqs: NM_TO_IN_LBS_FAQS,
  countryRules: null,
};
