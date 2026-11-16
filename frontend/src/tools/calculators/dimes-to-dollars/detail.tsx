import type { ToolPageDetail } from '@/tools/page-detail';
import { DimesToDollarsGuideArticle } from './DimesToDollarsGuideArticle';
import { DIMES_TO_DOLLARS_FAQS, DIMES_TO_DOLLARS_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert U.S. dimes to dollars and dollars to dimes. 1 dime = $0.10 · 10 dimes = $1.',
  asideAriaLabel: 'Interactive dimes to dollars calculator',
  tocItems: DIMES_TO_DOLLARS_TOC_ITEMS,
  GuideArticle: DimesToDollarsGuideArticle,
  faqs: DIMES_TO_DOLLARS_FAQS,
  countryRules: null,
};
