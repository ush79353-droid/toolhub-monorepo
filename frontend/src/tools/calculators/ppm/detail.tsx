import type { ToolPageDetail } from '@/tools/page-detail';
import { PpmGuideArticle } from './PpmGuideArticle';
import { PPM_FAQS, PPM_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert between decimal ratios, percent, per mille, ppm, ppb, and ppt; synchronized through a dimensionless proportion.',
  asideAriaLabel: 'Interactive PPM calculator',
  tocItems: PPM_TOC_ITEMS,
  GuideArticle: PpmGuideArticle,
  faqs: PPM_FAQS,
  countryRules: null,
};
