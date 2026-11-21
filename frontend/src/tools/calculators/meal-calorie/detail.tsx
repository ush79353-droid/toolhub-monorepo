import type { ToolPageDetail } from '@/tools/page-detail';
import { MealCalorieGuideArticle } from './MealCalorieGuideArticle';
import { MEAL_CALORIE_FAQS, MEAL_CALORIE_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Split a daily calorie budget across three, four, or five meals with rounded targets and flexible min–max bands.',
  asideAriaLabel: 'Interactive Meal Calorie Calculator',
  tocItems: MEAL_CALORIE_TOC_ITEMS,
  GuideArticle: MealCalorieGuideArticle,
  faqs: MEAL_CALORIE_FAQS,
  countryRules: null,
};