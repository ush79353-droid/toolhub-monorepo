import type { ToolPageDetail } from '@/tools/page-detail';
import { HeightConverterGuideArticle } from './HeightConverterGuideArticle';
import { HEIGHT_CONVERTER_FAQS, HEIGHT_CONVERTER_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert height between centimeters, meters, feet, and inches instantly for accurate metric and imperial measurements.',
  asideAriaLabel: 'Interactive height converter',
  tocItems: HEIGHT_CONVERTER_TOC_ITEMS,
  GuideArticle: HeightConverterGuideArticle,
  faqs: HEIGHT_CONVERTER_FAQS,
  countryRules: null,
};
