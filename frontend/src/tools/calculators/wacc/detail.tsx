import type { ToolPageDetail } from '@/tools/page-detail';
import { WaccGuideArticle } from './WaccGuideArticle';
import { WACC_FAQS, WACC_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Calculate the weighted average cost of capital using the cost of equity, cost of debt, capital structure, and corporate tax rate.',
  asideAriaLabel: 'Interactive WACC Calculator',
  tocItems: WACC_TOC_ITEMS,
  GuideArticle: WaccGuideArticle,
  faqs: WACC_FAQS,
  countryRules: null,
};
