import type { ToolPageDetail } from '@/tools/page-detail';
import { OuncesToGramsGuideArticle } from './OuncesToGramsGuideArticle';
import { OUNCES_TO_GRAMS_FAQS, OUNCES_TO_GRAMS_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert ounces to grams and grams to ounces — exact avoirdupois: 1 oz = 28.349523125 g.',
  asideAriaLabel: 'Interactive ounces to grams converter',
  tocItems: OUNCES_TO_GRAMS_TOC_ITEMS,
  GuideArticle: OuncesToGramsGuideArticle,
  faqs: OUNCES_TO_GRAMS_FAQS,
  countryRules: null,
};
