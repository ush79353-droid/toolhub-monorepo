import type { ToolPageDetail } from '@/tools/page-detail';
import { TspToMlGuideArticle } from './TspToMlGuideArticle';
import { TSPML_FAQS, TSPML_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert teaspoons to milliliters instantly. Defaults to the metric teaspoon (5 mL); switch to US customary when needed.',
  asideAriaLabel: 'Interactive tsp to mL converter',
  tocItems: TSPML_TOC_ITEMS,
  GuideArticle: TspToMlGuideArticle,
  faqs: TSPML_FAQS,
  countryRules: null,
};
