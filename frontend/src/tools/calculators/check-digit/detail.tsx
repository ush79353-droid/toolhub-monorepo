import type { ToolPageDetail } from '@/tools/page-detail';
import { CheckDigitGuideArticle } from './CheckDigitGuideArticle';
import { CHECK_DIGIT_FAQS, CHECK_DIGIT_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Generate and verify GS1 Modulo 10 check digits for GTIN-8, UPC-A, EAN-13, and GTIN-14 barcode numbers.',
  asideAriaLabel: 'Interactive Check Digit Calculator',
  tocItems: CHECK_DIGIT_TOC_ITEMS,
  GuideArticle: CheckDigitGuideArticle,
  faqs: CHECK_DIGIT_FAQS,
  countryRules: null,
};
