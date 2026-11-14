import type { ToolPageDetail } from '@/tools/page-detail';
import { YARDS_TO_ACRES_FAQS, YARDS_TO_ACRES_TOC_ITEMS } from './content';
import { YardsToAcresGuideArticle } from './YardsToAcresGuideArticle';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert square yards to acres and acres to square yards instantly using the exact factor 1 acre = 4840 yd².',
  asideAriaLabel: 'Interactive yards to acres calculator',
  tocItems: YARDS_TO_ACRES_TOC_ITEMS,
  GuideArticle: YardsToAcresGuideArticle,
  faqs: YARDS_TO_ACRES_FAQS,
  countryRules: null,
};
