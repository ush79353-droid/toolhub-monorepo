import type { ToolPageDetail } from '@/tools/page-detail';
import { NmToFtLbsGuideArticle } from './NmToFtLbsGuideArticle';
import { NM_TO_FT_LBS_FAQS, NM_TO_FT_LBS_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert newton-meters (N·m) to foot-pounds (ft·lbf) and foot-pounds to newton-meters instantly.',
  asideAriaLabel: 'Interactive Nm to ft-lbs converter',
  tocItems: NM_TO_FT_LBS_TOC_ITEMS,
  GuideArticle: NmToFtLbsGuideArticle,
  faqs: NM_TO_FT_LBS_FAQS,
  countryRules: null,
};
