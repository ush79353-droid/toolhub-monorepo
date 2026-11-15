import type { ToolPageDetail } from '@/tools/page-detail';
import { EffectiveInterestRateGuideArticle } from './EffectiveInterestRateGuideArticle';
import { EFFECTIVE_INTEREST_RATE_FAQS, EFFECTIVE_INTEREST_RATE_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert a nominal annual interest rate into the periodic rate and effective interest rate (EIR).',
  asideAriaLabel: 'Interactive effective interest rate calculator',
  tocItems: EFFECTIVE_INTEREST_RATE_TOC_ITEMS,
  GuideArticle: EffectiveInterestRateGuideArticle,
  faqs: EFFECTIVE_INTEREST_RATE_FAQS,
  countryRules: null,
};
