import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const RATE_OF_RETURN_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-rate-of-return-calculator', label: 'What Is a Rate of Return Calculator?' },
  { id: 'rate-of-return-formulas', label: 'Formulas' },
  { id: 'step-by-step-example', label: 'Step-by-Step Example' },
  { id: 'rate-of-return-faq', label: 'Frequently Asked Questions' },
];

export const RATE_OF_RETURN_FAQS: readonly FAQItem[] = [
  {
    question: 'What does this rate of return calculator do?',
    answer:
      'It finds the annual nominal rate of return implied by an initial investment, a final amount, the investment length, compounding frequency, and optional interim deposits or withdrawals.',
  },
  {
    question: 'How is the rate calculated with no cash flows?',
    answer:
      'Annual Rate (%) = m × [(Final / Initial)^(1 / (m × Years)) − 1] × 100, where m is the number of compounding periods per year.',
  },
  {
    question: 'How are deposits and withdrawals handled?',
    answer:
      'Positive cash flows are additional deposits and negative cash flows are withdrawals. The calculator solves numerically for the interest rate that produces the entered final amount, respecting cash-flow frequency and payment timing.',
  },
  {
    question: 'Is this the same as percentage return or annualized return?',
    answer:
      'No. This tool solves for a compounding-aware annual nominal rate of return and can include interim cash flows. Percentage return and annualized return calculators use different inputs and formulas.',
  },
  {
    question: 'Does the currency selector convert amounts?',
    answer:
      'No. It only changes the currency label and grouping. Enter all money fields already in the selected currency.',
  },
];
