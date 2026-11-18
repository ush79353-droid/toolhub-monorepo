import type { ToolPageDetail } from '@/tools/page-detail';
import { JoulesToVoltsGuideArticle } from './JoulesToVoltsGuideArticle';
import { JOULES_TO_VOLTS_FAQS, JOULES_TO_VOLTS_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert between electrical energy (joules), charge (coulombs), and voltage using V = E / Q — joules alone are not enough.',
  asideAriaLabel: 'Interactive joules to volts calculator',
  tocItems: JOULES_TO_VOLTS_TOC_ITEMS,
  GuideArticle: JoulesToVoltsGuideArticle,
  faqs: JOULES_TO_VOLTS_FAQS,
  countryRules: null,
};
