import type { ToolPageDetail } from '@/tools/page-detail';
import { GrToMlGuideArticle } from './GrToMlGuideArticle';
import { GR_TO_ML_FAQS, GR_TO_ML_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert grams (gr / g) to milliliters using substance density. Calculate g to mL or mL to grams for water, milk, honey, oil, and custom densities.',
  asideAriaLabel: 'Interactive grams to milliliters converter',
  tocItems: GR_TO_ML_TOC_ITEMS,
  GuideArticle: GrToMlGuideArticle,
  faqs: GR_TO_ML_FAQS,
  countryRules: null,
};
