import type { ToolPageDetail } from '@/tools/page-detail';
import { LbsToStoneGuideArticle } from './LbsToStoneGuideArticle';
import { LBS_TO_STONE_FAQS, LBS_TO_STONE_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert pounds to stones and stones to pounds instantly using the exact factor 1 stone = 14 pounds.',
  asideAriaLabel: 'Interactive lbs to stone converter',
  tocItems: LBS_TO_STONE_TOC_ITEMS,
  GuideArticle: LbsToStoneGuideArticle,
  faqs: LBS_TO_STONE_FAQS,
  countryRules: null,
};
