import type { ToolPageDetail } from '@/tools/page-detail';
import { BmiTeensGuideArticle } from './BmiTeensGuideArticle';
import { BMI_TEENS_FAQS, BMI_TEENS_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Use our BMI Calculator for Teens to find BMI and BMI Prime from height and weight, then interpret results with CDC BMI-for-age percentiles for ages 10–20.',
  asideAriaLabel: 'Interactive BMI Calculator for Teens',
  tocItems: BMI_TEENS_TOC_ITEMS,
  GuideArticle: BmiTeensGuideArticle,
  faqs: BMI_TEENS_FAQS,
  countryRules: null,
};
