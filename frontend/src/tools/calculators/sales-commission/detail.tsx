import type { ToolPageDetail } from '@/tools/page-detail';
import { SalesCommissionGuideArticle } from './SalesCommissionGuideArticle';
import { SALES_COMMISSION_FAQS, SALES_COMMISSION_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Model sales commission from gross sales, profit, quota, or margin-based thresholds, then see labor cost and operating profit for the period.',
  asideAriaLabel: 'Interactive sales commission calculator',
  tocItems: SALES_COMMISSION_TOC_ITEMS,
  GuideArticle: SalesCommissionGuideArticle,
  faqs: SALES_COMMISSION_FAQS,
  countryRules: null,
};
