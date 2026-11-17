import type { ToolPageDetail } from '@/tools/page-detail';
import { DegreesToSecondsGuideArticle } from './DegreesToSecondsGuideArticle';
import { DEGREES_TO_SECONDS_FAQS, DEGREES_TO_SECONDS_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert angular degrees to arcseconds (″) and back — exact 3,600:1 factor, not clock time.',
  asideAriaLabel: 'Interactive degrees to seconds converter',
  tocItems: DEGREES_TO_SECONDS_TOC_ITEMS,
  GuideArticle: DegreesToSecondsGuideArticle,
  faqs: DEGREES_TO_SECONDS_FAQS,
  countryRules: null,
};
