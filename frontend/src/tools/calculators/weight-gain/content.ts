import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const WEIGHT_GAIN_TOC: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'Weight Gain Calculator' },
  { id: 'formula', label: 'Maintenance & Surplus' },
  { id: 'pace', label: 'Gain Pace' },
  { id: 'example', label: 'Worked Example' },
  { id: 'limits', label: 'Limitations' },
  { id: 'weight-gain-faq', label: 'FAQ' },
];

export const WEIGHT_GAIN_FAQS: readonly FAQItem[] = [
  {
    question: 'How are maintenance calories calculated?',
    answer:
      'Mifflin–St Jeor BMR multiplied by an activity (PAL) factor. The result is your estimated TDEE — calories to maintain weight.',
  },
  {
    question: 'What do Normal and Strict paces mean?',
    answer:
      'Normal targets about 0.5 kg (1.1 lb) per week with a +500 kcal/day surplus. Strict targets about 1 kg (2.2 lb) per week with a +1,000 kcal/day surplus.',
  },
  {
    question: 'Is this medical advice?',
    answer:
      'No. It is an educational planning estimate for generally healthy adults. Seek clinical guidance for underweight recovery or medical conditions.',
  },
];
