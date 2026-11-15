import type { ToolPageDetail } from '@/tools/page-detail';
import { UnicodeTextGuideArticle } from './UnicodeTextGuideArticle';
import { UNICODE_FAQS, UNICODE_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert ordinary text into circled, squared, inverted, and monospaced Unicode styles you can copy and paste.',
  asideAriaLabel: 'Interactive Unicode text converter',
  tocItems: UNICODE_TOC_ITEMS,
  GuideArticle: UnicodeTextGuideArticle,
  faqs: UNICODE_FAQS,
  countryRules: null,
};
