import type { ToolPageDetail } from '@/tools/page-detail';
import { OvulationGuideArticle } from './OvulationGuideArticle';
import { OVULATION_FAQS, OVULATION_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Educational ovulation day, fertile window, and approximate due dates for three cycles from cycle length and LMP — dates are approximate, not clinical advice.',
  asideAriaLabel: 'Interactive Ovulation Calculator',
  tocItems: OVULATION_TOC_ITEMS,
  GuideArticle: OvulationGuideArticle,
  faqs: OVULATION_FAQS,
  countryRules: null,
};
