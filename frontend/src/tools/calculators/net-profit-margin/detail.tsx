import type { ToolPageDetail } from '@/tools/page-detail';
import { NetProfitMarginGuideArticle } from './NetProfitMarginGuideArticle';
import { NET_PROFIT_MARGIN_FAQS, NET_PROFIT_MARGIN_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Calculate net profit margin from net profit and total revenues, with real FX on each money field. Distinct from gross and operating margins.',
  asideAriaLabel: 'Interactive Net Profit Margin Calculator',
  tocItems: NET_PROFIT_MARGIN_TOC_ITEMS,
  GuideArticle: NetProfitMarginGuideArticle,
  faqs: NET_PROFIT_MARGIN_FAQS,
  countryRules: null,
};
