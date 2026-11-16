import type { ToolPageDetail } from '@/tools/page-detail';
import { BarometricPressureGuideArticle } from './BarometricPressureGuideArticle';
import { BAROMETRIC_PRESSURE_FAQS, BAROMETRIC_PRESSURE_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert barometric pressure between atmospheres, bar, pascals, psi, hectopascals, millibars, and more with exact SI-linked factors.',
  asideAriaLabel: 'Interactive barometric pressure conversion calculator',
  tocItems: BAROMETRIC_PRESSURE_TOC_ITEMS,
  GuideArticle: BarometricPressureGuideArticle,
  faqs: BAROMETRIC_PRESSURE_FAQS,
  countryRules: null,
};
