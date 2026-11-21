import type { ToolPageDetail } from '@/tools/page-detail';
import { CentsToDollarsGuideArticle } from './CentsToDollarsGuideArticle';
import { CENTS_TO_DOLLARS_FAQS, CENTS_TO_DOLLARS_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert US cents to dollars and dollars to cents instantly. 100 cents = $1; no foreign exchange rates.',
  asideAriaLabel: 'Interactive cents to dollars calculator',
  tocItems: CENTS_TO_DOLLARS_TOC_ITEMS,
  GuideArticle: CentsToDollarsGuideArticle,
  faqs: CENTS_TO_DOLLARS_FAQS,
  countryRules: null,
};
