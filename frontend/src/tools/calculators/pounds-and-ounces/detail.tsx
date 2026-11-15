import type { ToolPageDetail } from '@/tools/page-detail';
import { POUNDS_AND_OUNCES_FAQS, POUNDS_AND_OUNCES_TOC_ITEMS } from './content';
import { PoundsAndOuncesGuideArticle } from './PoundsAndOuncesGuideArticle';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert pounds, ounces, mixed lb+oz, grams, kilograms, and stones. Add multiple mixed-weight measurements with automatic ounce normalization.',
  asideAriaLabel: 'Interactive pounds and ounces calculator',
  tocItems: POUNDS_AND_OUNCES_TOC_ITEMS,
  GuideArticle: PoundsAndOuncesGuideArticle,
  faqs: POUNDS_AND_OUNCES_FAQS,
  countryRules: null,
};
