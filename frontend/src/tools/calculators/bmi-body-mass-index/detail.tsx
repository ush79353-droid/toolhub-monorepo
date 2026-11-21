import type { ToolPageDetail } from '@/tools/page-detail';
import { BmiBodyMassIndexGuideArticle } from './BmiBodyMassIndexGuideArticle';
import {
  BMI_BODY_MASS_INDEX_FAQS,
  BMI_BODY_MASS_INDEX_TOC_ITEMS,
} from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Use our BMI Calculator – Body Mass Index to find BMI and BMI Prime from height and weight. Adult results follow WHO categories; optional age and athlete notes explain childhood percentiles and muscular builds.',
  asideAriaLabel: 'Interactive BMI Calculator – Body Mass Index',
  tocItems: BMI_BODY_MASS_INDEX_TOC_ITEMS,
  GuideArticle: BmiBodyMassIndexGuideArticle,
  faqs: BMI_BODY_MASS_INDEX_FAQS,
  countryRules: null,
};
