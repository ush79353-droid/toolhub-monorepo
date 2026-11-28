import type { ToolPageDetail } from '@/tools/page-detail';
import { CommuteGuideArticle } from './CommuteGuideArticle';
import { COMMUTE_FAQS, COMMUTE_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Estimate daily to yearly commuting costs for car and public transport, split carpool shares, and compare which option is cheaper under your inputs.',
  asideAriaLabel: 'Interactive Commute Calculator',
  tocItems: COMMUTE_TOC_ITEMS,
  GuideArticle: CommuteGuideArticle,
  faqs: COMMUTE_FAQS,
  countryRules: null,
};
