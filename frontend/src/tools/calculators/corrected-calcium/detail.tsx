import type { ToolPageDetail } from '@/tools/page-detail';
import { CorrectedCalciumGuideArticle } from './CorrectedCalciumGuideArticle';
import { CORRECTED_CALCIUM_FAQS, CORRECTED_CALCIUM_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Estimate albumin-adjusted total calcium with the Payne teaching formula — educational only.',
  asideAriaLabel: 'Interactive Corrected Calcium Calculator',
  tocItems: CORRECTED_CALCIUM_TOC_ITEMS,
  GuideArticle: CorrectedCalciumGuideArticle,
  faqs: CORRECTED_CALCIUM_FAQS,
  countryRules: null,
};
