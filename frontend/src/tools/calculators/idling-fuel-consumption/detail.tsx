import type { ToolPageDetail } from '@/tools/page-detail';
import { IdlingFuelGuideArticle } from './IdlingFuelGuideArticle';
import { IDLING_FAQS, IDLING_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Estimate petrol or diesel fuel burned while idling from engine size or a custom rate, then calculate fuel used and cost for any duration.',
  asideAriaLabel: 'Interactive Idling Fuel Consumption Calculator',
  tocItems: IDLING_TOC_ITEMS,
  GuideArticle: IdlingFuelGuideArticle,
  faqs: IDLING_FAQS,
  countryRules: null,
};
