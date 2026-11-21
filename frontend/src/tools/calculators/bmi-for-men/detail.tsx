import type { ToolPageDetail } from '@/tools/page-detail';
import { BmiForMenGuideArticle } from './BmiForMenGuideArticle';
import { BMI_FOR_MEN_FAQS, BMI_FOR_MEN_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Use our BMI Calculator for Men to find BMI and BMI Prime from height and weight. Adult results follow WHO categories; age under 20 withholds adult cut-offs.',
  asideAriaLabel: 'Interactive BMI Calculator for Men',
  tocItems: BMI_FOR_MEN_TOC_ITEMS,
  GuideArticle: BmiForMenGuideArticle,
  faqs: BMI_FOR_MEN_FAQS,
  countryRules: null,
};
