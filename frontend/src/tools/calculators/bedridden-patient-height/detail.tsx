import type { ToolPageDetail } from '@/tools/page-detail';
import { BedriddenGuideArticle } from './BedriddenGuideArticle';
import { BEDRIDDEN_FAQS, BEDRIDDEN_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Educational stature and weight estimates from bedside anthropometry — not a clinical scale substitute.',
  asideAriaLabel: 'Interactive Bedridden Patient Height Calculator',
  tocItems: BEDRIDDEN_TOC_ITEMS,
  GuideArticle: BedriddenGuideArticle,
  faqs: BEDRIDDEN_FAQS,
  countryRules: null,
};
