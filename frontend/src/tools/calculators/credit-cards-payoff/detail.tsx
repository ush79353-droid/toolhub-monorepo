import type { ToolPageDetail } from '@/tools/page-detail';
import { CreditCardsPayoffGuideArticle } from './CreditCardsPayoffGuideArticle';
import {
  CREDIT_CARDS_PAYOFF_FAQS,
  CREDIT_CARDS_PAYOFF_TOC_ITEMS,
} from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Build a multi-card debt avalanche payoff schedule from monthly budget, balances, minimums, and APRs, with optimal order, total interest, and month-by-month payments.',
  asideAriaLabel: 'Interactive Credit Cards Payoff Calculator',
  tocItems: CREDIT_CARDS_PAYOFF_TOC_ITEMS,
  GuideArticle: CreditCardsPayoffGuideArticle,
  faqs: CREDIT_CARDS_PAYOFF_FAQS,
  countryRules: null,
};
