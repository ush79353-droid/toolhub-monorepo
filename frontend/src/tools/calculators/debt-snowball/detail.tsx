import type { ToolPageDetail } from '@/tools/page-detail';
import { DebtSnowballGuideArticle } from './DebtSnowballGuideArticle';
import { DEBT_SNOWBALL_FAQS, DEBT_SNOWBALL_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Compare minimum, snowball, and avalanche payoff plans with independent FX on every money field.',
  asideAriaLabel: 'Interactive Debt Snowball Calculator',
  tocItems: DEBT_SNOWBALL_TOC_ITEMS,
  GuideArticle: DebtSnowballGuideArticle,
  faqs: DEBT_SNOWBALL_FAQS,
  countryRules: null,
};
