import type { ToolPageDetail } from '@/tools/page-detail';
import { HourConverterGuideArticle } from './HourConverterGuideArticle';
import { HOUR_CONVERTER_FAQS, HOUR_CONVERTER_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert hours to minutes, seconds, days, weeks, months, and years instantly with accurate formulas and compound HMS support.',
  asideAriaLabel: 'Interactive hour converter',
  tocItems: HOUR_CONVERTER_TOC_ITEMS,
  GuideArticle: HourConverterGuideArticle,
  faqs: HOUR_CONVERTER_FAQS,
  countryRules: null,
};
