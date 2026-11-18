import type { ToolPageDetail } from '@/tools/page-detail';
import { LbsToGGuideArticle } from './LbsToGGuideArticle';
import { LBS_TO_G_FAQS, LBS_TO_G_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert pounds to grams and grams to pounds instantly. Exact: 1 lb = 453.59237 g.',
  asideAriaLabel: 'Interactive lbs to g converter',
  tocItems: LBS_TO_G_TOC_ITEMS,
  GuideArticle: LbsToGGuideArticle,
  faqs: LBS_TO_G_FAQS,
  countryRules: null,
};
