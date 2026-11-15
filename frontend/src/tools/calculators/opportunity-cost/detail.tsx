import type { ToolPageDetail } from '@/tools/page-detail';
import { OpportunityCostGuideArticle } from './OpportunityCostGuideArticle';
import { OPPORTUNITY_COST_FAQS, OPPORTUNITY_COST_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Estimate the inflation-adjusted investment gain you forgo by spending money today instead of investing it after tax.',
  asideAriaLabel: 'Interactive Opportunity Cost Calculator',
  tocItems: OPPORTUNITY_COST_TOC_ITEMS,
  GuideArticle: OpportunityCostGuideArticle,
  faqs: OPPORTUNITY_COST_FAQS,
  countryRules: null,
};
