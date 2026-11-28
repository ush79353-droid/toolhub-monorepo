import type { ToolPageDetail } from '@/tools/page-detail';
import { SpeedGuideArticle } from './SpeedGuideArticle';
import { SPEED_FAQS, SPEED_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Calculate speed, distance, and time with unit conversions, average speed, and illustrative speed comparisons.',
  asideAriaLabel: 'Interactive Speed Calculator',
  tocItems: SPEED_TOC_ITEMS,
  GuideArticle: SpeedGuideArticle,
  faqs: SPEED_FAQS,
  countryRules: null,
};
