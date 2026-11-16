import type { ToolPageDetail } from '@/tools/page-detail';
import { CcToGramsGuideArticle } from './CcToGramsGuideArticle';
import { CC_TO_GRAMS_FAQS, CC_TO_GRAMS_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert cubic centimeters (cc) to grams and grams to cc using substance density. Default water ≈ 1 g/cm³ near 4 °C.',
  asideAriaLabel: 'Interactive CC to grams converter',
  tocItems: CC_TO_GRAMS_TOC_ITEMS,
  GuideArticle: CcToGramsGuideArticle,
  faqs: CC_TO_GRAMS_FAQS,
  countryRules: null,
};
