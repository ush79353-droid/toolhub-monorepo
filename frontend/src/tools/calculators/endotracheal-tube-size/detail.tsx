import type { ToolPageDetail } from '@/tools/page-detail';
import { EndotrachealTubeSizeGuideArticle } from './EndotrachealTubeSizeGuideArticle';
import { ETT_FAQS, ETT_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Educational pediatric ETT size estimates (Cole uncuffed / Khine-style cuffed, oral depth) — not an intubation protocol.',
  asideAriaLabel: 'Interactive Endotracheal Tube Size Calculator',
  tocItems: ETT_TOC_ITEMS,
  GuideArticle: EndotrachealTubeSizeGuideArticle,
  faqs: ETT_FAQS,
  countryRules: null,
};
