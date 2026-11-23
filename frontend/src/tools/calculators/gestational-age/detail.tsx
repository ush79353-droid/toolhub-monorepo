import type { ToolPageDetail } from '@/tools/page-detail';
import { GestationalAgeGuideArticle } from './GestationalAgeGuideArticle';
import {
  GESTATIONAL_AGE_FAQS,
  GESTATIONAL_AGE_TOC_ITEMS,
} from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Educational gestational weeks and days from an estimated due date and a current date using ACOG-style 280-day calendar dating.',
  asideAriaLabel: 'Interactive Gestational Age Calculator',
  tocItems: GESTATIONAL_AGE_TOC_ITEMS,
  GuideArticle: GestationalAgeGuideArticle,
  faqs: GESTATIONAL_AGE_FAQS,
  countryRules: null,
};