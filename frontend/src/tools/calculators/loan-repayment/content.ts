import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const LOAN_REPAYMENT_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-loan-repayment', label: 'What Is a Loan Repayment Calculator?' },
  { id: 'payment-formulas', label: 'Payment Formulas' },
  { id: 'step-by-step-example', label: 'Step-by-Step Example' },
  { id: 'loan-repayment-faq', label: 'Frequently Asked Questions' },
];

export const LOAN_REPAYMENT_FAQS: readonly FAQItem[] = [
  {
    question: 'What is the difference between even total and even principal payments?',
    answer:
      'Even total payments keep a fixed monthly payment (standard amortizing loan). Even principal payments repay equal principal each month plus interest on the remaining balance, so the total payment declines over time.',
  },
  {
    question: 'How do extra monthly payments affect payoff?',
    answer:
      'Extra principal reduces the outstanding balance sooner, which lowers future interest and can shorten the payoff term. Interest savings compare a zero-extra baseline schedule to the accelerated schedule.',
  },
  {
    question: 'Why is balloon payment blocked?',
    answer:
      'The reference shows a balloon payment option but no residual amount or balloon convention. Results stay blocked while that option is selected to avoid inventing a residual.',
  },
  {
    question: 'Do the currency selectors convert amounts?',
    answer:
      'Yes. Loan amount and extra monthly payment each have an independent currency. Changing either converts that amount with stored FX rates. Before amortization, the extra payment is normalized into the loan currency. Rates and durations are never converted.',
  },
];
