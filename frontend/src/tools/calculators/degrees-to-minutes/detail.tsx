import type { ToolPageDetail } from '@/tools/page-detail';
import { DegreesToMinutesGuideArticle } from './DegreesToMinutesGuideArticle';
import { DEGREES_TO_MINUTES_FAQS, DEGREES_TO_MINUTES_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert angular degrees to minutes of arc (arcminutes) and back; exact 60:1 factor, not clock time.',
  asideAriaLabel: 'Interactive degrees to minutes converter',
  tocItems: DEGREES_TO_MINUTES_TOC_ITEMS,
  GuideArticle: DegreesToMinutesGuideArticle,
  faqs: DEGREES_TO_MINUTES_FAQS,
  countryRules: null,
};
