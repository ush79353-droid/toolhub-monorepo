import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const HOME_EQUITY_LOAN_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-home-equity-loan', label: 'What Is a Home Equity Loan?' },
  { id: 'home-equity-formula', label: 'Payment Formula' },
  { id: 'step-by-step-example', label: 'Step-by-Step Example' },
  { id: 'home-equity-faq', label: 'Frequently Asked Questions' },
];

export const HOME_EQUITY_LOAN_FAQS: readonly FAQItem[] = [
  {
    question: 'How is the monthly payment calculated?',
    answer:
      'Fixed-rate amortizing loan: r = APR / 1200, n = years × 12, Payment = P × r / (1 − (1 + r)^(−n)). When the rate is zero, Payment = P / n.',
  },
  {
    question: 'How are total payments and total interest calculated?',
    answer:
      'Total of payments = monthly payment × n using the full-precision payment. Total interest = total of payments − principal.',
  },
  {
    question: 'What happens when Include closing costs is checked?',
    answer:
      'The checkbox is shown for screenshot parity, but no verified closing-cost amount or percentage exists in project data. Results stay blocked while it is checked so fees are not invented.',
  },
  {
    question: 'Can I change currencies?',
    answer:
      'No. The reference shows USD ($) symbols without currency selectors, so amounts stay in fixed dollar formatting.',
  },
];
