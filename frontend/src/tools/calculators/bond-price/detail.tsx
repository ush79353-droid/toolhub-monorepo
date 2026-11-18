import type { ToolPageDetail } from '@/tools/page-detail';
import { BondPriceGuideArticle } from './BondPriceGuideArticle';
import { BOND_PRICE_FAQS, BOND_PRICE_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Price a bond from face value, coupon rate, payment frequency, years to maturity, and yield to maturity, with independent FX on money fields.',
  asideAriaLabel: 'Interactive Bond Price Calculator',
  tocItems: BOND_PRICE_TOC_ITEMS,
  GuideArticle: BondPriceGuideArticle,
  faqs: BOND_PRICE_FAQS,
  countryRules: null,
};
