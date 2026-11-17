import type { ToolPageDetail } from '@/tools/page-detail';
import { DebtToEquityGuideArticle } from './DebtToEquityGuideArticle';
import { DEBT_TO_EQUITY_FAQS, DEBT_TO_EQUITY_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    "Compute the debt to equity ratio as total liabilities divided by stockholders' equity, with real currency conversion when the two amounts use different currencies.",
  asideAriaLabel: 'Interactive Debt to Equity Calculator',
  tocItems: DEBT_TO_EQUITY_TOC_ITEMS,
  GuideArticle: DebtToEquityGuideArticle,
  faqs: DEBT_TO_EQUITY_FAQS,
  countryRules: null,
};
