import type { ToolPageDetail } from '@/tools/page-detail';
import { UnleveredBetaGuideArticle } from './UnleveredBetaGuideArticle';
import { UB_FAQS, UB_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Calculate unlevered (asset) beta from levered equity beta, corporate tax rate, and debt-to-equity ratio using a Hamada-style formula.',
  asideAriaLabel: 'Interactive Unlevered Beta Calculator',
  tocItems: UB_TOC_ITEMS,
  GuideArticle: UnleveredBetaGuideArticle,
  faqs: UB_FAQS,
  countryRules: null,
};
