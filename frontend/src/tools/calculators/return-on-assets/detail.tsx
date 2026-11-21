import type { ToolPageDetail } from '@/tools/page-detail';
import { ReturnOnAssetsGuideArticle } from './ReturnOnAssetsGuideArticle';
import { ROA_FAQS, ROA_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Calculate Return on Assets (ROA) from net income and total assets — with optional average assets — to measure profit relative to the asset base.',
  asideAriaLabel: 'Interactive Return on Assets Calculator',
  tocItems: ROA_TOC_ITEMS,
  GuideArticle: ReturnOnAssetsGuideArticle,
  faqs: ROA_FAQS,
  countryRules: null,
};
