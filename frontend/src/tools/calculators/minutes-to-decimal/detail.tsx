import type { ToolPageDetail } from '@/tools/page-detail';
import { MinutesToDecimalGuideArticle } from './MinutesToDecimalGuideArticle';
import { M2DEC_FAQS, M2DEC_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert clock minutes to decimal hours and equivalent minutes and seconds. Exact: 1 hour = 60 minutes = 3,600 seconds.',
  asideAriaLabel: 'Interactive minutes to decimal calculator',
  tocItems: M2DEC_TOC_ITEMS,
  GuideArticle: MinutesToDecimalGuideArticle,
  faqs: M2DEC_FAQS,
  countryRules: null,
};
