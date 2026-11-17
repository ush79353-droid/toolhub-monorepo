import type { ToolPageDetail } from '@/tools/page-detail';
import { RentOrBuyGuideArticle } from './RentOrBuyGuideArticle';
import { RENT_OR_BUY_FAQS, RENT_OR_BUY_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Compare renting versus buying over your staying period — with mortgage amortization, appreciation, commissions, and real FX on money fields.',
  asideAriaLabel: 'Interactive Rent or Buy Calculator',
  tocItems: RENT_OR_BUY_TOC_ITEMS,
  GuideArticle: RentOrBuyGuideArticle,
  faqs: RENT_OR_BUY_FAQS,
  countryRules: null,
};
