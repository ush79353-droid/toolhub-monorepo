import type { ToolPageDetail } from '@/tools/page-detail';
import { AutoLeaseGuideArticle } from './AutoLeaseGuideArticle';
import { AUTO_LEASE_FAQS, AUTO_LEASE_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Estimate auto lease payments from price, money factor or APR, residual value, and tax, or solve for the vehicle price that fits a monthly budget (USD).',
  asideAriaLabel: 'Interactive Auto Lease Calculator',
  tocItems: AUTO_LEASE_TOC_ITEMS,
  GuideArticle: AutoLeaseGuideArticle,
  faqs: AUTO_LEASE_FAQS,
  countryRules: null,
};
