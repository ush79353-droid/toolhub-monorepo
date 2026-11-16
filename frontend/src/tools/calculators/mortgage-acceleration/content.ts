import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const MORTGAGE_ACCELERATION_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-mortgage-acceleration', label: 'What Is Mortgage Acceleration?' },
  { id: 'mortgage-acceleration-formulas', label: 'Formulas' },
  { id: 'step-by-step-example', label: 'Step-by-Step Example' },
  { id: 'mortgage-acceleration-faq', label: 'Frequently Asked Questions' },
];

export const MORTGAGE_ACCELERATION_FAQS: readonly FAQItem[] = [
  {
    question: 'What is accelerated bi-weekly vs ordinary bi-weekly?',
    answer:
      'Accelerated bi-weekly pays half of the standard monthly installment every 14 days (26 half-payments ≈ 13 monthly payments per year). Ordinary bi-weekly splits twelve monthly payments across 26 periods, so annual cash flow matches monthly. They are not the same schedule.',
  },
  {
    question: 'How is the accelerated bi-weekly payment calculated?',
    answer:
      'First compute the fixed monthly payment from the loan, rate, and term. The accelerated bi-weekly installment is that monthly payment divided by two. Interest is accrued on a bi-weekly period rate derived from the selected compounding convention.',
  },
  {
    question: 'Does extra payment apply to both columns?',
    answer:
      'No. Extra principal is applied only on the accelerated schedule. The “Payments w/o acceleration” column is the baseline monthly schedule without extras.',
  },
  {
    question: 'Do the currency selectors convert amounts?',
    answer:
      'Yes. Loan amount and extra payment (and optional upfront fee) use stored FX rates and normalize into the loan currency before amortization. Interest rate, term, and due date are never converted.',
  },
];
