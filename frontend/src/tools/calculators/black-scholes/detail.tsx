import type { ToolPageDetail } from '@/tools/page-detail';
import { BlackScholesGuideArticle } from './BlackScholesGuideArticle';
import { BLACK_SCHOLES_FAQS, BLACK_SCHOLES_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Price European call and put options with the dividend-adjusted Black–Scholes–Merton model. Enter spot, strike, time, yield, volatility, and the risk-free rate.',
  asideAriaLabel: 'Interactive Black Scholes Calculator',
  tocItems: BLACK_SCHOLES_TOC_ITEMS,
  GuideArticle: BlackScholesGuideArticle,
  faqs: BLACK_SCHOLES_FAQS,
  countryRules: null,
};
