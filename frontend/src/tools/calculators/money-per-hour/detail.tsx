import type { ToolPageDetail } from '@/tools/page-detail';
import { MoneyPerHourGuideArticle } from './MoneyPerHourGuideArticle';
import { MONEY_PER_HOUR_FAQS, MONEY_PER_HOUR_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert annual, monthly, biweekly, weekly, or daily pay into money per hour from hours per week — enter any one amount with independent FX on each money field.',
  asideAriaLabel: 'Interactive Money per Hour Calculator',
  tocItems: MONEY_PER_HOUR_TOC_ITEMS,
  GuideArticle: MoneyPerHourGuideArticle,
  faqs: MONEY_PER_HOUR_FAQS,
  countryRules: null,
};
