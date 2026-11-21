import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const CALORIE_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'Calorie Calculator' },
  { id: 'formula', label: 'Mifflin–St Jeor Formula' },
  { id: 'activity', label: 'Activity Levels' },
  { id: 'how-to-use', label: 'How to Use' },
  { id: 'example', label: 'Worked Example' },
  { id: 'limitations', label: 'Limitations' },
  { id: 'calorie-faq', label: 'Frequently Asked Questions' },
];

export const CALORIE_FAQS: readonly FAQItem[] = [
  {
    question: 'How does this calorie calculator work?',
    answer:
      'It estimates basal metabolic rate with the Mifflin–St Jeor equation, then multiplies by a physical activity level (PAL) factor to estimate daily maintenance calories (TDEE).',
  },
  {
    question: 'What does Exercise 1–2 times/week mean?',
    answer:
      'It is the light-activity PAL band used here (1.4). Other bands cover little/no exercise through professional athlete levels.',
  },
  {
    question: 'Does this show macronutrient grams?',
    answer:
      'No. The screenshot scope is daily calories only. Macro splits belong in a dedicated macro tool when available.',
  },
  {
    question: 'Is this medical advice?',
    answer:
      'No. It is an educational estimate for generally healthy adults. Pregnancy, illness, and clinical nutrition need professional guidance.',
  },
];
