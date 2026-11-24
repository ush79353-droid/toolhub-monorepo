import type { ToolPageDetail } from '@/tools/page-detail';
import { SteroidConversionGuideArticle } from './SteroidConversionGuideArticle';
import {
  STEROID_CONVERSION_FAQS,
  STEROID_CONVERSION_TOC_ITEMS,
} from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Educational systemic glucocorticoid mg equivalents by duration—anti-inflammatory table only, not taper or prescribing guidance.',
  asideAriaLabel: 'Interactive Steroid Conversion Calculator',
  tocItems: STEROID_CONVERSION_TOC_ITEMS,
  GuideArticle: SteroidConversionGuideArticle,
  faqs: STEROID_CONVERSION_FAQS,
  countryRules: null,
};
