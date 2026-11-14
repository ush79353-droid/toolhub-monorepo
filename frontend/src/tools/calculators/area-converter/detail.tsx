import type { ToolPageDetail } from '@/tools/page-detail';
import { AreaConverterGuideArticle } from './AreaConverterGuideArticle';
import { AREA_CONVERTER_FAQS, AREA_CONVERTER_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert area among square meters, square feet, acres, hectares, and 11 other metric and imperial units.',
  asideAriaLabel: 'Interactive area converter',
  tocItems: AREA_CONVERTER_TOC_ITEMS,
  GuideArticle: AreaConverterGuideArticle,
  faqs: AREA_CONVERTER_FAQS,
  countryRules: null,
};
