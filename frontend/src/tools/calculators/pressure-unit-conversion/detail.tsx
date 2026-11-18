import type { ToolPageDetail } from '@/tools/page-detail';
import { PressureUnitConversionGuideArticle } from './PressureUnitConversionGuideArticle';
import { PRESSURE_UNIT_FAQS, PRESSURE_UNIT_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert pressure between Pa, kPa, bar, psi, atm, Torr, mmHg, and more. Exact SI and conventional factors via Pascals.',
  asideAriaLabel: 'Interactive pressure unit conversion calculator',
  tocItems: PRESSURE_UNIT_TOC_ITEMS,
  GuideArticle: PressureUnitConversionGuideArticle,
  faqs: PRESSURE_UNIT_FAQS,
  countryRules: null,
};
