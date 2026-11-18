import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const QUIZ_LOAN_BALANCE_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'about-this-quiz', label: 'About This Quiz' },
  { id: 'scoring-rules', label: 'Scoring Rules' },
  { id: 'loan-balance-basics', label: 'Loan Balance Basics' },
  { id: 'quiz-faq', label: 'Frequently Asked Questions' },
];

export const QUIZ_LOAN_BALANCE_FAQS: readonly FAQItem[] = [
  {
    question: 'Is this a loan balance calculator?',
    answer:
      'No. This tool is an educational multiple-choice quiz about loan balances. Use the Loan Balance Calculator for outstanding principal estimates.',
  },
  {
    question: 'When is my score shown?',
    answer:
      'The score out of 5 appears only after every question has an answer. Changing any answer recalculates the score immediately.',
  },
  {
    question: 'When do explanations appear?',
    answer:
      'Check “Show explanations and correct answers.” Explanations stay hidden until all five questions are answered, even if the checkbox is already checked.',
  },
];
