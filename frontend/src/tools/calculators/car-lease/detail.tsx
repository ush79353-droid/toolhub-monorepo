import type { ToolPageDetail } from '@/tools/page-detail';
import { CarLeaseGuideArticle } from './CarLeaseGuideArticle';
import { CAR_LEASE_FAQS, CAR_LEASE_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Estimate net capitalized cost, residual value, and monthly lease payment with the money-factor model, independent FX on each money field, fees financed into cap cost, and sales tax applied monthly.',
  asideAriaLabel: 'Interactive Car Lease Calculator',
  tocItems: CAR_LEASE_TOC_ITEMS,
  GuideArticle: CarLeaseGuideArticle,
  faqs: CAR_LEASE_FAQS,
  countryRules: null,
};
