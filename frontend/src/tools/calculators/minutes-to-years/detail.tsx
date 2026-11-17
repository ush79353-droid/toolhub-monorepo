import type { ToolPageDetail } from '@/tools/page-detail';
import { MinutesToYearsGuideArticle } from './MinutesToYearsGuideArticle';
import { M2Y_FAQS, M2Y_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert minutes to average years and back. Average year = 365.25 days = 525,960 minutes.',
  asideAriaLabel: 'Interactive minutes to years conversion calculator',
  tocItems: M2Y_TOC_ITEMS,
  GuideArticle: MinutesToYearsGuideArticle,
  faqs: M2Y_FAQS,
  countryRules: null,
};
