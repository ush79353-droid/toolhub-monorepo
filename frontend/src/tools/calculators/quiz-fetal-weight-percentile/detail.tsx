import type { ToolPageDetail } from '@/tools/page-detail';
import { QuizFetalWeightPercentileGuideArticle } from './QuizFetalWeightPercentileGuideArticle';
import {
  QUIZ_FETAL_WEIGHT_PERCENTILE_FAQS,
  QUIZ_FETAL_WEIGHT_PERCENTILE_TOC_ITEMS,
} from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Five educational questions on fetal weight percentiles, Hadlock biometry, and late-pregnancy follow-up. Not medical advice.',
  asideAriaLabel: 'Interactive Quiz: Fetal Weight Percentile',
  tocItems: QUIZ_FETAL_WEIGHT_PERCENTILE_TOC_ITEMS,
  GuideArticle: QuizFetalWeightPercentileGuideArticle,
  faqs: QUIZ_FETAL_WEIGHT_PERCENTILE_FAQS,
  countryRules: null,
};
