import type { ToolPageDetail } from '@/tools/page-detail';
import { EarnestMoneyGuideArticle } from './EarnestMoneyGuideArticle';
import { EARNEST_MONEY_FAQS, EARNEST_MONEY_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Estimate an earnest money deposit from property price and percentage, or reverse-solve percentage or purchase price, with clear one-way calculation modes and denomination-only currency display.',
  asideAriaLabel: 'Interactive Earnest Money Calculator',
  tocItems: EARNEST_MONEY_TOC_ITEMS,
  GuideArticle: EarnestMoneyGuideArticle,
  faqs: EARNEST_MONEY_FAQS,
  countryRules: null,
};
