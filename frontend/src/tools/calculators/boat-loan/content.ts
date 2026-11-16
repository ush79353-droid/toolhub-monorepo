import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const BOAT_LOAN_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-boat-loan', label: 'What Is a Boat Loan?' },
  { id: 'boat-loan-formula', label: 'Monthly Payment Formula' },
  { id: 'step-by-step-example', label: 'Step-by-Step Example' },
  { id: 'boat-loan-faq', label: 'Frequently Asked Questions' },
];

export const BOAT_LOAN_FAQS: readonly FAQItem[] = [
  {
    question: 'How is the monthly payment calculated?',
    answer:
      'This tool uses a fixed-rate amortizing loan: monthly rate r = APR / 100 / 12, payments n from the term, and M = P × r / (1 − (1 + r)^(−n)). When the rate is zero, M = P / n.',
  },
  {
    question: 'How is total interest paid calculated?',
    answer:
      'Total interest = (monthly payment × number of payments) − principal, using the full-precision payment before display rounding.',
  },
  {
    question: 'Do the currency selectors convert amounts?',
    answer:
      'Yes. Loan amount, monthly payment, and total interest each have an independent currency. Changing loan currency converts the principal with stored FX rates. Changing a result currency only re-expresses that result. Term and interest rate are never converted.',
  },
  {
    question: 'Are taxes, insurance, or fees included?',
    answer:
      'No. The calculator estimates principal-and-interest only from loan amount, term, and annual rate.',
  },
];
