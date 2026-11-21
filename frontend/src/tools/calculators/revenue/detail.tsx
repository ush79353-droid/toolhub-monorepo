import type { ToolPageDetail } from '@/tools/page-detail';
import { RevenueGuideArticle } from './RevenueGuideArticle';
import { REVENUE_FAQS, REVENUE_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Solve price, quantity, or total revenue from any two inputs, with independent FX on money fields.',
  asideAriaLabel: 'Interactive Revenue Calculator',
  tocItems: REVENUE_TOC_ITEMS,
  GuideArticle: RevenueGuideArticle,
  faqs: REVENUE_FAQS,
  countryRules: null,
};
