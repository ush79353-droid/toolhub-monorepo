import type { ToolPageDetail } from '@/tools/page-detail';
import { LiterToCcGuideArticle } from './LiterToCcGuideArticle';
import { LITER_TO_CC_FAQS, LITER_TO_CC_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert liters to cubic centimeters (cc) and back instantly using the exact factor 1 L = 1000 cc.',
  asideAriaLabel: 'Interactive liter to cc converter',
  tocItems: LITER_TO_CC_TOC_ITEMS,
  GuideArticle: LiterToCcGuideArticle,
  faqs: LITER_TO_CC_FAQS,
  countryRules: null,
};
