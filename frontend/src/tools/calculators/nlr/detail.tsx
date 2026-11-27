import type { ToolPageDetail } from '@/tools/page-detail';
import { NlrGuideArticle } from './NlrGuideArticle';
import { NLR_FAQS, NLR_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Educational neutrophil-to-lymphocyte ratio from absolute counts or differential percentages — not a diagnosis.',
  asideAriaLabel: 'Interactive NLR Calculator',
  tocItems: NLR_TOC_ITEMS,
  GuideArticle: NlrGuideArticle,
  faqs: NLR_FAQS,
  countryRules: null,
};
