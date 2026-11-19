import type { ToolPageDetail } from '@/tools/page-detail';
import { LeaseGuideArticle } from './LeaseGuideArticle';
import { LEASE_FAQS, LEASE_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Estimate lease monthly payments, total interest, and cost to own from product value, residual, term, and rate.',
  asideAriaLabel: 'Interactive Lease Calculator',
  tocItems: LEASE_TOC_ITEMS,
  GuideArticle: LeaseGuideArticle,
  faqs: LEASE_FAQS,
  countryRules: null,
};
