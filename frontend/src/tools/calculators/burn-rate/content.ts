import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const BURN_RATE_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-burn-rate', label: 'What Burn Rate Means' },
  { id: 'burn-rate-formulas', label: 'Formulas' },
  { id: 'cash-runway', label: 'Cash Runway' },
  { id: 'burn-rate-example', label: 'Example' },
  { id: 'burn-rate-faq', label: 'Frequently Asked Questions' },
];

export const BURN_RATE_FAQS: readonly FAQItem[] = [
  {
    question: 'What is burn rate?',
    answer:
      'Burn rate is how fast cash decreases over a period, usually expressed per month: (initial balance − final balance) ÷ duration in months.',
  },
  {
    question: 'What is cash runway?',
    answer:
      'Cash runway estimates how long the final balance lasts at the current monthly burn rate: final balance ÷ burn rate. It assumes burn continues at that rate.',
  },
  {
    question: 'When is runway shown as N/A?',
    answer:
      'When burn rate is zero or negative, cash is not depleting under these inputs, so there is no finite depletion runway. The calculator shows N/A instead of inventing a number.',
  },
  {
    question: 'Does currency convert amounts?',
    answer:
      'No. Currency changes the symbol and grouping only. Enter both balances in the same currency.',
  },
];
