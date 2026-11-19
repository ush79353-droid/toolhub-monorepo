import type { ToolPageDetail } from '@/tools/page-detail';
import { WageGuideArticle } from './WageGuideArticle';
import { WAGE_FAQS, WAGE_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert hourly wage across per-second, per-minute, daily, weekly, biweekly, monthly, and annual pay from hours per week — enter any one amount with independent FX on each money field.',
  asideAriaLabel: 'Interactive Wage Calculator',
  tocItems: WAGE_TOC_ITEMS,
  GuideArticle: WageGuideArticle,
  faqs: WAGE_FAQS,
  countryRules: null,
};
