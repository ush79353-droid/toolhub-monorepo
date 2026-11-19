import type { ToolPageDetail } from '@/tools/page-detail';
import { AdjustedGrossIncomeGuideArticle } from './AdjustedGrossIncomeGuideArticle';
import { AGI_FAQS, AGI_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Estimate US Tax Year 2025 adjusted gross income from taxable income sources minus Schedule 1 above-the-line adjustments — with independent currency conversion on every money field.',
  asideAriaLabel: 'Interactive Adjusted Gross Income (AGI) Calculator',
  tocItems: AGI_TOC_ITEMS,
  GuideArticle: AdjustedGrossIncomeGuideArticle,
  faqs: AGI_FAQS,
  countryRules: null,
};
