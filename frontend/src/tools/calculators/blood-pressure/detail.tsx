import type { ToolPageDetail } from '@/tools/page-detail';
import { BloodPressureGuideArticle } from './BloodPressureGuideArticle';
import { BLOOD_PRESSURE_FAQS, BLOOD_PRESSURE_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Educational office blood-pressure category lookup using ACC/AHA or 2018 joint ESC/ESH tables. Labels one systolic/diastolic reading — not a clinical diagnosis.',
  asideAriaLabel: 'Interactive Blood Pressure Calculator',
  tocItems: BLOOD_PRESSURE_TOC_ITEMS,
  GuideArticle: BloodPressureGuideArticle,
  faqs: BLOOD_PRESSURE_FAQS,
  countryRules: null,
};
