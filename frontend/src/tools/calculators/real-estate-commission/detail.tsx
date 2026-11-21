import type { ToolPageDetail } from '@/tools/page-detail';
import { RealEstateCommissionGuideArticle } from './RealEstateCommissionGuideArticle';
import {
  REAL_ESTATE_COMMISSION_FAQS,
  REAL_ESTATE_COMMISSION_TOC_ITEMS,
} from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Estimate brokerage commission and owner net proceeds from a house price and commission rate, with independent FX on each money field and no invented taxes or closing costs.',
  asideAriaLabel: 'Interactive Real Estate Commission Calculator',
  tocItems: REAL_ESTATE_COMMISSION_TOC_ITEMS,
  GuideArticle: RealEstateCommissionGuideArticle,
  faqs: REAL_ESTATE_COMMISSION_FAQS,
  countryRules: null,
};
