import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const INTEREST_RATE_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-interest-rate', label: 'What Is an Interest Rate?' },
  { id: 'interest-rate-formula', label: 'How the Calculator Works' },
  { id: 'step-by-step-example', label: 'Step-by-Step Example' },
  { id: 'interest-rate-faq', label: 'Frequently Asked Questions' },
];

export const INTEREST_RATE_FAQS: readonly FAQItem[] = [
  {
    question: 'How is the loan interest rate solved?',
    answer:
      'The calculator solves the payment-period rate r in Loan Amount = Payment × [1 − (1 + r)^(−n)] / r, then converts between payment and capitalization frequencies to report the annual nominal rate and EAR.',
  },
  {
    question: 'What is the difference between EAR and APR?',
    answer:
      'EAR adjusts the nominal rate for compounding only. APR also reflects prepaid and loaned fees so you can compare the true borrowing cost across offers.',
  },
  {
    question: 'How do prepaid and loaned fees differ?',
    answer:
      'Prepaid fees are paid upfront and are not interest-bearing. Loaned fees are rolled into the balance, so interest is charged on them and the adjusted periodic payment rises.',
  },
  {
    question: 'Does changing the currency convert the amount?',
    answer:
      'No. Currency selection changes denomination and formatting only. It does not apply a live exchange rate.',
  },
];
