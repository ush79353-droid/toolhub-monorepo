import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const LOAN_BALANCE_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-loan-balance', label: 'What Is Remaining Loan Balance?' },
  { id: 'loan-balance-formula', label: 'Loan Balance Formula' },
  { id: 'step-by-step-example', label: 'Step-by-Step Example' },
  { id: 'loan-balance-faq', label: 'Frequently Asked Questions' },
];

export const LOAN_BALANCE_FAQS: readonly FAQItem[] = [
  {
    question: 'How is the remaining balance calculated?',
    answer:
      'This tool uses a standard fixed-rate monthly amortizing schedule. It computes the monthly payment from the original principal, annual rate, and full term, then finds the outstanding principal after the elapsed period’s scheduled payments.',
  },
  {
    question: 'What do Loan term and Period mean?',
    answer:
      'Loan term is the original full repayment length (years + months). Period is how much of that term has already elapsed. For a 10-year loan and a 3-year period, the remaining balance is after 36 monthly payments.',
  },
  {
    question: 'Does changing the currency convert amounts?',
    answer:
      'Yes. Loan and loan remaining each have an independent currency. Changing the loan currency converts the principal with stored FX rates. Changing the result currency only re-expresses the calculated remaining balance. Interest rate and durations are never converted. Missing rates block cross-currency changes.',
  },
];
