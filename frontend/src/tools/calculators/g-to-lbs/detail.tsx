import type { ToolPageDetail } from '@/tools/page-detail';
import { GToLbsGuideArticle } from './GToLbsGuideArticle';
import { G_TO_LBS_FAQS, G_TO_LBS_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert grams to pounds instantly. Calculate accurate gram-to-pound and pound-to-gram conversions using the exact international avoirdupois pound.',
  asideAriaLabel: 'Interactive grams to pounds converter',
  tocItems: G_TO_LBS_TOC_ITEMS,
  GuideArticle: GToLbsGuideArticle,
  faqs: G_TO_LBS_FAQS,
  countryRules: null,
};
