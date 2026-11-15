import type { ToolPageDetail } from '@/tools/page-detail';
import { MutualFundGuideArticle } from './MutualFundGuideArticle';
import { MUTUAL_FUND_FAQS, MUTUAL_FUND_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Project SIP or lump-sum mutual fund maturity with monthly compounding and an expected annual return.',
  asideAriaLabel: 'Interactive Mutual Fund Calculator',
  tocItems: MUTUAL_FUND_TOC_ITEMS,
  GuideArticle: MutualFundGuideArticle,
  faqs: MUTUAL_FUND_FAQS,
  countryRules: null,
};
