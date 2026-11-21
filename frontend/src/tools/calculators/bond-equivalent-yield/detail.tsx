import type { ToolPageDetail } from '@/tools/page-detail';
import { BondEquivalentYieldGuideArticle } from './BondEquivalentYieldGuideArticle';
import {
  BOND_EQUIVALENT_YIELD_FAQS,
  BOND_EQUIVALENT_YIELD_TOC_ITEMS,
} from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Compute investment-basis bond equivalent yield from bond price, face value, and days to maturity, with independent FX on money fields. Uses a 365-day year; not bank discount yield, YTM, or current yield.',
  asideAriaLabel: 'Interactive Bond Equivalent Yield Calculator',
  tocItems: BOND_EQUIVALENT_YIELD_TOC_ITEMS,
  GuideArticle: BondEquivalentYieldGuideArticle,
  faqs: BOND_EQUIVALENT_YIELD_FAQS,
  countryRules: null,
};
