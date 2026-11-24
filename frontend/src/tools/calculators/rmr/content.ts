import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const RMR_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'Resting metabolic rate' },
  { id: 'formula', label: 'Equation' },
  { id: 'faq', label: 'FAQ' },
];

export const RMR_FAQS: readonly FAQItem[] = [
  {
    question: 'Which equation estimates RMR?',
    answer:
      'Original Harris–Benedict (1919) resting energy, multiplied by a 1.1 thermic-effect-of-food factor so digestion is included. No activity, stress, or exercise multiplier is applied.',
  },
  {
    question: 'How is RMR different from BMR?',
    answer:
      'Basal metabolic rate is measured under stricter fasting/rest conditions and excludes digestion. Resting metabolic rate is a closely related field estimate that commonly includes a small digestion (TEF) allowance.',
  },
  {
    question: 'Does this estimate total daily calories?',
    answer:
      'No. The result is resting kcal/day only. Activity and lifestyle multipliers belong in a separate TDEE tool.',
  },
];
