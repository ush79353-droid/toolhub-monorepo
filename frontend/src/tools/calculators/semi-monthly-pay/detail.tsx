import type { ToolPageDetail } from '@/tools/page-detail';
import { SemiMonthlyPayGuideArticle } from './SemiMonthlyPayGuideArticle';
import { SEMI_MONTHLY_PAY_FAQS, SEMI_MONTHLY_PAY_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert hourly, daily, weekly, monthly, or yearly wage into semi-monthly pay (twice per month, 24 periods/year) with independent currency conversion on every money field.',
  asideAriaLabel: 'Interactive Semi-Monthly Pay Calculator',
  tocItems: SEMI_MONTHLY_PAY_TOC_ITEMS,
  GuideArticle: SemiMonthlyPayGuideArticle,
  faqs: SEMI_MONTHLY_PAY_FAQS,
  countryRules: null,
};
