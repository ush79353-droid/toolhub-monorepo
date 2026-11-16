import type { ToolPageDetail } from '@/tools/page-detail';
import { KnotsToKphGuideArticle } from './KnotsToKphGuideArticle';
import { KNOTS_KPH_FAQS, KNOTS_KPH_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert knots to km/h and km/h to knots instantly. 1 knot = exactly 1.852 km/h. Expand for mph, m/s, and ft/s.',
  asideAriaLabel: 'Interactive knots to kph converter',
  tocItems: KNOTS_KPH_TOC_ITEMS,
  GuideArticle: KnotsToKphGuideArticle,
  faqs: KNOTS_KPH_FAQS,
  countryRules: null,
};
