import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const CREDIT_CARD_MINIMUM_PAYMENT_TOC_ITEMS: readonly TableOfContentsItem[] =
  [
    {
      id: 'what-credit-card-minimum-payment',
      label: 'What This Calculator Does',
    },
    { id: 'credit-card-minimum-payment-formulas', label: 'Formulas' },
    { id: 'credit-card-minimum-payment-example', label: 'Example' },
    {
      id: 'credit-card-minimum-payment-faq',
      label: 'Frequently Asked Questions',
    },
  ];

export const CREDIT_CARD_MINIMUM_PAYMENT_FAQS: readonly FAQItem[] = [
  {
    question: 'How is the minimum payment calculated?',
    answer:
      'Flat percentage uses max(fixed minimum, balance × minimum %). Percentage + interest adds that month’s interest to the percentage portion before applying the floor. An optional monthly fixed payment is added on top of the minimum; it does not replace it.',
  },
  {
    question: 'What does capitalization frequency mean?',
    answer:
      'It controls how interest accrues each month before the payment is applied. With the checkbox off, this tool uses a Daily (360) convention that matches the reference example. When enabled, you can choose Monthly, Daily (365), or Daily (360). APR and frequencies are never FX-converted.',
  },
  {
    question: 'Do the currency selectors convert amounts?',
    answer:
      'Yes. Statement balance, minimum-payment floor, and monthly fixed payment each have independent currencies and are normalized into the statement-balance currency before amortization. APR %, percentages, and dates are never FX-converted. Missing rates block conversion; stale rates warn but still convert.',
  },
];
