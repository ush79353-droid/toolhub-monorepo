import type { ToolPageDetail } from '@/tools/page-detail';
import { GalToGramsGuideArticle } from './GalToGramsGuideArticle';
import { GAL_TO_GRAMS_FAQS, GAL_TO_GRAMS_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert US liquid gallons to grams using substance density. Select water, milk, oil, or enter a custom density for accurate volume-to-mass conversion.',
  asideAriaLabel: 'Interactive gallons to grams converter',
  tocItems: GAL_TO_GRAMS_TOC_ITEMS,
  GuideArticle: GalToGramsGuideArticle,
  faqs: GAL_TO_GRAMS_FAQS,
  countryRules: null,
};
