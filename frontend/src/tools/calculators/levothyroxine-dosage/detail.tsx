import type { ToolPageDetail } from '@/tools/page-detail';
import { LevothyroxineDosageGuideArticle } from './LevothyroxineDosageGuideArticle';
import { LEVO_FAQS, LEVO_TOC } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Explore levothyroxine eligibility fields from the approved screenshot — educational only. No patient-specific mcg/day dose is published without clinical approval.',
  asideAriaLabel: 'Levothyroxine Dosage Calculator panel',
  tocItems: LEVO_TOC,
  GuideArticle: LevothyroxineDosageGuideArticle,
  faqs: LEVO_FAQS,
  countryRules: null,
};
