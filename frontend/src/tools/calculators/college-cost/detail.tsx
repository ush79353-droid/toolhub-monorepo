import type { ToolPageDetail } from '@/tools/page-detail';
import { COLLEGE_COST_FAQS, COLLEGE_COST_TOC_ITEMS } from './content';
import { CollegeCostGuideArticle } from './CollegeCostGuideArticle';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Estimate future college expenses with cost inflation, savings targets, after-tax investment growth, and a monthly contribution plan. Currency changes formatting only.',
  asideAriaLabel: 'College Cost Calculator guide',
  tocItems: COLLEGE_COST_TOC_ITEMS,
  GuideArticle: CollegeCostGuideArticle,
  faqs: COLLEGE_COST_FAQS,
  countryRules: null,
};
