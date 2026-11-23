import type { ToolPageDetail } from '@/tools/page-detail';
import { BenzodiazepineConversionGuideArticle } from './BenzodiazepineConversionGuideArticle';
import {
  BENZODIAZEPINE_CONVERSION_FAQS,
  BENZODIAZEPINE_CONVERSION_TOC_ITEMS,
} from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Approximate benzodiazepine and barbiturate dose equivalencies — educational comparison only.',
  asideAriaLabel: 'Interactive Benzodiazepine Conversion Calculator',
  tocItems: BENZODIAZEPINE_CONVERSION_TOC_ITEMS,
  GuideArticle: BenzodiazepineConversionGuideArticle,
  faqs: BENZODIAZEPINE_CONVERSION_FAQS,
  countryRules: null,
};