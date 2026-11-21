import type { ToolPageDetail } from '@/tools/page-detail';
import { ResidualIncomeGuideArticle } from './ResidualIncomeGuideArticle';
import { RI_FAQS, RI_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Calculate residual income from net income, equity capital, and cost of equity, including the equity charge and a clear positive/zero/negative interpretation.',
  asideAriaLabel: 'Interactive Residual Income Calculator',
  tocItems: RI_TOC_ITEMS,
  GuideArticle: ResidualIncomeGuideArticle,
  faqs: RI_FAQS,
  countryRules: null,
};
