import type { ToolPageDetail } from '@/tools/page-detail';
import { FeureaGuideArticle } from './FeureaGuideArticle';
import { FEUREA_FAQS, FEUREA_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Educational FEUrea from paired serum and urine urea/BUN and creatinine — not an AKI diagnosis.',
  asideAriaLabel: 'Interactive FEUrea Calculator',
  tocItems: FEUREA_TOC_ITEMS,
  GuideArticle: FeureaGuideArticle,
  faqs: FEUREA_FAQS,
  countryRules: null,
};
