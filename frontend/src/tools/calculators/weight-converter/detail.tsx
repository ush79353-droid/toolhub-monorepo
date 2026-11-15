import type { ToolPageDetail } from '@/tools/page-detail';
import { WeightConverterGuideArticle } from './WeightConverterGuideArticle';
import { WEIGHT_CONVERTER_FAQS, WEIGHT_CONVERTER_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert mass among kilograms, grams, pounds, ounces, stones, tonnes, and troy ounces.',
  asideAriaLabel: 'Interactive weight converter',
  tocItems: WEIGHT_CONVERTER_TOC_ITEMS,
  GuideArticle: WeightConverterGuideArticle,
  faqs: WEIGHT_CONVERTER_FAQS,
  countryRules: null,
};
