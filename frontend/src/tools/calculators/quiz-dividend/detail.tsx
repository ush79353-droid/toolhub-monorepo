import type { ToolPageDetail } from '@/tools/page-detail';
import { QuizDividendGuideArticle } from './QuizDividendGuideArticle';
import { QUIZ_DIVIDEND_FAQS, QUIZ_DIVIDEND_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Educational dividend investing quiz — six questions, score out of six, optional explanations.',
  asideAriaLabel: 'Interactive Dividend Quiz',
  tocItems: QUIZ_DIVIDEND_TOC_ITEMS,
  GuideArticle: QuizDividendGuideArticle,
  faqs: QUIZ_DIVIDEND_FAQS,
  countryRules: null,
};
