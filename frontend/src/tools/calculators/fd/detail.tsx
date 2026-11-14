import type { ToolPageDetail } from '@/tools/page-detail';
import { FdGuideArticle } from './FdGuideArticle';
import { FD_FAQS, FD_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Estimate fixed deposit maturity, interest, and payouts for simple or cumulative deposits.',
  asideAriaLabel: 'Interactive fixed deposit calculator',
  tocItems: FD_TOC_ITEMS,
  GuideArticle: FdGuideArticle,
  faqs: FD_FAQS,
  countryRules: null,
};
