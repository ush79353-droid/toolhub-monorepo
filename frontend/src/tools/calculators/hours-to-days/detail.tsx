import type { ToolPageDetail } from '@/tools/page-detail';
import { HoursToDaysGuideArticle } from './HoursToDaysGuideArticle';
import { HOURS_TO_DAYS_FAQS, HOURS_TO_DAYS_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert hours to days instantly (and days back to hours) with accurate formulas, examples, and a conversion table.',
  asideAriaLabel: 'Interactive hours to days calculator',
  tocItems: HOURS_TO_DAYS_TOC_ITEMS,
  GuideArticle: HoursToDaysGuideArticle,
  faqs: HOURS_TO_DAYS_FAQS,
  countryRules: null,
};
