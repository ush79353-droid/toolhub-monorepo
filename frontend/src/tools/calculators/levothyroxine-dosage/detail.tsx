import type { ToolPageDetail } from '@/tools/page-detail';
import { LevothyroxineDosageGuideArticle } from './LevothyroxineDosageGuideArticle';
import { LEVO_FAQS, LEVO_TOC } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Educational levothyroxine teaching estimate for the verified healthy-adult overt-hypothyroidism branch (FDA 1.6 mcg/kg × Devine dosing weight). Not a prescription — other populations stay clinician-gated.',
  asideAriaLabel: 'Levothyroxine Dosage Calculator panel',
  tocItems: LEVO_TOC,
  GuideArticle: LevothyroxineDosageGuideArticle,
  faqs: LEVO_FAQS,
  countryRules: null,
};
