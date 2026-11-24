import type { ToolPageDetail } from '@/tools/page-detail';
import { KatchMcardleGuideArticle } from './KatchMcardleGuideArticle';
import { KATCH_MCARDLE_FAQS, KATCH_MCARDLE_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Basal metabolic rate from lean body mass (Katch–McArdle) — resting kcal/day only.',
  asideAriaLabel: 'Interactive Katch–McArdle Calculator',
  tocItems: KATCH_MCARDLE_TOC_ITEMS,
  GuideArticle: KatchMcardleGuideArticle,
  faqs: KATCH_MCARDLE_FAQS,
  countryRules: null,
};
