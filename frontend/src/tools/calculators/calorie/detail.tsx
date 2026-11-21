import type { ToolPageDetail } from '@/tools/page-detail';
import { CalorieGuideArticle } from './CalorieGuideArticle';
import { CALORIE_FAQS, CALORIE_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Estimate daily maintenance calories with Mifflin–St Jeor BMR multiplied by your activity level.',
  asideAriaLabel: 'Interactive Calorie Calculator',
  tocItems: CALORIE_TOC_ITEMS,
  GuideArticle: CalorieGuideArticle,
  faqs: CALORIE_FAQS,
  countryRules: null,
};
