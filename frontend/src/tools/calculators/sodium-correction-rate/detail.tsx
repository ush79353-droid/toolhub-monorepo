import type { ToolPageDetail } from '@/tools/page-detail';
import { SodiumCorrectionRateGuideArticle } from './SodiumCorrectionRateGuideArticle';
import {
  SODIUM_CORRECTION_RATE_FAQS,
  SODIUM_CORRECTION_RATE_TOC_ITEMS,
} from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Estimate Adrogué–Madias ΔNa per liter and infusion rate from TBW, serum Na, and fluid — educational only.',
  asideAriaLabel: 'Interactive Sodium Correction Rate Calculator',
  tocItems: SODIUM_CORRECTION_RATE_TOC_ITEMS,
  GuideArticle: SodiumCorrectionRateGuideArticle,
  faqs: SODIUM_CORRECTION_RATE_FAQS,
  countryRules: null,
};
