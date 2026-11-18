import type { ToolPageDetail } from '@/tools/page-detail';
import { OunceToKgGuideArticle } from './OunceToKgGuideArticle';
import { OUNCE_TO_KG_FAQS, OUNCE_TO_KG_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert ounces to kilograms and kilograms to ounces — exact avoirdupois: 1 oz = 0.028349523125 kg, with linked pounds.',
  asideAriaLabel: 'Interactive ounce to kilogram converter',
  tocItems: OUNCE_TO_KG_TOC_ITEMS,
  GuideArticle: OunceToKgGuideArticle,
  faqs: OUNCE_TO_KG_FAQS,
  countryRules: null,
};
