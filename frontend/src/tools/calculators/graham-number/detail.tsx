import type { ToolPageDetail } from '@/tools/page-detail';
import { GrahamNumberGuideArticle } from './GrahamNumberGuideArticle';
import { GRAHAM_FAQS, GRAHAM_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Calculate the Graham Number from earnings per share and book value per share, then compare it with the current market price.',
  asideAriaLabel: 'Interactive Graham Number Calculator',
  tocItems: GRAHAM_TOC_ITEMS,
  GuideArticle: GrahamNumberGuideArticle,
  faqs: GRAHAM_FAQS,
  countryRules: null,
};
