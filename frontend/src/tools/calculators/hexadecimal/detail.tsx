import type { ToolPageDetail } from '@/tools/page-detail';
import { HexadecimalGuideArticle } from './HexadecimalGuideArticle';
import { HEX_FAQS, HEX_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert decimal and binary to hexadecimal, or hex to decimal and binary, with exact integer math and step-by-step breakdowns.',
  asideAriaLabel: 'Interactive hexadecimal converter',
  tocItems: HEX_TOC_ITEMS,
  GuideArticle: HexadecimalGuideArticle,
  faqs: HEX_FAQS,
  countryRules: null,
};
