import type { ToolPageDetail } from '@/tools/page-detail';
import { GRAMS_TO_OUNCES_FAQS, GRAMS_TO_OUNCES_TOC_ITEMS } from './content';
import { GramsToOuncesGuideArticle } from './GramsToOuncesGuideArticle';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert grams to avoirdupois ounces and ounces to grams using the exact factor 1 oz = 28.349523125 g. Mass only — not fluid ounces.',
  asideAriaLabel: 'Interactive grams to ounces calculator',
  tocItems: GRAMS_TO_OUNCES_TOC_ITEMS,
  GuideArticle: GramsToOuncesGuideArticle,
  faqs: GRAMS_TO_OUNCES_FAQS,
  countryRules: null,
};
