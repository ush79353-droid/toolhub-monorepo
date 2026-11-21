import type { ToolPageDetail } from '@/tools/page-detail';
import { LeaseMileageGuideArticle } from './LeaseMileageGuideArticle';
import { LEASE_MILEAGE_FAQS, LEASE_MILEAGE_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Project lease-end excess miles and the charge to set aside each month, with km/mi and independent FX on fee and cash results.',
  asideAriaLabel: 'Interactive Lease Mileage Calculator',
  tocItems: LEASE_MILEAGE_TOC_ITEMS,
  GuideArticle: LeaseMileageGuideArticle,
  faqs: LEASE_MILEAGE_FAQS,
  countryRules: null,
};
