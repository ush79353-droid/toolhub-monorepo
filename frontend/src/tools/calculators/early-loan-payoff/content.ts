import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const EARLY_LOAN_PAYOFF_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-early-payoff', label: 'What Is Early Loan Payoff?' },
  { id: 'payment-formulas', label: 'Payment Formulas' },
  { id: 'step-by-step-example', label: 'Step-by-Step Example' },
  { id: 'early-loan-payoff-faq', label: 'Frequently Asked Questions' },
];

export const EARLY_LOAN_PAYOFF_FAQS: readonly FAQItem[] = [
  {
    question: 'How does an extra monthly payment help?',
    answer:
      'Extra principal reduces the outstanding balance sooner, which lowers future interest and can shorten the payoff term. Interest savings compare a zero-extra baseline schedule to the accelerated schedule.',
  },
  {
    question: 'What does “decreasing monthly payments” mean here?',
    answer:
      'Equal principal each month (original balance ÷ scheduled months) plus interest on the remaining balance, so the total payment declines over time. Unchecked uses a fixed level amortizing payment.',
  },
  {
    question: 'Why are balloon payments blocked?',
    answer:
      'The reference shows a balloon checkbox but no residual amount or balloon convention. Results stay blocked while the option is checked to avoid inventing a residual.',
  },
  {
    question: 'Do the currency selectors convert amounts?',
    answer:
      'Yes. Loan balance and extra monthly payment each have an independent currency. Changing either converts that amount with stored FX rates. Before amortization, the extra payment is normalized into the loan currency. Rates and durations are never converted.',
  },
];
