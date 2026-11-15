import type { ToolPageDetail } from '@/tools/page-detail';
import { DecimalToHexGuideArticle } from './DecimalToHexGuideArticle';
import { DECIMAL_HEX_FAQS, DECIMAL_HEX_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert decimal integers to hexadecimal and back, with optional signed 16-bit two’s-complement encoding.',
  asideAriaLabel: 'Interactive decimal to hexadecimal converter',
  tocItems: DECIMAL_HEX_TOC_ITEMS,
  GuideArticle: DecimalToHexGuideArticle,
  faqs: DECIMAL_HEX_FAQS,
  countryRules: null,
};
