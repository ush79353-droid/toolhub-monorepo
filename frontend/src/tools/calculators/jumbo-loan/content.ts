import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const JUMBO_LOAN_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-jumbo-loan', label: 'What Is a Jumbo Loan?' },
  { id: 'jumbo-loan-formula', label: 'Jumbo Loan Formulas' },
  { id: 'step-by-step-example', label: 'Step-by-Step Example' },
  { id: 'jumbo-loan-faq', label: 'Frequently Asked Questions' },
];

export const JUMBO_LOAN_FAQS: readonly FAQItem[] = [
  {
    question: 'How are down payment and jumbo loan amount calculated?',
    answer:
      'Down payment = property price × (down payment % / 100). Jumbo loan amount (financed principal) = property price − down payment. Editing the percentage updates the amount; editing the amount updates the percentage.',
  },
  {
    question: 'How is the monthly payment calculated?',
    answer:
      'Using a fixed-rate amortizing loan: n = years × 12 + months, r = APR / 1200, Monthly Payment = P × r / (1 − (1 + r)^(−n)). When the rate is zero, Monthly Payment = P / n.',
  },
  {
    question: 'Do the currency selectors convert amounts?',
    answer:
      'Yes. Property price, down payment, jumbo loan amount, and monthly payment each have independent currencies. Mixed inputs normalize into the property-price currency before calculation. Percentages, term, and the first-day date never convert.',
  },
  {
    question: 'What is the first day used for?',
    answer:
      'First day is the date of the first monthly payment. The payoff date is estimated as first day plus n months, using the same civil-date conventions as other Omega mortgage tools.',
  },
  {
    question: 'Are taxes, insurance, or jumbo-loan fees included?',
    answer:
      'No. This calculator estimates principal-and-interest only from property price, down payment, rate, term, and first payment date.',
  },
];
