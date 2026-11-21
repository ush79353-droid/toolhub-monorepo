import type { ToolPageDetail } from '@/tools/page-detail';
import { NPS_FAQS, NPS_TOC_ITEMS } from './content';
import { NpsGuideArticle } from './NpsGuideArticle';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Calculate Net Promoter Score from 0–10 survey response counts; promoters, passives, detractors, percentages, and NPS on the −100 to +100 scale.',
  asideAriaLabel: 'NPS Calculator guide',
  tocItems: NPS_TOC_ITEMS,
  GuideArticle: NpsGuideArticle,
  faqs: NPS_FAQS,
  countryRules: null,
};
