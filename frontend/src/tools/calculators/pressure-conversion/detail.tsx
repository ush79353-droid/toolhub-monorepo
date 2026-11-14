import type { ToolPageDetail } from '@/tools/page-detail';
import { PressureConverterGuideArticle } from './PressureConverterGuideArticle';
import { PRESSURE_CONVERSION_FAQS, PRESSURE_CONVERSION_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert pressure among bar, psi, atmospheres, pascals, and more from one canonical pascal value.',
  asideAriaLabel: 'Interactive pressure conversion calculator',
  tocItems: PRESSURE_CONVERSION_TOC_ITEMS,
  GuideArticle: PressureConverterGuideArticle,
  faqs: PRESSURE_CONVERSION_FAQS,
  countryRules: null,
};
