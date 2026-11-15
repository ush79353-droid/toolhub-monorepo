import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const HEDGE_RATIO_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-hedge-ratio', label: 'What Is Hedge Ratio?' },
  { id: 'hedge-ratio-formula', label: 'Hedge Ratio Formula' },
  { id: 'step-by-step-example', label: 'Step-by-Step Example' },
  { id: 'hedge-ratio-faq', label: 'Frequently Asked Questions' },
];

export const HEDGE_RATIO_FAQS: readonly FAQItem[] = [
  {
    question: 'What is a hedge ratio?',
    answer:
      'Hedge ratio measures how much of an exposure is covered by a hedge position, expressed as a percent of total exposure.',
  },
  {
    question: 'How do you calculate hedge ratio?',
    answer:
      'Hedge Ratio (%) = (Value of Hedge Position ÷ Value of Total Exposure) × 100.',
  },
  {
    question: 'Can the hedge ratio be above 100%?',
    answer:
      'Yes. A ratio above 100% means the hedge is larger than the exposure (overhedging).',
  },
  {
    question: 'Can the hedge position be zero?',
    answer:
      'Yes. A zero hedge position yields a 0% hedge ratio. Total exposure must still be greater than zero.',
  },
];
