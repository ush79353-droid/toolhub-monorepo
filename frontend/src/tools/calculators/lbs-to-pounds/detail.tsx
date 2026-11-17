import type { ToolPageDetail } from '@/tools/page-detail';
import { LbsToPoundsGuideArticle } from './LbsToPoundsGuideArticle';
import { LBS_TO_POUNDS_FAQS, LBS_TO_POUNDS_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert lbs to pounds instantly. Both names describe the same unit — the numerical value stays exactly the same.',
  asideAriaLabel: 'Interactive lbs to pounds converter',
  tocItems: LBS_TO_POUNDS_TOC_ITEMS,
  GuideArticle: LbsToPoundsGuideArticle,
  faqs: LBS_TO_POUNDS_FAQS,
  countryRules: null,
};
