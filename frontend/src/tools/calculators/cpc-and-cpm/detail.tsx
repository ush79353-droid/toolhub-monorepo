import type { ToolPageDetail } from '@/tools/page-detail';
import { CpcAndCpmGuideArticle } from './CpcAndCpmGuideArticle';
import { CPC_CPM_FAQS, CPC_CPM_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Calculate CPC, CPM, clicks, CTR, and total ad cost from the values you already know.',
  asideAriaLabel: 'Interactive CPC and CPM Calculator',
  tocItems: CPC_CPM_TOC_ITEMS,
  GuideArticle: CpcAndCpmGuideArticle,
  faqs: CPC_CPM_FAQS,
  countryRules: null,
};
