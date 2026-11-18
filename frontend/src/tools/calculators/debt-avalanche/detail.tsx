import type { ToolPageDetail } from '@/tools/page-detail';
import { DebtAvalancheGuideArticle } from './DebtAvalancheGuideArticle';
import { DEBT_AVALANCHE_FAQS, DEBT_AVALANCHE_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Compare minimum-payment repayment with the debt avalanche method to estimate interest savings and an earlier payoff.',
  asideAriaLabel: 'Interactive Debt Avalanche Calculator',
  tocItems: DEBT_AVALANCHE_TOC_ITEMS,
  GuideArticle: DebtAvalancheGuideArticle,
  faqs: DEBT_AVALANCHE_FAQS,
  countryRules: null,
};
