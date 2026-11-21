import type { ToolPageDetail } from '@/tools/page-detail';
import { PregnancyWeightGainWeekByWeekGuideArticle } from './PregnancyWeightGainWeekByWeekGuideArticle';
import { PWG_WEEK_FAQS, PWG_WEEK_TOC } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Chart IOM pregnancy weight-gain ranges week by week from pre-pregnancy BMI. Educational ranges only—not medical advice.',
  asideAriaLabel: 'Interactive Pregnancy Weight Gain Week by Week Breakdown',
  tocItems: PWG_WEEK_TOC,
  GuideArticle: PregnancyWeightGainWeekByWeekGuideArticle,
  faqs: PWG_WEEK_FAQS,
  countryRules: null,
};
