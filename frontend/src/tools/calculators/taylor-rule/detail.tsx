import type { ToolPageDetail } from '@/tools/page-detail';
import { TaylorRuleGuideArticle } from './TaylorRuleGuideArticle';
import { TAYLOR_RULE_FAQS, TAYLOR_RULE_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Calculate a benchmark central bank policy interest rate using the Taylor rule. Enter inflation, target inflation, actual GDP, potential GDP, and the neutral real interest rate to estimate a rule-based nominal interest rate.',
  asideAriaLabel: 'Interactive Taylor Rule Calculator',
  tocItems: TAYLOR_RULE_TOC_ITEMS,
  GuideArticle: TaylorRuleGuideArticle,
  faqs: TAYLOR_RULE_FAQS,
  countryRules: null,
};
