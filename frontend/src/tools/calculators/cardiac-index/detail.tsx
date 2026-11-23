import type { ToolPageDetail } from '@/tools/page-detail';
import { CardiacIndexGuideArticle } from './CardiacIndexGuideArticle';
import { CARDIAC_INDEX_FAQS, CARDIAC_INDEX_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Educational cardiac index (L/min/m²) from known cardiac output or Fick principle using Mosteller BSA — not a clinical monitoring decision.',
  asideAriaLabel: 'Interactive Cardiac Index Calculator',
  tocItems: CARDIAC_INDEX_TOC_ITEMS,
  GuideArticle: CardiacIndexGuideArticle,
  faqs: CARDIAC_INDEX_FAQS,
  countryRules: null,
};
