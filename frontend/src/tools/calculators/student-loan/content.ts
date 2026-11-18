import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const STUDENT_LOAN_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-student-loan', label: 'What Is a Student Loan Calculator?' },
  { id: 'student-loan-formula', label: 'Monthly Payment Formula' },
  { id: 'step-by-step-example', label: 'Step-by-Step Example' },
  { id: 'student-loan-faq', label: 'Frequently Asked Questions' },
];

export const STUDENT_LOAN_FAQS: readonly FAQItem[] = [
  {
    question: 'How is the monthly payment calculated?',
    answer:
      'This tool uses a fixed-rate amortizing loan: monthly rate r = APR / 100 / 12, n = years × 12 + months, and M = P × r × (1 + r)^n / ((1 + r)^n − 1). When the rate is zero, M = P / n.',
  },
  {
    question: 'What counts as remaining term?',
    answer:
      'Enter whole years plus months from 0 to 11. The payment count is years × 12 + months. A zero-month total term is rejected.',
  },
  {
    question: 'Do the currency selectors convert amounts?',
    answer:
      'Yes. Loan balance and monthly payment each have an independent currency. Changing loan currency converts the principal with stored FX rates. Changing payment currency only re-expresses that result. Term and interest rate are never converted.',
  },
  {
    question: 'Are fees, forgiveness, or income-driven plans included?',
    answer:
      'No. The calculator estimates principal-and-interest only from loan balance, remaining term, and annual rate.',
  },
];
