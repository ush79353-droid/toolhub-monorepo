import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const PARTIALLY_AMORTIZED_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-partially-amortized', label: 'What Is a Partially Amortized Loan?' },
  { id: 'partially-amortized-formula', label: 'Formulas' },
  { id: 'step-by-step-example', label: 'Step-by-Step Example' },
  { id: 'partially-amortized-faq', label: 'Frequently Asked Questions' },
];

export const PARTIALLY_AMORTIZED_FAQS: readonly FAQItem[] = [
  {
    question: 'How is amortization time different from the payment period?',
    answer:
      'Amortization time (N) is the full schedule used to size the regular monthly payment. The payment period (K) is how long those payments are actually made before the remaining principal is due as a balloon. Typically 0 < K < N.',
  },
  {
    question: 'What is the balloon payment?',
    answer:
      'The balloon is the outstanding principal immediately after the last scheduled payment in the payment period. If the payment period equals the amortization time, the balloon is zero (fully amortized).',
  },
  {
    question: 'Does changing currency convert amounts?',
    answer:
      'Yes. Full loan and each result (monthly payment, total paid, balloon, total) have independent currencies. Changing the loan currency converts the principal. Changing a result currency only re-expresses that calculated amount. Rate and durations are never converted.',
  },
];
