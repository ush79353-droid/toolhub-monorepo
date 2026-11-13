import type { ToolPageDetail } from '@/tools/page-detail';
import { SHIFT_PAY_FAQS, SHIFT_PAY_TOC_ITEMS } from './content';
import { TwelveHourShiftPayGuideArticle } from './TwelveHourShiftPayGuideArticle';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Split one shift into regular hours and overtime hours, then project week, month, and year pay from the schedule you set.',
  asideAriaLabel: 'Interactive 12-hour shift pay calculator',
  tocItems: SHIFT_PAY_TOC_ITEMS,
  GuideArticle: TwelveHourShiftPayGuideArticle,
  faqs: SHIFT_PAY_FAQS,
  countryRules: null,
};
