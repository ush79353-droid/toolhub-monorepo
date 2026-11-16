import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const LAND_LOAN_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-land-loan', label: 'What Is a Land Loan?' },
  { id: 'land-loan-formula', label: 'Land Loan Formulas' },
  { id: 'step-by-step-example', label: 'Step-by-Step Example' },
  { id: 'land-loan-faq', label: 'Frequently Asked Questions' },
];

export const LAND_LOAN_FAQS: readonly FAQItem[] = [
  {
    question: 'How are down payment and loan value calculated?',
    answer:
      'Down payment = land value × (down payment % / 100). Loan value (financed principal) = land value − down payment. Editing the percentage updates the amount; editing the amount updates the percentage.',
  },
  {
    question: 'How is the periodic payment calculated?',
    answer:
      'Using a fixed-rate amortizing loan: r = APR / (100 × payments per year), N from term and frequency, Payment = P × r / (1 − (1 + r)^(−N)). When the rate is zero, Payment = P / N.',
  },
  {
    question: 'Do the currency selectors convert amounts?',
    answer:
      'Yes. All six monetary fields have independent currencies. Land value converts when its currency changes. Down payment, loan value, and the three money results can display in other currencies using stored FX rates. Percentages, term, frequency, payment count, and periodic rate never convert.',
  },
  {
    question: 'Are taxes, insurance, or fees included?',
    answer:
      'No. This calculator estimates principal-and-interest only from land value, down payment, rate, term, and payment frequency.',
  },
];
