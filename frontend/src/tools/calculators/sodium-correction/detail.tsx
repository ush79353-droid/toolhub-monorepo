import type { ToolPageDetail } from '@/tools/page-detail';
import { SodiumCorrectionGuideArticle } from './SodiumCorrectionGuideArticle';
import {
  SODIUM_CORRECTION_FAQS,
  SODIUM_CORRECTION_TOC_ITEMS,
} from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Estimate hyperglycemia-corrected serum sodium with Hillier (and optional Katz) — educational only.',
  asideAriaLabel: 'Interactive Sodium Correction Calculator',
  tocItems: SODIUM_CORRECTION_TOC_ITEMS,
  GuideArticle: SodiumCorrectionGuideArticle,
  faqs: SODIUM_CORRECTION_FAQS,
  countryRules: null,
};
