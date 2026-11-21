import type { ToolPageDetail } from '@/tools/page-detail';
import { PositivePregnancyFollowUpGuideArticle } from './PositivePregnancyFollowUpGuideArticle';
import {
  POSITIVE_PREGNANCY_FOLLOW_UP_FAQS,
  POSITIVE_PREGNANCY_FOLLOW_UP_TOC_ITEMS,
} from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Educational follow-up after a positive home pregnancy test, with the same natural/IVF testing timetable widget used on related tools. Timing estimates only — not a confirmation of pregnancy or treatment plan.',
  asideAriaLabel: 'Interactive positive pregnancy test follow-up',
  tocItems: POSITIVE_PREGNANCY_FOLLOW_UP_TOC_ITEMS,
  GuideArticle: PositivePregnancyFollowUpGuideArticle,
  faqs: POSITIVE_PREGNANCY_FOLLOW_UP_FAQS,
  countryRules: null,
};
