import type { ToolPageDetail } from '@/tools/page-detail';
import { PoundsToGramsGuideArticle } from './PoundsToGramsGuideArticle';
import { POUNDS_TO_GRAMS_FAQS, POUNDS_TO_GRAMS_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert pounds to grams and grams to pounds instantly. Exact: 1 lb = 453.59237 g.',
  asideAriaLabel: 'Interactive pounds to grams converter',
  tocItems: POUNDS_TO_GRAMS_TOC_ITEMS,
  GuideArticle: PoundsToGramsGuideArticle,
  faqs: POUNDS_TO_GRAMS_FAQS,
  countryRules: null,
};
