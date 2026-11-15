import type { ToolPageDetail } from '@/tools/page-detail';
import { FIVE_TWENTY_NINE_FAQS, FIVE_TWENTY_NINE_TOC_ITEMS } from './content';
import { FiveTwentyNineGuideArticle } from './FiveTwentyNineGuideArticle';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Project a 529 balance, future education costs, and the monthly contribution that could fund college. An estimate, not tax advice.',
  asideAriaLabel: 'Interactive 529 college savings plan calculator',
  tocItems: FIVE_TWENTY_NINE_TOC_ITEMS,
  GuideArticle: FiveTwentyNineGuideArticle,
  faqs: FIVE_TWENTY_NINE_FAQS,
  countryRules: null,
};
