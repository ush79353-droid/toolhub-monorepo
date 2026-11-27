import type { ToolPageDetail } from '@/tools/page-detail';
import { TotalBodyWaterGuideArticle } from './TotalBodyWaterGuideArticle';
import {
  TOTAL_BODY_WATER_FAQS,
  TOTAL_BODY_WATER_TOC_ITEMS,
} from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Educational Watson 1980 total body water from sex, age, height, and weight — not a dilution assay.',
  asideAriaLabel: 'Interactive Total Body Water Calculator',
  tocItems: TOTAL_BODY_WATER_TOC_ITEMS,
  GuideArticle: TotalBodyWaterGuideArticle,
  faqs: TOTAL_BODY_WATER_FAQS,
  countryRules: null,
};
