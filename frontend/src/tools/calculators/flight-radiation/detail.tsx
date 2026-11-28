import type { ToolPageDetail } from '@/tools/page-detail';
import { FlightRadiationGuideArticle } from './FlightRadiationGuideArticle';
import { FLIGHT_RAD_FAQS, FLIGHT_RAD_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Estimate cosmic radiation dose from flight duration and an average dose rate — with unit conversions and clear labeling that results are illustrative estimates, not route-specific dosimetry.',
  asideAriaLabel: 'Interactive Flight Radiation Calculator',
  tocItems: FLIGHT_RAD_TOC_ITEMS,
  GuideArticle: FlightRadiationGuideArticle,
  faqs: FLIGHT_RAD_FAQS,
  countryRules: null,
};
