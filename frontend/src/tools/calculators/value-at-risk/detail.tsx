import type { ToolPageDetail } from '@/tools/page-detail';
import { ValueAtRiskGuideArticle } from './ValueAtRiskGuideArticle';
import { VALUE_AT_RISK_FAQS, VALUE_AT_RISK_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Estimate parametric Value at Risk from portfolio value, daily volatility, expected return, and horizon.',
  asideAriaLabel: 'Interactive Value at Risk calculator',
  tocItems: VALUE_AT_RISK_TOC_ITEMS,
  GuideArticle: ValueAtRiskGuideArticle,
  faqs: VALUE_AT_RISK_FAQS,
  countryRules: null,
};
