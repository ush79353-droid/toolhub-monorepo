import type { ToolPageDetail } from '@/tools/page-detail';
import { AdjustedGrossIncomeGuideArticle } from './AdjustedGrossIncomeGuideArticle';
import { AGI_FAQS, AGI_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Educational simplified Form 1040–style AGI estimate for US Tax Year 2025 from income minus Schedule 1 above-the-line adjustments — not a complete IRS filing — with independent currency conversion on every money field.',
  asideAriaLabel: 'Interactive Adjusted Gross Income (AGI) Calculator',
  tocItems: AGI_TOC_ITEMS,
  GuideArticle: AdjustedGrossIncomeGuideArticle,
  faqs: AGI_FAQS,
  countryRules: null,
};
