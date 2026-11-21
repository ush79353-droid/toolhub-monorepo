import type { ToolPageDetail } from '@/tools/page-detail';
import { EconomicProfitGuideArticle } from './EconomicProfitGuideArticle';
import { ECONOMIC_PROFIT_FAQS, ECONOMIC_PROFIT_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Estimate economic profit from total revenue, explicit costs, and implicit (opportunity) costs, with real FX on every money field.',
  asideAriaLabel: 'Interactive Economic Profit Calculator',
  tocItems: ECONOMIC_PROFIT_TOC_ITEMS,
  GuideArticle: EconomicProfitGuideArticle,
  faqs: ECONOMIC_PROFIT_FAQS,
  countryRules: null,
};
