import type { ToolPageDetail } from '@/tools/page-detail';
import { GramsInMlGuideArticle } from './GramsInMlGuideArticle';
import { GRAMS_IN_ML_FAQS, GRAMS_IN_ML_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert grams to milliliters using ingredient density. Calculate g to mL or mL to grams for water, milk, honey, oil, flour, and custom densities.',
  asideAriaLabel: 'Interactive grams in milliliters converter',
  tocItems: GRAMS_IN_ML_TOC_ITEMS,
  GuideArticle: GramsInMlGuideArticle,
  faqs: GRAMS_IN_ML_FAQS,
  countryRules: null,
};
