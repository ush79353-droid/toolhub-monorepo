import type { ToolPageDetail } from '@/tools/page-detail';
import { YardToMileGuideArticle } from './YardToMileGuideArticle';
import { YARD_TO_MILE_FAQS, YARD_TO_MILE_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert yards to miles and miles to yards instantly; 1 mile equals exactly 1,760 yards.',
  asideAriaLabel: 'Interactive yard to mile converter',
  tocItems: YARD_TO_MILE_TOC_ITEMS,
  GuideArticle: YardToMileGuideArticle,
  faqs: YARD_TO_MILE_FAQS,
  countryRules: null,
};
