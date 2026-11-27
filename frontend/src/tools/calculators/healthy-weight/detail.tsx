import type { ToolPageDetail } from '@/tools/page-detail';
import { HealthyWeightGuideArticle } from './HealthyWeightGuideArticle';
import { HEALTHY_WEIGHT_FAQS, HEALTHY_WEIGHT_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Estimate an adult healthy weight range from height using BMI 18.5 to below 25 — educational only.',
  asideAriaLabel: 'Interactive Healthy Weight Calculator',
  tocItems: HEALTHY_WEIGHT_TOC_ITEMS,
  GuideArticle: HealthyWeightGuideArticle,
  faqs: HEALTHY_WEIGHT_FAQS,
  countryRules: null,
};
