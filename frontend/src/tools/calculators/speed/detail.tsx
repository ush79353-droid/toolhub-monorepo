import type { ToolPageDetail } from '@/tools/page-detail';
import { SpeedGuideArticle } from './SpeedGuideArticle';
import { SPEED_FAQS, SPEED_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert mph, km/h, m/s, ft/s, knots, and running pace instantly. All linear units go through meters per second.',
  asideAriaLabel: 'Interactive speed conversion calculator',
  tocItems: SPEED_TOC_ITEMS,
  GuideArticle: SpeedGuideArticle,
  faqs: SPEED_FAQS,
  countryRules: null,
};
