import type { ToolPageDetail } from '@/tools/page-detail';
import { IncomeTaxGuideArticle } from './IncomeTaxGuideArticle';
import { INCOME_TAX_FAQS, INCOME_TAX_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Estimate US federal income tax for 2025 and 2026 from wages, income, deductions, credits, and withholding, fixed USD educational estimate.',
  asideAriaLabel: 'Interactive Income Tax Calculator',
  tocItems: INCOME_TAX_TOC_ITEMS,
  GuideArticle: IncomeTaxGuideArticle,
  faqs: INCOME_TAX_FAQS,
  countryRules: null,
};
