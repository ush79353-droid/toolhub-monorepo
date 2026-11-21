import type { ToolPageDetail } from '@/tools/page-detail';
import { RetirementGuideArticle } from './RetirementGuideArticle';
import { RETIREMENT_FAQS, RETIREMENT_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Project savings to retirement with compound growth, estimate level income through life expectancy while returns continue, and compare total retirement income to cost of living. Currency changes formatting only.',
  asideAriaLabel: 'Interactive Retirement Calculator',
  tocItems: RETIREMENT_TOC_ITEMS,
  GuideArticle: RetirementGuideArticle,
  faqs: RETIREMENT_FAQS,
  countryRules: null,
};
