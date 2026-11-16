import type { ToolPageDetail } from '@/tools/page-detail';
import { QuizLoanBalanceGuideArticle } from './QuizLoanBalanceGuideArticle';
import {
  QUIZ_LOAN_BALANCE_FAQS,
  QUIZ_LOAN_BALANCE_TOC_ITEMS,
} from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Educational quiz on loan balances — five questions, score out of five, optional explanations.',
  asideAriaLabel: 'Interactive Loan Balance Quiz',
  tocItems: QUIZ_LOAN_BALANCE_TOC_ITEMS,
  GuideArticle: QuizLoanBalanceGuideArticle,
  faqs: QUIZ_LOAN_BALANCE_FAQS,
  countryRules: null,
};
