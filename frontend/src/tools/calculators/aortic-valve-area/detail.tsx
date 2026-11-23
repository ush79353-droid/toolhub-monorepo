import type { ToolPageDetail } from '@/tools/page-detail';
import { AorticValveAreaGuideArticle } from './AorticValveAreaGuideArticle';
import {
  AORTIC_VALVE_AREA_FAQS,
  AORTIC_VALVE_AREA_TOC_ITEMS,
} from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Educational continuity-equation aortic valve area from LVOT diameter and VTIs — not a stenosis diagnosis.',
  asideAriaLabel: 'Interactive Aortic Valve Area Calculator',
  tocItems: AORTIC_VALVE_AREA_TOC_ITEMS,
  GuideArticle: AorticValveAreaGuideArticle,
  faqs: AORTIC_VALVE_AREA_FAQS,
  countryRules: null,
};
