import type { ToolPageDetail } from '@/tools/page-detail';
import { QuartersToDollarsGuideArticle } from './QuartersToDollarsGuideArticle';
import { QUARTERS_TO_DOLLARS_FAQS, QUARTERS_TO_DOLLARS_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert U.S. quarters to dollars and dollars to quarters. 1 quarter = $0.25 · 4 quarters = $1.',
  asideAriaLabel: 'Interactive quarters to dollars calculator',
  tocItems: QUARTERS_TO_DOLLARS_TOC_ITEMS,
  GuideArticle: QuartersToDollarsGuideArticle,
  faqs: QUARTERS_TO_DOLLARS_FAQS,
  countryRules: null,
};
