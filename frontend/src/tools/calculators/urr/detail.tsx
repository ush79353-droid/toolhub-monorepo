import type { ToolPageDetail } from '@/tools/page-detail';
import { UrrGuideArticle } from './UrrGuideArticle';
import { URR_FAQS, URR_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Educational urea reduction ratio from pre- and post-dialysis urea — not a Kt/V or prescription.',
  asideAriaLabel: 'Interactive URR Calculator',
  tocItems: URR_TOC_ITEMS,
  GuideArticle: UrrGuideArticle,
  faqs: URR_FAQS,
  countryRules: null,
};
