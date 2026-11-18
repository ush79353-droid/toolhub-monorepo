import type { ToolPageDetail } from '@/tools/page-detail';
import { GramsToFlOzGuideArticle } from './GramsToFlOzGuideArticle';
import { GRAMS_TO_FL_OZ_FAQS, GRAMS_TO_FL_OZ_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert grams to US or UK fluid ounces using substance density. Calculate g to fl oz or fluid ounces to grams for water, milk, honey, oil, and custom densities.',
  asideAriaLabel: 'Interactive grams to fluid ounces converter',
  tocItems: GRAMS_TO_FL_OZ_TOC_ITEMS,
  GuideArticle: GramsToFlOzGuideArticle,
  faqs: GRAMS_TO_FL_OZ_FAQS,
  countryRules: null,
};
