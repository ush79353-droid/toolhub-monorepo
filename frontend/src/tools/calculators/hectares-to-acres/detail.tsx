import type { ToolPageDetail } from '@/tools/page-detail';
import { HectaresToAcresGuideArticle } from './HectaresToAcresGuideArticle';
import { HECTARES_TO_ACRES_FAQS, HECTARES_TO_ACRES_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert hectares to acres instantly. Calculate accurate hectares-to-acres and acres-to-hectares land area conversions online.',
  asideAriaLabel: 'Interactive hectares to acres converter',
  tocItems: HECTARES_TO_ACRES_TOC_ITEMS,
  GuideArticle: HectaresToAcresGuideArticle,
  faqs: HECTARES_TO_ACRES_FAQS,
  countryRules: null,
};
