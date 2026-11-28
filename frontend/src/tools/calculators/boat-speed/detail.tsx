import type { ToolPageDetail } from '@/tools/page-detail';
import { BoatSpeedGuideArticle } from './BoatSpeedGuideArticle';
import { BOAT_SPEED_FAQS, BOAT_SPEED_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    "Estimate boat speed with Crouch's formula from shaft horsepower, displacement, and hull-type coefficients — with unit conversions and reverse solves.",
  asideAriaLabel: 'Interactive Boat Speed Calculator',
  tocItems: BOAT_SPEED_TOC_ITEMS,
  GuideArticle: BoatSpeedGuideArticle,
  faqs: BOAT_SPEED_FAQS,
  countryRules: null,
};
