import type { ToolPageDetail } from '@/tools/page-detail';
import { NickelsToDollarsGuideArticle } from './NickelsToDollarsGuideArticle';
import { NICKELS_TO_DOLLARS_FAQS, NICKELS_TO_DOLLARS_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert U.S. nickels to dollars and dollars to nickels. 1 nickel = $0.05 · 20 nickels = $1.',
  asideAriaLabel: 'Interactive nickels to dollars calculator',
  tocItems: NICKELS_TO_DOLLARS_TOC_ITEMS,
  GuideArticle: NickelsToDollarsGuideArticle,
  faqs: NICKELS_TO_DOLLARS_FAQS,
  countryRules: null,
};
