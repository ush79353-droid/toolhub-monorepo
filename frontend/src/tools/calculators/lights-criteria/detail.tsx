import type { ToolPageDetail } from '@/tools/page-detail';
import { LightsCriteriaGuideArticle } from './LightsCriteriaGuideArticle';
import { LIGHTS_CRITERIA_FAQS, LIGHTS_CRITERIA_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Educational Light’s criteria for pleural fluid — protein and LDH comparisons with strict inequalities. Not a diagnosis.',
  asideAriaLabel: "Interactive Light's Criteria Calculator",
  tocItems: LIGHTS_CRITERIA_TOC_ITEMS,
  GuideArticle: LightsCriteriaGuideArticle,
  faqs: LIGHTS_CRITERIA_FAQS,
  countryRules: null,
};
