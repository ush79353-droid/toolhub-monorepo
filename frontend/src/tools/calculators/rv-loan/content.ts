import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const RV_LOAN_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-rv-loan', label: 'What Is an RV Loan?' },
  { id: 'rv-loan-formula', label: 'Payment Formula' },
  { id: 'step-by-step-example', label: 'Step-by-Step Example' },
  { id: 'rv-loan-faq', label: 'Frequently Asked Questions' },
];

export const RV_LOAN_FAQS: readonly FAQItem[] = [
  {
    question: 'How is the loan amount calculated?',
    answer:
      'Loan amount = RV price − down payment after both money fields are normalized into the RV price currency.',
  },
  {
    question: 'How is the monthly payment calculated?',
    answer:
      'Fixed-rate amortizing loan on the financed principal: r = APR / 100 / 12, N = years × 12 + months, M = P × r / (1 − (1 + r)^(−N)). When the rate is zero, M = P / N. When P is zero, M is zero.',
  },
  {
    question: 'What are total paid and cost of loan?',
    answer:
      'Total paid = monthly payment × number of payments (excludes down payment). Cost of loan = total paid − loan amount.',
  },
  {
    question: 'Do the currency selectors convert amounts?',
    answer:
      'Yes. All six monetary fields have independent currencies. Changing RV price or down payment currency converts that input. Changing a result currency only re-expresses the calculated value. Term and interest rate are never converted.',
  },
];
