import type { ToolPageDetail } from '@/tools/page-detail';
import { AFFOGuideArticle } from './AFFOGuideArticle';
import { AFFO_FAQS, AFFO_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Estimate simplified funds from operations and a labeled AFFO bridge for one reporting period. The result is not a Nareit filing and not cash available to distribute.',
  asideAriaLabel: 'Interactive AFFO calculator',
  tocItems: AFFO_TOC_ITEMS,
  GuideArticle: AFFOGuideArticle,
  faqs: AFFO_FAQS,
  countryRules: null,
};
