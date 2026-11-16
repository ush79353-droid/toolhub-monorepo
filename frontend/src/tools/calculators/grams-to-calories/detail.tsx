import type { ToolPageDetail } from '@/tools/page-detail';
import { GramsToCaloriesGuideArticle } from './GramsToCaloriesGuideArticle';
import { GRAMS_TO_CALORIES_FAQS, GRAMS_TO_CALORIES_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert grams of carbohydrates, protein, fat, and alcohol into kilocalories using Atwater factors.',
  asideAriaLabel: 'Interactive grams to calories calculator',
  tocItems: GRAMS_TO_CALORIES_TOC_ITEMS,
  GuideArticle: GramsToCaloriesGuideArticle,
  faqs: GRAMS_TO_CALORIES_FAQS,
  countryRules: null,
};
