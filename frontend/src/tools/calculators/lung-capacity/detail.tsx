import type { ToolPageDetail } from '@/tools/page-detail';
import { LungCapacityGuideArticle } from './LungCapacityGuideArticle';
import { LUNG_CAPACITY_FAQS, LUNG_CAPACITY_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Educational lung capacities from IRV, TV, ERV, and RV — TLC, VC, FRC, and IC arithmetic, not a PFT report.',
  asideAriaLabel: 'Interactive Lung Capacity Calculator',
  tocItems: LUNG_CAPACITY_TOC_ITEMS,
  GuideArticle: LungCapacityGuideArticle,
  faqs: LUNG_CAPACITY_FAQS,
  countryRules: null,
};
