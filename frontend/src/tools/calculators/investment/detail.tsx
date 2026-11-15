import type { ToolPageDetail } from '@/tools/page-detail';
import { InvestmentGuideArticle } from './InvestmentGuideArticle';
import { INVESTMENT_FAQS, INVESTMENT_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Project your investment’s final balance, earned return, and annual growth with compounding, contributions, and optional inflation.',
  asideAriaLabel: 'Interactive investment calculator',
  tocItems: INVESTMENT_TOC_ITEMS,
  GuideArticle: InvestmentGuideArticle,
  faqs: INVESTMENT_FAQS,
  countryRules: null,
};
