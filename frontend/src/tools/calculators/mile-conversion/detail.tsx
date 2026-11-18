import type { ToolPageDetail } from '@/tools/page-detail';
import { MileConversionGuideArticle } from './MileConversionGuideArticle';
import { MILE_FAQS, MILE_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert statute miles to kilometers, meters, feet, yards, nautical miles, and more. Exact: 1 mile = 1.609344 km = 1609.344 m.',
  asideAriaLabel: 'Interactive mile conversion calculator',
  tocItems: MILE_TOC_ITEMS,
  GuideArticle: MileConversionGuideArticle,
  faqs: MILE_FAQS,
  countryRules: null,
};
