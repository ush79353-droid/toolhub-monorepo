import type { ToolPageDetail } from '@/tools/page-detail';
import { SafetyStockGuideArticle } from './SafetyStockGuideArticle';
import { SAFETY_STOCK_FAQS, SAFETY_STOCK_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Estimate basic safety stock and reorder point from max and average daily usage and lead times in days.',
  asideAriaLabel: 'Interactive safety stock calculator',
  tocItems: SAFETY_STOCK_TOC_ITEMS,
  GuideArticle: SafetyStockGuideArticle,
  faqs: SAFETY_STOCK_FAQS,
  countryRules: null,
};
