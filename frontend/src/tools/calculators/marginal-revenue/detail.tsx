import type { ToolPageDetail } from '@/tools/page-detail';
import { MarginalRevenueGuideArticle } from './MarginalRevenueGuideArticle';
import { MARGINAL_REVENUE_FAQS, MARGINAL_REVENUE_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Estimate discrete marginal revenue as ΔTR/ΔQ from initial and final revenue and quantity, with independent FX on money fields.',
  asideAriaLabel: 'Interactive Marginal Revenue Calculator',
  tocItems: MARGINAL_REVENUE_TOC_ITEMS,
  GuideArticle: MarginalRevenueGuideArticle,
  faqs: MARGINAL_REVENUE_FAQS,
  countryRules: null,
};
