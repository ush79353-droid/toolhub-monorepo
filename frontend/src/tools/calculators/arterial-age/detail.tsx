import type { ToolPageDetail } from '@/tools/page-detail';
import { ArterialAgeGuideArticle } from './ArterialAgeGuideArticle';
import { ARTERIAL_AGE_FAQS, ARTERIAL_AGE_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Educational MESA arterial age from Agatston coronary calcium — Â = 39.1 + 7.25 × ln(CAC + 1). Chronologic age is comparison-only.',
  asideAriaLabel: 'Interactive Arterial Age Calculator',
  tocItems: ARTERIAL_AGE_TOC_ITEMS,
  GuideArticle: ArterialAgeGuideArticle,
  faqs: ARTERIAL_AGE_FAQS,
  countryRules: null,
};
