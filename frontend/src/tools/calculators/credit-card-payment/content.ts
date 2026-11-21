import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const CREDIT_CARD_PAYMENT_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-credit-card-payment', label: 'What This Calculator Does' },
  { id: 'credit-card-payment-formulas', label: 'Formulas' },
  { id: 'credit-card-payment-example', label: 'Example' },
  { id: 'credit-card-payment-faq', label: 'Frequently Asked Questions' },
];

export const CREDIT_CARD_PAYMENT_FAQS: readonly FAQItem[] = [
  {
    question: 'How is the required monthly payment calculated?',
    answer:
      'n = years × 12 + months. The monthly period rate follows the selected compounding (Monthly uses APR/12; Daily 360/365 compound within the month). Payment = Balance × r / (1 − (1+r)^(−n)); when APR is 0%, Payment = Balance / n. Totals come from a repayment schedule with a final-installment adjustment.',
  },
  {
    question: 'What do minimum payment & compound settings do?',
    answer:
      'Compounding sets the period rate used in the payment formula and interest schedule. Minimum percentage, floor, and method define the card minimum; if the required payment would be lower, it is raised to that minimum. APR, percentages, and dates are never FX-converted.',
  },
  {
    question: 'Do the currency selectors convert amounts?',
    answer:
      'Yes. Balance and minimum-payment floor each have independent currencies and are normalized into the balance currency before calculating. Missing rates block conversion; stale rates warn but still convert.',
  },
];
