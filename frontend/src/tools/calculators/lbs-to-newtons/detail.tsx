import type { ToolPageDetail } from '@/tools/page-detail';
import { LbsToNewtonsGuideArticle } from './LbsToNewtonsGuideArticle';
import { LBS_TO_NEWTONS_FAQS, LBS_TO_NEWTONS_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead: 'Convert pounds-force (lbf) to newtons (N) and newtons to pounds-force instantly.',
  asideAriaLabel: 'Interactive lbs to newtons converter',
  tocItems: LBS_TO_NEWTONS_TOC_ITEMS,
  GuideArticle: LbsToNewtonsGuideArticle,
  faqs: LBS_TO_NEWTONS_FAQS,
  countryRules: null,
};
