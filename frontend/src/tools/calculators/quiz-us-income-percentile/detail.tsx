import type { ToolPageDetail } from '@/tools/page-detail';
import { QuizUsIncomePercentileGuideArticle } from './QuizUsIncomePercentileGuideArticle';
import {
  QUIZ_US_INCOME_PERCENTILE_FAQS,
  QUIZ_US_INCOME_PERCENTILE_TOC_ITEMS,
} from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Educational quiz on US income percentiles; eight questions, score out of eight, hints and answer review.',
  asideAriaLabel: 'Interactive US Income Percentile Quiz',
  tocItems: QUIZ_US_INCOME_PERCENTILE_TOC_ITEMS,
  GuideArticle: QuizUsIncomePercentileGuideArticle,
  faqs: QUIZ_US_INCOME_PERCENTILE_FAQS,
  countryRules: null,
};
