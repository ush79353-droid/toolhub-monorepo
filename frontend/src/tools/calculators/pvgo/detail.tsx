import type { ToolPageDetail } from '@/tools/page-detail';
import { PvgoGuideArticle } from './PvgoGuideArticle';
import { PVGO_FAQS, PVGO_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead: 'Estimate EPS and the present value of growth opportunities per share.',
  asideAriaLabel: 'Interactive PVGO Calculator',
  tocItems: PVGO_TOC_ITEMS,
  GuideArticle: PvgoGuideArticle,
  faqs: PVGO_FAQS,
  countryRules: null,
};
