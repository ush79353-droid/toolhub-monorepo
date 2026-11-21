import type { ToolPageDetail } from '@/tools/page-detail';
import { BmiKidsGuideArticle } from './BmiKidsGuideArticle';
import { BMI_KIDS_FAQS, BMI_KIDS_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Calculate child BMI and BMI Prime from height and weight. Open “How healthy is this BMI?” for CDC BMI-for-age percentiles by exact age and sex — not adult WHO cut-offs or BMI Prime.',
  asideAriaLabel: 'Interactive BMI Calculator for Kids',
  tocItems: BMI_KIDS_TOC_ITEMS,
  GuideArticle: BmiKidsGuideArticle,
  faqs: BMI_KIDS_FAQS,
  countryRules: null,
};
