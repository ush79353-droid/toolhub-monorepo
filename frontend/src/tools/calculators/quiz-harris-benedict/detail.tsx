import type { ToolPageDetail } from '@/tools/page-detail';
import { QuizHarrisBenedictGuideArticle } from './QuizHarrisBenedictGuideArticle';
import {
  QUIZ_HARRIS_BENEDICT_FAQS,
  QUIZ_HARRIS_BENEDICT_TOC_ITEMS,
} from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Educational Harris–Benedict BMR quiz; seven questions; score out of seven when complete.',
  asideAriaLabel: 'Interactive Harris–Benedict BMR Quiz',
  tocItems: QUIZ_HARRIS_BENEDICT_TOC_ITEMS,
  GuideArticle: QuizHarrisBenedictGuideArticle,
  faqs: QUIZ_HARRIS_BENEDICT_FAQS,
  countryRules: null,
};
