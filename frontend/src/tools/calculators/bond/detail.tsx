import type { ToolPageDetail } from '@/tools/page-detail';
import { BondGuideArticle } from './BondGuideArticle';
import { BOND_FAQS, BOND_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Solve coupon-date bond price, face value, yield, maturity, or annual coupon in USD—leave exactly one variable blank.',
  asideAriaLabel: 'Interactive Bond Calculator',
  tocItems: BOND_TOC_ITEMS,
  GuideArticle: BondGuideArticle,
  faqs: BOND_FAQS,
  countryRules: null,
};
