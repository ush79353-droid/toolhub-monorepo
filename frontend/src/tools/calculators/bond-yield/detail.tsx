import type { ToolPageDetail } from '@/tools/page-detail';
import { BondYieldGuideArticle } from './BondYieldGuideArticle';
import { BOND_YIELD_FAQS, BOND_YIELD_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Solve bond yield to maturity from face value, clean price, coupon rate, payment frequency, and years to maturity, with independent FX on money fields.',
  asideAriaLabel: 'Interactive Bond Yield Calculator',
  tocItems: BOND_YIELD_TOC_ITEMS,
  GuideArticle: BondYieldGuideArticle,
  faqs: BOND_YIELD_FAQS,
  countryRules: null,
};
