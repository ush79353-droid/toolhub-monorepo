import type { ToolPageDetail } from '@/tools/page-detail';
import { AnnualIncomeGuideArticle } from './AnnualIncomeGuideArticle';
import { ANNUAL_INCOME_FAQS, ANNUAL_INCOME_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert hourly wage to annual income from hours and weeks worked, then estimate net pay after a simplified flat tax with independent FX on each money field.',
  asideAriaLabel: 'Interactive Annual Income Calculator',
  tocItems: ANNUAL_INCOME_TOC_ITEMS,
  GuideArticle: AnnualIncomeGuideArticle,
  faqs: ANNUAL_INCOME_FAQS,
  countryRules: null,
};
