import type { ToolPageDetail } from '@/tools/page-detail';
import { ExpectedUtilityGuideArticle } from './ExpectedUtilityGuideArticle';
import { EXPECTED_UTILITY_FAQS, EXPECTED_UTILITY_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Compute two-event expected utility under a risk-neutral linear utility assumption U(x) = x.',
  asideAriaLabel: 'Interactive expected utility calculator',
  tocItems: EXPECTED_UTILITY_TOC_ITEMS,
  GuideArticle: ExpectedUtilityGuideArticle,
  faqs: EXPECTED_UTILITY_FAQS,
  countryRules: null,
};
