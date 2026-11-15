import type { ToolPageDetail } from '@/tools/page-detail';
import { AbsencePercentageGuideArticle } from './AbsencePercentageGuideArticle';
import { ABSENCE_PERCENTAGE_FAQS, ABSENCE_PERCENTAGE_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Calculate workforce absenteeism rate from total employees, workdays per employee, and days absent.',
  asideAriaLabel: 'Interactive absence percentage calculator',
  tocItems: ABSENCE_PERCENTAGE_TOC_ITEMS,
  GuideArticle: AbsencePercentageGuideArticle,
  faqs: ABSENCE_PERCENTAGE_FAQS,
  countryRules: null,
};
