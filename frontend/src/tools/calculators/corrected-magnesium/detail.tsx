import type { ToolPageDetail } from '@/tools/page-detail';
import { CorrectedMagnesiumGuideArticle } from './CorrectedMagnesiumGuideArticle';
import {
  CORRECTED_MAGNESIUM_FAQS,
  CORRECTED_MAGNESIUM_TOC_ITEMS,
} from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Estimate albumin-adjusted magnesium with the Kroll & Elin teaching formula — educational only.',
  asideAriaLabel: 'Interactive Corrected Magnesium Calculator',
  tocItems: CORRECTED_MAGNESIUM_TOC_ITEMS,
  GuideArticle: CorrectedMagnesiumGuideArticle,
  faqs: CORRECTED_MAGNESIUM_FAQS,
  countryRules: null,
};
