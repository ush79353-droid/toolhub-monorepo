import type { ToolPageDetail } from '@/tools/page-detail';
import { BondCurrentYieldGuideArticle } from './BondCurrentYieldGuideArticle';
import {
  BOND_CURRENT_YIELD_FAQS,
  BOND_CURRENT_YIELD_TOC_ITEMS,
} from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Compute annual coupon, coupon per period, and current yield from face value, coupon rate, frequency, and bond price, with independent FX on money fields. Not yield to maturity.',
  asideAriaLabel: 'Interactive Bond Current Yield Calculator',
  tocItems: BOND_CURRENT_YIELD_TOC_ITEMS,
  GuideArticle: BondCurrentYieldGuideArticle,
  faqs: BOND_CURRENT_YIELD_FAQS,
  countryRules: null,
};
