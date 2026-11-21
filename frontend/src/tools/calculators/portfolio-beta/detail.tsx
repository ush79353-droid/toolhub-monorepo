import type { ToolPageDetail } from '@/tools/page-detail';
import { PortfolioBetaGuideArticle } from './PortfolioBetaGuideArticle';
import { PB_FAQS, PB_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Calculate portfolio beta from individual stock betas and allocation weights, with weighted contributions and market-sensitivity interpretation.',
  asideAriaLabel: 'Interactive Portfolio Beta Calculator',
  tocItems: PB_TOC_ITEMS,
  GuideArticle: PortfolioBetaGuideArticle,
  faqs: PB_FAQS,
  countryRules: null,
};
