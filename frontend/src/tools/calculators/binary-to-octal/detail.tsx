import type { ToolPageDetail } from '@/tools/page-detail';
import { BinaryToOctalGuideArticle } from './BinaryToOctalGuideArticle';
import { BINARY_OCTAL_FAQS, BINARY_OCTAL_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert binary to octal and octal to binary with exact three-bit grouping and step-by-step breakdowns.',
  asideAriaLabel: 'Interactive binary to octal converter',
  tocItems: BINARY_OCTAL_TOC_ITEMS,
  GuideArticle: BinaryToOctalGuideArticle,
  faqs: BINARY_OCTAL_FAQS,
  countryRules: null,
};
