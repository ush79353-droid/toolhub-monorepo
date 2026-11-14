import type { ToolPageDetail } from '@/tools/page-detail';
import { ParkingRatioGuideArticle } from './ParkingRatioGuideArticle';
import { PARKING_RATIO_FAQS, PARKING_RATIO_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead: 'Calculate parking spaces per 1,000 units of rentable area.',
  asideAriaLabel: 'Interactive Parking Ratio Calculator',
  tocItems: PARKING_RATIO_TOC_ITEMS,
  GuideArticle: ParkingRatioGuideArticle,
  faqs: PARKING_RATIO_FAQS,
  countryRules: null,
};
