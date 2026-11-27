import type { ToolPageDetail } from '@/tools/page-detail';
import { WaterIntakeGuideArticle } from './WaterIntakeGuideArticle';
import { WATER_INTAKE_FAQS, WATER_INTAKE_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Estimate IOM adequate daily water intake by age and sex — educational only.',
  asideAriaLabel: 'Interactive Water Intake Calculator',
  tocItems: WATER_INTAKE_TOC_ITEMS,
  GuideArticle: WaterIntakeGuideArticle,
  faqs: WATER_INTAKE_FAQS,
  countryRules: null,
};
