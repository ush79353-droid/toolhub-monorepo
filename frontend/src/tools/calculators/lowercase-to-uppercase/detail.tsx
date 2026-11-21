import type { ToolPageDetail } from '@/tools/page-detail';
import { LowercaseToUppercaseGuideArticle } from './LowercaseToUppercaseGuideArticle';
import {
  LOWERCASE_TO_UPPERCASE_FAQS,
  LOWERCASE_TO_UPPERCASE_TOC_ITEMS,
} from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert lowercase and mixed-case text to uppercase instantly. Paste words, sentences, or paragraphs, then copy the result. Optional title, sentence, and toggle modes included.',
  asideAriaLabel: 'Interactive lowercase to uppercase converter',
  tocItems: LOWERCASE_TO_UPPERCASE_TOC_ITEMS,
  GuideArticle: LowercaseToUppercaseGuideArticle,
  faqs: LOWERCASE_TO_UPPERCASE_FAQS,
  countryRules: null,
};
