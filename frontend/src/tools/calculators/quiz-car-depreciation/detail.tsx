import type { ToolPageDetail } from '@/tools/page-detail';
import { QuizCarDepreciationGuideArticle } from './QuizCarDepreciationGuideArticle';
import {
  QUIZ_CAR_DEPRECIATION_FAQS,
  QUIZ_CAR_DEPRECIATION_TOC_ITEMS,
} from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Educational car-depreciation quiz — five questions, score out of five, optional progressive explanations.',
  asideAriaLabel: 'Interactive Car Depreciation Quiz',
  tocItems: QUIZ_CAR_DEPRECIATION_TOC_ITEMS,
  GuideArticle: QuizCarDepreciationGuideArticle,
  faqs: QUIZ_CAR_DEPRECIATION_FAQS,
  countryRules: null,
};
