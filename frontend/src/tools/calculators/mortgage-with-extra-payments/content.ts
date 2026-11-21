import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const MORTGAGE_WITH_EXTRA_PAYMENTS_TOC_ITEMS: readonly TableOfContentsItem[] =
  [
    {
      id: 'what-are-extra-mortgage-payments',
      label: 'What Are Extra Mortgage Payments?',
    },
    {
      id: 'how-this-calculator-works',
      label: 'How This Calculator Works',
    },
    {
      id: 'accelerated-biweekly-example',
      label: 'Accelerated Bi-Weekly Example',
    },
    {
      id: 'mortgage-with-extra-payments-faq',
      label: 'Frequently Asked Questions',
    },
  ];

export const MORTGAGE_WITH_EXTRA_PAYMENTS_FAQS: readonly FAQItem[] = [
  {
    question: 'What is accelerated bi-weekly?',
    answer:
      'Accelerated bi-weekly takes your normal monthly payment, divides it by two, and charges that amount every two weeks (26 times per year). That is roughly thirteen monthly payments per year, so the loan finishes earlier even when the periodic extra and lump-sum fields are zero.',
  },
  {
    question: 'How do periodic extras and lump sums apply?',
    answer:
      'Periodic extras are added to each revised payment on or after the start date. A lump-sum prepayment reduces principal on the first payment date on or after the paid-on date. Both amounts are converted into the mortgage currency before amortization.',
  },
  {
    question: 'Does the currency selector convert amounts?',
    answer:
      'Yes. Changing a money field’s currency converts that amount with MongoDB-backed exchange rates. Periodic and lump-sum currencies are normalized into the mortgage currency for the schedule. Interest rate, term, and dates are never FX-converted. Missing rates block conversion; stale rates still convert with a warning.',
  },
  {
    question: 'What does the Original column show?',
    answer:
      'Original is always the standard monthly amortization for your mortgage amount, rate, term, and interest calculation method, without frequency changes or extra payments. With extra compares that baseline to the revised schedule.',
  },
];
