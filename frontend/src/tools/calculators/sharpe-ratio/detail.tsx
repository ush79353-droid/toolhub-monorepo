import type { ToolPageDetail } from '@/tools/page-detail';
import { SharpeRatioGuideArticle } from './SharpeRatioGuideArticle';
import { SHARPE_RATIO_FAQS, SHARPE_RATIO_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead: 'Measure excess return per unit of total volatility (standard deviation).',
  asideAriaLabel: 'Interactive Sharpe Ratio Calculator',
  tocItems: SHARPE_RATIO_TOC_ITEMS,
  GuideArticle: SharpeRatioGuideArticle,
  faqs: SHARPE_RATIO_FAQS,
  countryRules: null,
};
