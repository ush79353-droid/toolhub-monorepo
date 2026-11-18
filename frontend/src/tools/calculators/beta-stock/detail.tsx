import type { ToolPageDetail } from '@/tools/page-detail';
import { BetaStockGuideArticle } from './BetaStockGuideArticle';
import { BETA_STOCK_FAQS, BETA_STOCK_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Estimate stock beta from chronological asset and benchmark prices using return covariance.',
  asideAriaLabel: 'Interactive Beta Stock Calculator',
  tocItems: BETA_STOCK_TOC_ITEMS,
  GuideArticle: BetaStockGuideArticle,
  faqs: BETA_STOCK_FAQS,
  countryRules: null,
};
