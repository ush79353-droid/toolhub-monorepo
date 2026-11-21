import type { ToolPageDetail } from '@/tools/page-detail';
import { MpcGuideArticle } from './MpcGuideArticle';
import { MPC_FAQS, MPC_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Calculate marginal propensity to consume (MPC) from changes in income and spending. Explore the consumption function, MPS, multiplier, and formulas.',
  asideAriaLabel: 'Interactive MPC Calculator',
  tocItems: MPC_TOC_ITEMS,
  GuideArticle: MpcGuideArticle,
  faqs: MPC_FAQS,
  countryRules: null,
};
