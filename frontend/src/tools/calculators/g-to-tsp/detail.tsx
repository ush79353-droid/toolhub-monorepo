import type { ToolPageDetail } from '@/tools/page-detail';
import { GToTspGuideArticle } from './GToTspGuideArticle';
import { G_TO_TSP_FAQS, G_TO_TSP_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert grams to teaspoons using ingredient density. Calculate g to US tsp or teaspoons to grams for salt, sugar, flour, honey, and more.',
  asideAriaLabel: 'Interactive grams to teaspoons converter',
  tocItems: G_TO_TSP_TOC_ITEMS,
  GuideArticle: GToTspGuideArticle,
  faqs: G_TO_TSP_FAQS,
  countryRules: null,
};
