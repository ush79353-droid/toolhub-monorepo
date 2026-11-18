import type { ToolPageDetail } from '@/tools/page-detail';
import { UppercaseToLowercaseGuideArticle } from './UppercaseToLowercaseGuideArticle';
import { UPPERCASE_TO_LOWERCASE_FAQS, UPPERCASE_TO_LOWERCASE_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert uppercase and mixed-case text to lowercase instantly. Paste sentences or paragraphs, then copy the result — all in your browser.',
  asideAriaLabel: 'Interactive uppercase to lowercase converter',
  tocItems: UPPERCASE_TO_LOWERCASE_TOC_ITEMS,
  GuideArticle: UppercaseToLowercaseGuideArticle,
  faqs: UPPERCASE_TO_LOWERCASE_FAQS,
  countryRules: null,
};
