import type { ToolPageDetail } from '@/tools/page-detail';
import { KnotsToMphGuideArticle } from './KnotsToMphGuideArticle';
import { KNOTS_MPH_FAQS, KNOTS_MPH_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert knots to mph and mph to knots instantly. Also syncs km/h, ft/s, and m/s using exact nautical and statute mile constants.',
  asideAriaLabel: 'Interactive knots to mph converter',
  tocItems: KNOTS_MPH_TOC_ITEMS,
  GuideArticle: KnotsToMphGuideArticle,
  faqs: KNOTS_MPH_FAQS,
  countryRules: null,
};
