import type { ToolPageDetail } from '@/tools/page-detail';
import { BinaryToHexGuideArticle } from './BinaryToHexGuideArticle';
import { BINARY_HEX_FAQS, BINARY_HEX_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert binary integers to hexadecimal with decimal and octal equivalents, plus optional reverse conversion.',
  asideAriaLabel: 'Interactive binary to hexadecimal converter',
  tocItems: BINARY_HEX_TOC_ITEMS,
  GuideArticle: BinaryToHexGuideArticle,
  faqs: BINARY_HEX_FAQS,
  countryRules: null,
};
