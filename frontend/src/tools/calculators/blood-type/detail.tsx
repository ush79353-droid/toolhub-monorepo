import type { ToolPageDetail } from '@/tools/page-detail';
import { BloodTypeGuideArticle } from './BloodTypeGuideArticle';
import { BLOOD_TYPE_FAQS, BLOOD_TYPE_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Educational offspring ABO/Rh probabilities from parental phenotypes — equal priors where genotypes are ambiguous, not a laboratory blood bank result.',
  asideAriaLabel: 'Interactive Blood Type Calculator',
  tocItems: BLOOD_TYPE_TOC_ITEMS,
  GuideArticle: BloodTypeGuideArticle,
  faqs: BLOOD_TYPE_FAQS,
  countryRules: null,
};