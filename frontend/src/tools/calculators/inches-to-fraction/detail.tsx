import type { ToolPageDetail } from '@/tools/page-detail';
import { InchesToFractionGuideArticle } from './InchesToFractionGuideArticle';
import { INCHES_TO_FRACTION_FAQS, INCHES_TO_FRACTION_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert decimal inches to readable fractions at 1/2 through 1/256 precision, with mixed numbers and metric equivalents.',
  asideAriaLabel: 'Interactive inches to fraction calculator',
  tocItems: INCHES_TO_FRACTION_TOC_ITEMS,
  GuideArticle: InchesToFractionGuideArticle,
  faqs: INCHES_TO_FRACTION_FAQS,
  countryRules: null,
};
