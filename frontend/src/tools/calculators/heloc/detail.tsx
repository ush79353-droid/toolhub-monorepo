import type { ToolPageDetail } from '@/tools/page-detail';
import { HelocGuideArticle } from './HelocGuideArticle';
import { HELOC_FAQS, HELOC_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Estimate HELOC interest-only draw payments, amortizing repayment installments, fees, schedules, and balances — with optional rate-adjustment projections.',
  asideAriaLabel: 'Interactive HELOC Calculator',
  tocItems: HELOC_TOC_ITEMS,
  GuideArticle: HelocGuideArticle,
  faqs: HELOC_FAQS,
  countryRules: null,
};
