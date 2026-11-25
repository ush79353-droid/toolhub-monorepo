import type { ToolPageDetail } from '@/tools/page-detail';
import { PfRatioGuideArticle } from './PfRatioGuideArticle';
import { PF_RATIO_FAQS, PF_RATIO_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Educational PaO₂/FiO₂ (Horovitz) index — ratio alone does not establish ARDS.',
  asideAriaLabel: 'Interactive PF Ratio Calculator',
  tocItems: PF_RATIO_TOC_ITEMS,
  GuideArticle: PfRatioGuideArticle,
  faqs: PF_RATIO_FAQS,
  countryRules: null,
};
