import type { ToolPageDetail } from '@/tools/page-detail';
import { BillionToTrillionGuideArticle } from './BillionToTrillionGuideArticle';
import { BILLION_TRILLION_FAQS, BILLION_TRILLION_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert billions to trillions and back with short-scale definitions and scientific notation.',
  asideAriaLabel: 'Interactive billion to trillion converter',
  tocItems: BILLION_TRILLION_TOC_ITEMS,
  GuideArticle: BillionToTrillionGuideArticle,
  faqs: BILLION_TRILLION_FAQS,
  countryRules: null,
};
