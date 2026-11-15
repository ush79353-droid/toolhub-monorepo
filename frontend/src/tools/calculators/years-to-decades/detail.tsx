import type { ToolPageDetail } from '@/tools/page-detail';
import { YearsToDecadesGuideArticle } from './YearsToDecadesGuideArticle';
import { YEARS_DECADES_FAQS, YEARS_DECADES_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert years to decades and back. One decade is exactly 10 years — duration, not a named calendar decade.',
  asideAriaLabel: 'Interactive years to decades calculator',
  tocItems: YEARS_DECADES_TOC_ITEMS,
  GuideArticle: YearsToDecadesGuideArticle,
  faqs: YEARS_DECADES_FAQS,
  countryRules: null,
};
