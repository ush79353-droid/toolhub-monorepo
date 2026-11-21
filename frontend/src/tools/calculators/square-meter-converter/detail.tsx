import type { ToolPageDetail } from '@/tools/page-detail';
import { SquareMeterConverterGuideArticle } from './SquareMeterConverterGuideArticle';
import { M2_CONVERTER_FAQS, M2_CONVERTER_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert square meters to square feet, acres, hectares, inches, and more; edit any unit, all stay linked.',
  asideAriaLabel: 'Interactive square meter area converter',
  tocItems: M2_CONVERTER_TOC_ITEMS,
  GuideArticle: SquareMeterConverterGuideArticle,
  faqs: M2_CONVERTER_FAQS,
  countryRules: null,
};
