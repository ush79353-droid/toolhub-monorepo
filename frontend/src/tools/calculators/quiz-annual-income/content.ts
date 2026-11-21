import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const QUIZ_ANNUAL_INCOME_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'about-this-quiz', label: 'About This Quiz' },
  { id: 'scoring-rules', label: 'Scoring Rules' },
  { id: 'income-basics', label: 'Income Basics' },
  { id: 'quiz-faq', label: 'Frequently Asked Questions' },
];

export const QUIZ_ANNUAL_INCOME_FAQS: readonly FAQItem[] = [
  {
    question: 'Is this an annual income calculator?',
    answer:
      'No. This is a seven-question educational quiz about annual income concepts. Use the Annual Income Calculator when you need to convert hours and wages into a yearly figure.',
  },
  {
    question: 'When is my score shown?',
    answer:
      'The score out of 7 appears only after every question has an answer. Changing any answer recalculates the score immediately. Incomplete quizzes show “Please answer all questions to see your score!”',
  },
  {
    question: 'Why do questions appear one after another?',
    answer:
      'The quiz reveals the next question automatically after you answer the previous one. Earlier answers stay editable; clearing the quiz resets progression.',
  },
  {
    question: 'Are the dollar examples real salaries?',
    answer:
      'No. The Suzy and Jeff examples use fixed USD teaching numbers so you can check the arithmetic. They are not tax advice or a pay estimate for a real job.',
  },
];
