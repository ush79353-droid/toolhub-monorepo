import type { ToolPageDetail } from '@/tools/page-detail';
import { SquareFeetConverterGuideArticle } from './SquareFeetConverterGuideArticle';
import { SQFT_CONVERTER_FAQS, SQFT_CONVERTER_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert square feet to square meters, inches, yards, acres, and more — or reverse the conversion instantly.',
  asideAriaLabel: 'Interactive square feet area converter',
  tocItems: SQFT_CONVERTER_TOC_ITEMS,
  GuideArticle: SquareFeetConverterGuideArticle,
  faqs: SQFT_CONVERTER_FAQS,
  countryRules: null,
};
