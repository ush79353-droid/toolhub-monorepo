import type { ToolPageDetail } from '@/tools/page-detail';
import { InvestmentFeeGuideArticle } from './InvestmentFeeGuideArticle';
import { INVESTMENT_FEE_FAQS, INVESTMENT_FEE_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'See how sales loads, operating fees, turnover, and redemption charges reduce long-term fund value.',
  asideAriaLabel: 'Interactive Investment Fee Calculator',
  tocItems: INVESTMENT_FEE_TOC_ITEMS,
  GuideArticle: InvestmentFeeGuideArticle,
  faqs: INVESTMENT_FEE_FAQS,
  countryRules: null,
};
