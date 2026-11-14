import type { ToolPageDetail } from '@/tools/page-detail';
import { NumberToBillionGuideArticle } from './NumberToBillionGuideArticle';
import { NUMBER_BILLION_FAQS, NUMBER_BILLION_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert any number to billions and billions back to numbers with short-scale scientific notation.',
  asideAriaLabel: 'Interactive number to billion converter',
  tocItems: NUMBER_BILLION_TOC_ITEMS,
  GuideArticle: NumberToBillionGuideArticle,
  faqs: NUMBER_BILLION_FAQS,
  countryRules: null,
};
