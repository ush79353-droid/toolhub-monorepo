import type { ToolPageDetail } from '@/tools/page-detail';
import { MortgagePointsGuideArticle } from './MortgagePointsGuideArticle';
import { MORTGAGE_POINTS_FAQS, MORTGAGE_POINTS_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Compare two mortgage-points options against a baseline rate—monthly savings, break-even, interest, and balances with real FX.',
  asideAriaLabel: 'Interactive Mortgage Points Calculator',
  tocItems: MORTGAGE_POINTS_TOC_ITEMS,
  GuideArticle: MortgagePointsGuideArticle,
  faqs: MORTGAGE_POINTS_FAQS,
  countryRules: null,
};
