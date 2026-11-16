import type { ToolPageDetail } from '@/tools/page-detail';
import { MeterToMileGuideArticle } from './MeterToMileGuideArticle';
import { METER_TO_MILE_FAQS, METER_TO_MILE_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert meters to miles and miles to meters instantly using the exact international statute mile (1 mi = 1609.344 m).',
  asideAriaLabel: 'Interactive meter to mile converter',
  tocItems: METER_TO_MILE_TOC_ITEMS,
  GuideArticle: MeterToMileGuideArticle,
  faqs: METER_TO_MILE_FAQS,
  countryRules: null,
};
