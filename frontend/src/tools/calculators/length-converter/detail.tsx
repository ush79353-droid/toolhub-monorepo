import type { ToolPageDetail } from '@/tools/page-detail';
import { LengthConverterGuideArticle } from './LengthConverterGuideArticle';
import { LENGTH_CONVERTER_FAQS, LENGTH_CONVERTER_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert length among meters, kilometers, feet, inches, miles, and scientific or nautical units.',
  asideAriaLabel: 'Interactive length converter',
  tocItems: LENGTH_CONVERTER_TOC_ITEMS,
  GuideArticle: LengthConverterGuideArticle,
  faqs: LENGTH_CONVERTER_FAQS,
  countryRules: null,
};
