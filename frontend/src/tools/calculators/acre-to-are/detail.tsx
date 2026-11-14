import type { ToolPageDetail } from '@/tools/page-detail';
import { AcreToAreGuideArticle } from './AcreToAreGuideArticle';
import { ACRE_TO_ARE_FAQS, ACRE_TO_ARE_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert acres to ares and ares to acres using the exact factor of 40.468564224 ares per acre.',
  asideAriaLabel: 'Interactive acre to are conversion calculator',
  tocItems: ACRE_TO_ARE_TOC_ITEMS,
  GuideArticle: AcreToAreGuideArticle,
  faqs: ACRE_TO_ARE_FAQS,
  countryRules: null,
};
