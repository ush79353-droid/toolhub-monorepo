import type { ToolPageDetail } from '@/tools/page-detail';
import { FinancialLeverageRatioGuideArticle } from './FinancialLeverageRatioGuideArticle';
import {
  FINANCIAL_LEVERAGE_RATIO_FAQS,
  FINANCIAL_LEVERAGE_RATIO_TOC_ITEMS,
} from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Calculate the equity multiplier — Financial leverage = Total assets ÷ Total equity — from current assets, non-current assets, and total equity.',
  asideAriaLabel: 'Interactive Financial Leverage Ratio Calculator',
  tocItems: FINANCIAL_LEVERAGE_RATIO_TOC_ITEMS,
  GuideArticle: FinancialLeverageRatioGuideArticle,
  faqs: FINANCIAL_LEVERAGE_RATIO_FAQS,
  countryRules: null,
};
