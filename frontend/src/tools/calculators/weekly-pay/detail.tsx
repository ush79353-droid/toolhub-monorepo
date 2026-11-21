import type { ToolPageDetail } from '@/tools/page-detail';
import { WEEKLY_PAY_FAQS, WEEKLY_PAY_TOC_ITEMS } from './content';
import { WeeklyPayGuideArticle } from './WeeklyPayGuideArticle';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert hourly, daily, monthly, or annual gross pay into weekly earnings with your hours, days, and paid weeks — currency changes display formatting only.',
  asideAriaLabel: 'Weekly Pay Calculator guide',
  tocItems: WEEKLY_PAY_TOC_ITEMS,
  GuideArticle: WeeklyPayGuideArticle,
  faqs: WEEKLY_PAY_FAQS,
  countryRules: null,
};
