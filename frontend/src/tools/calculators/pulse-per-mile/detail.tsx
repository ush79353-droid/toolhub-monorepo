import type { ToolPageDetail } from '@/tools/page-detail';
import { PulsePerMileGuideArticle } from './PulsePerMileGuideArticle';
import { PPM_FAQS, PPM_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Calculate vehicle speed sensor pulses per mile and wheel rotations per mile from axle ratio, reluctor teeth, and tire diameter.',
  asideAriaLabel: 'Interactive Pulse per Mile Calculator',
  tocItems: PPM_TOC_ITEMS,
  GuideArticle: PulsePerMileGuideArticle,
  faqs: PPM_FAQS,
  countryRules: null,
};
