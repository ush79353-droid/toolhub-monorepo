import type { ToolPageDetail } from '@/tools/page-detail';
import { HardnessGuideArticle } from './HardnessGuideArticle';
import { HARDNESS_FAQS, HARDNESS_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Estimate Brinell, Rockwell B, Rockwell C, and Vickers hardness equivalents for non-austenitic steel using approximate reference charts.',
  asideAriaLabel: 'Interactive hardness conversion calculator',
  tocItems: HARDNESS_TOC_ITEMS,
  GuideArticle: HardnessGuideArticle,
  faqs: HARDNESS_FAQS,
  countryRules: null,
};
