import type { ToolPageDetail } from '@/tools/page-detail';
import { ForceConverterGuideArticle } from './ForceConverterGuideArticle';
import { FORCE_CONVERTER_FAQS, FORCE_CONVERTER_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert force among newtons, kilonewtons, dynes, pounds-force, kilograms-force, and more.',
  asideAriaLabel: 'Interactive force converter',
  tocItems: FORCE_CONVERTER_TOC_ITEMS,
  GuideArticle: ForceConverterGuideArticle,
  faqs: FORCE_CONVERTER_FAQS,
  countryRules: null,
};
