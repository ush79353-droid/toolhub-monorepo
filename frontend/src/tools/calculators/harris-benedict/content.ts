import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const HARRIS_BENEDICT_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'Harris–Benedict BMR' },
  { id: 'formula', label: 'Revised equation' },
  { id: 'faq', label: 'FAQ' },
];

export const HARRIS_BENEDICT_FAQS: readonly FAQItem[] = [
  {
    question: 'Which Harris–Benedict equation is used?',
    answer:
      'Revised Harris–Benedict resting energy equations from Roza & Shizgal (Am J Clin Nutr, 1984), sharing the same basal coefficients as the BEE calculator. No activity multipliers are applied — the result is basal kcal/day only.',
  },
  {
    question: 'How is this different from the original 1919 equations?',
    answer:
      'Harris & Benedict (1918/1919) published the classic multiple-regression BMR formulas. Roza & Shizgal (1984) recalculated resting energy on an expanded Harris–Benedict cohort; this tool uses that revised form.',
  },
  {
    question: 'Does this estimate total daily calories?',
    answer:
      'No. Basal metabolic rate is resting energy only. Activity, stress, or temperature multipliers are out of scope unless a separate TEE tool applies them.',
  },
];
