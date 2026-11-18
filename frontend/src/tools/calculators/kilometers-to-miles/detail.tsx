import type { ToolPageDetail } from '@/tools/page-detail';
import { KilometersToMilesGuideArticle } from './KilometersToMilesGuideArticle';
import { KM_TO_MI_FAQS, KM_TO_MI_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert kilometers to miles and miles to kilometers instantly. Exact: 1 mi = 1.609344 km.',
  asideAriaLabel: 'Interactive kilometers to miles calculator',
  tocItems: KM_TO_MI_TOC_ITEMS,
  GuideArticle: KilometersToMilesGuideArticle,
  faqs: KM_TO_MI_FAQS,
  countryRules: null,
};
