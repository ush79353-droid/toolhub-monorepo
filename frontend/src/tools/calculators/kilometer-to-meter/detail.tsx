import type { ToolPageDetail } from '@/tools/page-detail';
import { KilometerToMeterGuideArticle } from './KilometerToMeterGuideArticle';
import { KM_TO_M_FAQS, KM_TO_M_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert kilometers to meters and meters to kilometers instantly. Exact: 1 km = 1,000 m.',
  asideAriaLabel: 'Interactive kilometer to meter converter',
  tocItems: KM_TO_M_TOC_ITEMS,
  GuideArticle: KilometerToMeterGuideArticle,
  faqs: KM_TO_M_FAQS,
  countryRules: null,
};
