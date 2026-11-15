import type { ToolPageDetail } from '@/tools/page-detail';
import { CUBIC_METER_FAQS, CUBIC_METER_TOC_ITEMS } from './content';
import { CubicMeterGuideArticle } from './CubicMeterGuideArticle';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Calculate cubic meters from height, length, and width, and convert between cubic meters, cubic feet, liters, and more.',
  asideAriaLabel: 'Interactive cubic meter calculator',
  tocItems: CUBIC_METER_TOC_ITEMS,
  GuideArticle: CubicMeterGuideArticle,
  faqs: CUBIC_METER_FAQS,
  countryRules: null,
};
