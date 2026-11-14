import type { ToolPageDetail } from '@/tools/page-detail';
import { AttritionRateGuideArticle } from './AttritionRateGuideArticle';
import { ATTRITION_RATE_FAQS, ATTRITION_RATE_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Calculate your organization’s employee attrition rate from starting headcount, ending headcount, and departed staff with verified mathematical formulas.',
  asideAriaLabel: 'Interactive Attrition Rate Calculator',
  tocItems: ATTRITION_RATE_TOC_ITEMS,
  GuideArticle: AttritionRateGuideArticle,
  faqs: ATTRITION_RATE_FAQS,
};
