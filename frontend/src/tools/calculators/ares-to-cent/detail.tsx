import type { ToolPageDetail } from '@/tools/page-detail';
import { AresToCentGuideArticle } from './AresToCentGuideArticle';
import { ARES_TO_CENT_FAQS, ARES_TO_CENT_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert ares to cents and cents to ares using exact international acre and metric are factors.',
  asideAriaLabel: 'Interactive ares to cent converter',
  tocItems: ARES_TO_CENT_TOC_ITEMS,
  GuideArticle: AresToCentGuideArticle,
  faqs: ARES_TO_CENT_FAQS,
  countryRules: null,
};
