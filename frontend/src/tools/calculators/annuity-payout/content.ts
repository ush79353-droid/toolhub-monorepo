import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const ANNUITY_PAYOUT_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-annuity-payout', label: 'What Is an Annuity Payout?' },
  { id: 'annuity-payout-formula', label: 'Annuity Payout Formula' },
  { id: 'step-by-step-example', label: 'Step-by-Step Example' },
  { id: 'annuity-payout-faq', label: 'Frequently Asked Questions' },
];

export const ANNUITY_PAYOUT_FAQS: readonly FAQItem[] = [
  {
    question: 'What is the difference between fixed length and fixed payment?',
    answer:
      'Fixed length solves for the equal withdrawal that exhausts (or reaches a target final balance over) a known term. Fixed payment keeps your withdrawal amount fixed and solves how long the balance lasts.',
  },
  {
    question: 'Ordinary annuity vs annuity due?',
    answer:
      'Ordinary annuity payments occur at the end of each period. Annuity due payments occur at the beginning. Beginning-of-period withdrawals leave less principal to earn interest, so the sustainable payment is slightly lower for the same term.',
  },
  {
    question: 'Does the currency selector convert the initial balance?',
    answer:
      'Yes. Changing the initial-balance currency converts that amount using the stored exchange-rate snapshot. Final balance and fixed-payment amount each have independent currencies and convert the same way. Rates, lengths, and frequencies are never converted. If rates are unavailable, cross-currency switching is blocked.',
  },
];
