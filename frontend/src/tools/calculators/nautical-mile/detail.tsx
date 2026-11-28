import type { ToolPageDetail } from '@/tools/page-detail';
import { NauticalMileGuideArticle } from './NauticalMileGuideArticle';
import { NM_FAQS, NM_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert nautical miles to kilometers and statute miles, and calculate travel distance, speed, and time using knots.',
  asideAriaLabel: 'Interactive Nautical Mile Calculator',
  tocItems: NM_TOC_ITEMS,
  GuideArticle: NauticalMileGuideArticle,
  faqs: NM_FAQS,
  countryRules: null,
};
