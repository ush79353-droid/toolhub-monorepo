import type { ToolPageDetail } from '@/tools/page-detail';
import { CaloriesBurnedGuideArticle } from './CaloriesBurnedGuideArticle';
import {
  CALORIES_BURNED_FAQS,
  CALORIES_BURNED_TOC_ITEMS,
} from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Estimate calories burned from 2011 Compendium MET values for your activity, body weight, and duration—or distance for walk, run, and cycle paces. Educational only; share uses the page URL only.',
  asideAriaLabel: 'Interactive Calories Burned Calculator',
  tocItems: CALORIES_BURNED_TOC_ITEMS,
  GuideArticle: CaloriesBurnedGuideArticle,
  faqs: CALORIES_BURNED_FAQS,
  countryRules: null,
};