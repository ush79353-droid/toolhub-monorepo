import type { ToolPageDetail } from '@/tools/page-detail';
import { CalorieDeficitGuideArticle } from './CalorieDeficitGuideArticle';
import { CALORIE_DEFICIT_FAQS, CALORIE_DEFICIT_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Estimate the daily calorie deficit needed to reach a lower weight by a target date, with an illustrative sedentary intake plan. Educational only — not medical advice.',
  asideAriaLabel: 'Interactive Calorie Deficit Calculator',
  tocItems: CALORIE_DEFICIT_TOC_ITEMS,
  GuideArticle: CalorieDeficitGuideArticle,
  faqs: CALORIE_DEFICIT_FAQS,
  countryRules: null,
};
