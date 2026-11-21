import type { ToolPageDetail } from '@/tools/page-detail';
import { PregnancyWeightGainGuideArticle } from './PregnancyWeightGainGuideArticle';
import {
  PREGNANCY_WEIGHT_GAIN_FAQS,
  PREGNANCY_WEIGHT_GAIN_TOC_ITEMS,
} from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Estimate recommended pregnancy weight gain from pre-pregnancy BMI using IOM / National Academies 2009 guidelines. Educational ranges only—not medical advice.',
  asideAriaLabel: 'Interactive Pregnancy Weight Gain Calculator',
  tocItems: PREGNANCY_WEIGHT_GAIN_TOC_ITEMS,
  GuideArticle: PregnancyWeightGainGuideArticle,
  faqs: PREGNANCY_WEIGHT_GAIN_FAQS,
  countryRules: null,
};
