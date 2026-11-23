import type { ToolPageDetail } from '@/tools/page-detail';
import { LvGuideArticle } from './LvGuideArticle';
import { LV_FAQS, LV_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Educational ASE cube-formula left ventricular mass, LVMI, and relative wall thickness from linear echo dimensions.',
  asideAriaLabel: 'Interactive LV Calculator',
  tocItems: LV_TOC_ITEMS,
  GuideArticle: LvGuideArticle,
  faqs: LV_FAQS,
  countryRules: null,
};
