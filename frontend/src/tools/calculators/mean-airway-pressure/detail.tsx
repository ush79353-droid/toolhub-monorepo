import type { ToolPageDetail } from '@/tools/page-detail';
import { MeanAirwayPressureGuideArticle } from './MeanAirwayPressureGuideArticle';
import { MAP_FAQS, MAP_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Educational mean airway pressure (Pmean = PEEP + k×(PIP−PEEP)×Ti/Ttot) — not a ventilator order.',
  asideAriaLabel: 'Interactive Mean Airway Pressure Calculator',
  tocItems: MAP_TOC_ITEMS,
  GuideArticle: MeanAirwayPressureGuideArticle,
  faqs: MAP_FAQS,
  countryRules: null,
};
