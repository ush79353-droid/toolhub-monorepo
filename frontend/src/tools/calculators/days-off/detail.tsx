import type { ToolPageDetail } from '@/tools/page-detail';
import { DaysOffGuideArticle } from './DaysOffGuideArticle';
import { DAYS_OFF_FAQS, DAYS_OFF_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead: 'Compare typical paid-leave rules by country and contract type.',
  asideAriaLabel: 'Interactive Days Off Calculator',
  tocItems: DAYS_OFF_TOC_ITEMS,
  GuideArticle: DaysOffGuideArticle,
  faqs: DAYS_OFF_FAQS,
  countryRules: null,
};
