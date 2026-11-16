import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const MORTGAGE_PREPAYMENT_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-mortgage-prepayment', label: 'What Is Mortgage Prepayment?' },
  { id: 'mortgage-prepayment-formula', label: 'How Prepayments Work' },
  { id: 'step-by-step-example', label: 'Step-by-Step Example' },
  { id: 'mortgage-prepayment-faq', label: 'Frequently Asked Questions' },
];

export const MORTGAGE_PREPAYMENT_FAQS: readonly FAQItem[] = [
  {
    question: 'What does this calculator compare?',
    answer:
      'It builds a fixed-rate amortization schedule, then a second schedule with periodic and/or lump-sum principal prepayments, and compares payoff date, payment count, interest, and totals.',
  },
  {
    question: 'Do prepayments change the regular payment?',
    answer:
      'No. The scheduled installment stays the same. Extra amounts reduce principal so the loan ends sooner and total interest falls.',
  },
  {
    question: 'How are mixed currencies handled?',
    answer:
      'Mortgage amount, periodic prepayment, and lump-sum each have their own currency. Prepayments are converted into the mortgage currency using MongoDB-backed FX rates before amortization. Rates and dates are never converted.',
  },
  {
    question: 'What if prepayments exceed the remaining balance?',
    answer:
      'Extras are capped so the final payment clears the loan without overpaying. Zero interest and partial final payments are supported.',
  },
];
