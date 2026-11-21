import type { ToolPageDetail } from '@/tools/page-detail';
import { HoursPayGuideArticle } from './HoursPayGuideArticle';
import { HOURS_PAY_FAQS, HOURS_PAY_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert daily, weekly, monthly, or annual pay into an equivalent hourly wage using your working hours — with independent currency conversion on every money field.',
  asideAriaLabel: 'Interactive Hours Pay Calculator',
  tocItems: HOURS_PAY_TOC_ITEMS,
  GuideArticle: HoursPayGuideArticle,
  faqs: HOURS_PAY_FAQS,
  countryRules: null,
};
