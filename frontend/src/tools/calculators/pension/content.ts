import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const PENSION_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is', label: 'What This Pension Calculator Compares' },
  { id: 'how-it-works', label: 'How the Comparison Works' },
  { id: 'cola', label: 'Cost-of-Living Adjustment (COLA)' },
  { id: 'break-even', label: 'Understanding Break-Even' },
  { id: 'limitations', label: 'Limitations and Disclaimer' },
  { id: 'pension-faq', label: 'Frequently Asked Questions' },
];

export const PENSION_FAQS: readonly FAQItem[] = [
  {
    question: 'Does a later break-even mean I should take the pension?',
    answer:
      'Not automatically. A later depletion age means the invested lump sum lasts longer when matching pension withdrawals. Longevity, risk tolerance, estate goals, taxes, and guarantees still matter. This tool does not recommend either option.',
  },
  {
    question: 'How is COLA applied?',
    answer:
      'The monthly pension starts at your entered amount. After every 12 months of payments, that monthly amount is increased by the annual COLA percent. COLA is not applied monthly in this model.',
  },
  {
    question: 'How does the invested lump sum earn returns?',
    answer:
      'The annual return is converted to a monthly rate with (1 + r)^(1/12) − 1. Each month the balance grows at that rate, then an amount equal to the current monthly pension is withdrawn.',
  },
  {
    question: 'What if there is no break-even in the table?',
    answer:
      'If the invested balance remains positive through the projection horizon while matching withdrawals, the model reports no depletion break-even in that window. Changing return, COLA, or pension size can change the outcome.',
  },
  {
    question: 'Are taxes included?',
    answer:
      'No. Taxes, fees, survivor benefits, spousal elections, and guarantees are omitted unless you adjust inputs yourself to approximate them.',
  },
  {
    question: 'Does changing the currency convert amounts?',
    answer:
      'No. The currency selector only changes symbols and grouping. Amounts are not converted with exchange rates.',
  },
];
