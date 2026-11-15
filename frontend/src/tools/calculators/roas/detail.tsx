import type { ToolPageDetail } from '@/tools/page-detail';
import { RoasGuideArticle } from './RoasGuideArticle';
import { ROAS_FAQS, ROAS_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Calculate return on ad spend from campaign spend and revenue, with a clearly labeled ad-only ROI view.',
  asideAriaLabel: 'Interactive ROAS calculator',
  tocItems: ROAS_TOC_ITEMS,
  GuideArticle: RoasGuideArticle,
  faqs: ROAS_FAQS,
  countryRules: null,
};
