import type { ToolPageDetail } from '@/tools/page-detail';
import { BondConvexityGuideArticle } from './BondConvexityGuideArticle';
import { BOND_CONVEXITY_FAQS, BOND_CONVEXITY_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Estimate bond coupons, flat price at yield to maturity, and finite-difference convexity with independent FX on money fields.',
  asideAriaLabel: 'Interactive Bond Convexity Calculator',
  tocItems: BOND_CONVEXITY_TOC_ITEMS,
  GuideArticle: BondConvexityGuideArticle,
  faqs: BOND_CONVEXITY_FAQS,
  countryRules: null,
};
