import type { ToolPageDetail } from '@/tools/page-detail';
import { DropsPerMinuteGuideArticle } from './DropsPerMinuteGuideArticle';
import {
  DROPS_PER_MINUTE_FAQS,
  DROPS_PER_MINUTE_TOC_ITEMS,
} from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Estimate IV drops/min, drops/hour, and mL/h from volume, time, and drop factor — educational only.',
  asideAriaLabel: 'Interactive Drops Per Minute Calculator',
  tocItems: DROPS_PER_MINUTE_TOC_ITEMS,
  GuideArticle: DropsPerMinuteGuideArticle,
  faqs: DROPS_PER_MINUTE_FAQS,
  countryRules: null,
};
