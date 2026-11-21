import type { ToolPageDetail } from '@/tools/page-detail';
import { AnnualPayGuideArticle } from './AnnualPayGuideArticle';
import { ANNUAL_PAY_FAQS, ANNUAL_PAY_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert hourly wage to annual pay from hours and weeks worked, then estimate net pay after a simplified flat tax with independent FX on each money field.',
  asideAriaLabel: 'Interactive Annual Pay Calculator',
  tocItems: ANNUAL_PAY_TOC_ITEMS,
  GuideArticle: AnnualPayGuideArticle,
  faqs: ANNUAL_PAY_FAQS,
  countryRules: null,
};
