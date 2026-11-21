import type { ToolPageDetail } from '@/tools/page-detail';
import { RateOfPayGuideArticle } from './RateOfPayGuideArticle';
import { RATE_OF_PAY_FAQS, RATE_OF_PAY_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert hourly, daily, weekly, biweekly, monthly, or annual pay from hours per week — enter any one amount with independent FX on each money field.',
  asideAriaLabel: 'Interactive Rate of Pay Calculator',
  tocItems: RATE_OF_PAY_TOC_ITEMS,
  GuideArticle: RateOfPayGuideArticle,
  faqs: RATE_OF_PAY_FAQS,
  countryRules: null,
};
