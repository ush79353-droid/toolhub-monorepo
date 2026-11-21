import type { ToolPageDetail } from '@/tools/page-detail';
import { QuizAnnualIncomeGuideArticle } from './QuizAnnualIncomeGuideArticle';
import {
  QUIZ_ANNUAL_INCOME_FAQS,
  QUIZ_ANNUAL_INCOME_TOC_ITEMS,
} from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Educational annual-income quiz — seven questions, progressive reveal, score out of seven.',
  asideAriaLabel: 'Interactive Annual Income Quiz',
  tocItems: QUIZ_ANNUAL_INCOME_TOC_ITEMS,
  GuideArticle: QuizAnnualIncomeGuideArticle,
  faqs: QUIZ_ANNUAL_INCOME_FAQS,
  countryRules: null,
};
