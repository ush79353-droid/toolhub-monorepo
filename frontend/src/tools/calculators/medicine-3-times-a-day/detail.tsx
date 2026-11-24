import type { ToolPageDetail } from '@/tools/page-detail';
import { Medicine3TimesADayGuideArticle } from './Medicine3TimesADayGuideArticle';
import {
  MEDICINE_3_TIMES_A_DAY_FAQS,
  MEDICINE_3_TIMES_A_DAY_TOC_ITEMS,
} from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Educational dosing-interval worksheet for 2, 3, or 4 daily doses from your first dose time. Not a prescription or clinical advice.',
  asideAriaLabel: 'Interactive Medicine 3 Times a Day Calculator',
  tocItems: MEDICINE_3_TIMES_A_DAY_TOC_ITEMS,
  GuideArticle: Medicine3TimesADayGuideArticle,
  faqs: MEDICINE_3_TIMES_A_DAY_FAQS,
  countryRules: null,
};
