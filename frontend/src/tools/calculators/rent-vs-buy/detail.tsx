import type { ToolPageDetail } from '@/tools/page-detail';
import { RentVsBuyGuideArticle } from './RentVsBuyGuideArticle';
import { RENT_VS_BUY_FAQS, RENT_VS_BUY_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Compare renting versus buying over your staying period, with mortgage amortization, appreciation, commissions, and real FX on money fields.',
  asideAriaLabel: 'Interactive Rent vs. Buy Calculator',
  tocItems: RENT_VS_BUY_TOC_ITEMS,
  GuideArticle: RentVsBuyGuideArticle,
  faqs: RENT_VS_BUY_FAQS,
  countryRules: null,
};
