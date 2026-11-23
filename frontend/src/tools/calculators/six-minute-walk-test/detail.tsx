import type { ToolPageDetail } from '@/tools/page-detail';
import { SixMinuteWalkGuideArticle } from './SixMinuteWalkGuideArticle';
import { SIX_MINUTE_WALK_FAQS, SIX_MINUTE_WALK_TOC } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Estimate healthy-adult predicted 6MWD (Enright–Sherrill) and optional percent of expected.',
  asideAriaLabel: 'Interactive 6 Minute Walk Test Calculator',
  tocItems: SIX_MINUTE_WALK_TOC,
  GuideArticle: SixMinuteWalkGuideArticle,
  faqs: SIX_MINUTE_WALK_FAQS,
  countryRules: null,
};
