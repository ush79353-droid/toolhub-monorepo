import type { ToolPageDetail } from '@/tools/page-detail';
import { AcresToSquareMilesGuideArticle } from './AcresToSquareMilesGuideArticle';
import { ACRES_TO_MI2_FAQS, ACRES_TO_MI2_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert acres to square miles and square miles to acres with the exact factor of 640 acres per square mile.',
  asideAriaLabel: 'Interactive acres to square miles calculator',
  tocItems: ACRES_TO_MI2_TOC_ITEMS,
  GuideArticle: AcresToSquareMilesGuideArticle,
  faqs: ACRES_TO_MI2_FAQS,
  countryRules: null,
};
