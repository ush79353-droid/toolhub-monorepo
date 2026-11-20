import type { ToolPageDetail } from '@/tools/page-detail';
import { ModifiedAdjustedGrossIncomeGuideArticle } from './ModifiedAdjustedGrossIncomeGuideArticle';
import { MAGI_FAQS, MAGI_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Illustrative simplified MAGI estimate from AGI plus common add-backs — not Roth, IRA, ACA, or education program-specific MAGI — with independent FX on every money field.',
  asideAriaLabel:
    'Interactive Modified Adjusted Gross Income (MAGI) Calculator',
  tocItems: MAGI_TOC_ITEMS,
  GuideArticle: ModifiedAdjustedGrossIncomeGuideArticle,
  faqs: MAGI_FAQS,
  countryRules: null,
};