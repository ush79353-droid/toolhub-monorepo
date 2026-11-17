import type { ToolPageDetail } from '@/tools/page-detail';
import { ProratedRentGuideArticle } from './ProratedRentGuideArticle';
import { PRORATED_RENT_FAQS, PRORATED_RENT_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Estimate move-in or move-out rent using actual calendar days, with independent FX on rent and result.',
  asideAriaLabel: 'Interactive Prorated Rent Calculator',
  tocItems: PRORATED_RENT_TOC_ITEMS,
  GuideArticle: ProratedRentGuideArticle,
  faqs: PRORATED_RENT_FAQS,
  countryRules: null,
};
