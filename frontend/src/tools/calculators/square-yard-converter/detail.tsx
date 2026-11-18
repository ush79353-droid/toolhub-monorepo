import type { ToolPageDetail } from '@/tools/page-detail';
import { SquareYardConverterGuideArticle } from './SquareYardConverterGuideArticle';
import { YD2_CONVERTER_FAQS, YD2_CONVERTER_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert square yards to square feet, square meters, acres, and more — edit any unit, all stay linked.',
  asideAriaLabel: 'Interactive square yard area converter',
  tocItems: YD2_CONVERTER_TOC_ITEMS,
  GuideArticle: SquareYardConverterGuideArticle,
  faqs: YD2_CONVERTER_FAQS,
  countryRules: null,
};
