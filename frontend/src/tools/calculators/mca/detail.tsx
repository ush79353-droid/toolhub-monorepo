import type { ToolPageDetail } from '@/tools/page-detail';
import { McaGuideArticle } from './McaGuideArticle';
import { MCA_FAQS, MCA_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Educational fetal MCA peak systolic velocity as multiples of the median (MoM) from published singleton or MCDA twin reference medians by gestational week.',
  asideAriaLabel: 'Interactive MCA Calculator',
  tocItems: MCA_TOC_ITEMS,
  GuideArticle: McaGuideArticle,
  faqs: MCA_FAQS,
  countryRules: null,
};