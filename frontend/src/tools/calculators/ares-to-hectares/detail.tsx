import type { ToolPageDetail } from '@/tools/page-detail';
import { AresToHectaresGuideArticle } from './AresToHectaresGuideArticle';
import { ARES_TO_HECTARES_FAQS, ARES_TO_HECTARES_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert ares to hectares and hectares to ares using the exact factor of 100 ares per hectare.',
  asideAriaLabel: 'Interactive ares to hectares converter',
  tocItems: ARES_TO_HECTARES_TOC_ITEMS,
  GuideArticle: AresToHectaresGuideArticle,
  faqs: ARES_TO_HECTARES_FAQS,
  countryRules: null,
};
