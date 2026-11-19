import type { ToolPageDetail } from '@/tools/page-detail';
import { CommercialLeaseGuideArticle } from './CommercialLeaseGuideArticle';
import { COMMERCIAL_LEASE_FAQS, COMMERCIAL_LEASE_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Estimate commercial rent from area, base rate, and operating expenses, plus an optional agent fee — with independent FX on every money field.',
  asideAriaLabel: 'Interactive Commercial Lease Calculator',
  tocItems: COMMERCIAL_LEASE_TOC_ITEMS,
  GuideArticle: CommercialLeaseGuideArticle,
  faqs: COMMERCIAL_LEASE_FAQS,
  countryRules: null,
};
