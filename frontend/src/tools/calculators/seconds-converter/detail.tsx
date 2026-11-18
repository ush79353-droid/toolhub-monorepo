import type { ToolPageDetail } from '@/tools/page-detail';
import { SecondsConverterGuideArticle } from './SecondsConverterGuideArticle';
import { SECONDS_CONVERTER_FAQS, SECONDS_CONVERTER_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert seconds to minutes, hours, days, weeks, months, and years — and reverse any unit.',
  asideAriaLabel: 'Interactive seconds converter',
  tocItems: SECONDS_CONVERTER_TOC_ITEMS,
  GuideArticle: SecondsConverterGuideArticle,
  faqs: SECONDS_CONVERTER_FAQS,
  countryRules: null,
};
