import type { ToolPageDetail } from '@/tools/page-detail';
import { LaborCostGuideArticle } from './LaborCostGuideArticle';
import { LABOR_COST_FAQS, LABOR_COST_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead: 'Estimate annual and hourly labor cost including paid time off and extras.',
  asideAriaLabel: 'Interactive Labor Cost Calculator',
  tocItems: LABOR_COST_TOC_ITEMS,
  GuideArticle: LaborCostGuideArticle,
  faqs: LABOR_COST_FAQS,
  countryRules: null,
};
