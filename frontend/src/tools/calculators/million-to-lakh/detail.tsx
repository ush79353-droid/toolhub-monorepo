import type { ToolPageDetail } from '@/tools/page-detail';
import { MillionToLakhGuideArticle } from './MillionToLakhGuideArticle';
import { MILLION_LAKH_FAQS, MILLION_LAKH_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert millions to lakhs and lakhs to millions with Indian and international number formatting.',
  asideAriaLabel: 'Interactive million to lakh converter',
  tocItems: MILLION_LAKH_TOC_ITEMS,
  GuideArticle: MillionToLakhGuideArticle,
  faqs: MILLION_LAKH_FAQS,
  countryRules: null,
};
