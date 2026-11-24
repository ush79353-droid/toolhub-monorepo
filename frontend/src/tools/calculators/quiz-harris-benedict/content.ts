import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const QUIZ_HARRIS_BENEDICT_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'about-this-quiz', label: 'About This Quiz' },
  { id: 'scoring-rules', label: 'Scoring Rules' },
  { id: 'bmr-basics', label: 'BMR Basics' },
  { id: 'quiz-faq', label: 'Frequently Asked Questions' },
];

export const QUIZ_HARRIS_BENEDICT_FAQS: readonly FAQItem[] = [
  {
    question: 'Is this a basal metabolic rate calculator?',
    answer:
      'No. This is a seven-question educational quiz about Harris–Benedict BMR concepts. Use the Harris–Benedict Calculator when you need a resting kcal/day estimate from age, sex, height, and weight.',
  },
  {
    question: 'When is my score shown?',
    answer:
      'The score out of 7 appears only after every question has an answer. Changing any answer recalculates the score immediately. Incomplete quizzes show “Please answer all questions to see your score!”',
  },
  {
    question: 'Which Harris–Benedict equation do the explanations refer to?',
    answer:
      'Teaching aligns with the revised Harris–Benedict resting-energy equations shared by Omega’s Harris–Benedict and BEE calculators (Roza & Shizgal, 1984 coefficients). Activity factor 1.2 matches the shared light-sedentary multiplier.',
  },
  {
    question: 'Does Share send my answers?',
    answer:
      'No. Share/copy uses only the public quiz page URL so selections stay out of share payloads, URLs, and logs.',
  },
];
