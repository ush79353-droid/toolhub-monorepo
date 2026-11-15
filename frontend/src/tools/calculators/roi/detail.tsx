import type { ToolPageDetail } from '@/tools/page-detail';
import { RoiGuideArticle } from './RoiGuideArticle';
import { ROI_FAQS, ROI_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Calculate basic ROI and date-based annualized ROI from invested amount, optional contributions, and returned value.',
  asideAriaLabel: 'Interactive ROI Calculator',
  tocItems: ROI_TOC_ITEMS,
  GuideArticle: RoiGuideArticle,
  faqs: ROI_FAQS,
  countryRules: null,
};
