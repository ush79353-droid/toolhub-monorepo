import type { ToolPageDetail } from '@/tools/page-detail';
import { FeetConverterGuideArticle } from './FeetConverterGuideArticle';
import { FEET_FAQS, FEET_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert feet to meters, centimeters, inches, yards, miles, and more — 1 ft = 0.3048 m exactly.',
  asideAriaLabel: 'Interactive feet converter',
  tocItems: FEET_TOC_ITEMS,
  GuideArticle: FeetConverterGuideArticle,
  faqs: FEET_FAQS,
  countryRules: null,
};
