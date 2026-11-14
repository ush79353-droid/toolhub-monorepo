import type { ToolPageDetail } from '@/tools/page-detail';
import { BinaryGuideArticle } from './BinaryGuideArticle';
import { BINARY_FAQS, BINARY_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert decimal integers to fixed-width binary and binary back to signed decimals with two’s complement.',
  asideAriaLabel: 'Interactive binary converter',
  tocItems: BINARY_TOC_ITEMS,
  GuideArticle: BinaryGuideArticle,
  faqs: BINARY_FAQS,
  countryRules: null,
};
