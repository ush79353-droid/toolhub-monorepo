import type { ToolPageDetail } from '@/tools/page-detail';
import { RentalCommissionGuideArticle } from './RentalCommissionGuideArticle';
import { RENTAL_COMMISSION_FAQS, RENTAL_COMMISSION_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Estimate rental agent commission from annual or monthly rent, with preset month fractions and a custom percentage — independent FX on every money field.',
  asideAriaLabel: 'Interactive Rental Commission Calculator',
  tocItems: RENTAL_COMMISSION_TOC_ITEMS,
  GuideArticle: RentalCommissionGuideArticle,
  faqs: RENTAL_COMMISSION_FAQS,
  countryRules: null,
};
