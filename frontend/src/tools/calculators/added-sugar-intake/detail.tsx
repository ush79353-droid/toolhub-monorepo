import type { ToolPageDetail } from '@/tools/page-detail';
import { AddedSugarIntakeGuideArticle } from './AddedSugarIntakeGuideArticle';
import { ADDED_SUGAR_INTAKE_FAQS, ADDED_SUGAR_INTAKE_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Estimate daily added sugar from common foods and compare to sex-specific reference limits—educational only.',
  asideAriaLabel: 'Interactive Added Sugar Intake Calculator',
  tocItems: ADDED_SUGAR_INTAKE_TOC_ITEMS,
  GuideArticle: AddedSugarIntakeGuideArticle,
  faqs: ADDED_SUGAR_INTAKE_FAQS,
  countryRules: null,
};