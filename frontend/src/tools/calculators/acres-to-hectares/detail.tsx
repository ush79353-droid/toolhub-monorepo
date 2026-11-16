import type { ToolPageDetail } from '@/tools/page-detail';
import { AcresToHectaresGuideArticle } from './AcresToHectaresGuideArticle';
import { ACRES_TO_HECTARES_FAQS, ACRES_TO_HECTARES_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert acres to hectares and hectares to acres instantly using the exact international factor 1 acre = 0.40468564224 ha.',
  asideAriaLabel: 'Interactive acres to hectares converter',
  tocItems: ACRES_TO_HECTARES_TOC_ITEMS,
  GuideArticle: AcresToHectaresGuideArticle,
  faqs: ACRES_TO_HECTARES_FAQS,
  countryRules: null,
};
