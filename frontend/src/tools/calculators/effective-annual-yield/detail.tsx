import type { ToolPageDetail } from '@/tools/page-detail';
import { EffectiveAnnualYieldGuideArticle } from './EffectiveAnnualYieldGuideArticle';
import {
  EFFECTIVE_ANNUAL_YIELD_FAQS,
  EFFECTIVE_ANNUAL_YIELD_TOC_ITEMS,
} from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert coupon rate into effective annual yield from face value, annual coupon, and payment frequency.',
  asideAriaLabel: 'Interactive Effective Annual Yield Calculator',
  tocItems: EFFECTIVE_ANNUAL_YIELD_TOC_ITEMS,
  GuideArticle: EffectiveAnnualYieldGuideArticle,
  faqs: EFFECTIVE_ANNUAL_YIELD_FAQS,
  countryRules: null,
};
