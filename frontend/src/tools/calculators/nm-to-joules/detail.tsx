import type { ToolPageDetail } from '@/tools/page-detail';
import { NmToJoulesGuideArticle } from './NmToJoulesGuideArticle';
import { NM_TO_JOULES_FAQS, NM_TO_JOULES_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert N ↔ J/m and J ↔ N·m instantly. Optional work calculator uses W = F d cos(θ). Torque is not the same as energy.',
  asideAriaLabel: 'Interactive Nm to joules calculator',
  tocItems: NM_TO_JOULES_TOC_ITEMS,
  GuideArticle: NmToJoulesGuideArticle,
  faqs: NM_TO_JOULES_FAQS,
  countryRules: null,
};
