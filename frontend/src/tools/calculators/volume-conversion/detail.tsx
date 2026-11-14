import type { ToolPageDetail } from '@/tools/page-detail';
import { VOLUME_CONVERSION_FAQS, VOLUME_CONVERSION_TOC_ITEMS } from './content';
import { VolumeConversionGuideArticle } from './VolumeConversionGuideArticle';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert milliliters, liters, gallons, quarts, pints, cups, fluid ounces, tablespoons, teaspoons, and cubic units with live multi-field synchronization.',
  asideAriaLabel: 'Interactive volume conversion calculator',
  tocItems: VOLUME_CONVERSION_TOC_ITEMS,
  GuideArticle: VolumeConversionGuideArticle,
  faqs: VOLUME_CONVERSION_FAQS,
  countryRules: null,
};
