import type { ToolPageDetail } from '@/tools/page-detail';
import { RmrGuideArticle } from './RmrGuideArticle';
import { RMR_FAQS, RMR_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Resting metabolic rate from original Harris–Benedict (1919) × TEF 1.1 — resting kcal/day only.',
  asideAriaLabel: 'Interactive RMR Calculator',
  tocItems: RMR_TOC_ITEMS,
  GuideArticle: RmrGuideArticle,
  faqs: RMR_FAQS,
  countryRules: null,
};
