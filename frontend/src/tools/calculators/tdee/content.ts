import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const TDEE_TOC: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'TDEE Calculator' },
  { id: 'formula', label: 'Formula' },
  { id: 'faq', label: 'FAQ' },
];

export const TDEE_FAQS: readonly FAQItem[] = [
  {
    question: 'How is TDEE calculated?',
    answer:
      'BMR uses Mifflin–St Jeor; TDEE = BMR × physical activity level (PAL). Light exercise 1–2 times/week uses PAL 1.4.',
  },
  {
    question: 'Does changing activity change BMR?',
    answer: 'No. BMR depends on sex, age, height, and weight. Only TDEE changes with PAL.',
  },
];
