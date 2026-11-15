import type { ToolPageDetail } from '@/tools/page-detail';
import { LightYearConversionGuideArticle } from './LightYearConversionGuideArticle';
import { LIGHT_YEAR_FAQS, LIGHT_YEAR_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert light-years to kilometers, miles, meters, astronomical units, and parsecs using Julian-year and IAU definitions.',
  asideAriaLabel: 'Interactive light year conversion calculator',
  tocItems: LIGHT_YEAR_TOC_ITEMS,
  GuideArticle: LightYearConversionGuideArticle,
  faqs: LIGHT_YEAR_FAQS,
  countryRules: null,
};
