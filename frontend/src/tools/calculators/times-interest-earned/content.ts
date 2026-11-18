import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const TIMES_INTEREST_EARNED_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-tie-ratio', label: 'What Is the Times Interest Earned Ratio?' },
  { id: 'tie-ratio-formula', label: 'TIE Ratio Formula' },
  { id: 'step-by-step-example', label: 'Step-by-Step Example' },
  { id: 'tie-ratio-faq', label: 'Frequently Asked Questions' },
];

export const TIMES_INTEREST_EARNED_FAQS: readonly FAQItem[] = [
  {
    question: 'What does the times interest earned (TIE) ratio measure?',
    answer:
      'It shows how many times earnings before interest and taxes (EBIT) can cover total interest for the period. A higher ratio generally means more cushion to service interest; it is not a complete credit analysis.',
  },
  {
    question: 'Can EBIT be zero or negative?',
    answer:
      'Yes. Zero EBIT yields a TIE ratio of 0. Negative EBIT yields a negative ratio. Total interest must still be greater than zero, and the calculator never shows NaN or Infinity.',
  },
  {
    question: 'Do the currency selectors convert amounts?',
    answer:
      'Yes. EBIT and total interest each have an independent currency. Changing a field’s currency converts that amount using the stored exchange-rate snapshot. Both amounts are normalized into the EBIT currency before dividing, so a currency-only change does not alter the TIE ratio. If rates are unavailable, cross-currency switching is blocked.',
  },
];
