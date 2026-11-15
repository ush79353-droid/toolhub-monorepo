import type { ToolPageDetail } from '@/tools/page-detail';
import { CtrGuideArticle } from './CtrGuideArticle';
import { CTR_FAQS, CTR_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead: 'Calculate click-through rate from ad impressions and clicks.',
  asideAriaLabel: 'Interactive CTR Calculator',
  tocItems: CTR_TOC_ITEMS,
  GuideArticle: CtrGuideArticle,
  faqs: CTR_FAQS,
  countryRules: null,
};
