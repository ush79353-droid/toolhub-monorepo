import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const CAR_INTEREST_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-car-interest', label: 'What Is Car Interest?' },
  { id: 'car-interest-formula', label: 'Car Interest Formulas' },
  { id: 'step-by-step-example', label: 'Step-by-Step Example' },
  { id: 'car-interest-faq', label: 'Frequently Asked Questions' },
];

export const CAR_INTEREST_FAQS: readonly FAQItem[] = [
  {
    question: 'How is the loan amount calculated?',
    answer:
      'Loan amount = car price − down payment − trade-in value. When those fields use different currencies, each amount is converted into the loan-amount currency with stored MongoDB exchange rates before subtraction.',
  },
  {
    question: 'How are monthly payment and total interest calculated?',
    answer:
      'Payment count n = years × 12 + months. Monthly rate r = annual rate / 1200. Monthly payment = P × r / (1 − (1 + r)^(−n)); when r = 0, payment = P / n. Total interest = monthly payment × n − P, using full-precision payment before display rounding.',
  },
  {
    question: 'Do the currency selectors convert amounts?',
    answer:
      'Yes. All six money fields have independent currencies. Changing an input currency converts that amount. Changing loan-amount, monthly-payment, or total-interest currency re-expresses calculated values. Interest rate and loan term are never converted. Missing rates block cross-currency switching; stale rates warn but remain usable.',
  },
  {
    question: 'Are taxes, fees, or insurance included?',
    answer:
      'No. This calculator estimates principal-and-interest only from car price, down payment, trade-in, rate, and term.',
  },
];
