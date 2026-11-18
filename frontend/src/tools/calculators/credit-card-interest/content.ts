import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const CREDIT_CARD_INTEREST_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-credit-card-interest', label: 'What This Calculator Does' },
  { id: 'credit-card-interest-formulas', label: 'Formulas' },
  { id: 'credit-card-interest-example', label: 'Example' },
  { id: 'credit-card-interest-faq', label: 'Frequently Asked Questions' },
];

export const CREDIT_CARD_INTEREST_FAQS: readonly FAQItem[] = [
  {
    question: 'How is credit card interest calculated here?',
    answer:
      'By default the model uses a standard monthly-period assumption: Monthly Interest = Outstanding Balance × APR / 1200. Optional daily compounding (APR ÷ 365 or ÷ 360) compounds within each month before the payment is applied. Real issuers often use average daily balance; this tool is an educational approximation.',
  },
  {
    question: 'How do minimum payments work?',
    answer:
      'You can choose a flat percentage of balance or percentage plus that month’s interest, then take the greater of that amount and a currency floor. Additional payment is added on top. If the scheduled payment never covers interest, the calculator reports that the balance never pays off.',
  },
  {
    question: 'Do the currency selectors convert amounts?',
    answer:
      'Yes. Balance, fixed payment, additional payment, and the minimum-payment floor each have independent currencies and are normalized into the balance currency before the amortization loop. APR %, percentages, months, and years are never FX-converted. Missing rates block conversion; stale rates warn but still convert.',
  },
];
