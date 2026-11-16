import type { ToolPageDetail } from '@/tools/page-detail';
import { WeirdUnitsGuideArticle } from './WeirdUnitsGuideArticle';
import { WEIRD_UNITS_FAQS, WEIRD_UNITS_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert everyday length, mass, time, area, and volume into memorable references like LEGO bricks, Everest heights, and workdays — with documented assumptions.',
  asideAriaLabel: 'Interactive weird units converter',
  tocItems: WEIRD_UNITS_TOC_ITEMS,
  GuideArticle: WeirdUnitsGuideArticle,
  faqs: WEIRD_UNITS_FAQS,
  countryRules: null,
};
