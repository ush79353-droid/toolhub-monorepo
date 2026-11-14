import type { ToolPageDetail } from '@/tools/page-detail';
import { SHIFT_PAY_FAQS, SHIFT_PAY_TOC_ITEMS } from './content';
import { TwelveHourShiftPayGuideArticle } from './TwelveHourShiftPayGuideArticle';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Price a 12-hour shift from an hourly wage, an overtime wage, and regular hours, then see day, week, month, and year pay.',
  asideAriaLabel: 'Interactive 12-hour shift pay calculator',
  tocItems: SHIFT_PAY_TOC_ITEMS,
  GuideArticle: TwelveHourShiftPayGuideArticle,
  faqs: SHIFT_PAY_FAQS,
  countryRules: null,
};
