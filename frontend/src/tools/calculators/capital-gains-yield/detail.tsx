import type { ToolPageDetail } from '@/tools/page-detail';
import { CapitalGainsYieldGuideArticle } from './CapitalGainsYieldGuideArticle';
import { CAPITAL_GAINS_YIELD_FAQS, CAPITAL_GAINS_YIELD_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Calculate capital gains and capital gains yield from bought price and current price.',
  asideAriaLabel: 'Interactive Capital Gains Yield Calculator',
  tocItems: CAPITAL_GAINS_YIELD_TOC_ITEMS,
  GuideArticle: CapitalGainsYieldGuideArticle,
  faqs: CAPITAL_GAINS_YIELD_FAQS,
  countryRules: null,
};
