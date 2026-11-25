import type { ToolPageDetail } from '@/tools/page-detail';
import { PsaDensityGuideArticle } from './PsaDensityGuideArticle';
import { PSA_DENSITY_FAQS, PSA_DENSITY_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Educational PSA density: serum PSA divided by prostate volume from ellipsoid dimensions or direct volume entry — numeric ratio only, not a diagnosis.',
  asideAriaLabel: 'Interactive PSA Density Calculator',
  tocItems: PSA_DENSITY_TOC_ITEMS,
  GuideArticle: PsaDensityGuideArticle,
  faqs: PSA_DENSITY_FAQS,
  countryRules: null,
};