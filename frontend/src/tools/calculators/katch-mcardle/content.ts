import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const KATCH_MCARDLE_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'Katch–McArdle BMR' },
  { id: 'formula', label: 'Formula & LBM modes' },
  { id: 'faq', label: 'FAQ' },
];

export const KATCH_MCARDLE_FAQS: readonly FAQItem[] = [
  {
    question: 'What equation does this calculator use?',
    answer:
      'Katch–McArdle basal metabolic rate: BMR = 370 + 21.6 × lean body mass (kg), expressed in kcal/day. It is an educational resting-energy estimate only — no activity multiplier.',
  },
  {
    question: 'How is lean body mass obtained when I do not know it?',
    answer:
      'When “I don’t know my LBM” is selected, lean mass is estimated with the Boer (1984) sex-specific equations from weight (kg) and height (cm). Measured LBM or body-fat % is preferred when available.',
  },
  {
    question: 'Does this estimate total daily calories?',
    answer:
      'No. The result is basal (resting) kcal/day only. Activity, stress, or temperature multipliers are out of scope for this tool.',
  },
];
