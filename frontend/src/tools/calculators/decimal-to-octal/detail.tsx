import type { ToolPageDetail } from '@/tools/page-detail';
import { DecimalToOctalGuideArticle } from './DecimalToOctalGuideArticle';
import { DECIMAL_OCTAL_FAQS, DECIMAL_OCTAL_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert decimal numbers to octal and octal to decimal with exact BigInt precision and step-by-step calculations.',
  asideAriaLabel: 'Interactive decimal to octal converter',
  tocItems: DECIMAL_OCTAL_TOC_ITEMS,
  GuideArticle: DecimalToOctalGuideArticle,
  faqs: DECIMAL_OCTAL_FAQS,
  countryRules: null,
};
