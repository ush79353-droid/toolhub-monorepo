import type { ToolPageDetail } from '@/tools/page-detail';
import { NewtonMeterGuideArticle } from './NewtonMeterGuideArticle';
import { NEWTON_METER_FAQS, NEWTON_METER_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert newton-meters (N·m) to foot-pounds (ft·lbf) and other torque units instantly.',
  asideAriaLabel: 'Interactive newton meter calculator',
  tocItems: NEWTON_METER_TOC_ITEMS,
  GuideArticle: NewtonMeterGuideArticle,
  faqs: NEWTON_METER_FAQS,
  countryRules: null,
};
