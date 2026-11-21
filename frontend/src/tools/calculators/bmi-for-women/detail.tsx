import type { ToolPageDetail } from '@/tools/page-detail';
import { BmiForWomenGuideArticle } from './BmiForWomenGuideArticle';
import { BMI_FOR_WOMEN_FAQS, BMI_FOR_WOMEN_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Use our BMI Calculator for Women to find BMI and BMI Prime from height and weight. Adult results follow WHO categories; age under 20 withholds adult cut-offs. Do not use adult labels to evaluate pregnancy weight.',
  asideAriaLabel: 'Interactive BMI Calculator for Women',
  tocItems: BMI_FOR_WOMEN_TOC_ITEMS,
  GuideArticle: BmiForWomenGuideArticle,
  faqs: BMI_FOR_WOMEN_FAQS,
  countryRules: null,
};
