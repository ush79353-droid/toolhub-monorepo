import type { ToolPageDetail } from '@/tools/page-detail';
import { ContributionMarginGuideArticle } from './ContributionMarginGuideArticle';
import { CM_FAQS, CM_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Find contribution margin, contribution margin ratio, and profit from selling price, variable cost, units, and fixed costs. Currency changes the symbol only.',
  asideAriaLabel: 'Interactive contribution margin calculator',
  tocItems: CM_TOC_ITEMS,
  GuideArticle: ContributionMarginGuideArticle,
  faqs: CM_FAQS,
  countryRules: null,
};
