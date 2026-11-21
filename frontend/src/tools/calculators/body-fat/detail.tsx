import type { ToolPageDetail } from '@/tools/page-detail';
import { BodyFatGuideArticle } from './BodyFatGuideArticle';
import { BODY_FAT_FAQS, BODY_FAT_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Estimate body fat percentage with the CUN-BAE (ADA) equation, U.S. Navy circumferences, or a Deurenberg BMI method — plus fat mass, lean mass, and BMI.',
  asideAriaLabel: 'Interactive Body Fat Calculator',
  tocItems: BODY_FAT_TOC_ITEMS,
  GuideArticle: BodyFatGuideArticle,
  faqs: BODY_FAT_FAQS,
  countryRules: null,
};
