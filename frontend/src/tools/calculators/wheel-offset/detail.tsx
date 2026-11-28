import type { ToolPageDetail } from '@/tools/page-detail';
import { WheelOffsetGuideArticle } from './WheelOffsetGuideArticle';
import { WO_FAQS, WO_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Compare current and replacement wheel width and offset (ET) to estimate inner clearance and outer position changes — nominal rim edges only, not a fitment guarantee.',
  asideAriaLabel: 'Interactive Wheel Offset Calculator',
  tocItems: WO_TOC_ITEMS,
  GuideArticle: WheelOffsetGuideArticle,
  faqs: WO_FAQS,
  countryRules: null,
};
