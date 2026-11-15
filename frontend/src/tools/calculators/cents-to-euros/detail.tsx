import type { ToolPageDetail } from '@/tools/page-detail';
import { CentsToEurosGuideArticle } from './CentsToEurosGuideArticle';
import { CENTS_EUROS_FAQS, CENTS_EUROS_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert euro cents to euros and euros to cents with the exact fixed factor of 100.',
  asideAriaLabel: 'Interactive cents to euros calculator',
  tocItems: CENTS_EUROS_TOC_ITEMS,
  GuideArticle: CentsToEurosGuideArticle,
  faqs: CENTS_EUROS_FAQS,
  countryRules: null,
};
