import type { ToolPageDetail } from '@/tools/page-detail';
import { OuncesToPoundsGuideArticle } from './OuncesToPoundsGuideArticle';
import { OUNCES_TO_POUNDS_FAQS, OUNCES_TO_POUNDS_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert ounces to pounds and pounds to ounces — exact avoirdupois: 1 lb = 16 oz, with linked kilograms.',
  asideAriaLabel: 'Interactive ounces to pounds converter',
  tocItems: OUNCES_TO_POUNDS_TOC_ITEMS,
  GuideArticle: OuncesToPoundsGuideArticle,
  faqs: OUNCES_TO_POUNDS_FAQS,
  countryRules: null,
};
