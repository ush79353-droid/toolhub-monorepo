import type { ToolPageDetail } from '@/tools/page-detail';
import { EquivalentRateGuideArticle } from './EquivalentRateGuideArticle';
import { EQUIVALENT_RATE_FAQS, EQUIVALENT_RATE_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert a nominal interest rate between compounding frequencies and show the matching AER.',
  asideAriaLabel: 'Interactive Equivalent Rate Calculator – AER',
  tocItems: EQUIVALENT_RATE_TOC_ITEMS,
  GuideArticle: EquivalentRateGuideArticle,
  faqs: EQUIVALENT_RATE_FAQS,
  countryRules: null,
};
