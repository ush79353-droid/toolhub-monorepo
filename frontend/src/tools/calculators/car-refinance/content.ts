import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const CAR_REFINANCE_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-car-refinance', label: 'What Is Car Loan Refinancing?' },
  { id: 'how-to-use', label: 'How to Use This Calculator' },
  { id: 'car-refinance-formulas', label: 'Refinance Formulas' },
  { id: 'cash-fees-notes', label: 'Cash In/Out and Fees' },
  { id: 'step-by-step-example', label: 'Step-by-Step Example' },
  { id: 'car-refinance-faq', label: 'Frequently Asked Questions' },
];

export const CAR_REFINANCE_FAQS: readonly FAQItem[] = [
  {
    question: 'How does this car refinance calculator work?',
    answer:
      'It amortizes your remaining auto loan at the current rate and term (or solves the remaining term from your monthly payment), then compares that schedule with a new loan term and rate. The summary shows loan amount, monthly payment, rate, term, total interest, and total payments for both sides.',
  },
  {
    question: 'What does cash in / out mean?',
    answer:
      'Positive cash out increases the new loan principal (you borrow extra cash). Negative cash in reduces the new principal (you pay money toward the balance at refinance). Zero leaves the balance unchanged before fees.',
  },
  {
    question: 'How are refinancing fees treated?',
    answer:
      'When “Set fees and costs” is enabled, you can pay fees upfront or finance them. Financed fees are added to the new principal. Upfront fees are added to new-loan total payments only and do not earn interest inside the amortization.',
  },
  {
    question: 'Do the currency selectors convert amounts?',
    answer:
      'Yes. Balance, current monthly payment (payment mode), cash in/out, and fees each have independent currencies. Amounts are converted into the balance currency with stored Phase 2 FX rates before math. Interest rates, terms, and dates are never converted. Missing rates block conversion; stale rates warn but still convert.',
  },
  {
    question: 'Is this the same as Refinance Calculator or Mortgage Refinance?',
    answer:
      'No. This tool is the car-specific refinance comparison on /tools/car-refinance-calculator. General refinance and mortgage refinance remain separate catalog tools.',
  },
];
