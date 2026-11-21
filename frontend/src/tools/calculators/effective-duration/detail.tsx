import type { ToolPageDetail } from '@/tools/page-detail';
import { EffectiveDurationGuideArticle } from './EffectiveDurationGuideArticle';
import {
  EFFECTIVE_DURATION_FAQS,
  EFFECTIVE_DURATION_TOC_ITEMS,
} from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    "Calculate how sensitive a bond's price is to changes in market yields using the effective duration formula. Estimate interest-rate sensitivity from coupon bond pricing or scenario-based prices for option-aware analysis.",
  asideAriaLabel: 'Interactive Effective Duration Calculator',
  tocItems: EFFECTIVE_DURATION_TOC_ITEMS,
  GuideArticle: EffectiveDurationGuideArticle,
  faqs: EFFECTIVE_DURATION_FAQS,
  countryRules: null,
};
