import type { ToolPageDetail } from '@/tools/page-detail';
import { DECAGRAM_TO_GRAM_FAQS, DECAGRAM_TO_GRAM_TOC_ITEMS } from './content';
import { DecagramToGramGuideArticle } from './DecagramToGramGuideArticle';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert decagrams to grams and grams to decagrams using the exact factor 1 dag = 10 g.',
  asideAriaLabel: 'Interactive decagram to gram converter',
  tocItems: DECAGRAM_TO_GRAM_TOC_ITEMS,
  GuideArticle: DecagramToGramGuideArticle,
  faqs: DECAGRAM_TO_GRAM_FAQS,
  countryRules: null,
};
