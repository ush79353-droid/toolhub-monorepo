import type { ToolPageDetail } from '@/tools/page-detail';
import { Curb65GuideArticle } from './Curb65GuideArticle';
import { CURB65_FAQS, CURB65_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Educational CURB-65 score for community-acquired pneumonia risk stratification (Lim et al.) — not an admission order.',
  asideAriaLabel: 'Interactive CURB-65 Calculator',
  tocItems: CURB65_TOC_ITEMS,
  GuideArticle: Curb65GuideArticle,
  faqs: CURB65_FAQS,
  countryRules: null,
};
