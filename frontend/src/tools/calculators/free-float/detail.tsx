import type { ToolPageDetail } from '@/tools/page-detail';
import { FreeFloatGuideArticle } from './FreeFloatGuideArticle';
import { FREE_FLOAT_FAQS, FREE_FLOAT_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Calculate free float shares and free float percentage from outstanding, restricted, and closely held share counts.',
  asideAriaLabel: 'Interactive Free Float Calculator',
  tocItems: FREE_FLOAT_TOC_ITEMS,
  GuideArticle: FreeFloatGuideArticle,
  faqs: FREE_FLOAT_FAQS,
  countryRules: null,
};
