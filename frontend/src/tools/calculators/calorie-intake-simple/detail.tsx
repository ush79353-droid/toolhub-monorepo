import type { ToolPageDetail } from '@/tools/page-detail';
import { CalorieIntakeSimpleGuideArticle } from './CalorieIntakeSimpleGuideArticle';
import {
  CALORIE_INTAKE_SIMPLE_FAQS,
  CALORIE_INTAKE_SIMPLE_TOC_ITEMS,
} from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Estimate daily maintenance calories from Mifflin–St Jeor BMR and a simple five-level activity factor.',
  asideAriaLabel: 'Interactive Calorie Intake Calculator (Simple)',
  tocItems: CALORIE_INTAKE_SIMPLE_TOC_ITEMS,
  GuideArticle: CalorieIntakeSimpleGuideArticle,
  faqs: CALORIE_INTAKE_SIMPLE_FAQS,
  countryRules: null,
};
