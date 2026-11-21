import type { ToolPageDetail } from '@/tools/page-detail';
import { DART_FAQS, DART_TOC_ITEMS } from './content';
import { DartRateGuideArticle } from './DartRateGuideArticle';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Calculate the OSHA DART incidence rate from qualifying days-away, restricted, or transferred cases and actual employee hours worked; (N × 200,000) ÷ hours.',
  asideAriaLabel: 'DART Rate Calculator guide',
  tocItems: DART_TOC_ITEMS,
  GuideArticle: DartRateGuideArticle,
  faqs: DART_FAQS,
  countryRules: null,
};
