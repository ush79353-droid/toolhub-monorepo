import type { ToolPageDetail } from '@/tools/page-detail';
import { RealtorCommissionVatGuideArticle } from './RealtorCommissionVatGuideArticle';
import {
  REALTOR_COMMISSION_VAT_FAQS,
  REALTOR_COMMISSION_VAT_TOC_ITEMS,
} from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Estimate VAT-exclusive realtor commission on a house price: net fee, VAT on the fee, commission gross, and owner proceeds, with independent FX on money fields.',
  asideAriaLabel: 'Interactive Realtor Commission Calculator with VAT',
  tocItems: REALTOR_COMMISSION_VAT_TOC_ITEMS,
  GuideArticle: RealtorCommissionVatGuideArticle,
  faqs: REALTOR_COMMISSION_VAT_FAQS,
  countryRules: null,
};
