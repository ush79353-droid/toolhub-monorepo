import type { ToolPageDetail } from '@/tools/page-detail';
import { EffectiveCorporateTaxRateGuideArticle } from './EffectiveCorporateTaxRateGuideArticle';
import {
  EFFECTIVE_CORPORATE_TAX_RATE_FAQS,
  EFFECTIVE_CORPORATE_TAX_RATE_TOC_ITEMS,
} from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Divide income tax paid by earnings before tax to get the effective corporate tax rate. Currency changes the denomination only.',
  asideAriaLabel: 'Interactive effective corporate tax rate calculator',
  tocItems: EFFECTIVE_CORPORATE_TAX_RATE_TOC_ITEMS,
  GuideArticle: EffectiveCorporateTaxRateGuideArticle,
  faqs: EFFECTIVE_CORPORATE_TAX_RATE_FAQS,
  countryRules: null,
};
