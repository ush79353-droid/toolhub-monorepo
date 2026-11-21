import type { ToolPageDetail } from '@/tools/page-detail';
import { BondYtmGuideArticle } from './BondYtmGuideArticle';
import { BOND_YTM_FAQS, BOND_YTM_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Solve bond yield to maturity from face value, clean price, coupon rate, payment frequency, and years to maturity, with independent FX on money fields.',
  asideAriaLabel: 'Interactive Bond YTM Calculator',
  tocItems: BOND_YTM_TOC_ITEMS,
  GuideArticle: BondYtmGuideArticle,
  faqs: BOND_YTM_FAQS,
  countryRules: null,
};
