import type { ToolPageDetail } from '@/tools/page-detail';
import { RevenuePerEmployeeGuideArticle } from './RevenuePerEmployeeGuideArticle';
import { RPE_FAQS, RPE_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead: 'Calculate revenue generated per employee from total revenue and headcount.',
  asideAriaLabel: 'Interactive Revenue Per Employee Calculator',
  tocItems: RPE_TOC_ITEMS,
  GuideArticle: RevenuePerEmployeeGuideArticle,
  faqs: RPE_FAQS,
  countryRules: null,
};
