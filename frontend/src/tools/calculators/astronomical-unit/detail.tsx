import type { ToolPageDetail } from '@/tools/page-detail';
import { AstronomicalUnitGuideArticle } from './AstronomicalUnitGuideArticle';
import { AU_FAQS, AU_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert astronomical units to kilometers, miles, meters, light-years, and parsecs using IAU and Julian-year definitions.',
  asideAriaLabel: 'Interactive astronomical unit calculator',
  tocItems: AU_TOC_ITEMS,
  GuideArticle: AstronomicalUnitGuideArticle,
  faqs: AU_FAQS,
  countryRules: null,
};
