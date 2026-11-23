import type { ToolPageDetail } from '@/tools/page-detail';
import { MitralValveAreaGuideArticle } from './MitralValveAreaGuideArticle';
import {
  MITRAL_VALVE_AREA_FAQS,
  MITRAL_VALVE_AREA_TOC_ITEMS,
} from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Educational Doppler mitral valve area from continuity, pressure half-time, or deceleration — not a stenosis diagnosis.',
  asideAriaLabel: 'Interactive Mitral Valve Area Calculator',
  tocItems: MITRAL_VALVE_AREA_TOC_ITEMS,
  GuideArticle: MitralValveAreaGuideArticle,
  faqs: MITRAL_VALVE_AREA_FAQS,
  countryRules: null,
};
