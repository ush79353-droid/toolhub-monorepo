import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const QUIZ_DIVIDEND_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'about-this-quiz', label: 'About This Quiz' },
  { id: 'scoring-rules', label: 'Scoring Rules' },
  { id: 'dividend-basics', label: 'Dividend Basics' },
  { id: 'quiz-faq', label: 'Frequently Asked Questions' },
];

export const QUIZ_DIVIDEND_FAQS: readonly FAQItem[] = [
  {
    question: 'Is this a dividend yield calculator?',
    answer:
      'No. This tool is an educational six-question quiz about dividend investing basics. Use the Dividend Yield Calculator for yield math on real inputs.',
  },
  {
    question: 'When is my score shown?',
    answer:
      'The score out of 6 (and accuracy percent) appears only after every question has an answer. Changing any answer recalculates the score immediately.',
  },
  {
    question: 'How are the numeric answers graded?',
    answer:
      'Question 4 expects about 1% yield. Question 6 expects about $2,593.74 from $1,000 compounded at 10% for 10 years. Small rounding differences within the documented tolerance still count as correct.',
  },
  {
    question: 'When do explanations appear?',
    answer:
      'Check “Show explanations and correct answers.” Feedback stays hidden until all six questions are answered, even if the checkbox is already checked.',
  },
];
