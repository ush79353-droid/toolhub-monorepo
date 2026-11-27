import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const QUIZ_FFMI_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'about-this-quiz', label: 'About This Quiz' },
  { id: 'scoring-rules', label: 'Scoring Rules' },
  { id: 'ffmi-basics', label: 'FFMI Basics' },
  { id: 'quiz-faq', label: 'Frequently Asked Questions' },
];

export const QUIZ_FFMI_FAQS: readonly FAQItem[] = [
  {
    question: 'Is this a fat-free mass index calculator?',
    answer:
      'No. This is an eight-question educational quiz about FFMI concepts. Use the FFMI Calculator when you need numeric FFM, FFMI, and normalized FFMI from height, weight, and body fat %.',
  },
  {
    question: 'Why are later questions locked?',
    answer:
      'The quiz unlocks one question at a time. Answer the current question to reveal the next. There is no skipping ahead.',
  },
  {
    question: 'When is my score shown?',
    answer:
      'The score out of 8 appears only after every question has an answer. Changing any unlocked answer recalculates immediately when the quiz is complete.',
  },
  {
    question: 'Does Share send my answers?',
    answer:
      'No. Share/copy uses only the public quiz page URL so selections stay out of share payloads, URLs, and logs.',
  },
];
