import type { ToolPageDetail } from '@/tools/page-detail';
import { MillionToThousandGuideArticle } from './MillionToThousandGuideArticle';
import { MILLION_THOUSAND_FAQS, MILLION_THOUSAND_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert millions to thousands and thousands to millions with absolute decimal and scientific notation.',
  asideAriaLabel: 'Interactive million to thousand converter',
  tocItems: MILLION_THOUSAND_TOC_ITEMS,
  GuideArticle: MillionToThousandGuideArticle,
  faqs: MILLION_THOUSAND_FAQS,
  countryRules: null,
};
