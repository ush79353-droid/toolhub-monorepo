import type { ToolPageDetail } from '@/tools/page-detail';
import { NumberToMillionGuideArticle } from './NumberToMillionGuideArticle';
import { NUMBER_MILLION_FAQS, NUMBER_MILLION_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert any number to millions and millions back to numbers with short-scale scientific notation.',
  asideAriaLabel: 'Interactive number to million converter',
  tocItems: NUMBER_MILLION_TOC_ITEMS,
  GuideArticle: NumberToMillionGuideArticle,
  faqs: NUMBER_MILLION_FAQS,
  countryRules: null,
};
